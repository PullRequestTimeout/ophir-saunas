<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
</script>

<!-- <div class="ycbm-widget">
	<script src="https://embed.ycb.me" async data-domain="ophirsaunas" data-displaymode="light"></script>
</div> -->

<div>
	<PrimaryButton href="/contact" text="Contact Us" primary={true} />
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
</style>
