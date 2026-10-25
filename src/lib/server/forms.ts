import { z } from "zod";

/** A dollar amount typed by the admin ("45" or "45.50"), stored as cents */
export const dollars = z
	.string()
	.trim()
	.regex(/^\d+(\.\d{1,2})?$/, "Enter an amount like 45 or 45.50")
	.transform((value) => Math.round(Number(value) * 100));

/** An unchecked checkbox isn't submitted at all, so a missing value means false */
export const checkbox = z.preprocess((value) => value === "on" || value === "true", z.boolean());

/** Empty hidden id means "create" */
export const optionalId = z.preprocess((value) => (value === "" ? undefined : value), z.uuid().optional());

export const time = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Enter a time");

export const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a date");

export type FieldErrors = Record<string, string[] | undefined>;

/** Validates FormData against a schema. Keys listed in `arrays` are read with getAll (e.g. checkbox groups). */
export function parseForm<T extends z.ZodType>(
	schema: T,
	form: FormData,
	arrays: string[] = []
): { data: z.infer<T>; errors: null } | { data: null; errors: FieldErrors } {
	const raw: Record<string, unknown> = {};
	for (const key of new Set(form.keys())) {
		raw[key] = arrays.includes(key) ? form.getAll(key) : form.get(key);
	}
	for (const key of arrays) raw[key] ??= [];

	const result = schema.safeParse(raw);
	if (result.success) return { data: result.data, errors: null };
	return { data: null, errors: z.flattenError(result.error).fieldErrors as FieldErrors };
}
