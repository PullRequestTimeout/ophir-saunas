<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import { page } from "$app/state";
	import { onMount } from "svelte";

	onMount(() => {
		console.log("Current page:", page.url.pathname);
	});
</script>

<header class="large-screens">
	<a href="/"> </a>
	<nav>
		<a href="/">Home</a>
		<a href="/about">About</a>
		<a href="/pricing">Pricing</a>
		<a href="/contact">Contact</a>
	</nav>
</header>

<style>
	@media (max-width: 1024px) {
		.large-screens {
			display: none;
		}
	}
</style>
