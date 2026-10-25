// Formatting helpers shared by the site, admin and emails. Dates are "YYYY-MM-DD" calendar days and times are
// "HH:MM[:SS]" local times (America/Vancouver); they're formatted in UTC so the server's timezone never shifts them.

export const TIMEZONE = "America/Vancouver";

export const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function formatCents(cents: number) {
	const dollars = cents / 100;
	return "$" + (Number.isInteger(dollars) ? dollars.toString() : dollars.toFixed(2));
}

export function centsToDollars(cents: number) {
	return (cents / 100).toFixed(2).replace(/\.00$/, "");
}

function toUtcDate(date: string) {
	const [y, m, d] = date.split("-").map(Number);
	return new Date(Date.UTC(y, m - 1, d));
}

/** "2026-11-06" → "Fri, Nov 6" (add the year with { year: true }) */
export function formatDate(date: string, options: { year?: boolean; long?: boolean } = {}) {
	return toUtcDate(date).toLocaleDateString("en-CA", {
		timeZone: "UTC",
		weekday: options.long ? "long" : "short",
		month: options.long ? "long" : "short",
		day: "numeric",
		year: options.year ? "numeric" : undefined
	});
}

/** "18:30:00" → "6:30pm" */
export function formatTime(time: string) {
	const [h, m] = time.split(":").map(Number);
	const suffix = h >= 12 ? "pm" : "am";
	const hour = h % 12 || 12;
	return `${hour}:${m.toString().padStart(2, "0")}${suffix}`;
}

/** ISO weekday of a calendar day, 1 = Monday … 7 = Sunday */
export function isoWeekday(date: string) {
	return toUtcDate(date).getUTCDay() || 7;
}

export function addDays(date: string, days: number) {
	const d = toUtcDate(date);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}

/** Today's calendar day in Rossland */
export function localToday() {
	return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(new Date());
}

/** The homepage banner text for a time-off period: the admin's own message, or a default built from the dates */
export function timeOffMessage(period: { start_date: string; end_date: string; banner_message: string }) {
	if (period.banner_message.trim()) return period.banner_message.trim();
	const dates =
		period.start_date === period.end_date
			? `on ${formatDate(period.start_date, { long: true })}`
			: `from ${formatDate(period.start_date, { long: true })} to ${formatDate(period.end_date, { long: true })}`;
	return `We're taking a break ${dates}. Bookings resume ${formatDate(addDays(period.end_date, 1), { long: true })}.`;
}

/** Short summary of allowed weekdays, e.g. [1,2,3,4] → "Mon–Thu", [5] → "Fri" */
export function formatWeekdays(days: number[]) {
	const sorted = [...days].sort((a, b) => a - b);
	const short = (d: number) => weekdayNames[d - 1].slice(0, 3);
	const isRun = sorted.length > 2 && sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
	return isRun ? `${short(sorted[0])}–${short(sorted[sorted.length - 1])}` : sorted.map(short).join(", ");
}

/** A stored timestamp in Rossland time, e.g. "Oct 25, 2026, 11:49 a.m." */
export function formatTimestamp(timestamp: string) {
	return new Date(timestamp).toLocaleString("en-CA", { timeZone: TIMEZONE, dateStyle: "medium", timeStyle: "short" });
}
