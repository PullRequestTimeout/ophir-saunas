<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import { openBookingModal } from "$lib/utils/globalStates.svelte";
	import { isIntersecting } from "$lib/utils/isIntersecting";
	import SpanifyText from "$lib/components/SpanifyText.svelte";
</script>

<section>
	<h2 class="decorative-heading heading-fade-in" use:isIntersecting>
		<SpanifyText text="Ready to book your sauna?" />
	</h2>
	<p class="subheading text-light">Flexible rentals. Easy setup. No stress.</p>
	<div>
		<PrimaryButton onAction={openBookingModal} text="Book Now" />
		<PrimaryButton href="/contact" text="Ask a Question" primary={false} />
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		background-color: var(--color-background-tan);
		gap: var(--spacing-s);
	}

	section p.subheading {
		font-size: var(--font-body-l);
	}

	section > div {
		display: flex;
		gap: var(--spacing-m);
		margin-top: var(--spacing-m);
	}
</style>
