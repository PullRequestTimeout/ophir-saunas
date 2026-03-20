<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import { page } from "$app/state";
	import { slide } from "svelte/transition";
	import { onMount } from "svelte";

	function handleBookingModal() {
		alert("Booking modal opened!");
	}

	let showMobileMenu = $state(false);
</script>

<header class="small-screens">
	<a href="/">
		<img src="/assets/ophir-logo.svg" alt="Logo" />
	</a>
	<button class="hamburger" aria-label="menu button" onclick={() => (showMobileMenu = !showMobileMenu)}>
		<svg class={"ham hamRotate ham8 " + (showMobileMenu ? "active" : "")} viewBox="0 0 100 100" width="80">
			<path class="line top" d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20" />
			<path class="line middle" d="m 30,50 h 40" />
			<path class="line bottom" d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20" />
		</svg>
	</button>
	{#if showMobileMenu}
		<nav transition:slide>
			<a href="/" onclick={() => (showMobileMenu = false)}>Home</a>
			<a href="/about" onclick={() => (showMobileMenu = false)}>About</a>
			<a href="/pricing" onclick={() => (showMobileMenu = false)}>Pricing</a>
			<a href="/contact" onclick={() => (showMobileMenu = false)}>Contact</a>
			<PrimaryButton onAction={handleBookingModal} text="Book Now" />
		</nav>
	{/if}
</header>

<header class="large-screens">
	<a href="/">
		<img src="/assets/ophir-logo.svg" alt="Logo" />
	</a>
	<nav>
		<a href="/" class={page.url.pathname === "/" ? "active" : ""}>Home</a>
		<a href="/about" class={page.url.pathname === "/about" ? "active" : ""}>About</a>
		<a href="/pricing" class={page.url.pathname === "/pricing" ? "active" : ""}>Pricing</a>
		<a href="/contact" class={page.url.pathname === "/contact" ? "active" : ""}>Contact</a>
	</nav>
	<PrimaryButton onAction={handleBookingModal} text="Book Now" />
</header>

<style>
	header {
		width: 100vw;
		display: flex;
		align-items: center;
		padding: var(--spacing-m) var(--padding-inline);
		justify-content: space-between;
		position: relative;
	}

	header.large-screens {
		display: none;
	}

	nav {
		display: flex;
		gap: var(--spacing-l);
		color: var(--color-primary);
		font-weight: 600;
	}

	header.small-screens nav {
		position: absolute;
		top: 100%;
		left: 0;
		height: 70vh;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--color-white);
		width: 100%;
		padding: var(--spacing-m) 0;
		/* box-shadow: var(--shadow); */
	}

	nav a {
		position: relative;
	}

	/* Hamburger Menu */

	@media (min-width: 1024px) {
		header.large-screens {
			display: flex;
		}

		header.small-screens {
			display: none;
		}

		nav {
			position: relative;
		}

		nav a::after {
			content: "";
			position: absolute;
			display: block;
			width: 0%;
			height: var(--border-width);
			background-color: var(--color-primary);
			margin-top: 3px;
			transition: width 0.2s ease;
			transform-origin: center;
		}

		nav a.active::after {
			width: 100%;
		}

		@media (hover: hover) {
			nav a:hover::after {
				width: 100%;
			}
		}
	}

	/* Hamburger Menu */
	button.hamburger {
		background: none;
		border: none;
		padding: 0;
	}

	svg.ham {
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition: transform 400ms;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	svg.ham.active {
		transform: rotate(45deg);
	}

	svg.ham .line {
		fill: none;
		transition:
			stroke-dasharray 400ms,
			stroke-dashoffset 400ms;
		stroke: var(--color-primary);
		stroke-width: 5.5;
		stroke-linecap: round;
	}

	svg.ham .top {
		stroke-dasharray: 40 160;
	}
	svg.ham .middle {
		stroke-dasharray: 40 142;
		transform-origin: 50%;
		transition: transform 400ms;
	}

	svg.ham .bottom {
		stroke-dasharray: 40 85;
		transform-origin: 50%;
		transition:
			transform 400ms,
			stroke-dashoffset 400ms;
	}

	svg.ham.active .middle {
		transform: rotate(90deg);
	}

	svg.ham.active .top,
	svg.ham.active .bottom {
		stroke-dashoffset: -64px;
	}
</style>
