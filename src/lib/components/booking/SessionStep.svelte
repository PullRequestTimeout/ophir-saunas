<script lang="ts">
	import { dropInSlotLabels, type DropInSlot } from "$lib/types/booking";
	import { formatCents, formatDate } from "$lib/utils/format";
	import QuantityStepper from "./QuantityStepper.svelte";
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	const slots = Object.keys(dropInSlotLabels) as DropInSlot[];

	const day = $derived(flow.latestDropInDay);
	const maxParty = $derived(day && flow.slot ? Math.max(1, day.remaining[flow.slot]) : 1);
	const price = $derived(flow.options?.settings.drop_in_price_cents ?? 0);

	// Spot counts can drop after a refetch, so keep the party within what's left.
	$effect(() => {
		if (flow.partySize > maxParty) flow.partySize = maxParty;
	});

	function chooseSlot(slot: DropInSlot) {
		flow.slot = slot;
		flow.error = null;
	}

	const spotsLeft = (remaining: number) => (remaining === 0 ? "Full" : `${remaining} ${remaining === 1 ? "spot" : "spots"} left`);
</script>

{#if day}
	<div class="step">
		<p>{formatDate(day.date, { long: true })} at {day.location}</p>
		<fieldset>
			<legend>Session time</legend>
			<div class="choices">
				{#each slots as slot (slot)}
					<label class="choice">
						<input
							type="radio"
							name="slot"
							value={slot}
							checked={flow.slot === slot}
							disabled={day.remaining[slot] === 0}
							onchange={() => chooseSlot(slot)}
						/>
						<span class="choice-body">
							<span class="choice-title"><span>{dropInSlotLabels[slot]}</span><span>{spotsLeft(day.remaining[slot])}</span></span>
						</span>
					</label>
				{/each}
			</div>
		</fieldset>

		{#if flow.slot}
			<div class="party">
				<div>
					<p class="label" id="party-size-label">How many people?</p>
					<p class="hint">{formatCents(price)} per person · up to {maxParty} for this session</p>
				</div>
				<QuantityStepper value={flow.partySize} min={1} max={maxParty} labelledby="party-size-label" onchange={(value) => (flow.partySize = value)} />
			</div>
			<div class="summary">
				<p>
					<strong>Total:</strong>
					{flow.partySize} × {formatCents(price)} = {formatCents(flow.partySize * price)}
				</p>
			</div>
		{/if}
	</div>
{/if}

<style>
	div.party {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-s) var(--spacing-m);
	}

	div.party p.label {
		margin-bottom: 0;
	}
</style>
