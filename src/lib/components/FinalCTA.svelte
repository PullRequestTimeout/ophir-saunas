<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";

	function handleBookingModal() {
		// Placeholder function for booking modal logic
		alert("Booking modal would appear here.");
	}
</script>

<section>
	<h2 class="decorative-heading">Ready to book your sauna?</h2>
	<p class="subheading text-light">Flexible rentals. Easy setup. No stress.</p>
	<div>
		<PrimaryButton onAction={handleBookingModal} text="Book Now" />
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
