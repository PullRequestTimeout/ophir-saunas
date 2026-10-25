import { z } from "zod";

const contact = {
	name: z.string().trim().min(1, "Enter your name").max(100),
	email: z.email("Enter a valid email address").max(200),
	phone: z
		.string()
		.trim()
		.regex(/^[\d\s()+.-]{7,25}$/, "Enter a valid phone number"),
	notes: z.string().trim().max(1000).default(""),
	/** Honeypot: hidden from people, so anything here came from a bot */
	website: z.string().max(0).optional()
};

export const rentalRequest = z.object({
	package_id: z.uuid(),
	delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	delivery_time: z.string().regex(/^\d{2}:\d{2}$/),
	zone_id: z.uuid(),
	address: z.string().trim().min(5, "Enter the delivery address").max(300),
	add_ons: z
		.array(z.object({ id: z.uuid(), quantity: z.number().int().min(1).max(20) }))
		.max(20)
		.refine((items) => new Set(items.map((item) => item.id)).size === items.length, "Each add-on can only be listed once")
		.default([]),
	...contact
});

export const dropInRequest = z.object({
	day_id: z.uuid(),
	slot: z.enum(["17-19", "19-21"]),
	party_size: z.number().int().min(1).max(20),
	...contact
});

export type RentalRequest = z.input<typeof rentalRequest>;
export type DropInRequest = z.input<typeof dropInRequest>;
