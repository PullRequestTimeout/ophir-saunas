<script lang="ts">
	// Type definition for the component's props
	type PrimaryButtonProps = {
		href?: string;
		text?: string;
		primary?: boolean;
		type?: "button" | "submit" | "reset";
		onAction?: (event: MouseEvent) => void;
	};

	// Destructure props with default values
	let { href, text = "Button", primary = true, type = "button", onAction }: PrimaryButtonProps = $props();

	//
	let buttonEl: HTMLAnchorElement | HTMLButtonElement | undefined = $state();

	function getMousePos(event: MouseEvent) {
		if (!buttonEl) return;
		const rect = buttonEl.getBoundingClientRect();
		mousePos = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	function handleClick(event: MouseEvent) {
		onAction?.(event);
	}

	let mousePos = $state({ x: 0, y: 0 });
</script>

{#if href}
	<a bind:this={buttonEl} {href} class={primary ? "primary" : "secondary"} onmouseenter={getMousePos} onclick={handleClick}>
		<span>{text}</span>
		<div style="--top: {mousePos.y}px; --left: {mousePos.x}px;"></div>
	</a>
{:else}
	<button bind:this={buttonEl} {type} class={primary ? "primary" : "secondary"} onmouseenter={getMousePos} onclick={handleClick}>
		<span>{text}</span>
		<div style="--top: {mousePos.y}px; --left: {mousePos.x}px;"></div>
	</button>
{/if}

<style>
	a,
	button {
		position: relative;
		display: inline-block;
		padding: 0.35rem 1.5rem 0.5rem 1.5rem;
		border-radius: var(--border-radius);
		text-decoration: none;
		font-size: var(--font-body-s);
		font-weight: 600;
		background-color: var(--color-primary);
		overflow: hidden;
		color: var(--color-white);
		transition: 0.25s ease-out;
		width: fit-content;
	}

	button {
		border: 0;
		cursor: pointer;
	}

	a span,
	button span {
		position: relative;
		z-index: 1;
		text-transform: capitalize;
	}

	a > div,
	button > div {
		position: absolute;
		top: var(--top);
		left: var(--left);
		transform: translate(-50%, -50%);
		width: 0;
		height: 0;
		border-radius: 50%;
		pointer-events: none;
		touch-action: none;
		background-color: var(--color-primary-light);
		transition:
			width 0.4s ease-out,
			height 0.4s ease-out;
	}

	a.secondary,
	button.secondary {
		background-color: transparent;
		border: none;
		padding: calc(0.35rem + var(--border-width)) calc(1.5rem + var(--border-width)) calc(0.5rem + var(--border-width))
			calc(1.5rem + var(--border-width));
		box-shadow: inset 0 0 0 var(--border-width) var(--color-primary);
		color: var(--color-primary);
		transition: color 0.4s ease-out;
	}

	a.secondary > div,
	button.secondary > div {
		background-color: var(--color-primary);
	}

	@media (hover: hover) {
		a:hover > div,
		button:hover > div {
			width: 30rem;
			height: 30rem;
		}

		a.secondary:hover,
		button.secondary:hover {
			color: var(--color-white);
		}
	}
</style>
