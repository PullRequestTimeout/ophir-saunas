// Form actions shared by the admin rental and drop-in detail pages.

import { error, fail, type Actions, type RequestEvent } from "@sveltejs/kit";
import { z } from "zod";
import { db } from "$lib/server/supabase";
import { checkbox, parseForm } from "$lib/server/forms";
import { emailConfigured } from "$lib/server/email/send";
import { emailDropInCustomer, emailRentalCustomer, getDropIn, getRental, statusEmailKind, type BookingType } from "$lib/server/bookings";
import type { BookingStatus } from "$lib/types/booking";

const transitions = {
	approve: { from: ["pending"], to: "confirmed", done: "Booking approved." },
	decline: { from: ["pending"], to: "declined", done: "Request declined." },
	cancel: { from: ["pending", "confirmed"], to: "cancelled", done: "Booking cancelled." }
} satisfies Record<string, { from: BookingStatus[]; to: BookingStatus; done: string }>;

const table = (type: BookingType) => (type === "rental" ? "rentals" : "drop_in_bookings");

/** Emails the customer about their booking's current status; resolves to whether it was sent */
async function emailCustomer(type: BookingType, id: string, kind?: Parameters<typeof emailRentalCustomer>[0]) {
	if (type === "rental") {
		const rental = await getRental(id);
		return !!rental && emailRentalCustomer(kind ?? statusEmailKind(rental.status), rental);
	}
	const booking = await getDropIn(id);
	return !!booking && emailDropInCustomer(kind ?? statusEmailKind(booking.status), booking);
}

/** The toast for an action that may email the customer; a wanted email that didn't go out becomes a warning that stays on screen */
function withEmailNote(done: string, wanted: boolean, sent: boolean, hasEmail = true) {
	if (!wanted) return { message: done };
	if (sent) return { message: `${done} The customer has been emailed.` };
	if (!hasEmail) return { message: done, warning: "No email was sent because the booking has no email address." };
	return {
		message: done,
		warning: emailConfigured() ? "The email to the customer couldn't be sent." : "No email was sent because email isn't set up yet."
	};
}

/** What happened to the confirmation email for a manual booking, passed to the detail page as `?created=` */
const createdOutcomes = {
	none: { wanted: false, sent: false, hasEmail: true },
	sent: { wanted: true, sent: true, hasEmail: true },
	failed: { wanted: true, sent: false, hasEmail: true },
	"no-address": { wanted: true, sent: false, hasEmail: false }
};
type CreatedOutcome = keyof typeof createdOutcomes;

/** Sends a manual booking's confirmation if asked to, and returns the outcome for the detail page's `?created=` */
export async function sendCreatedEmail(notify: boolean, email: string, send: () => Promise<boolean>): Promise<CreatedOutcome> {
	if (!notify) return "none";
	if (!email) return "no-address";
	return (await send()) ? "sent" : "failed";
}

/** The detail page's toast after a manual booking redirects to it */
export function createdToast(outcome: string | null) {
	if (!outcome || !(outcome in createdOutcomes)) return null;
	const { wanted, sent, hasEmail } = createdOutcomes[outcome as CreatedOutcome];
	return withEmailNote("Booking created.", wanted, sent, hasEmail);
}

function statusAction(type: BookingType, name: keyof typeof transitions) {
	const transition = transitions[name];
	return async ({ request, params }: RequestEvent) => {
		const id = requireId(params.id ?? "");
		const { data } = parseForm(z.object({ notify: checkbox }), await request.formData());
		const notify = data?.notify ?? false;

		// Only move from the expected status, so a stale page can't e.g. re-confirm a cancelled booking.
		const { data: updated, error: dbError } = await db()
			.from(table(type))
			.update({ status: transition.to })
			.eq("id", id)
			.in("status", transition.from)
			.select("id");
		if (dbError) return fail(500, { errors: { form: ["Couldn't update the booking. Please try again."] } });
		if (!updated?.length) return fail(409, { errors: { form: ["This booking has already changed. Reload the page to see its current status."] } });

		const sent = notify && (await emailCustomer(type, id));
		return withEmailNote(transition.done, notify, sent);
	};
}

export function bookingActions(type: BookingType): Actions {
	return {
		approve: statusAction(type, "approve"),
		decline: statusAction(type, "decline"),
		cancel: statusAction(type, "cancel"),

		notes: async ({ request, params }) => {
			const { data, errors } = parseForm(z.object({ admin_notes: z.string().trim().max(5000) }), await request.formData());
			if (errors) return fail(400, { errors });
			const { error: dbError } = await db().from(table(type)).update({ admin_notes: data.admin_notes }).eq("id", params.id!);
			if (dbError) return fail(500, { errors: { form: ["Couldn't save your notes. Please try again."] } });
			return { message: "Notes saved." };
		},

		resend: async ({ params }) => {
			const sent = await emailCustomer(type, params.id!);
			if (sent) return { message: "Email sent to the customer." };
			return fail(502, {
				errors: { form: [emailConfigured() ? "The email couldn't be sent. Please try again later." : "Email isn't set up yet, so nothing was sent."] }
			});
		}
	};
}

/** 404s unless `id` is a uuid, so bad links don't reach the database */
export function requireId(id: string) {
	if (!z.uuid().safeParse(id).success) error(404, "Booking not found.");
	return id;
}
