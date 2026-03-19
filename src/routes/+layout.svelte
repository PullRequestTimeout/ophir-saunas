<script lang="ts">
	let { children } = $props();
	import Nav from "$lib/components/Nav.svelte";
</script>

<Nav />
{@render children()}
