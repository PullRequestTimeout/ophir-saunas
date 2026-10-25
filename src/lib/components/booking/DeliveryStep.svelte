<script lang="ts">
	import { formatCents } from "$lib/utils/format";
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();
</script>

<div class="step">
	<fieldset>
		<legend>Delivery area</legend>
		<div class="choices two-up">
			{#each flow.options?.zones ?? [] as zone (zone.id)}
				<label class="choice">
					<input type="radio" name="zone" value={zone.id} bind:group={flow.zoneId} />
					<span class="choice-body">
						<span class="choice-title"><span>{zone.name}</span><span>{formatCents(zone.price_cents)}</span></span>
					</span>
				</label>
			{/each}
		</div>
	</fieldset>

	<div class="field">
		<label for="booking-address">Delivery address</label>
		<textarea
			id="booking-address"
			autocomplete="street-address"
			bind:value={flow.address}
			aria-describedby="booking-address-hint{flow.fieldErrors.address ? ' booking-address-error' : ''}"
			aria-invalid={flow.fieldErrors.address ? true : undefined}
		></textarea>
		<small id="booking-address-hint" class="hint">Add anything that helps us find a flat spot for the sauna, like a back lane or gate code.</small>
		{#if flow.fieldErrors.address}<small id="booking-address-error" class="field-error">{flow.fieldErrors.address}</small>{/if}
	</div>
</div>
