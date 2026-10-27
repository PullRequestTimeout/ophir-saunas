<script lang="ts">
	import { formatCents } from "$lib/utils/format";
	import { addOnSections } from "$lib/utils/addOns";
	import QuantityStepper from "./QuantityStepper.svelte";
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	const sections = $derived(addOnSections(flow.options?.addOns ?? []));

	const setQuantity = (id: string, quantity: number) => (flow.addOns[id] = quantity);

	/** Picks one add-on from a choice group (or none) and clears the rest of the group */
	function choose(group: { id: string }[], id: string | null) {
		for (const addOn of group) flow.addOns[addOn.id] = addOn.id === id ? 1 : 0;
	}
</script>

<div class="step">
	<p>Optional extras for your rental. You can skip this step.</p>
	{#each sections as section (section.group || section.addOns[0].id)}
		{#if section.group}
			{@const chosen = section.addOns.find((a) => (flow.addOns[a.id] ?? 0) > 0)?.id ?? null}
			<fieldset>
				<legend>{section.group}</legend>
				<div class="choices two-up">
					<label class="choice">
						<input type="radio" name="add-on-{section.group}" checked={chosen === null} onchange={() => choose(section.addOns, null)} />
						<span class="choice-body"><span class="choice-title"><span>None</span></span></span>
					</label>
					{#each section.addOns as addOn (addOn.id)}
						<label class="choice">
							<input type="radio" name="add-on-{section.group}" checked={chosen === addOn.id} onchange={() => choose(section.addOns, addOn.id)} />
							<span class="choice-body">
								<span class="choice-title"><span>{addOn.name}</span><span>{formatCents(addOn.price_cents)}</span></span>
								{#if addOn.description}<span class="choice-meta">{addOn.description}</span>{/if}
							</span>
						</label>
					{/each}
				</div>
			</fieldset>
		{:else}
			{@const addOn = section.addOns[0]}
			{@const quantity = flow.addOns[addOn.id] ?? 0}
			{#if addOn.max_quantity <= 1}
				<label class="choice">
					<input type="checkbox" checked={quantity > 0} onchange={(e) => setQuantity(addOn.id, e.currentTarget.checked ? 1 : 0)} />
					<span class="choice-body">
						<span class="choice-title"><span>{addOn.name}</span><span>{formatCents(addOn.price_cents)}</span></span>
						{#if addOn.description}<span class="choice-meta">{addOn.description}</span>{/if}
					</span>
				</label>
			{:else}
				<div class="add-on">
					<div class="add-on-text">
						<p class="choice-title"><span id="add-on-{addOn.id}">{addOn.name}</span><span>{formatCents(addOn.price_cents)}</span></p>
						{#if addOn.description}<p class="choice-meta">{addOn.description}</p>{/if}
					</div>
					<QuantityStepper
						value={quantity}
						max={addOn.max_quantity}
						labelledby="add-on-{addOn.id}"
						onchange={(value) => setQuantity(addOn.id, value)}
					/>
				</div>
			{/if}
		{/if}
	{/each}
</div>

<style>
	/* Add-ons with a quantity; single choices use the shared .choice cards */
	div.add-on {
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
</style>
