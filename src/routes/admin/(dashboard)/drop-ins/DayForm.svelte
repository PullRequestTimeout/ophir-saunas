<!-- Create/edit form for a drop-in day. -->

<script lang="ts">
	import { enhance } from "$app/forms";
	import Field from "$lib/components/admin/Field.svelte";
	import type { DropInDay } from "$lib/types/booking";

	let { day, errors = null, today }: { day?: DropInDay; errors?: Record<string, string[] | undefined> | null; today: string } = $props();

	const isNew = $derived(!day);
	const prefix = $derived(`day-${day?.id ?? "new"}-`);
	let saving = $state(false);
</script>

<form
	method="POST"
	action="?/save"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			await update({ reset: isNew });
			saving = false;
		};
	}}
>
	<input type="hidden" name="id" value={day?.id ?? ""} />
	<div class="grid">
		<Field label="Date" name="date" idPrefix={prefix} {errors}>
			{#snippet children(attrs)}<input type="date" min={isNew ? today : undefined} value={day?.date ?? ""} required {...attrs} />{/snippet}
		</Field>
		<Field label="Location" name="location" idPrefix={prefix} hint="Shown to customers and in their confirmation email." {errors}>
			{#snippet children(attrs)}<input type="text" value={day?.location ?? ""} maxlength="200" required {...attrs} />{/snippet}
		</Field>
	</div>
	<Field label="Notes for customers (optional)" name="notes" idPrefix={prefix} hint="e.g. parking, what to bring." {errors}>
		{#snippet children(attrs)}<textarea maxlength="1000" {...attrs}>{day?.notes ?? ""}</textarea>{/snippet}
	</Field>
	<label class="checkbox">
		<input type="checkbox" name="active" checked={day?.active ?? true} />
		Open for bookings
	</label>
	<div class="actions">
		<button class="btn solid" type="submit" disabled={saving}>{isNew ? "Add drop-in day" : "Save changes"}</button>
		{#if day}
			<button
				class="btn danger"
				type="submit"
				formaction="?/delete"
				formnovalidate
				onclick={(event) => {
					if (!confirm("Delete this drop-in day?")) event.preventDefault();
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
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: var(--spacing-m);
	}

	div.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-s);
	}
</style>
