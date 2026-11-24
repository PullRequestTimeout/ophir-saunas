// Calendar availability fetched one month at a time, as BookingCalendar shows each month. Used by the booking modal
// (BookingFlow extends it) and the admin New booking page.

import type { Availability } from "$lib/server/availability";

/** "2026-11" for the month a date falls in */
export const monthOf = (date: string) => date.slice(0, 7);

function monthRange(month: string) {
	const [y, m] = month.split("-").map(Number);
	const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
	return { from: `${month}-01`, to: `${month}-${String(last).padStart(2, "0")}` };
}

export class AvailabilityMonths {
	/** Availability per month ("2026-11") */
	months = $state<Record<string, Availability | "loading" | "error">>({});

	async loadMonth(month: string, force = false) {
		const current = this.months[month];
		if (!force && current && current !== "error") return;
		this.months[month] = "loading";
		const { from, to } = monthRange(month);
		try {
			const res = await fetch(`/api/availability?from=${from}&to=${to}`);
			if (!res.ok) throw new Error(res.statusText);
			this.months[month] = await res.json();
		} catch {
			this.months[month] = "error";
		}
	}

	/** Loaded availability for the month `date` is in, if any */
	availabilityFor(date: string) {
		const month = this.months[monthOf(date)];
		return typeof month === "object" ? month : null;
	}
}
