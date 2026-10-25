import { error, json } from "@sveltejs/kit";
import { getAvailability } from "$lib/server/availability";
import { addDays } from "$lib/utils/format";
import type { RequestHandler } from "./$types";

const isDate = (value: string | null): value is string => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

/** GET /api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD (at most ~3 months at a time) */
export const GET: RequestHandler = async ({ url }) => {
	const from = url.searchParams.get("from");
	const to = url.searchParams.get("to");
	if (!isDate(from) || !isDate(to) || to < from || to > addDays(from, 100)) {
		error(400, "Provide from and to dates no more than 100 days apart.");
	}

	try {
		return json(await getAvailability(from, to), { headers: { "cache-control": "no-store" } });
	} catch (err) {
		console.error("Loading availability failed", err);
		error(500, "Couldn't load availability.");
	}
};
