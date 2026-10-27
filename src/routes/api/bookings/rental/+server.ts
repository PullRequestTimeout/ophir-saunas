import { json } from "@sveltejs/kit";
import { z } from "zod";
import { db, rpcErrorMessage } from "$lib/server/supabase";
import { rentalRequest } from "$lib/server/bookingSchemas";
import { addOnChoiceError } from "$lib/server/availability";
import { rateLimited } from "$lib/server/rateLimit";
import { notifyNewRental } from "$lib/server/bookings";
import type { Rental } from "$lib/types/booking";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	if (rateLimited(`rental:${getClientAddress()}`)) {
		return json({ message: "Too many booking attempts. Please wait a few minutes and try again." }, { status: 429 });
	}

	const parsed = rentalRequest.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return json({ message: "Please check your details and try again.", errors: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
	}
	const b = parsed.data;

	const addOnError = await addOnChoiceError(b.add_ons.map((a) => a.id));
	if (addOnError) return json({ message: addOnError }, { status: 400 });

	// Totals, statuses and availability are all decided in the database, never trusted from the client.
	const { data, error } = await db()
		.rpc("create_rental", {
			p_package_id: b.package_id,
			p_delivery_date: b.delivery_date,
			p_delivery_time: b.delivery_time,
			p_zone_id: b.zone_id,
			p_address: b.address,
			p_add_ons: b.add_ons,
			p_name: b.name,
			p_email: b.email,
			p_phone: b.phone,
			p_notes: b.notes
		})
		.single<Rental>();

	if (error) {
		const message = rpcErrorMessage(error);
		if (message) return json({ message }, { status: 409 });
		console.error("create_rental failed", error);
		return json({ message: "Something went wrong saving your booking. Please try again or contact us." }, { status: 500 });
	}

	// Awaited so the emails go out before the serverless function ends; they never fail the booking.
	await notifyNewRental(data);

	return json(
		{
			booking: {
				id: data.id,
				status: data.status,
				package_name: data.package_name,
				delivery_date: data.delivery_date,
				delivery_time: data.delivery_time,
				pickup_date: data.pickup_date,
				pickup_time: data.pickup_time,
				line_items: data.line_items,
				total_cents: data.total_cents
			}
		},
		{ status: 201 }
	);
};
