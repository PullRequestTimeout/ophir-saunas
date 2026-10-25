<!-- Label + hint + error wrapper for admin form controls. The child receives the attributes that link it all up:
	<Field label="Email" name="owner_email" errors={form?.errors}>{#snippet children(attrs)}<input type="email" {...attrs} />{/snippet}</Field> -->

<script lang="ts">
	import type { Snippet } from "svelte";

	type Attrs = { id: string; name: string; "aria-describedby"?: string; "aria-invalid"?: boolean };

	let {
		label,
		name,
		hint,
		errors,
		idPrefix = "",
		children
	}: {
		label: string;
		name: string;
		hint?: string;
		errors?: Record<string, string[] | undefined> | null;
		/** Keeps ids unique when the same field appears in several forms on one page */
		idPrefix?: string;
		children: Snippet<[Attrs]>;
	} = $props();

	const id = $derived(`${idPrefix}${name}`);
	const error = $derived(errors?.[name]?.[0]);
	const describedBy = $derived([hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined);
</script>

<div class="field">
	<label for={id}>{label}</label>
	{@render children({ id, name, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
	{#if hint}
		<small id="{id}-hint" class="hint">{hint}</small>
	{/if}
	{#if error}
		<small id="{id}-error" class="field-error">{error}</small>
	{/if}
</div>

<style>
	div.field {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		min-width: 0;
	}
</style>
