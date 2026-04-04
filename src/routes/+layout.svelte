<script lang="ts">
	let { children } = $props();
	import Nav from "$lib/components/Nav.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import "material-icons/iconfont/filled.css";
	import FinalCTA from "$lib/components/FinalCTA.svelte";
	import BookingModal from "$lib/components/BookingModal.svelte";
	import TemporaryOverlay from "$lib/components/TemporaryOverlay.svelte";
	import { onMount } from "svelte";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";

	// Remove before launch
	onMount(() => {
		if (page.url.pathname !== "/") {
			goto("/");
		}
	});
</script>

<!-- <Nav /> -->
{@render children()}
<!-- <FinalCTA /> -->
<!-- <Footer /> -->
<!-- <BookingModal /> -->
<TemporaryOverlay />
