import { error, fail } from "@sveltejs/kit";
import { z } from "zod";
import { db } from "$lib/server/supabase";
import { checkbox, date, optionalId, parseForm } from "$lib/server/forms";
import { localToday } from "$lib/utils/format";
import type { DropInBooking, DropInDay } from "$lib/types/booking";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
	const showPast = url.searchParams.has("past");
	const today = localToday();

	let query = db().from("drop_in_days").select("*");
	query = showPast ? query.lt("date", today).order("date", { ascending: false }).limit(30) : query.gte("date", today).order("date");

	const [days, settings] = await Promise.all([
		query.returns<DropInDay[]>(),
		db().from("settings").select("drop_in_capacity").single<{ drop_in_capacity: number }>()
	]);
	if (days.error || settings.error) error(500, "Couldn't load drop-in days.");

	const ids = days.data.map((day) => day.id);
	const bookings = ids.length
		? await db().from("drop_in_bookings").select("*").in("drop_in_day_id", ids).order("created_at").returns<DropInBooking[]>()
		: { data: [] as DropInBooking[], error: null };
	if (bookings.error) error(500, "Couldn't load drop-in bookings.");

	return { days: days.data, bookings: bookings.data, capacity: settings.data.drop_in_capacity, showPast, today };
};

const saveSchema = z.object({
	id: optionalId,
	date,
	location: z.string().trim().min(1, "Enter where the session is").max(200),
	notes: z.string().trim().max(1000).default(""),
	active: checkbox
});

const conflictMessages: Record<string, string> = {
	rental_conflict: "A private rental is booked over that date. Choose another date or cancel the rental first.",
	time_off: "That date falls within your time off."
};

async function activeBookingCount(dayId: string) {
	const { count } = await db()
		.from("drop_in_bookings")
		.select("id", { count: "exact", head: true })
		.eq("drop_in_day_id", dayId)
		.in("status", ["pending", "confirmed"]);
	return count ?? 0;
}

export const actions: Actions = {
	save: async ({ request }) => {
		const form = await request.formData();
		const key = String(form.get("id") || "new");
		const { data, errors } = parseForm(saveSchema, form);
		if (errors) return fail(400, { id: key, errors });

		// Moving or hiding a day would strand people who've booked it.
		if (data.id) {
			const { data: existing } = await db().from("drop_in_days").select("date").eq("id", data.id).single<{ date: string }>();
			if (existing && (existing.date !== data.date || !data.active) && (await activeBookingCount(data.id)) > 0) {
				return fail(400, {
					id: key,
					errors: { form: ["People have booked this session. Cancel their bookings before moving or hiding it."] }
				});
			}
		}

		const { error: rpcError } = await db().rpc("save_drop_in_day", {
			p_id: data.id ?? null,
			p_date: data.date,
			p_location: data.location,
			p_notes: data.notes,
			p_active: data.active
		});
		if (rpcError) {
			const message =
				rpcError.code === "23505"
					? "There's already a drop-in day on that date."
					: (conflictMessages[rpcError.message] ?? "Couldn't save. Please try again.");
			return fail(400, { id: key, errors: { form: [message] } });
		}

		return { id: key, saved: true };
	},

	delete: async ({ request }) => {
		const id = String((await request.formData()).get("id") ?? "");
		if (!z.uuid().safeParse(id).success) return fail(400, { id, errors: { form: ["Unknown drop-in day."] } });

		const { count } = await db().from("drop_in_bookings").select("id", { count: "exact", head: true }).eq("drop_in_day_id", id);
		if (count) {
			return fail(400, {
				id,
				errors: { form: ['This session has bookings, so it can\'t be deleted. Untick "Open for bookings" to hide it instead.'] }
			});
		}

		const { error: dbError } = await db().from("drop_in_days").delete().eq("id", id);
		if (dbError) return fail(500, { id, errors: { form: ["Couldn't delete. Please try again."] } });

		return { id, deleted: true };
	}
};
