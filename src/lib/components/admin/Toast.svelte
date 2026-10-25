<!-- Short-lived confirmation message for admin actions. The live region stays mounted so screen readers announce changes. -->

<script lang="ts">
	import { fly } from "svelte/transition";

	/** `trigger` re-shows the toast when the same message repeats, e.g. pass the page's `form` result */
	let { message, trigger }: { message: string | null; trigger?: unknown } = $props();

	let visible = $state<string | null>(null);

	$effect(() => {
		void trigger;
		if (!message) return;
		visible = message;
		const timer = setTimeout(() => (visible = null), 3000);
		return () => clearTimeout(timer);
	});
</script>

<div class="region" role="status" aria-live="polite">
	{#if visible}
		<p transition:fly={{ y: 20, duration: 250 }}>
			<span class="material-icons" aria-hidden="true">check_circle</span>{visible}
		</p>
	{/if}
</div>

<style>
	div.region {
		position: fixed;
		bottom: var(--spacing-m);
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		pointer-events: none;
	}

	p {
		display: flex;
		align-items: center;
		gap: var(--spacing-s);
		background-color: var(--color-primary);
		color: var(--color-background-white);
		padding: var(--spacing-s) var(--spacing-m);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow);
		font-weight: 600;
		white-space: nowrap;
	}

	p span.material-icons {
		color: inherit;
		font-size: 20px;
	}
</style>
