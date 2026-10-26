import { error } from "@sveltejs/kit";
import { bookingActions, createdToast, requireId } from "$lib/server/adminBookings";
import { getDropIn } from "$lib/server/bookings";
import { emailConfigured } from "$lib/server/email/send";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url }) => {
	const booking = await getDropIn(requireId(params.id));
	if (!booking) error(404, "Booking not found.");
	return { booking, emailConfigured: emailConfigured(), created: createdToast(url.searchParams.get("created")) };
};

export const actions: Actions = bookingActions("drop-in");
