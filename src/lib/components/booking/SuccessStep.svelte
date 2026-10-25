<script lang="ts">
	import { formatCents } from "$lib/utils/format";
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	const confirmed = $derived(flow.result?.status === "confirmed");
</script>

<div class="step success">
	<span class="material-icons" aria-hidden="true">{confirmed ? "check_circle" : "schedule"}</span>
	{#if confirmed}
		<p>You're booked! We've sent the details to <strong>{flow.contact.email}</strong>.</p>
	{:else}
		<p>
			Thanks, {flow.contact.name.split(" ")[0]}. We've received your request and will email <strong>{flow.contact.email}</strong> once it's confirmed.
		</p>
	{/if}
	{#if flow.result}
		<p>Estimated total: <strong>{formatCents(flow.result.total_cents)}</strong>. Nothing has been charged.</p>
	{/if}
	<p>Questions? Reply to the email or contact us any time.</p>
</div>

<style>
	div.success {
		align-items: center;
		text-align: center;
	}

	div.success span.material-icons {
		font-size: 64px;
	}
</style>
