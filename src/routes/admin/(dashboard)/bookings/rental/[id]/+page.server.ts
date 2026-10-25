import { error } from "@sveltejs/kit";
import { bookingActions, requireId } from "$lib/server/adminBookings";
import { getRental } from "$lib/server/bookings";
import { emailConfigured } from "$lib/server/email/send";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const rental = await getRental(requireId(params.id));
	if (!rental) error(404, "Booking not found.");
	return { rental, emailConfigured: emailConfigured() };
};

export const actions: Actions = bookingActions("rental");
