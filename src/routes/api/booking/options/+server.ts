import { error, json } from "@sveltejs/kit";
import { getBookingOptions } from "$lib/server/availability";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	try {
		return json(await getBookingOptions(), { headers: { "cache-control": "no-store" } });
	} catch (err) {
		console.error("Loading booking options failed", err);
		error(500, "Couldn't load booking options.");
	}
};
