import { error, fail } from "@sveltejs/kit";
import { z } from "zod";
import { db } from "$lib/server/supabase";
import { checkbox, parseForm, time } from "$lib/server/forms";
import type { Settings } from "$lib/types/booking";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const { data, error: dbError } = await db().from("settings").select("*").single<Settings>();
	if (dbError) error(500, "Couldn't load settings.");
	return { settings: data };
};

const schema = z
	.object({
		auto_confirm: checkbox,
		same_day_turnaround: checkbox,
		pickup_time: time,
		delivery_window_start: time,
		delivery_window_end: time,
		delivery_slot_minutes: z.coerce
			.number()
			.int()
			.refine((n) => [15, 30, 60].includes(n), "Choose 15, 30 or 60 minutes"),
		drop_in_capacity: z.coerce.number().int().min(1, "At least 1").max(20, "At most 20"),
		owner_email: z.email("Enter a valid email address"),
		reminder_days_before: z.coerce.number().int().min(0, "0 or more").max(14, "At most 14")
	})
	.refine((s) => s.delivery_window_start < s.delivery_window_end, {
		path: ["delivery_window_end"],
		message: "The window must end after it starts"
	});

export const actions: Actions = {
	default: async ({ request }) => {
		const { data, errors } = parseForm(schema, await request.formData());
		if (errors) return fail(400, { errors });

		const { error: dbError } = await db().from("settings").update(data).eq("id", true);
		if (dbError) return fail(500, { errors: { form: ["Couldn't save settings. Please try again."] } });

		return { success: true };
	}
};
