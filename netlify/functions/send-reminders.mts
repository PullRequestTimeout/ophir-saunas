// Netlify Scheduled Function: once a day, asks the site to send booking reminder emails.
// The work happens in src/routes/api/cron/reminders/+server.ts; this only triggers it with the shared secret.
// Needs CRON_SECRET set in the Netlify environment. URL is provided by Netlify (the site's main address).
// This daily run also keeps the Supabase project awake: free-tier projects pause after 7 days without activity.
// The endpoint rejects the call before touching the database if CRON_SECRET is missing, so set it on BOTH the dev
// and prod Netlify sites, and keep some daily database call here if reminders are ever removed.

export default async () => {
	const res = await fetch(`${process.env.URL}/api/cron/reminders`, {
		method: "POST",
		headers: { authorization: `Bearer ${process.env.CRON_SECRET}` }
	});
	console.log("Reminders:", res.status, await res.text());
};

// 16:00 UTC is 8–9am in Rossland, depending on daylight saving.
export const config = { schedule: "0 16 * * *" };
