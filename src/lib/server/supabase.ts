import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env as publicEnv } from "$env/dynamic/public";
import { env } from "$env/dynamic/private";

let client: SupabaseClient | undefined;

// Server-only client using the secret key. It bypasses RLS, so only use it after validating input
// (public endpoints) or checking the admin session (admin routes). Created lazily so builds don't need the env vars.
export function db(): SupabaseClient {
	client ??= createClient(publicEnv.PUBLIC_SUPABASE_URL!, env.SUPABASE_SECRET_KEY!, {
		auth: { persistSession: false, autoRefreshToken: false }
	});
	return client;
}

/** Unwraps a query result, throwing its error */
export function must<T>(result: { data: T | null; error: unknown }): T {
	if (result.error) throw result.error;
	return result.data as T;
}

// Messages raised by the booking RPCs, mapped to customer-facing copy.
const rpcErrors: Record<string, string> = {
	rental_conflict: "Sorry, the sauna is already booked for some of those dates.",
	drop_in_conflict: "Sorry, the sauna is running drop-in sessions during those dates.",
	time_off: "Sorry, we're taking time off during those dates.",
	too_soon: "That date is no longer available to book online.",
	invalid_weekday: "That package can't be delivered on the selected day.",
	invalid_delivery_time: "Please choose a delivery time within the delivery window.",
	invalid_package: "That package is no longer available.",
	invalid_zone: "That delivery area is no longer available.",
	invalid_add_on: "One of the selected add-ons is no longer available.",
	invalid_drop_in_day: "That drop-in session is no longer available.",
	invalid_party_size: "Please choose a valid party size.",
	slot_full: "Sorry, there aren't enough spots left in that time slot."
};

export function rpcErrorMessage(error: { message: string }): string | null {
	return rpcErrors[error.message] ?? null;
}
