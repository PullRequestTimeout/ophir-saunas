<!-- "Drop-off: Fri, Nov 6, 7:00pm · Pickup: Mon, Nov 9, around 10:00am" -->

<script lang="ts">
	import { formatDate, formatTime } from "$lib/utils/format";
	import type { Snippet } from "svelte";
	import type { BookingFlow } from "./flow.svelte";

	let { flow, children }: { flow: BookingFlow; children?: Snippet } = $props();
</script>

{#if flow.deliveryDate && flow.pickupDate && flow.options}
	<div class="summary">
		<p>
			<strong>Drop-off:</strong>
			{formatDate(flow.deliveryDate)}{flow.deliveryTime ? `, ${formatTime(flow.deliveryTime)}` : ""}
		</p>
		<p><strong>Pickup:</strong> {formatDate(flow.pickupDate)}, around {formatTime(flow.options.settings.pickup_time)}</p>
		{@render children?.()}
	</div>
{/if}
