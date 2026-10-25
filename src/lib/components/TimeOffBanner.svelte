<!-- Homepage notice for upcoming or current time off, managed in Admin → Time Off -->

<script lang="ts">
	import { timeOffMessage } from "$lib/utils/format";
	import type { TimeOff } from "$lib/types/booking";

	let { period }: { period: TimeOff } = $props();
</script>

<aside class="time-off" aria-label="Notice">
	<span class="material-icons" aria-hidden="true">beach_access</span>
	<p>{timeOffMessage(period)}</p>
</aside>

<style>
	aside.time-off {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-s);
		margin-top: 4.5rem; /* clears the fixed nav */
		padding: var(--spacing-s) var(--padding-inline);
		background-color: var(--color-background-tan);
		color: var(--color-primary);
		text-align: center;
	}

	aside.time-off p {
		font-size: var(--font-body-m);
		font-weight: 600;
	}

	aside.time-off span.material-icons {
		flex-shrink: 0;
	}
</style>
