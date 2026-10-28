import { db } from "$lib/server/supabase";
import { addDays, localToday } from "$lib/utils/format";
import type { TimeOff } from "$lib/types/booking";
import type { LayoutServerLoad } from "./$types";

// Announce time off from a month ahead until it ends.
const NOTICE_DAYS = 30;

export const load: LayoutServerLoad = async ({ setHeaders }) => {
	// A short cache keeps public pages fast while banner and price edits still show within a minute.
	// Set here for every page, since setting the same header again in a page load throws.
	setHeaders({ "cache-control": "public, max-age=60" });

	const today = localToday();
	const { data, error } = await db()
		.from("time_off")
		.select("*")
		.eq("show_banner", true)
		.gte("end_date", today)
		.lte("start_date", addDays(today, NOTICE_DAYS))
		.order("start_date")
		.limit(1)
		.returns<TimeOff[]>();

	// The banner is a nice-to-have; never break a page over it.
	if (error) console.error("Loading the time-off banner failed", error);
	return { timeOff: data?.[0] ?? null };
};
