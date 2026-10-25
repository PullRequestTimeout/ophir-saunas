<script lang="ts">
	import { formatCents } from "$lib/utils/format";
	import type { BookingFlow } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	const fromPrice = $derived(flow.options?.packages.length ? Math.min(...flow.options.packages.map((p) => p.price_cents)) : null);
</script>

<div class="step">
	<button type="button" class="service" onclick={() => flow.start("rental")}>
		<span class="material-icons" aria-hidden="true">local_shipping</span>
		<span class="service-text">
			<span class="service-title">Private Rental</span>
			<span>We deliver the sauna to you for one or more nights.{fromPrice !== null ? ` From ${formatCents(fromPrice)}.` : ""}</span>
		</span>
	</button>
	<button type="button" class="service" onclick={() => flow.start("drop-in")}>
		<span class="material-icons" aria-hidden="true">groups</span>
		<span class="service-text">
			<span class="service-title">Drop-in Session</span>
			<span>
				Join a shared two-hour session on select evenings.{flow.options
					? ` ${formatCents(flow.options.settings.drop_in_price_cents)} per person.`
					: ""}
			</span>
		</span>
	</button>
</div>

<style>
	button.service {
		display: flex;
		gap: var(--spacing-m);
		align-items: flex-start;
		text-align: left;
		padding: var(--spacing-m);
		border: 2px solid var(--color-background-green);
		border-radius: 14px;
		background-color: var(--color-white);
		color: var(--color-grey);
		transition: border-color 0.15s ease-out;
	}

	button.service:hover {
		border-color: var(--color-primary);
	}

	span.service-text {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		line-height: 1.5;
	}

	span.service-title {
		font-weight: 600;
		font-size: 18px;
		color: var(--color-primary);
	}
</style>
