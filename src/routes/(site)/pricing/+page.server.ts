import { error } from "@sveltejs/kit";
import { getBookingOptions } from "$lib/server/availability";
import type { PageServerLoad } from "./$types";

// The (site) layout load sets a one-minute cache for this page.
export const load: PageServerLoad = async () => {
	try {
		const { packages, addOns, zones, settings } = await getBookingOptions();
		return { packages, addOns, zones, dropIn: { priceCents: settings.drop_in_price_cents, capacity: settings.drop_in_capacity } };
	} catch (err) {
		console.error("Loading pricing failed", err);
		error(500, "Couldn't load pricing.");
	}
};
