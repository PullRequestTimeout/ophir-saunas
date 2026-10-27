// State for the multi-step booking modal. One instance lives in BookingModal and is passed to each step; the modal
// resets it on close, so every open starts a fresh booking.

import type { Availability, BookingOptions, PublicDropInDay } from "$lib/server/availability";
import type { BookingStatus, DropInSlot, LineItem } from "$lib/types/booking";
import type { BookingService } from "$lib/utils/globalStates.svelte";
import { canDeliver } from "$lib/utils/availability";
import { addDays, localToday } from "$lib/utils/format";

export type Step = "service" | "package" | "date" | "delivery" | "addons" | "session-day" | "session" | "contact" | "review" | "success";

export interface BookingResult {
	status: BookingStatus;
	total_cents: number;
}

/** "2026-11" for the month a date falls in */
export const monthOf = (date: string) => date.slice(0, 7);

function monthRange(month: string) {
	const [y, m] = month.split("-").map(Number);
	const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
	return { from: `${month}-01`, to: `${month}-${String(last).padStart(2, "0")}` };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[\d\s()+.-]{7,25}$/;

export class BookingFlow {
	service = $state<BookingService | null>(null);
	step = $state<Step>("service");

	options = $state<BookingOptions | null>(null);
	optionsError = $state(false);
	/** Availability per month ("2026-11"), fetched as the calendar shows each month */
	months = $state<Record<string, Availability | "loading" | "error">>({});

	// Rental
	packageId = $state<string | null>(null);
	deliveryDate = $state<string | null>(null);
	deliveryTime = $state<string | null>(null);
	zoneId = $state<string | null>(null);
	address = $state("");
	addOns = $state<Record<string, number>>({});

	// Drop-in
	dropInDay = $state<PublicDropInDay | null>(null);
	slot = $state<DropInSlot | null>(null);
	partySize = $state(1);

	contact = $state({ name: "", email: "", phone: "", notes: "", website: "" });

	/** Message shown under the current step's fields */
	error = $state<string | null>(null);
	fieldErrors = $state<Record<string, string>>({});
	submitting = $state(false);
	/** The last submit failed because the dates or spots were taken in the meantime */
	conflict = $state(false);
	/** The customer chose Edit on the review step, so Continue goes back there instead of through every later step */
	returnToReview = $state(false);
	result = $state<BookingResult | null>(null);

	steps = $derived<Step[]>(
		this.service === "rental"
			? ["package", "date", "delivery", ...(this.options?.addOns.length ? (["addons"] as const) : []), "contact", "review"]
			: this.service === "drop-in"
				? ["session-day", "session", "contact", "review"]
				: []
	);

	package = $derived(this.options?.packages.find((p) => p.id === this.packageId) ?? null);
	zone = $derived(this.options?.zones.find((z) => z.id === this.zoneId) ?? null);
	/** The chosen drop-in day with the latest spot counts, which are refetched if a booking attempt finds a slot full */
	latestDropInDay = $derived(
		this.dropInDay ? (this.availabilityFor(this.dropInDay.date)?.dropInDays.find((d) => d.id === this.dropInDay?.id) ?? this.dropInDay) : null
	);
	pickupDate = $derived(this.package && this.deliveryDate ? addDays(this.deliveryDate, this.package.nights) : null);

	/** Itemised estimate for the review step; the server recomputes the real total */
	lineItems = $derived.by<LineItem[]>(() => {
		const options = this.options;
		if (!options) return [];
		const item = (label: string, unit_cents: number, quantity = 1) => ({ label, quantity, unit_cents, total_cents: unit_cents * quantity });

		if (this.service === "drop-in") return [item("Drop-in session", options.settings.drop_in_price_cents, this.partySize)];

		const items: LineItem[] = [];
		if (this.package) items.push(item(this.package.name, this.package.price_cents));
		if (this.zone) items.push(item(`Delivery: ${this.zone.name}`, this.zone.price_cents));
		for (const addOn of options.addOns) {
			const quantity = this.addOns[addOn.id] ?? 0;
			if (quantity > 0) items.push(item(addOn.name, addOn.price_cents, quantity));
		}
		return items;
	});
	totalCents = $derived(this.lineItems.reduce((sum, item) => sum + item.total_cents, 0));

	async loadOptions() {
		if (this.options) return;
		this.optionsError = false;
		try {
			const res = await fetch("/api/booking/options");
			if (!res.ok) throw new Error(res.statusText);
			this.options = await res.json();
		} catch {
			this.optionsError = true;
		}
	}

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

	start(service: BookingService) {
		this.returnToReview = false;
		if (this.service !== service) {
			this.service = service;
			this.error = null;
		}
		this.step = this.steps[0];
	}

	/** Starts the (freshly reset) flow, on `service` if one was asked for */
	open(service: BookingService | null) {
		if (service) this.start(service);
		this.loadOptions();
		this.loadMonth(monthOf(localToday()));
	}

	/** Whether the customer has chosen anything yet, so closing would lose something */
	get started() {
		return !!(this.packageId || this.dropInDay || this.contact.name);
	}

	reset() {
		// Calendars may have changed by the next open; a flow in progress keeps its own until a submit conflicts.
		this.months = {};
		this.service = null;
		this.step = "service";
		this.packageId = this.deliveryDate = this.deliveryTime = this.zoneId = null;
		this.address = "";
		this.addOns = {};
		this.dropInDay = null;
		this.slot = null;
		this.partySize = 1;
		this.contact = { name: "", email: "", phone: "", notes: "", website: "" };
		this.error = null;
		this.fieldErrors = {};
		this.conflict = false;
		this.result = null;
		this.returnToReview = false;
	}

	get stepNumber() {
		return this.steps.indexOf(this.step) + 1;
	}

	back() {
		this.error = null;
		this.returnToReview = false;
		const index = this.steps.indexOf(this.step);
		this.step = index > 0 ? this.steps[index - 1] : "service";
	}

	next() {
		this.error = this.validate();
		if (this.error) return;
		if (this.returnToReview) {
			// Changing the package clears the date and changing the day clears the slot, so pick those again first.
			if (this.step === "package" && !this.deliveryDate) this.step = "date";
			else if (this.step === "session-day" && !this.slot) this.step = "session";
			else {
				this.step = "review";
				this.returnToReview = false;
			}
			return;
		}
		this.step = this.steps[this.steps.indexOf(this.step) + 1];
	}

	/** Jumps to an earlier step from the review step (or after a conflict), returning to review afterwards */
	goTo(step: Step) {
		this.error = null;
		this.conflict = false;
		this.returnToReview = true;
		this.step = step;
	}

	/** Why the current step can't be left yet, or null */
	validate(): string | null {
		this.fieldErrors = {};
		switch (this.step) {
			case "package":
				return this.package ? null : "Choose a package to continue.";
			case "date":
				if (!this.deliveryDate || !this.package) return "Choose a drop-off date to continue.";
				const availability = this.availabilityFor(this.deliveryDate);
				if (availability && !canDeliver(availability.calendar, this.package, this.deliveryDate)) {
					return "That date is no longer available. Choose another date.";
				}
				return this.deliveryTime ? null : "Choose a drop-off time to continue.";
			case "delivery":
				if (!this.zone) return "Choose your delivery area to continue.";
				if (this.address.trim().length < 5) this.fieldErrors.address = "Enter the delivery address.";
				break;
			case "session-day":
				return this.dropInDay ? null : "Choose a day to continue.";
			case "session":
				if (!this.slot) return "Choose a session time to continue.";
				return this.latestDropInDay?.remaining[this.slot] ? null : "That session is full. Choose another time or day.";
			case "contact":
				if (!this.contact.name.trim()) this.fieldErrors.name = "Enter your name.";
				if (!EMAIL.test(this.contact.email.trim())) this.fieldErrors.email = "Enter a valid email address.";
				if (!PHONE.test(this.contact.phone.trim())) this.fieldErrors.phone = "Enter a valid phone number.";
				break;
		}
		return Object.keys(this.fieldErrors).length ? "Please fix the highlighted fields." : null;
	}

	async submit() {
		if (this.submitting) return;
		this.error = null;
		this.conflict = false;
		this.submitting = true;

		const contact = { ...this.contact, email: this.contact.email.trim() };
		const [url, body] =
			this.service === "rental"
				? [
						"/api/bookings/rental",
						{
							package_id: this.packageId,
							delivery_date: this.deliveryDate,
							delivery_time: this.deliveryTime,
							zone_id: this.zoneId,
							address: this.address,
							add_ons: Object.entries(this.addOns)
								.filter(([, quantity]) => quantity > 0)
								.map(([id, quantity]) => ({ id, quantity })),
							...contact
						}
					]
				: ["/api/bookings/drop-in", { day_id: this.dropInDay?.id, slot: this.slot, party_size: this.partySize, ...contact }];

		try {
			const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
			const data = await res.json().catch(() => ({}));
			if (res.ok) {
				this.result = { status: data.booking.status, total_cents: data.booking.total_cents };
				this.step = "success";
				return;
			}
			this.error = data.message ?? "Something went wrong saving your booking. Please try again or contact us.";
			// The calendar may have changed since it loaded (e.g. someone else just booked these dates).
			if (res.status === 409) {
				this.conflict = true;
				const date = this.service === "rental" ? this.deliveryDate : this.dropInDay?.date;
				if (date) this.loadMonth(monthOf(date), true);
			}
		} catch {
			this.error = "We couldn't reach the server. Check your connection and try again.";
		} finally {
			this.submitting = false;
		}
	}
}
