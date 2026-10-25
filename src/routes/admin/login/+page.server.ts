import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

// Only follow redirects back into the admin area, never to another origin.
function safeRedirect(target: string | null) {
	return target && target.startsWith("/admin") && !target.startsWith("//") ? target : "/admin";
}

export const actions: Actions = {
	default: async ({ request, url, locals }) => {
		const form = await request.formData();
		const email = String(form.get("email") ?? "").trim();
		const password = String(form.get("password") ?? "");

		if (!email || !password) {
			return fail(400, { email, message: "Enter your email and password." });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
		if (error) {
			return fail(400, { email, message: "That email and password don't match." });
		}

		if (!(await locals.getAdmin())) {
			await locals.supabase.auth.signOut();
			return fail(403, { email, message: "This account doesn't have admin access." });
		}

		redirect(303, safeRedirect(url.searchParams.get("redirectTo")));
	}
};
