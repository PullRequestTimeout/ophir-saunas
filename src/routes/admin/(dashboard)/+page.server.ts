import { error } from "@sveltejs/kit";
import { db, must } from "$lib/server/supabase";
import { addDays, localToday } from "$lib/utils/format";
import type { BookingStatus, DropInDay, DropInSlot, Rental, TimeOff } from "$lib/types/booking";
import type { PageServerLoad } from "./$types";

const DAYS_AHEAD = 14;

type RentalSummary = Pick<
	Rental,
	| "id"
	| "status"
	| "customer_name"
	| "package_name"
	| "delivery_date"
	| "delivery_time"
	| "pickup_date"
	| "pickup_time"
	| "delivery_zone_name"
	| "address"
>;
type DropInSummary = { id: string; status: BookingStatus; slot: DropInSlot; party_size: number; customer_name: string; drop_in_day_id: string };

export const load: PageServerLoad = async () => {
	const today = localToday();
	const end = addDays(today, DAYS_AHEAD - 1);
	const rentalColumns =
		"id, status, customer_name, package_name, delivery_date, delivery_time, pickup_date, pickup_time, delivery_zone_name, address";

	try {
		const [rentals, days, pendingRentals, pendingDropIns, timeOff, capacity] = await Promise.all([
			db()
				.from("rentals")
				.select(rentalColumns)
				.in("status", ["pending", "confirmed"])
				.lte("delivery_date", end)
				.gte("pickup_date", today)
				.returns<RentalSummary[]>()
				.then(must),
			db().from("drop_in_days").select("*").eq("active", true).gte("date", today).lte("date", end).order("date").returns<DropInDay[]>().then(must),
			db().from("rentals").select(rentalColumns).eq("status", "pending").order("delivery_date").returns<RentalSummary[]>().then(must),
			db()
				.from("drop_in_bookings")
				.select("id, status, slot, party_size, customer_name, drop_in_day_id, day:drop_in_days(date)")
				.eq("status", "pending")
				.returns<(DropInSummary & { day: { date: string } })[]>()
				.then(must),
			db().from("time_off").select("*").gte("end_date", today).order("start_date").returns<TimeOff[]>().then(must),
			db().from("settings").select("drop_in_capacity").single<{ drop_in_capacity: number }>().then(must)
		]);

		const dayIds = days.map((d) => d.id);
		const dropIns = dayIds.length
			? await db()
					.from("drop_in_bookings")
					.select("id, status, slot, party_size, customer_name, drop_in_day_id")
					.in("drop_in_day_id", dayIds)
					.in("status", ["pending", "confirmed"])
					.returns<DropInSummary[]>()
					.then(must)
			: [];

		return {
			today,
			end,
			rentals,
			days,
			dropIns,
			pendingRentals,
			pendingDropIns: pendingDropIns.sort((a, b) => a.day.date.localeCompare(b.day.date)),
			timeOff,
			capacity: capacity.drop_in_capacity
		};
	} catch (err) {
		console.error("Loading the overview failed", err);
		error(500, "Couldn't load the overview.");
	}
};
