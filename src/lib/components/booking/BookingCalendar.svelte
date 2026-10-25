<!-- Month calendar for the booking modal. Loads each month's availability as it's shown; only days that
	`isAvailable` accepts can be picked. -->

<script lang="ts">
	import type { Availability } from "$lib/server/availability";
	import { formatDate, localToday } from "$lib/utils/format";
	import { untrack } from "svelte";
	import { monthOf, type BookingFlow } from "./flow.svelte";

	let {
		flow,
		selected,
		label,
		isAvailable,
		onselect,
		empty
	}: {
		flow: BookingFlow;
		selected: string | null;
		/** Accessible name for the calendar, e.g. "Drop-off date" */
		label: string;
		isAvailable: (date: string, availability: Availability) => boolean;
		onselect: (date: string) => void;
		/** Shown when nothing in the month is available */
		empty?: string;
	} = $props();

	const MONTHS_AHEAD = 12;
	const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	const today = localToday();
	const firstMonth = monthOf(today);
	const lastMonth = shiftMonth(firstMonth, MONTHS_AHEAD);

	// svelte-ignore state_referenced_locally
	let month = $state(selected ? monthOf(selected) : firstMonth);

	function shiftMonth(value: string, by: number) {
		const [y, m] = value.split("-").map(Number);
		const date = new Date(Date.UTC(y, m - 1 + by, 1));
		return date.toISOString().slice(0, 7);
	}

	$effect(() => {
		const shown = month;
		untrack(() => flow.loadMonth(shown));
	});

	const monthState = $derived(flow.months[month]);
	const availability = $derived(typeof monthState === "object" ? monthState : null);

	const monthLabel = $derived(new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en-CA", { timeZone: "UTC", month: "long", year: "numeric" }));

	const days = $derived.by(() => {
		const [y, m] = month.split("-").map(Number);
		const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
		// Monday-first offset of the 1st
		const offset = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
		const cells: (string | null)[] = Array(offset).fill(null);
		for (let d = 1; d <= count; d++) cells.push(`${month}-${String(d).padStart(2, "0")}`);
		return cells;
	});

	const available = $derived(new Set(availability ? days.filter((d): d is string => !!d && isAvailable(d, availability)) : []));
</script>

<div class="calendar" role="group" aria-label={label}>
	<div class="calendar-header">
		<button
			type="button"
			class="nav"
			onclick={() => month > firstMonth && (month = shiftMonth(month, -1))}
			aria-disabled={month <= firstMonth}
			aria-label="Previous month"
		>
			<span class="material-icons" aria-hidden="true">chevron_left</span>
		</button>
		<p class="month" aria-live="polite">{monthLabel}</p>
		<button
			type="button"
			class="nav"
			onclick={() => month < lastMonth && (month = shiftMonth(month, 1))}
			aria-disabled={month >= lastMonth}
			aria-label="Next month"
		>
			<span class="material-icons" aria-hidden="true">chevron_right</span>
		</button>
	</div>

	<div class="grid" aria-busy={monthState === "loading" || undefined}>
		{#each weekdays as weekday (weekday)}
			<span class="weekday" aria-hidden="true">{weekday}</span>
		{/each}
		{#each days as date, i (date ?? `blank-${i}`)}
			{#if date}
				{@const canPick = available.has(date)}
				<button
					type="button"
					class="day"
					class:available={canPick}
					class:today={date === today}
					disabled={!canPick}
					aria-pressed={date === selected}
					aria-label="{formatDate(date, { long: true })}{canPick ? '' : ', unavailable'}"
					onclick={() => onselect(date)}
				>
					{Number(date.slice(8))}
				</button>
			{:else}
				<span></span>
			{/if}
		{/each}
	</div>

	<!-- The month label is the live region; only loading and errors are announced from here -->
	<div class="calendar-status">
		{#if monthState === "loading" || monthState === undefined}
			<p role="status">Loading availability…</p>
		{:else if monthState === "error"}
			<p role="alert">Couldn't load availability.</p>
			<button type="button" class="link" onclick={() => flow.loadMonth(month, true)}>Try again</button>
		{:else if available.size === 0 && empty}
			<p>{empty}</p>
		{/if}
	</div>
</div>

<style>
	div.calendar {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	div.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	p.month {
		font-weight: 600;
		color: var(--color-primary);
	}

	button.nav {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		background: none;
	}

	button.nav[aria-disabled="true"] {
		opacity: 0.3;
		cursor: default;
	}

	div.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
	}

	span.weekday {
		text-align: center;
		font-size: 13px;
		color: var(--color-grey);
		padding-bottom: var(--spacing-xs);
	}

	button.day {
		min-height: 44px;
		border: 2px solid transparent;
		border-radius: 10px;
		background: none;
		color: var(--color-grey);
		font-size: 16px;
		opacity: 0.4;
		cursor: default;
	}

	button.day.available {
		opacity: 1;
		cursor: pointer;
		color: var(--color-primary);
		font-weight: 600;
		background-color: var(--color-white);
		border-color: var(--color-background-green);
	}

	button.day.today {
		text-decoration: underline;
	}

	button.day[aria-pressed="true"] {
		background-color: var(--color-primary);
		border-color: var(--color-primary);
		color: var(--color-white);
	}

	div.calendar-status {
		min-height: 1.5rem;
		display: flex;
		gap: var(--spacing-s);
		align-items: baseline;
		font-size: 14px;
		color: var(--color-grey);
	}

	@media (hover: hover) {
		button.nav:not([aria-disabled="true"]):hover {
			background-color: var(--color-background-green);
		}

		button.day.available:hover {
			border-color: var(--color-primary);
		}
	}
</style>
