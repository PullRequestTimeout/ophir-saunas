<!-- Animated hamburger that turns into a cross when `open`. Used by the site nav and the admin header.
	The line colour comes from `--hamburger-color` (default: primary green); `--hamburger-shift` sets how far it's nudged right. -->

<script lang="ts">
	let { open, onclick, controls }: { open: boolean; onclick: () => void; /** id of the menu it opens */ controls?: string } = $props();
</script>

<button class="hamburger" type="button" aria-label="Menu" aria-expanded={open} aria-controls={controls} {onclick}>
	<svg class="hamburgericon" class:active={open} viewBox="0 0 100 100" width="80" aria-hidden="true">
		<path class="line top" d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20" />
		<path class="line middle" d="m 30,50 h 40" />
		<path class="line bottom" d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20" />
	</svg>
</button>

<style>
	button.hamburger {
		background: none;
		border: none;
		padding: 0;
		scale: 0.75;
		/* Pulls the icon's built-in whitespace towards the edge; override with --hamburger-shift */
		translate: var(--hamburger-shift, 1.5rem) 0;
		overflow: hidden;
	}

	svg.hamburgericon {
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition: 0.4s;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	svg.hamburgericon.active {
		transform: rotate(45deg);
	}

	svg.hamburgericon .line {
		fill: none;
		transition: 0.4s;
		stroke: var(--hamburger-color, var(--color-primary));
		stroke-width: 6;
		stroke-linecap: round;
	}

	svg.hamburgericon .top {
		stroke-dasharray: 40 160;
	}

	svg.hamburgericon .middle {
		stroke-dasharray: 40 142;
		transform-origin: 50%;
		transition: 0.4s;
	}

	svg.hamburgericon .bottom {
		stroke-dasharray: 40 85;
		transform-origin: 50%;
		transition: 0.4s;
	}

	svg.hamburgericon.active .middle {
		transform: rotate(90deg);
	}

	svg.hamburgericon.active .top,
	svg.hamburgericon.active .bottom {
		stroke-dashoffset: -64px;
	}
</style>
