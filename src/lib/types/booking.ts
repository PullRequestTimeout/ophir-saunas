// Row types for the booking tables (see supabase/migrations). Dates are "YYYY-MM-DD", times "HH:MM:SS".

export type BookingStatus = "pending" | "confirmed" | "declined" | "cancelled";
export type DropInSlot = "17-19" | "19-21";

export const dropInSlotLabels: Record<DropInSlot, string> = {
	"17-19": "5:00pm – 7:00pm",
	"19-21": "7:00pm – 9:00pm"
};

export interface Package {
	id: string;
	name: string;
	nights: number;
	price_cents: number;
	/** ISO weekdays, 1 = Monday … 7 = Sunday */
	allowed_delivery_weekdays: number[];
	description: string;
	sort_order: number;
	active: boolean;
}

export interface AddOn {
	id: string;
	name: string;
	price_cents: number;
	max_quantity: number;
	/** Add-ons with the same non-empty group are a single choice: a booking may have at most one of them */
	choice_group: string;
	description: string;
	sort_order: number;
	active: boolean;
}

export interface DeliveryZone {
	id: string;
	name: string;
	price_cents: number;
	sort_order: number;
	active: boolean;
}

export interface Settings {
	auto_confirm: boolean;
	same_day_turnaround: boolean;
	pickup_time: string;
	delivery_window_start: string;
	delivery_window_end: string;
	delivery_slot_minutes: number;
	drop_in_price_cents: number;
	drop_in_capacity: number;
	owner_email: string;
	reminder_days_before: number;
}

export interface LineItem {
	label: string;
	quantity: number;
	unit_cents: number;
	total_cents: number;
}

interface Customer {
	customer_name: string;
	customer_email: string;
	customer_phone: string;
	customer_notes: string;
	admin_notes: string;
}

export interface Rental extends Customer {
	id: string;
	status: BookingStatus;
	package_id: string | null;
	package_name: string;
	nights: number;
	delivery_date: string;
	delivery_time: string;
	pickup_date: string;
	pickup_time: string;
	delivery_zone_id: string | null;
	delivery_zone_name: string;
	address: string;
	line_items: LineItem[];
	total_cents: number;
	source: "website" | "admin";
	manage_token: string;
	reminder_sent_at: string | null;
	created_at: string;
}

export interface DropInDay {
	id: string;
	date: string;
	location: string;
	notes: string;
	active: boolean;
}

export interface DropInBooking extends Customer {
	id: string;
	drop_in_day_id: string;
	slot: DropInSlot;
	party_size: number;
	status: BookingStatus;
	price_cents: number;
	total_cents: number;
	source: "website" | "admin";
	manage_token: string;
	reminder_sent_at: string | null;
	created_at: string;
}

export interface TimeOff {
	id: string;
	start_date: string;
	end_date: string;
	banner_message: string;
	show_banner: boolean;
}
