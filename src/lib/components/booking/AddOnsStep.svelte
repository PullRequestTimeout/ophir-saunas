<script lang="ts">
	import { formatCents } from "$lib/utils/format";
	import QuantityStepper from "./QuantityStepper.svelte";
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	const setQuantity = (id: string, quantity: number) => (flow.addOns[id] = quantity);
</script>

<div class="step">
	<p>Optional extras for your rental. You can skip this step.</p>
	<ul class="add-ons">
		{#each flow.options?.addOns ?? [] as addOn (addOn.id)}
			{@const quantity = flow.addOns[addOn.id] ?? 0}
			<li>
				<div class="add-on-text">
					<p class="choice-title"><span id="add-on-{addOn.id}">{addOn.name}</span><span>{formatCents(addOn.price_cents)}</span></p>
					{#if addOn.description}<p class="choice-meta">{addOn.description}</p>{/if}
				</div>
				{#if addOn.max_quantity <= 1}
					<label class="toggle">
						<input type="checkbox" checked={quantity > 0} onchange={(e) => setQuantity(addOn.id, e.currentTarget.checked ? 1 : 0)} />
						Add
					</label>
				{:else}
					<QuantityStepper
						value={quantity}
						max={addOn.max_quantity}
						labelledby="add-on-{addOn.id}"
						onchange={(value) => setQuantity(addOn.id, value)}
					/>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	ul.add-ons {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	li {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-s) var(--spacing-m);
		padding: var(--spacing-m);
		border: 2px solid var(--color-background-green);
		border-radius: 14px;
		background-color: var(--color-white);
	}

	div.add-on-text {
		flex: 1 1 12rem;
		min-width: 0;
	}

	label.toggle {
		display: flex;
		align-items: center;
		gap: var(--spacing-s);
		min-height: 44px;
		font-weight: 600;
		color: var(--color-primary);
		cursor: pointer;
	}

	label.toggle input {
		width: 1.25rem;
		height: 1.25rem;
		accent-color: var(--color-primary);
	}
</style>
