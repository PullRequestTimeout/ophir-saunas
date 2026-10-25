// Calendar rules shared by the booking form (to grey out dates) and the server. The database RPCs in
// supabase/migrations/*_booking_functions.sql enforce the same rules under a lock and have the final say;
// keep the two in sync.

import { addDays, isoWeekday } from "$lib/utils/format";
import type { DropInSlot } from "$lib/types/booking";

export interface DateRange {
	start: string;
	end: string;
}

/** Everything that occupies the sauna, with no customer details */
export interface Calendar {
	today: string;
	sameDayTurnaround: boolean;
	/** delivery_date … pickup_date of pending and confirmed rentals */
	rentals: DateRange[];
	/** Active drop-in days */
	dropInDates: string[];
	timeOff: DateRange[];
}

export type Conflict = "rental_conflict" | "drop_in_conflict" | "time_off";

/** Mirrors rental_conflict() in SQL: why a rental from `delivery` to `pickup` can't be booked, or null if it fits */
export function rentalConflict(calendar: Calendar, delivery: string, pickup: string): Conflict | null {
	const turnaround = calendar.sameDayTurnaround;

	// With turnaround, a morning pickup and an evening delivery can share a day.
	const overlapsRental = calendar.rentals.some((r) => (turnaround ? r.start < pickup && delivery < r.end : r.start <= pickup && delivery <= r.end));
	if (overlapsRental) return "rental_conflict";

	// Drop-ins run in the evening, so with turnaround only the pickup day may fall on a drop-in day.
	const overlapsDropIn = calendar.dropInDates.some((d) => (turnaround ? d >= delivery && d < pickup : d >= delivery && d <= pickup));
	if (overlapsDropIn) return "drop_in_conflict";

	if (calendar.timeOff.some((t) => t.start <= pickup && delivery <= t.end)) return "time_off";

	return null;
}

/** Whether a package can be delivered on `date`: far enough ahead, an allowed weekday, and the whole stay is free */
export function canDeliver(calendar: Calendar, pkg: { nights: number; allowed_delivery_weekdays: number[] }, date: string) {
	if (date <= calendar.today) return false;
	if (!pkg.allowed_delivery_weekdays.includes(isoWeekday(date))) return false;
	return rentalConflict(calendar, date, addDays(date, pkg.nights)) === null;
}

export function isTimeOff(calendar: Calendar, date: string) {
	return calendar.timeOff.some((t) => t.start <= date && date <= t.end);
}

/** Delivery time options, e.g. 18:00, 18:30 … 21:00 */
export function deliveryTimes(settings: { delivery_window_start: string; delivery_window_end: string; delivery_slot_minutes: number }) {
	const toMinutes = (time: string) => {
		const [h, m] = time.split(":").map(Number);
		return h * 60 + m;
	};
	const times: string[] = [];
	for (let t = toMinutes(settings.delivery_window_start); t <= toMinutes(settings.delivery_window_end); t += settings.delivery_slot_minutes) {
		times.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
	}
	return times;
}

export const dropInSlotStart: Record<DropInSlot, string> = { "17-19": "17:00", "19-21": "19:00" };
