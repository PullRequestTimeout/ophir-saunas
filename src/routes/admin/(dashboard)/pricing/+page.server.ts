import { error, fail } from "@sveltejs/kit";
import { z } from "zod";
import { db } from "$lib/server/supabase";
import { checkbox, dollars, optionalId, parseForm } from "$lib/server/forms";
import type { AddOn, DeliveryZone, Package } from "$lib/types/booking";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const [packages, addOns, zones, settings] = await Promise.all([
		db().from("packages").select("*").order("sort_order").returns<Package[]>(),
		db().from("add_ons").select("*").order("sort_order").returns<AddOn[]>(),
		db().from("delivery_zones").select("*").order("sort_order").returns<DeliveryZone[]>(),
		db().from("settings").select("drop_in_price_cents").single<{ drop_in_price_cents: number }>()
	]);
	if (packages.error || addOns.error || zones.error || settings.error) error(500, "Couldn't load pricing.");

	return {
		packages: packages.data,
		addOns: addOns.data,
		zones: zones.data,
		dropInPriceCents: settings.data.drop_in_price_cents
	};
};

const common = {
	id: optionalId,
	name: z.string().trim().min(1, "Enter a name").max(100),
	price_cents: dollars,
	sort_order: z.coerce.number().int().default(0),
	active: checkbox
};

// Each kind of priced item maps to its table and the fields the admin can edit.
const kinds = {
	package: {
		table: "packages",
		arrays: ["allowed_delivery_weekdays"],
		schema: z.object({
			...common,
			nights: z.coerce.number().int().min(1, "At least 1 night").max(14, "At most 14 nights"),
			allowed_delivery_weekdays: z.array(z.coerce.number().int().min(1).max(7)).min(1, "Choose at least one delivery day"),
			description: z.string().trim().max(500).default("")
		})
	},
	addOn: {
		table: "add_ons",
		arrays: [],
		schema: z.object({
			...common,
			max_quantity: z.coerce.number().int().min(1, "At least 1").max(20, "At most 20"),
			choice_group: z.string().trim().max(50).default(""),
			description: z.string().trim().max(500).default("")
		})
	},
	zone: {
		table: "delivery_zones",
		arrays: [],
		schema: z.object(common)
	}
} as const;

type Kind = keyof typeof kinds;
const isKind = (value: unknown): value is Kind => typeof value === "string" && value in kinds;

export const actions: Actions = {
	save: async ({ request }) => {
		const form = await request.formData();
		const kind = form.get("kind");
		if (!isKind(kind)) return fail(400, { kind: null, id: null, errors: { form: ["Unknown item type."] } });

		const key = String(form.get("id") || `new-${kind}`);
		const { table, schema, arrays } = kinds[kind];
		const { data, errors } = parseForm(schema, form, [...arrays]);
		if (errors) return fail(400, { kind, id: key, errors });

		const { id, ...values } = data;
		const result = id ? await db().from(table).update(values).eq("id", id) : await db().from(table).insert(values);
		if (result.error) return fail(500, { kind, id: key, errors: { form: ["Couldn't save. Please try again."] } });

		return { kind, id: key, saved: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const kind = form.get("kind");
		const id = String(form.get("id") ?? "");
		if (!isKind(kind) || !z.uuid().safeParse(id).success) return fail(400, { kind: null, id: null, errors: { form: ["Unknown item."] } });

		// Bookings keep their own copy of names and prices, so deleting an item never changes past bookings.
		const { error: dbError } = await db().from(kinds[kind].table).delete().eq("id", id);
		if (dbError) return fail(500, { kind, id, errors: { form: ["Couldn't delete. Please try again."] } });

		return { kind, id, deleted: true };
	},

	dropInPrice: async ({ request }) => {
		const { data, errors } = parseForm(z.object({ drop_in_price_cents: dollars }), await request.formData());
		if (errors) return fail(400, { kind: "dropIn", id: "dropIn", errors });

		const { error: dbError } = await db().from("settings").update(data).eq("id", true);
		if (dbError) return fail(500, { kind: "dropIn", id: "dropIn", errors: { form: ["Couldn't save. Please try again."] } });

		return { kind: "dropIn", id: "dropIn", saved: true };
	}
};
