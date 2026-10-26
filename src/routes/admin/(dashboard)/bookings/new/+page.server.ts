import { error, fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { db, must, rpcErrorMessage } from "$lib/server/supabase";
import { sendCreatedEmail } from "$lib/server/adminBookings";
import { checkbox, date, parseForm, time } from "$lib/server/forms";
import { emailDropInCustomer, emailRentalCustomer, getDropIn } from "$lib/server/bookings";
import { emailConfigured } from "$lib/server/email/send";
import { localToday } from "$lib/utils/format";
import type { AddOn, DeliveryZone, DropInDay, Package, Rental, Settings } from "$lib/types/booking";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
	try {
		const [packages, zones, addOns, days, settings] = await Promise.all([
			db().from("packages").select("*").order("sort_order").returns<Package[]>().then(must),
			db().from("delivery_zones").select("*").order("sort_order").returns<DeliveryZone[]>().then(must),
			db().from("add_ons").select("*").order("sort_order").returns<AddOn[]>().then(must),
			db().from("drop_in_days").select("*").eq("active", true).gte("date", localToday()).order("date").returns<DropInDay[]>().then(must),
			db()
				.from("settings")
				.select("delivery_window_start, drop_in_capacity")
				.single<Pick<Settings, "delivery_window_start" | "drop_in_capacity">>()
				.then(must)
		]);
		return {
			type: url.searchParams.get("type") === "drop-in" ? ("drop-in" as const) : ("rental" as const),
			packages,
			zones,
			addOns,
			days,
			settings,
			emailConfigured: emailConfigured()
		};
	} catch (err) {
		console.error("Loading the new booking form failed", err);
		error(500, "Couldn't load the booking form.");
	}
};

// Phone bookings may not have an email address; migrated bookings may not have a phone number.
const contact = {
	name: z.string().trim().min(1, "Enter the customer's name").max(100),
	email: z.preprocess(
		(value) => (typeof value === "string" ? value.trim() : value),
		z.union([z.literal(""), z.email("Enter a valid email address, or leave it blank").max(200)])
	),
	phone: z.string().trim().max(25).default(""),
	notes: z.string().trim().max(1000).default(""),
	admin_notes: z.string().trim().max(5000).default(""),
	notify: checkbox
};

const rentalSchema = z.object({
	package_id: z.uuid("Choose a package"),
	delivery_date: date,
	delivery_time: time,
	zone_id: z.uuid("Choose a delivery area"),
	address: z.string().trim().min(1, "Enter the delivery address").max(300),
	...contact
});

const dropInSchema = z.object({
	day_id: z.uuid("Choose a drop-in day"),
	slot: z.enum(["17-19", "19-21"], "Choose a session"),
	party_size: z.coerce.number().int().min(1, "At least 1 person").max(20),
	...contact
});

/** Admin-facing explanations of why the calendar refused a booking */
const conflictMessages: Record<string, string> = {
	rental_conflict: "The sauna is already booked for some of those dates.",
	drop_in_conflict: "A drop-in day falls within those dates. Move or hide the drop-in day first.",
	time_off: "Those dates fall within your time off.",
	slot_full: "There aren't enough spots left in that session."
};

const failure = (type: string, errors: Record<string, string[] | undefined>) => fail(400, { type, errors });

export const actions: Actions = {
	rental: async ({ request }) => {
		const form = await request.formData();
		const { data, errors } = parseForm(rentalSchema, form);
		if (errors) return failure("rental", errors);

		const addOns: { id: string; quantity: number }[] = [];
		for (const [key, value] of form) {
			const quantity = Number(value);
			if (key.startsWith("addon_") && Number.isInteger(quantity) && quantity > 0) addOns.push({ id: key.slice(6), quantity });
		}

		const { data: rental, error: rpcError } = await db()
			.rpc("create_rental", {
				p_package_id: data.package_id,
				p_delivery_date: data.delivery_date,
				p_delivery_time: data.delivery_time,
				p_zone_id: data.zone_id,
				p_address: data.address,
				p_add_ons: addOns,
				p_name: data.name,
				p_email: data.email,
				p_phone: data.phone,
				p_notes: data.notes,
				p_by_admin: true
			})
			.single<Rental>();
		if (rpcError) {
			const message = conflictMessages[rpcError.message] ?? rpcErrorMessage(rpcError);
			if (!message) console.error("create_rental (admin) failed", rpcError);
			return failure("rental", { form: [message ?? "Couldn't save the booking. Please try again."] });
		}

		if (data.admin_notes) await db().from("rentals").update({ admin_notes: data.admin_notes }).eq("id", rental.id);
		const created = await sendCreatedEmail(data.notify, data.email, () => emailRentalCustomer("confirmed", rental));

		redirect(303, `/admin/bookings/rental/${rental.id}?created=${created}`);
	},

	dropIn: async ({ request }) => {
		const { data, errors } = parseForm(dropInSchema, await request.formData());
		if (errors) return failure("drop-in", errors);

		const { data: created, error: rpcError } = await db()
			.rpc("create_drop_in_booking", {
				p_day_id: data.day_id,
				p_slot: data.slot,
				p_party_size: data.party_size,
				p_name: data.name,
				p_email: data.email,
				p_phone: data.phone,
				p_notes: data.notes,
				p_by_admin: true
			})
			.single<{ id: string }>();
		if (rpcError) {
			const message = conflictMessages[rpcError.message] ?? rpcErrorMessage(rpcError);
			if (!message) console.error("create_drop_in_booking (admin) failed", rpcError);
			return failure("drop-in", { form: [message ?? "Couldn't save the booking. Please try again."] });
		}

		if (data.admin_notes) await db().from("drop_in_bookings").update({ admin_notes: data.admin_notes }).eq("id", created.id);
		const outcome = await sendCreatedEmail(data.notify, data.email, async () => {
			const booking = await getDropIn(created.id);
			return !!booking && emailDropInCustomer("confirmed", booking);
		});

		redirect(303, `/admin/bookings/drop-in/${created.id}?created=${outcome}`);
	}
};
