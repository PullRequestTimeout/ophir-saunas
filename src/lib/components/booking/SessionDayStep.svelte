<script lang="ts">
	import { formatDate } from "$lib/utils/format";
	import BookingCalendar from "./BookingCalendar.svelte";
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	function select(date: string) {
		const day = flow.availabilityFor(date)?.dropInDays.find((d) => d.date === date);
		if (!day) return;
		if (flow.dropInDay?.id !== day.id) flow.slot = null;
		flow.dropInDay = day;
		flow.error = null;
	}
</script>

<div class="step">
	<p>Drop-in sessions run on select evenings. Days with spots left are highlighted.</p>
	<BookingCalendar
		{flow}
		label="Drop-in day"
		selected={flow.dropInDay?.date ?? null}
		isAvailable={(date, availability) =>
			availability.dropInDays.some((d) => d.date === date && (d.remaining["17-19"] > 0 || d.remaining["19-21"] > 0))}
		onselect={select}
		empty="No drop-in sessions with open spots this month. Try the next month."
	/>
	{#if flow.dropInDay}
		<div class="summary">
			<p><strong>{formatDate(flow.dropInDay.date, { long: true })}</strong></p>
			<p>Location: {flow.dropInDay.location}</p>
			{#if flow.dropInDay.notes}<p>{flow.dropInDay.notes}</p>{/if}
		</div>
	{/if}
</div>
