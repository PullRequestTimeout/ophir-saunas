<!-- Edit/create form for one package, add-on or delivery zone. -->

<script lang="ts">
	import { enhance } from "$app/forms";
	import Field from "$lib/components/admin/Field.svelte";
	import { centsToDollars, weekdayNames } from "$lib/utils/format";
	import type { AddOn, DeliveryZone, Package } from "$lib/types/booking";

	type Kind = "package" | "addOn" | "zone";
	type Item = Partial<Package & AddOn & DeliveryZone>;

	let {
		kind,
		item = {},
		errors = null,
		onsaved
	}: { kind: Kind; item?: Item; errors?: Record<string, string[] | undefined> | null; onsaved?: () => void } = $props();

	const isNew = $derived(!item.id);
	const prefix = $derived(`${kind}-${item.id ?? "new"}-`);
	let saving = $state(false);
</script>

<form
	method="POST"
	action="?/save"
	use:enhance={() => {
		saving = true;
		return async ({ result, update }) => {
			// New-item forms clear after a successful save; edit forms keep their values.
			await update({ reset: isNew });
			saving = false;
			if (result.type === "success") onsaved?.();
		};
	}}
>
	<input type="hidden" name="kind" value={kind} />
	<input type="hidden" name="id" value={item.id ?? ""} />

	<div class="grid">
		<div class="wide">
			<Field label="Name" name="name" idPrefix={prefix} {errors}>
				{#snippet children(attrs)}<input type="text" value={item.name ?? ""} required maxlength="100" {...attrs} />{/snippet}
			</Field>
		</div>
		<Field label="Price ($)" name="price_cents" idPrefix={prefix} {errors}>
			{#snippet children(attrs)}
				<input type="text" inputmode="decimal" value={item.price_cents != null ? centsToDollars(item.price_cents) : ""} required {...attrs} />
			{/snippet}
		</Field>
		{#if kind === "package"}
			<Field label="Nights" name="nights" idPrefix={prefix} {errors}>
				{#snippet children(attrs)}<input type="number" min="1" max="14" value={item.nights ?? 1} required {...attrs} />{/snippet}
			</Field>
		{/if}
		{#if kind === "addOn"}
			<Field label="Max quantity" name="max_quantity" idPrefix={prefix} hint="How many a customer can add." {errors}>
				{#snippet children(attrs)}<input type="number" min="1" max="20" value={item.max_quantity ?? 1} required {...attrs} />{/snippet}
			</Field>
		{/if}
		<Field label="Display order" name="sort_order" idPrefix={prefix} hint="Lower numbers show first." {errors}>
			{#snippet children(attrs)}<input type="number" value={item.sort_order ?? 0} {...attrs} />{/snippet}
		</Field>
	</div>

	{#if kind === "package"}
		<fieldset aria-describedby={errors?.allowed_delivery_weekdays ? `${prefix}weekdays-error` : undefined}>
			<legend>Delivery days</legend>
			<div class="weekdays">
				{#each weekdayNames as day, i}
					<label class="checkbox">
						<input type="checkbox" name="allowed_delivery_weekdays" value={i + 1} checked={item.allowed_delivery_weekdays?.includes(i + 1)} />
						{day.slice(0, 3)}
					</label>
				{/each}
			</div>
			{#if errors?.allowed_delivery_weekdays}
				<small id="{prefix}weekdays-error" class="field-error">{errors.allowed_delivery_weekdays[0]}</small>
			{/if}
		</fieldset>
	{/if}

	{#if kind !== "zone"}
		<Field label="Description" name="description" idPrefix={prefix} hint="Shown on the pricing page and in the booking form." {errors}>
			{#snippet children(attrs)}<textarea maxlength="500" {...attrs}>{item.description ?? ""}</textarea>{/snippet}
		</Field>
	{/if}

	<label class="checkbox">
		<input type="checkbox" name="active" checked={item.active ?? true} />
		Available to book
	</label>

	<div class="actions">
		<button class="btn solid" type="submit" disabled={saving}>{isNew ? "Add" : "Save changes"}</button>
		{#if !isNew}
			<button
				class="btn danger"
				type="submit"
				formaction="?/delete"
				formnovalidate
				onclick={(event) => {
					if (!confirm(`Delete "${item.name}"? Existing bookings keep their details. To hide it temporarily, untick "Available to book" instead.`))
						event.preventDefault();
				}}>Delete</button
			>
		{/if}
		{#if errors?.form}
			<p class="form-error" role="alert">{errors.form[0]}</p>
		{/if}
	</div>
</form>

<style>
	div.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: var(--spacing-m);
	}

	div.grid div.wide {
		grid-column: 1 / -1;
	}

	fieldset {
		border: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	legend {
		font-weight: 600;
		color: var(--color-primary);
		margin-bottom: var(--spacing-s);
	}

	div.weekdays {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-s) var(--spacing-m);
	}

	div.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-s);
	}
</style>
