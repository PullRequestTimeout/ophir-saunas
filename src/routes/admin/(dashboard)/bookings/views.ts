import type { BookingType } from "$lib/server/bookings";
import type { BookingStatus } from "$lib/types/booking";

export const views = {
	upcoming: "Upcoming",
	requests: "Requests",
	past: "Past",
	cancelled: "Declined & cancelled"
} as const;

export type View = keyof typeof views;

export interface BookingRow {
	type: BookingType;
	id: string;
	/** The day it starts (drop-off or drop-in day), for sorting */
	date: string;
	endDate: string | null;
	customer: string;
	summary: string;
	status: BookingStatus;
	total_cents: number;
}
