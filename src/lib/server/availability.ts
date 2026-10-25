import { db, must } from "$lib/server/supabase";
import { addDays, localToday, TIMEZONE } from "$lib/utils/format";
import { dropInSlotStart, isTimeOff, type Calendar } from "$lib/utils/availability";
import type { AddOn, DeliveryZone, DropInSlot, Package, Settings } from "$lib/types/booking";

/** The settings the public booking form needs; never includes the owner's email */
export type PublicSettings = Pick<
	Settings,
	| "auto_confirm"
	| "pickup_time"
	| "delivery_window_start"
	| "delivery_window_end"
	| "delivery_slot_minutes"
	| "drop_in_price_cents"
	| "drop_in_capacity"
>;

export interface BookingOptions {
	packages: Pick<Package, "id" | "name" | "nights" | "price_cents" | "allowed_delivery_weekdays" | "description">[];
	addOns: Pick<AddOn, "id" | "name" | "price_cents" | "max_quantity" | "description">[];
	zones: Pick<DeliveryZone, "id" | "name" | "price_cents">[];
	settings: PublicSettings;
}

export async function getBookingOptions(): Promise<BookingOptions> {
	const [packages, addOns, zones, settings] = await Promise.all([
		db()
			.from("packages")
			.select("id, name, nights, price_cents, allowed_delivery_weekdays, description")
			.eq("active", true)
			.order("sort_order")
			.then(must),
		db().from("add_ons").select("id, name, price_cents, max_quantity, description").eq("active", true).order("sort_order").then(must),
		db().from("delivery_zones").select("id, name, price_cents").eq("active", true).order("sort_order").then(must),
		db()
			.from("settings")
			.select("auto_confirm, pickup_time, delivery_window_start, delivery_window_end, delivery_slot_minutes, drop_in_price_cents, drop_in_capacity")
			.single<PublicSettings>()
			.then(must)
	]);

	return {
		packages: packages as BookingOptions["packages"],
		addOns: addOns as BookingOptions["addOns"],
		zones: zones as BookingOptions["zones"],
		settings
	};
}

export interface PublicDropInDay {
	id: string;
	date: string;
	location: string;
	notes: string;
	/** Spots left per slot; 0 when full, already started, or during time off */
	remaining: Record<DropInSlot, number>;
}

export interface Availability {
	calendar: Calendar;
	dropInDays: PublicDropInDay[];
}

// The longest package; rentals that start before `from` can still reach into the window.
const MAX_NIGHTS = 14;

/** Calendar and drop-in availability for days between `from` and `to` (inclusive) */
export async function getAvailability(from: string, to: string): Promise<Availability> {
	const windowStart = addDays(from, -MAX_NIGHTS);
	const windowEnd = addDays(to, MAX_NIGHTS);

	const [settings, rentals, dropInDays, timeOff] = await Promise.all([
		db()
			.from("settings")
			.select("same_day_turnaround, drop_in_capacity")
			.single<{ same_day_turnaround: boolean; drop_in_capacity: number }>()
			.then(must),
		db()
			.from("rentals")
			.select("delivery_date, pickup_date")
			.in("status", ["pending", "confirmed"])
			.lte("delivery_date", windowEnd)
			.gte("pickup_date", windowStart)
			.returns<{ delivery_date: string; pickup_date: string }[]>()
			.then(must),
		db()
			.from("drop_in_days")
			.select("id, date, location, notes")
			.eq("active", true)
			.gte("date", windowStart)
			.lte("date", windowEnd)
			.order("date")
			.returns<{ id: string; date: string; location: string; notes: string }[]>()
			.then(must),
		db()
			.from("time_off")
			.select("start_date, end_date")
			.lte("start_date", windowEnd)
			.gte("end_date", windowStart)
			.returns<{ start_date: string; end_date: string }[]>()
			.then(must)
	]);

	const today = localToday();
	const calendar: Calendar = {
		today,
		sameDayTurnaround: settings.same_day_turnaround,
		rentals: rentals.map((r) => ({ start: r.delivery_date, end: r.pickup_date })),
		dropInDates: dropInDays.map((d) => d.date),
		timeOff: timeOff.map((t) => ({ start: t.start_date, end: t.end_date }))
	};

	// Spots taken per day and slot
	const bookableDays = dropInDays.filter((d) => d.date >= today && d.date >= from && d.date <= to);
	const taken = new Map<string, number>();
	if (bookableDays.length) {
		const { data, error } = await db()
			.from("drop_in_bookings")
			.select("drop_in_day_id, slot, party_size")
			.in(
				"drop_in_day_id",
				bookableDays.map((d) => d.id)
			)
			.in("status", ["pending", "confirmed"])
			.returns<{ drop_in_day_id: string; slot: DropInSlot; party_size: number }[]>();
		if (error) throw error;
		for (const b of data) {
			const key = `${b.drop_in_day_id}:${b.slot}`;
			taken.set(key, (taken.get(key) ?? 0) + b.party_size);
		}
	}

	const nowTime = new Intl.DateTimeFormat("en-GB", { timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
	const remaining = (day: { id: string; date: string }, slot: DropInSlot) => {
		if (isTimeOff(calendar, day.date)) return 0;
		if (day.date === today && nowTime >= dropInSlotStart[slot]) return 0;
		return Math.max(0, settings.drop_in_capacity - (taken.get(`${day.id}:${slot}`) ?? 0));
	};

	return {
		calendar,
		dropInDays: bookableDays.map((day) => ({
			...day,
			remaining: { "17-19": remaining(day, "17-19"), "19-21": remaining(day, "19-21") }
		}))
	};
}
