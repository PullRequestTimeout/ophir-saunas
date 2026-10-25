import { error, fail } from "@sveltejs/kit";
import { z } from "zod";
import { db } from "$lib/server/supabase";
import { checkbox, date, optionalId, parseForm } from "$lib/server/forms";
import { formatDate, localToday } from "$lib/utils/format";
import type { TimeOff } from "$lib/types/booking";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
	const showPast = url.searchParams.has("past");
	const today = localToday();

	let query = db().from("time_off").select("*");
	query = showPast
		? query.lt("end_date", today).order("start_date", { ascending: false }).limit(30)
		: query.gte("end_date", today).order("start_date");

	const { data, error: dbError } = await query.returns<TimeOff[]>();
	if (dbError) error(500, "Couldn't load time off.");

	return { periods: data, showPast, today };
};

const saveSchema = z
	.object({
		id: optionalId,
		start_date: date,
		end_date: date,
		banner_message: z.string().trim().max(300).default(""),
		show_banner: checkbox
	})
	.refine((p) => p.end_date >= p.start_date, { path: ["end_date"], message: "The last day can't be before the first day" });

/** Bookings that were made before the time off was added aren't cancelled automatically; list them so the admin can follow up. */
async function overlaps(start: string, end: string) {
	const [rentals, dropIns] = await Promise.all([
		db()
			.from("rentals")
			.select("customer_name, delivery_date")
			.in("status", ["pending", "confirmed"])
			.lte("delivery_date", end)
			.gte("pickup_date", start)
			.returns<{ customer_name: string; delivery_date: string }[]>(),
		db().from("drop_in_days").select("date").eq("active", true).gte("date", start).lte("date", end).returns<{ date: string }[]>()
	]);

	return [
		...(rentals.data ?? []).map((r) => `Rental for ${r.customer_name} (delivery ${formatDate(r.delivery_date)})`),
		...(dropIns.data ?? []).map((d) => `Drop-in day on ${formatDate(d.date)}`)
	];
}

export const actions: Actions = {
	save: async ({ request }) => {
		const form = await request.formData();
		const key = String(form.get("id") || "new");
		const { data, errors } = parseForm(saveSchema, form);
		if (errors) return fail(400, { id: key, errors });

		const { id, ...values } = data;
		const result = id ? await db().from("time_off").update(values).eq("id", id) : await db().from("time_off").insert(values);
		if (result.error) return fail(500, { id: key, errors: { form: ["Couldn't save. Please try again."] } });

		return { id: key, saved: true, overlaps: await overlaps(data.start_date, data.end_date) };
	},

	delete: async ({ request }) => {
		const id = String((await request.formData()).get("id") ?? "");
		if (!z.uuid().safeParse(id).success) return fail(400, { id, errors: { form: ["Unknown time off."] } });

		const { error: dbError } = await db().from("time_off").delete().eq("id", id);
		if (dbError) return fail(500, { id, errors: { form: ["Couldn't delete. Please try again."] } });

		return { id, deleted: true };
	}
};
