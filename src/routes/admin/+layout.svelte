<script lang="ts">
	let { children } = $props();
	import "./admin.css";
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="admin">
	{@render children()}
</div>
