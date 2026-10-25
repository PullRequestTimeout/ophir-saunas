import { Resend } from "resend";
import { env } from "$env/dynamic/private";

export interface Email {
	subject: string;
	html: string;
	text: string;
}

let client: Resend | undefined;

/** Whether a real Resend key is configured; without one, emails are logged instead of sent */
export function emailConfigured() {
	const key = env.RESEND_API_KEY;
	return !!key && key !== "re_...";
}

/**
 * Sends an email and reports whether it went out. Never throws: a failed email must not fail the booking or
 * admin action that triggered it, so failures are logged and the caller decides what to show.
 */
export async function sendEmail(to: string, email: Email, options: { replyTo?: string } = {}): Promise<boolean> {
	if (!to) return false;
	if (!emailConfigured()) {
		console.info(`[email] Not sent (RESEND_API_KEY isn't set): "${email.subject}" to ${to}`);
		return false;
	}

	try {
		client ??= new Resend(env.RESEND_API_KEY);
		const { error } = await client.emails.send({
			from: env.EMAIL_FROM || "Ophir Mobile Saunas <bookings@ophirsaunas.ca>",
			to,
			replyTo: options.replyTo,
			subject: email.subject,
			html: email.html,
			text: email.text
		});
		if (error) {
			console.error(`[email] Resend rejected "${email.subject}" to ${to}`, error.name, error.message);
			return false;
		}
		return true;
	} catch (err) {
		console.error(`[email] Sending "${email.subject}" to ${to} failed`, err);
		return false;
	}
}
