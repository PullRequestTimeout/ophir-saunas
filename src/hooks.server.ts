import { createServerClient } from "@supabase/ssr";
import { redirect, type Handle } from "@sveltejs/kit";
import { env as publicEnv } from "$env/dynamic/public";
import { env } from "$env/dynamic/private";

const adminEmails = () =>
	(env.ADMIN_EMAILS ?? "")
		.split(",")
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean);

export const handle: Handle = async ({ event, resolve }) => {
	const isAdminRoute = event.url.pathname === "/admin" || event.url.pathname.startsWith("/admin/");

	// Only admin routes need a session-aware client; public pages and booking endpoints use the server client in $lib/server/supabase.
	if (isAdminRoute) {
		event.locals.supabase = createServerClient(publicEnv.PUBLIC_SUPABASE_URL!, publicEnv.PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => event.cookies.set(name, value, { ...options, path: "/" }));
				}
			}
		});

		// getClaims() verifies the JWT, unlike getSession() which trusts the cookie.
		event.locals.getAdmin = async () => {
			const { data, error } = await event.locals.supabase.auth.getClaims();
			const email = typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : null;
			if (error || !email || !adminEmails().includes(email)) return null;
			return { email };
		};

		const isLoginRoute = event.url.pathname === "/admin/login";
		const admin = await event.locals.getAdmin();
		event.locals.admin = admin;

		if (!admin && !isLoginRoute) {
			redirect(303, `/admin/login?redirectTo=${encodeURIComponent(event.url.pathname + event.url.search)}`);
		}
		if (admin && isLoginRoute) {
			redirect(303, "/admin");
		}
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === "content-range" || name === "x-supabase-api-version"
	});

	if (isAdminRoute) {
		response.headers.set("X-Robots-Tag", "noindex, nofollow");
		response.headers.set("Cache-Control", "private, no-store");
	}

	return response;
};
