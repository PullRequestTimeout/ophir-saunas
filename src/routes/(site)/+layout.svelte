<script lang="ts">
	let { children } = $props();
	import { page } from "$app/state";
	import Nav from "$lib/components/Nav.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import FinalCTA from "$lib/components/FinalCTA.svelte";
	import BookingModal from "$lib/components/BookingModal.svelte";
	import TimeOffBanner from "$lib/components/TimeOffBanner.svelte";

	// Lives in the layout so a closed banner stays closed while browsing; a full reload brings it back.
	let bannerClosed = $state(false);
</script>

<!-- The banner sits in the page flow and the nav hangs below it, so closing the banner slides both up -->
<div class="masthead">
	{#if page.data.timeOff && !bannerClosed}
		<TimeOffBanner period={page.data.timeOff} onclose={() => (bannerClosed = true)} />
	{/if}
	<Nav />
</div>
{@render children()}
<FinalCTA />
<Footer />
<BookingModal />

<style>
	/* flow-root: without the banner it's empty, and the page's top margin would collapse through it and push the nav down */
	div.masthead {
		display: flow-root;
		position: sticky;
		top: 0;
		z-index: 1000;
	}
</style>
