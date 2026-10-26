// Email content for each booking event. Rental emails always state drop-off and pickup; drop-in emails state the
// location and session time.

import { env as publicEnv } from "$env/dynamic/public";
import { homeFaqs } from "$lib/data/faqs";
import { dropInSlotLabels, type DropInBooking, type DropInDay, type Rental } from "$lib/types/booking";
import { formatCents, formatDate, formatTime } from "$lib/utils/format";
import { CONTACT_EMAIL, renderEmail, type EmailContent } from "./render";

export type CustomerEmailKind = "received" | "confirmed" | "declined" | "cancelled" | "reminder";

export type DropInWithDay = DropInBooking & { day: Pick<DropInDay, "date" | "location" | "notes"> };

const siteUrl = () => (publicEnv.PUBLIC_SITE_URL || "https://ophirsaunas.ca").replace(/\/$/, "");

const cancellationPolicy = homeFaqs.find((faq) => faq.question.toLowerCase().includes("cancellation"))?.answer[0]?.content;

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there";

const contactLine = `Questions or changes? Reply to this email or write to ${CONTACT_EMAIL}.`;
const paymentLine = "Nothing has been charged. We'll arrange payment with you directly.";

function rentalDetails(rental: Rental): [string, string][] {
	return [
		["Drop-off", `${formatDate(rental.delivery_date, { long: true })}, ${formatTime(rental.delivery_time)}`],
		["Pickup", `${formatDate(rental.pickup_date, { long: true })}, around ${formatTime(rental.pickup_time)}`],
		["Package", rental.package_name],
		["Address", rental.address],
		["Delivery area", rental.delivery_zone_name]
	];
}

function dropInDetails(booking: DropInWithDay): [string, string][] {
	return [
		["Date", formatDate(booking.day.date, { long: true })],
		["Time", dropInSlotLabels[booking.slot]],
		["Location", booking.day.location],
		["People", String(booking.party_size)],
		...(booking.day.notes ? ([["Notes", booking.day.notes]] as [string, string][]) : [])
	];
}

const customerCopy: Record<CustomerEmailKind, { subject: string; heading: string; intro: (name: string) => string[] }> = {
	received: {
		subject: "We've received your booking request",
		heading: "Request received",
		intro: (name) => [`Hi ${name}, thanks for your request! We'll check the details and email you as soon as it's confirmed.`]
	},
	confirmed: {
		subject: "Your sauna booking is confirmed",
		heading: "You're booked!",
		intro: (name) => [`Hi ${name}, your booking is confirmed. Here are the details.`]
	},
	declined: {
		subject: "About your booking request",
		heading: "We can't take this booking",
		intro: (name) => [
			`Hi ${name}, sorry, we're not able to take your booking for these dates. Nothing has been charged.`,
			"Please try other dates on our website, or reply to this email and we'll help find a time that works."
		]
	},
	cancelled: {
		subject: "Your booking has been cancelled",
		heading: "Booking cancelled",
		intro: (name) => [`Hi ${name}, your booking below has been cancelled. If this is unexpected, please reply to this email.`]
	},
	reminder: {
		subject: "Your sauna booking is coming up",
		heading: "See you soon",
		intro: (name) => [`Hi ${name}, a quick reminder that your sauna booking is coming up.`]
	}
};

function customerEmail(kind: CustomerEmailKind, name: string, base: Omit<EmailContent, "subject" | "heading" | "intro" | "preheader">, when: string) {
	const copy = customerCopy[kind];
	const active = kind === "received" || kind === "confirmed" || kind === "reminder";
	return renderEmail({
		subject: `${copy.subject} (${when})`,
		preheader: `${copy.heading}: ${when}`,
		heading: copy.heading,
		intro: copy.intro(firstName(name)),
		...base,
		outro: [
			...(active ? [paymentLine, ...(cancellationPolicy ? [`Cancellation policy: ${cancellationPolicy}`] : [])] : []),
			...(base.outro ?? []),
			contactLine
		]
	});
}

export function rentalCustomerEmail(kind: CustomerEmailKind, rental: Rental) {
	const active = kind === "received" || kind === "confirmed" || kind === "reminder";
	return customerEmail(
		kind,
		rental.customer_name,
		{
			details: rentalDetails(rental),
			items: active ? rental.line_items : undefined,
			total: active ? { label: kind === "received" ? "Estimated total" : "Total", cents: rental.total_cents } : undefined,
			outro:
				kind === "reminder"
					? ["Please make sure there's a flat, clear spot for the sauna and someone is around at drop-off so we can walk you through it."]
					: []
		},
		formatDate(rental.delivery_date)
	);
}

export function dropInCustomerEmail(kind: CustomerEmailKind, booking: DropInWithDay) {
	const active = kind === "received" || kind === "confirmed" || kind === "reminder";
	return customerEmail(
		kind,
		booking.customer_name,
		{
			details: dropInDetails(booking),
			items: active
				? [{ label: "Drop-in session", quantity: booking.party_size, unit_cents: booking.price_cents, total_cents: booking.total_cents }]
				: undefined,
			total: active ? { label: "Total", cents: booking.total_cents } : undefined,
			outro: kind === "reminder" ? ["Bring a towel, water and something warm to change into afterwards."] : []
		},
		`${formatDate(booking.day.date)}, ${dropInSlotLabels[booking.slot]}`
	);
}

function contactDetails(b: { customer_name: string; customer_email: string; customer_phone: string; customer_notes: string }): [string, string][] {
	return [
		["Name", b.customer_name],
		["Email", b.customer_email || "None given"],
		["Phone", b.customer_phone || "None given"],
		...(b.customer_notes ? ([["Notes", b.customer_notes]] as [string, string][]) : [])
	];
}

export function rentalOwnerEmail(rental: Rental) {
	const pending = rental.status === "pending";
	const label = pending ? "New booking request" : "New booking";
	return renderEmail({
		subject: `${label}: ${rental.customer_name}, ${formatDate(rental.delivery_date)}`,
		preheader: `${rental.package_name}, ${formatCents(rental.total_cents)}`,
		heading: label,
		intro: [pending ? "This request is waiting for you to approve or decline it." : "This booking was confirmed automatically."],
		details: [...rentalDetails(rental), ...contactDetails(rental)],
		items: rental.line_items,
		total: { label: "Total", cents: rental.total_cents },
		button: { label: pending ? "Review the request" : "Open in dashboard", url: `${siteUrl()}/admin/bookings/rental/${rental.id}` }
	});
}

export function dropInOwnerEmail(booking: DropInWithDay) {
	const pending = booking.status === "pending";
	const label = pending ? "New drop-in request" : "New drop-in booking";
	return renderEmail({
		subject: `${label}: ${booking.customer_name}, ${formatDate(booking.day.date)}`,
		preheader: `${booking.party_size} × ${dropInSlotLabels[booking.slot]}`,
		heading: label,
		intro: [pending ? "This request is waiting for you to approve or decline it." : "This booking was confirmed automatically."],
		details: [...dropInDetails(booking), ...contactDetails(booking)],
		total: { label: "Total", cents: booking.total_cents },
		button: { label: pending ? "Review the request" : "Open in dashboard", url: `${siteUrl()}/admin/bookings/drop-in/${booking.id}` }
	});
}
