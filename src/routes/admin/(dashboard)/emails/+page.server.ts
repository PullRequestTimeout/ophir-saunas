// Previews of every booking email with sample data, for checking wording and layout without sending anything.

import {
	dropInCustomerEmail,
	dropInOwnerEmail,
	rentalCustomerEmail,
	rentalOwnerEmail,
	type CustomerEmailKind,
	type DropInWithDay
} from "$lib/server/email/templates";
import { emailConfigured } from "$lib/server/email/send";
import { addDays, localToday } from "$lib/utils/format";
import type { Rental } from "$lib/types/booking";
import type { PageServerLoad } from "./$types";

const delivery = addDays(localToday(), 12);

const rental: Rental = {
	id: "00000000-0000-4000-8000-000000000000",
	status: "confirmed",
	package_id: null,
	package_name: "3 Night Weekend Rental",
	nights: 3,
	delivery_date: delivery,
	delivery_time: "19:00:00",
	pickup_date: addDays(delivery, 3),
	pickup_time: "10:00:00",
	delivery_zone_id: null,
	delivery_zone_name: "Rossland",
	address: "123 Columbia Ave\nRossland, BC",
	customer_name: "Sam Example",
	customer_email: "sam@example.com",
	customer_phone: "250 555 0100",
	customer_notes: "Gate code is 1234.",
	admin_notes: "",
	line_items: [
		{ label: "3 Night Weekend Rental", quantity: 1, unit_cents: 45000, total_cents: 45000 },
		{ label: "Delivery: Rossland", quantity: 1, unit_cents: 2500, total_cents: 2500 },
		{ label: "3 Hour Burn Wood Bundle", quantity: 2, unit_cents: 4000, total_cents: 8000 }
	],
	total_cents: 55500,
	source: "website",
	manage_token: "",
	reminder_sent_at: null,
	created_at: new Date().toISOString()
};

const dropIn: DropInWithDay = {
	id: "00000000-0000-4000-8000-000000000001",
	drop_in_day_id: "",
	slot: "17-19",
	party_size: 3,
	status: "confirmed",
	customer_name: "Alex Example",
	customer_email: "alex@example.com",
	customer_phone: "250 555 0101",
	customer_notes: "",
	admin_notes: "",
	price_cents: 2500,
	total_cents: 7500,
	source: "website",
	manage_token: "",
	reminder_sent_at: null,
	created_at: new Date().toISOString(),
	day: { date: addDays(localToday(), 5), location: "Centennial Park, Rossland", notes: "Parking on Spokane St." }
};

const kinds: CustomerEmailKind[] = ["received", "confirmed", "declined", "cancelled", "reminder"];

export const load: PageServerLoad = () => {
	const emails = [
		...kinds.map((kind) => ({ id: `rental-${kind}`, label: `Rental: ${kind}`, ...rentalCustomerEmail(kind, rental) })),
		{ id: "rental-owner", label: "Rental: owner notification", ...rentalOwnerEmail({ ...rental, status: "pending" }) },
		...kinds.map((kind) => ({ id: `drop-in-${kind}`, label: `Drop-in: ${kind}`, ...dropInCustomerEmail(kind, dropIn) })),
		{ id: "drop-in-owner", label: "Drop-in: owner notification", ...dropInOwnerEmail(dropIn) }
	];
	return { emails, emailConfigured: emailConfigured() };
};
