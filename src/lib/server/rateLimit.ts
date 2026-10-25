// Best-effort per-IP limit for the public booking endpoints. Serverless instances don't share memory, so this only
// slows down bursts from a single client; the honeypot field and server-side validation do the rest.

const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit = 10, windowMs = 10 * 60 * 1000) {
	const now = Date.now();
	const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
	recent.push(now);
	hits.set(key, recent);

	// Keep the map from growing forever on a long-lived instance
	if (hits.size > 5000) hits.clear();

	return recent.length > limit;
}
