<script lang="ts">
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	const fields = [
		{ name: "name", label: "Full name", type: "text", autocomplete: "name" },
		{ name: "email", label: "Email", type: "email", autocomplete: "email" },
		{ name: "phone", label: "Phone", type: "tel", autocomplete: "tel" }
	] as const;
</script>

<div class="step">
	{#each fields as field (field.name)}
		{@const error = flow.fieldErrors[field.name]}
		<div class="field">
			<label for="booking-{field.name}">{field.label}</label>
			<input
				id="booking-{field.name}"
				type={field.type}
				autocomplete={field.autocomplete}
				bind:value={flow.contact[field.name]}
				aria-describedby={error ? `booking-${field.name}-error` : undefined}
				aria-invalid={error ? true : undefined}
			/>
			{#if error}<small id="booking-{field.name}-error" class="field-error">{error}</small>{/if}
		</div>
	{/each}

	<div class="field">
		<label for="booking-notes">Anything we should know? <span class="optional">(optional)</span></label>
		<textarea id="booking-notes" bind:value={flow.contact.notes} maxlength="1000"></textarea>
	</div>

	<!-- Honeypot: hidden from people, so only bots fill it in -->
	<div class="visually-hidden" aria-hidden="true">
		<label for="booking-website">Website</label>
		<input id="booking-website" type="text" tabindex="-1" autocomplete="off" bind:value={flow.contact.website} />
	</div>
</div>

<style>
	span.optional {
		font-weight: 400;
		color: var(--color-grey);
	}
</style>
