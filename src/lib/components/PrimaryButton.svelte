<script lang="ts">
	let { href = "#", text = "Button", primary = true }: { href: string; text: string; primary: boolean } = $props();
	let buttonLink: HTMLAnchorElement;

	function getMousePos(event: MouseEvent) {
		const rect = buttonLink.getBoundingClientRect();
		mousePos = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	let mousePos = $state({ x: 0, y: 0 });
</script>

<a bind:this={buttonLink} {href} class={primary ? "primary" : "secondary"} onmouseenter={getMousePos}
	><span>{text}</span>
	<div style="--top: {mousePos.y}px; --left: {mousePos.x}px;"></div></a
>

<style>
	a {
		position: relative;
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border-radius: 20px;
		text-decoration: none;
		font-weight: bold;
		background-color: var(--color-primary-1);
		overflow: hidden;
		color: white;
	}

	a span {
		position: relative;
		z-index: 1;
		text-transform: capitalize;
	}

	a > div {
		position: absolute;
		top: var(--top);
		left: var(--left);
		transform: translate(-50%, -50%);
		width: 0;
		height: 0;
		border-radius: 50%;
		pointer-events: none;
		touch-action: none;
		background-color: var(--color-primary-2);
		transition:
			width 0.25s ease-out,
			height 0.25s ease-out;
	}

	@media (hover: hover) {
		a:hover > div {
			width: 20rem;
			height: 20rem;
		}
	}
</style>
