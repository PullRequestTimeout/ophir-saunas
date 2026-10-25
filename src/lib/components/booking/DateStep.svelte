<script lang="ts">
	import { canDeliver, deliveryTimes } from "$lib/utils/availability";
	import { tick } from "svelte";
	import { formatTime } from "$lib/utils/format";
	import BookingCalendar from "./BookingCalendar.svelte";
	import StaySummary from "./StaySummary.svelte";
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	const times = $derived(flow.options ? deliveryTimes(flow.options.settings) : []);

	let timeFieldset: HTMLFieldSetElement | undefined = $state();

	// The time choices appear below the calendar, often out of view on phones.
	async function selectDate(date: string) {
		flow.deliveryDate = date;
		flow.error = null;
		await tick();
		timeFieldset?.scrollIntoView({ block: "nearest" });
	}
</script>

<div class="step">
	{#if flow.package}
		{@const pkg = flow.package}
		<p>{pkg.name}: {pkg.nights} {pkg.nights === 1 ? "night" : "nights"}. Available drop-off dates are highlighted.</p>
		<BookingCalendar
			{flow}
			label="Drop-off date"
			selected={flow.deliveryDate}
			isAvailable={(date, availability) => canDeliver(availability.calendar, pkg, date)}
			onselect={selectDate}
			empty="No drop-off dates are available this month for this package. Try the next month."
		/>
	{/if}

	{#if flow.deliveryDate}
		<fieldset bind:this={timeFieldset}>
			<legend>Drop-off time</legend>
			<div class="pills">
				{#each times as time (time)}
					<label class="pill">
						<input type="radio" name="delivery-time" value={time} bind:group={flow.deliveryTime} />
						{formatTime(time)}
					</label>
				{/each}
			</div>
		</fieldset>
		<StaySummary {flow} />
	{/if}
</div>
