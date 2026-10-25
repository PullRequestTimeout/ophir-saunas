<script lang="ts">
	import { enhance } from "$app/forms";
	import Field from "$lib/components/admin/Field.svelte";
	import Toast from "$lib/components/admin/Toast.svelte";
	import ItemForm from "./ItemForm.svelte";
	import { centsToDollars, formatCents, formatWeekdays } from "$lib/utils/format";
	import type { AddOn, DeliveryZone, Package } from "$lib/types/booking";

	let { data, form } = $props();

	type Kind = "package" | "addOn" | "zone";
	const sections: { kind: Kind; title: string; singular: string }[] = [
		{ kind: "package", title: "Rental packages", singular: "package" },
		{ kind: "addOn", title: "Add-ons", singular: "add-on" },
		{ kind: "zone", title: "Delivery areas", singular: "delivery area" }
	];

	const itemsFor = (kind: Kind): (Package | AddOn | DeliveryZone)[] =>
		kind === "package" ? data.packages : kind === "addOn" ? data.addOns : data.zones;

	function summary(item: Package | AddOn | DeliveryZone) {
		const parts = [formatCents(item.price_cents)];
		if ("nights" in item)
			parts.push(`${item.nights} night${item.nights === 1 ? "" : "s"}`, `delivers ${formatWeekdays(item.allowed_delivery_weekdays)}`);
		if ("max_quantity" in item && item.max_quantity > 1) parts.push(`up to ${item.max_quantity}`);
		return parts.join(" · ");
	}

	// Only show validation errors on the form that was submitted
	const errorsFor = (key: string) => (form && "errors" in form && form.id === key ? form.errors : null);

	const toast = $derived(form && "saved" in form ? "Saved." : form && "deleted" in form ? "Deleted." : null);
</script>

<svelte:head>
	<title>Pricing | Ophir Admin</title>
</svelte:head>

<h1>Pricing</h1>
<p>Changes apply to new bookings straight away and show on the public pricing page. Existing bookings keep the prices they were booked at.</p>

{#each sections as section (section.kind)}
	<section class="card" aria-labelledby="{section.kind}-heading">
		<h2 id="{section.kind}-heading">{section.title}</h2>
		<ul>
			{#each itemsFor(section.kind) as item (item.id)}
				<li>
					<details open={form?.id === item.id && !!errorsFor(item.id)}>
						<summary>
							<span class="name">{item.name}</span>
							<span class="meta">{summary(item)}</span>
							{#if !item.active}<span class="badge cancelled">Hidden</span>{/if}
						</summary>
						<ItemForm kind={section.kind} {item} errors={errorsFor(item.id)} />
					</details>
				</li>
			{/each}
		</ul>
		<details class="add" open={!!errorsFor(`new-${section.kind}`)}>
			<summary><span class="material-icons" aria-hidden="true">add</span>Add {section.singular}</summary>
			<ItemForm kind={section.kind} errors={errorsFor(`new-${section.kind}`)} />
		</details>
	</section>
{/each}

<section class="card" aria-labelledby="drop-in-heading">
	<h2 id="drop-in-heading">Drop-in sessions</h2>
	<form
		method="POST"
		action="?/dropInPrice"
		use:enhance={() =>
			async ({ update }) =>
				update({ reset: false })}
		class="drop-in"
	>
		<Field label="Price per person ($)" name="drop_in_price_cents" errors={errorsFor("dropIn")}>
			{#snippet children(attrs)}
				<input type="text" inputmode="decimal" value={centsToDollars(data.dropInPriceCents)} required {...attrs} />
			{/snippet}
		</Field>
		<button class="btn solid" type="submit">Save price</button>
	</form>
</section>

<Toast message={toast} trigger={form} />

<style>
	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	li {
		border-bottom: 1px solid var(--color-primary-transparent);
	}

	details {
		padding-block: var(--spacing-s);
	}

	details[open] {
		padding-bottom: var(--spacing-m);
	}

	li summary {
		font-weight: 400;
	}

	summary::before {
		content: "chevron_right";
		font-family: "Material Icons";
		font-size: 20px;
		color: var(--color-primary);
		transition: transform 0.2s ease-out;
	}

	details[open] > summary::before {
		transform: rotate(90deg);
	}

	details.add summary::before {
		content: none;
	}

	span.name {
		font-weight: 600;
		color: var(--color-primary);
	}

	span.meta {
		color: var(--color-grey);
		font-size: 14px;
	}

	form.drop-in {
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-end;
	}
</style>
