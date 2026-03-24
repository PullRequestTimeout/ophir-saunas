<script lang="ts">
	let { children } = $props();
	import Nav from "$lib/components/Nav.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import "material-icons/iconfont/filled.css";
	import FinalCTA from "$lib/components/FinalCTA.svelte";
</script>

<Nav />
{@render children()}
<FinalCTA />
<Footer />
