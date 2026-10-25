<script lang="ts">
	import { formatCents, formatWeekdays } from "$lib/utils/format";
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	function choose(id: string) {
		if (flow.packageId === id) return;
		flow.packageId = id;
		// Each package has its own delivery days, so a date picked for another one may not fit.
		flow.deliveryDate = null;
		flow.error = null;
	}
</script>

<fieldset class="step">
	<legend class="visually-hidden">Package</legend>
	<div class="choices">
		{#each flow.options?.packages ?? [] as pkg (pkg.id)}
			<label class="choice">
				<input type="radio" name="package" value={pkg.id} checked={flow.packageId === pkg.id} onchange={() => choose(pkg.id)} />
				<span class="choice-body">
					<span class="choice-title"><span>{pkg.name}</span><span>{formatCents(pkg.price_cents)}</span></span>
					<span class="choice-meta">Drop-off {formatWeekdays(pkg.allowed_delivery_weekdays)}</span>
					{#if pkg.description}<span class="choice-meta">{pkg.description}</span>{/if}
				</span>
			</label>
		{/each}
	</div>
</fieldset>
