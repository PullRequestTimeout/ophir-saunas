import { json } from "@sveltejs/kit";
import { z } from "zod";
import { db, rpcErrorMessage } from "$lib/server/supabase";
import { dropInRequest } from "$lib/server/bookingSchemas";
import { rateLimited } from "$lib/server/rateLimit";
import type { DropInBooking } from "$lib/types/booking";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	if (rateLimited(`drop-in:${getClientAddress()}`)) {
		return json({ message: "Too many booking attempts. Please wait a few minutes and try again." }, { status: 429 });
	}

	const parsed = dropInRequest.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return json({ message: "Please check your details and try again.", errors: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
	}
	const b = parsed.data;

	const { data, error } = await db()
		.rpc("create_drop_in_booking", {
			p_day_id: b.day_id,
			p_slot: b.slot,
			p_party_size: b.party_size,
			p_name: b.name,
			p_email: b.email,
			p_phone: b.phone,
			p_notes: b.notes
		})
		.single<DropInBooking>();

	if (error) {
		const message = rpcErrorMessage(error);
		if (message) return json({ message }, { status: 409 });
		console.error("create_drop_in_booking failed", error);
		return json({ message: "Something went wrong saving your booking. Please try again or contact us." }, { status: 500 });
	}

	return json(
		{
			booking: {
				id: data.id,
				status: data.status,
				slot: data.slot,
				party_size: data.party_size,
				price_cents: data.price_cents,
				total_cents: data.total_cents
			}
		},
		{ status: 201 }
	);
};
