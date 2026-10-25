// Sends reminder emails for confirmed bookings coming up within `reminder_days_before` days. Called daily by the
// Netlify scheduled function in netlify/functions/send-reminders.mts. Idempotent: each booking is stamped with
// reminder_sent_at once its email goes out, so a re-run (or a missed day) never double-sends.

import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { db, must } from "$lib/server/supabase";
import { emailDropInCustomer, emailRentalCustomer, type DropInWithDay } from "$lib/server/bookings";
import { addDays, localToday } from "$lib/utils/format";
import type { DropInBooking, Rental } from "$lib/types/booking";
import type { RequestHandler } from "./$types";

const sha256 = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));

/** Constant-time check of the bearer token (hashing first makes both sides the same length) */
async function authorized(header: string | null) {
	const secret = env.CRON_SECRET;
	if (!secret || !header) return false;
	const [expected, given] = await Promise.all([sha256(`Bearer ${secret}`), sha256(header)]);
	let diff = 0;
	for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ given[i];
	return diff === 0;
}

export const POST: RequestHandler = async ({ request }) => {
	if (!(await authorized(request.headers.get("authorization")))) return json({ message: "Unauthorized" }, { status: 401 });

	const settings = await db().from("settings").select("reminder_days_before").single<{ reminder_days_before: number }>().then(must);
	const today = localToday();
	const until = addDays(today, settings.reminder_days_before);
	// Someone who booked in the last day has just had their confirmation, so a reminder would be noise.
	const bookedBefore = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

	const [rentals, dropIns] = await Promise.all([
		db()
			.from("rentals")
			.select("*")
			.eq("status", "confirmed")
			.is("reminder_sent_at", null)
			.gte("delivery_date", today)
			.lte("delivery_date", until)
			.lt("created_at", bookedBefore)
			.returns<Rental[]>()
			.then(must),
		db()
			.from("drop_in_bookings")
			.select("*, drop_in_days!inner(date, location, notes)")
			.eq("status", "confirmed")
			.is("reminder_sent_at", null)
			.gte("drop_in_days.date", today)
			.lte("drop_in_days.date", until)
			.lt("created_at", bookedBefore)
			.returns<(DropInBooking & { drop_in_days: DropInWithDay["day"] })[]>()
			.then(must)
	]);

	const stamp = (table: "rentals" | "drop_in_bookings", id: string) =>
		db().from(table).update({ reminder_sent_at: new Date().toISOString() }).eq("id", id).is("reminder_sent_at", null);

	let sent = 0;
	let failed = 0;
	for (const rental of rentals) {
		if (!rental.customer_email) continue;
		if (await emailRentalCustomer("reminder", rental)) {
			await stamp("rentals", rental.id);
			sent++;
		} else failed++;
	}
	for (const { drop_in_days: day, ...booking } of dropIns) {
		if (!booking.customer_email) continue;
		if (await emailDropInCustomer("reminder", { ...booking, day })) {
			await stamp("drop_in_bookings", booking.id);
			sent++;
		} else failed++;
	}

	return json({ sent, failed });
};
