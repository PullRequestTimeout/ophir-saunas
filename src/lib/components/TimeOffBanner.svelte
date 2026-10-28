<!-- Homepage notice for upcoming or current time off, managed in Admin → Time Off -->

<script lang="ts">
	import { slide } from "svelte/transition";
	import { timeOffMessage } from "$lib/utils/format";
	import type { TimeOff } from "$lib/types/booking";

	let { period, onclose }: { period: TimeOff; onclose: () => void } = $props();
</script>

<aside class="time-off" aria-label="Notice" transition:slide={{ duration: 300 }}>
	<span class="material-icons" aria-hidden="true">beach_access</span>
	<p>{timeOffMessage(period)}</p>
	<button type="button" aria-label="Dismiss notice" onclick={onclose}>
		<span class="material-icons" aria-hidden="true">close</span>
	</button>
</aside>

<style>
	aside.time-off {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-s);
		/* Room on the right for the close button, matched on the left to keep the message centred */
		padding: var(--spacing-s) calc(var(--padding-inline) + 2.75rem);
		position: relative;
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

	button {
		position: absolute;
		top: 50%;
		right: var(--padding-inline);
		translate: 0 -50%;
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		margin-right: -0.75rem; /* lines the icon up with the page edge while keeping a 44px target */
		border: none;
		border-radius: 50%;
		background: none;
		color: inherit;
		cursor: pointer;
		transition: background-color 0.2s ease-out;
	}

	@media (hover: hover) {
		button:hover {
			background-color: var(--color-primary-transparent);
		}
	}
</style>
