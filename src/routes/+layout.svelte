<script lang="ts">
	let { children } = $props();
	import Nav from "$lib/components/Nav.svelte";
	import "material-icons/iconfont/filled.css";
</script>

<Nav />
{@render children()}
