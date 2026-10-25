import { error } from "@sveltejs/kit";
import { getBookingOptions } from "$lib/server/availability";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Prices change rarely; a short cache keeps the page fast while admin edits still show within a minute.
	setHeaders({ "cache-control": "public, max-age=60" });

	try {
		const { packages, addOns, zones, settings } = await getBookingOptions();
		return { packages, addOns, zones, dropIn: { priceCents: settings.drop_in_price_cents, capacity: settings.drop_in_capacity } };
	} catch (err) {
		console.error("Loading pricing failed", err);
		error(500, "Couldn't load pricing.");
	}
};
