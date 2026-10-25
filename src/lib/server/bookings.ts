// Loading bookings and emailing about them, shared by the public booking endpoints, the admin and the reminders job.

import { db } from "$lib/server/supabase";
import { sendEmail } from "$lib/server/email/send";
import {
	dropInCustomerEmail,
	dropInOwnerEmail,
	rentalCustomerEmail,
	rentalOwnerEmail,
	type CustomerEmailKind,
	type DropInWithDay
} from "$lib/server/email/templates";
import type { Rental } from "$lib/types/booking";

export type { DropInWithDay };
export type BookingType = "rental" | "drop-in";

/** Drop-in bookings with their day, as `day` */
export const DROP_IN_SELECT = "*, day:drop_in_days(date, location, notes)";

export async function getRental(id: string) {
	const { data, error } = await db().from("rentals").select("*").eq("id", id).maybeSingle<Rental>();
	if (error) throw error;
	return data;
}

export async function getDropIn(id: string) {
	const { data, error } = await db().from("drop_in_bookings").select(DROP_IN_SELECT).eq("id", id).maybeSingle<DropInWithDay>();
	if (error) throw error;
	return data;
}

async function ownerEmail() {
	const { data } = await db().from("settings").select("owner_email").single<{ owner_email: string }>();
	return data?.owner_email ?? "";
}

/** Emails the customer about their rental; resolves to whether it was sent */
export async function emailRentalCustomer(kind: CustomerEmailKind, rental: Rental) {
	return sendEmail(rental.customer_email, rentalCustomerEmail(kind, rental), { replyTo: await ownerEmail() });
}

export async function emailDropInCustomer(kind: CustomerEmailKind, booking: DropInWithDay) {
	return sendEmail(booking.customer_email, dropInCustomerEmail(kind, booking), { replyTo: await ownerEmail() });
}

/** The customer email that matches a booking's current status */
export function statusEmailKind(status: Rental["status"]): CustomerEmailKind {
	return status === "pending" ? "received" : status;
}

/** Tells the customer and the owner about a new website booking. Failures are logged, never thrown. */
export async function notifyNewRental(rental: Rental) {
	const owner = await ownerEmail();
	await Promise.allSettled([
		sendEmail(rental.customer_email, rentalCustomerEmail(statusEmailKind(rental.status), rental), { replyTo: owner }),
		sendEmail(owner, rentalOwnerEmail(rental), { replyTo: rental.customer_email })
	]);
}

export async function notifyNewDropIn(booking: DropInWithDay) {
	const owner = await ownerEmail();
	await Promise.allSettled([
		sendEmail(booking.customer_email, dropInCustomerEmail(statusEmailKind(booking.status), booking), { replyTo: owner }),
		sendEmail(owner, dropInOwnerEmail(booking), { replyTo: booking.customer_email })
	]);
}
