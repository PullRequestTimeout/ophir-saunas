<!-- Short-lived confirmation message for admin actions. A `warning` (e.g. an email that didn't go out) stays until dismissed. The live region stays mounted so screen readers announce changes. -->

<script lang="ts">
	import { fly } from "svelte/transition";

	/** `trigger` re-shows the toast when the same message repeats, e.g. pass the page's `form` result */
	let { message, warning = null, trigger }: { message: string | null; warning?: string | null; trigger?: unknown } = $props();

	let visible = $state<{ message: string; warning: string | null } | null>(null);

	$effect(() => {
		void trigger;
		visible = message ? { message, warning } : null;
		if (!message || warning) return;
		const timer = setTimeout(() => (visible = null), 3000);
		return () => clearTimeout(timer);
	});
</script>

<div class="region" role="status" aria-live="polite">
	{#if visible}
		<div class="toast" class:warning={visible.warning} transition:fly={{ y: 20, duration: 250 }}>
			<span class="material-icons" aria-hidden="true">{visible.warning ? "warning" : "check_circle"}</span>
			<p>
				{visible.message}
				{#if visible.warning}<strong>{visible.warning}</strong>{/if}
			</p>
			{#if visible.warning}
				<button type="button" aria-label="Dismiss" onclick={() => (visible = null)}>
					<span class="material-icons" aria-hidden="true">close</span>
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Spans the viewport with a gutter and centres the toast, so long messages wrap instead of running off small screens */
	div.region {
		position: fixed;
		bottom: var(--spacing-m);
		left: var(--spacing-m);
		right: var(--spacing-m);
		z-index: 20;
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	div.toast {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-s);
		max-width: 32rem;
		background-color: var(--color-primary);
		color: var(--color-background-white);
		padding: var(--spacing-s) var(--spacing-m);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow);
		font-weight: 600;
		pointer-events: auto;
	}

	div.toast.warning {
		background-color: var(--color-danger-bg);
		color: var(--color-danger);
		border: 1px solid currentColor;
	}

	div.toast p {
		color: inherit;
	}

	div.toast strong {
		display: block;
	}

	div.toast span.material-icons {
		color: inherit;
		font-size: 20px;
		line-height: 1.5;
	}

	div.toast button {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		margin: -0.25rem -0.5rem -0.25rem 0;
		border-radius: 50%;
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
	}
</style>
