// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient } from "@supabase/supabase-js";

declare global {
	namespace App {
		// interface Error {}
		// Only set on /admin routes (see hooks.server.ts)
		interface Locals {
			supabase: SupabaseClient;
			getAdmin: () => Promise<{ email: string } | null>;
			admin: { email: string } | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			onoutclick?: CompositionEventHandler<T>;
			onintersect?: IntersectionObserverCallback<T>;
		}
	}
}

export {};
