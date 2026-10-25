<!-- Create/edit form for a time-off period. -->

<script lang="ts">
	import { enhance } from "$app/forms";
	import Field from "$lib/components/admin/Field.svelte";
	import type { TimeOff } from "$lib/types/booking";

	let { period, errors = null, today }: { period?: TimeOff; errors?: Record<string, string[] | undefined> | null; today: string } = $props();

	const isNew = $derived(!period);
	const prefix = $derived(`off-${period?.id ?? "new"}-`);
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
	<input type="hidden" name="id" value={period?.id ?? ""} />
	<div class="grid">
		<Field label="First day off" name="start_date" idPrefix={prefix} {errors}>
			{#snippet children(attrs)}<input type="date" min={isNew ? today : undefined} value={period?.start_date ?? ""} required {...attrs} />{/snippet}
		</Field>
		<Field label="Last day off" name="end_date" idPrefix={prefix} {errors}>
			{#snippet children(attrs)}<input type="date" min={isNew ? today : undefined} value={period?.end_date ?? ""} required {...attrs} />{/snippet}
		</Field>
	</div>
	<Field
		label="Homepage banner message (optional)"
		name="banner_message"
		idPrefix={prefix}
		hint="Leave blank to use: “We're taking a break [dates]. Bookings resume [date].”"
		{errors}
	>
		{#snippet children(attrs)}<textarea maxlength="300" {...attrs}>{period?.banner_message ?? ""}</textarea>{/snippet}
	</Field>
	<label class="checkbox">
		<input type="checkbox" name="show_banner" checked={period?.show_banner ?? true} />
		Show a banner on the homepage
	</label>
	<div class="actions">
		<button class="btn solid" type="submit" disabled={saving}>{isNew ? "Add time off" : "Save changes"}</button>
		{#if period}
			<button
				class="btn danger"
				type="submit"
				formaction="?/delete"
				formnovalidate
				onclick={(event) => {
					if (!confirm("Delete this time off? These dates will open up for bookings again.")) event.preventDefault();
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
