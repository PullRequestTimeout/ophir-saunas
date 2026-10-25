import { describe, expect, it } from "vitest";
import { canDeliver, deliveryTimes, rentalConflict, type Calendar } from "./availability";
import { addDays, formatTime, formatWeekdays, isoWeekday, timeOffMessage } from "./format";

// 2026-10-25 is a Sunday
const base: Calendar = { today: "2026-10-25", sameDayTurnaround: true, rentals: [], dropInDates: [], timeOff: [] };
const cal = (overrides: Partial<Calendar>): Calendar => ({ ...base, ...overrides });

const oneNight = { nights: 1, allowed_delivery_weekdays: [1, 2, 3, 4] };
const weekend = { nights: 3, allowed_delivery_weekdays: [5] };

describe("canDeliver", () => {
	it("needs at least a day's notice", () => {
		expect(canDeliver(base, { nights: 1, allowed_delivery_weekdays: [7] }, "2026-10-25")).toBe(false);
		expect(canDeliver(base, oneNight, "2026-10-26")).toBe(true);
	});

	it("only allows the package's delivery weekdays", () => {
		expect(canDeliver(base, oneNight, "2026-10-29")).toBe(true); // Thu
		expect(canDeliver(base, oneNight, "2026-10-30")).toBe(false); // Fri
		expect(canDeliver(base, weekend, "2026-10-30")).toBe(true);
	});
});

describe("rentalConflict with same-day turnaround", () => {
	const booked = cal({ rentals: [{ start: "2026-10-26", end: "2026-10-28" }] });

	it("lets a delivery land on another rental's pickup day", () => {
		expect(rentalConflict(booked, "2026-10-28", "2026-10-29")).toBeNull();
	});

	it("lets a pickup land on another rental's delivery day", () => {
		expect(rentalConflict(booked, "2026-10-25", "2026-10-26")).toBeNull();
	});

	it("blocks any real overlap", () => {
		expect(rentalConflict(booked, "2026-10-27", "2026-10-28")).toBe("rental_conflict");
		expect(rentalConflict(booked, "2026-10-26", "2026-10-27")).toBe("rental_conflict");
		expect(rentalConflict(booked, "2026-10-24", "2026-10-30")).toBe("rental_conflict");
	});
});

describe("rentalConflict without same-day turnaround", () => {
	const booked = cal({ sameDayTurnaround: false, rentals: [{ start: "2026-10-26", end: "2026-10-28" }] });

	it("blocks shared delivery/pickup days", () => {
		expect(rentalConflict(booked, "2026-10-28", "2026-10-29")).toBe("rental_conflict");
		expect(rentalConflict(booked, "2026-10-25", "2026-10-26")).toBe("rental_conflict");
	});

	it("allows a gap day", () => {
		expect(rentalConflict(booked, "2026-10-29", "2026-10-30")).toBeNull();
	});
});

describe("drop-in days", () => {
	it("allow a morning pickup on the drop-in day only with turnaround", () => {
		expect(rentalConflict(cal({ dropInDates: ["2026-10-28"] }), "2026-10-27", "2026-10-28")).toBeNull();
		expect(rentalConflict(cal({ sameDayTurnaround: false, dropInDates: ["2026-10-28"] }), "2026-10-27", "2026-10-28")).toBe(
			"drop_in_conflict"
		);
	});

	it("never allow an evening delivery on a drop-in day", () => {
		expect(rentalConflict(cal({ dropInDates: ["2026-10-28"] }), "2026-10-28", "2026-10-29")).toBe("drop_in_conflict");
	});

	it("block stays that span them", () => {
		expect(rentalConflict(cal({ dropInDates: ["2026-10-28"] }), "2026-10-27", "2026-10-29")).toBe("drop_in_conflict");
	});
});

describe("time off", () => {
	const away = cal({ timeOff: [{ start: "2026-11-02", end: "2026-11-03" }] });

	it("blocks rentals that deliver or pick up during it", () => {
		expect(rentalConflict(away, "2026-10-30", "2026-11-02")).toBe("time_off");
		expect(rentalConflict(away, "2026-11-03", "2026-11-04")).toBe("time_off");
	});

	it("allows rentals either side", () => {
		expect(rentalConflict(away, "2026-10-30", "2026-11-01")).toBeNull();
		expect(rentalConflict(away, "2026-11-04", "2026-11-05")).toBeNull();
	});
});

describe("deliveryTimes", () => {
	it("includes both ends of the window", () => {
		expect(deliveryTimes({ delivery_window_start: "18:00:00", delivery_window_end: "21:00:00", delivery_slot_minutes: 30 })).toEqual([
			"18:00",
			"18:30",
			"19:00",
			"19:30",
			"20:00",
			"20:30",
			"21:00"
		]);
	});
});

describe("format helpers", () => {
	it("handles calendar days without timezone drift", () => {
		expect(isoWeekday("2026-10-25")).toBe(7);
		expect(isoWeekday("2026-10-26")).toBe(1);
		expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
		expect(addDays("2026-03-08", 1)).toBe("2026-03-09"); // DST change in BC
	});

	it("formats times and weekday runs", () => {
		expect(formatTime("18:30:00")).toBe("6:30pm");
		expect(formatTime("10:00")).toBe("10:00am");
		expect(formatTime("12:00")).toBe("12:00pm");
		expect(formatWeekdays([1, 2, 3, 4])).toBe("Mon–Thu");
		expect(formatWeekdays([5])).toBe("Fri");
		expect(formatWeekdays([1, 5])).toBe("Mon, Fri");
	});

	it("builds a default time-off message", () => {
		expect(timeOffMessage({ start_date: "2026-12-20", end_date: "2027-01-03", banner_message: "" })).toBe(
			"We're taking a break from Sunday, December 20 to Sunday, January 3. Bookings resume Monday, January 4."
		);
		expect(timeOffMessage({ start_date: "2026-12-20", end_date: "2026-12-20", banner_message: "  Closed for maintenance  " })).toBe(
			"Closed for maintenance"
		);
	});
});
