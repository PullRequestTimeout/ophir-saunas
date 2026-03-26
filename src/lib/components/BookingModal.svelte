<script lang="ts">
	import { uiStore, closeBookingModal } from "$lib/utils/globalStates.svelte";
	import { clickOutside } from "$lib/utils/clickOutside";
	import { fade } from "svelte/transition";
</script>

{#if uiStore.bookingModalOpen}
	<div class="modal-overlay" transition:fade>
		<div class="modal-content" use:clickOutside onoutclick={closeBookingModal}>
			<button class="close" onclick={closeBookingModal}><span class="material-icons">close</span></button>
			<h2>Booking Modal</h2>
			<p>This is where the booking form will go.</p>
		</div>
	</div>
{/if}

<style>
	div.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	div.modal-content {
		background-color: var(--color-background-white);
		padding: var(--spacing-l);
		border-radius: var(--border-radius);
		position: relative;
		width: 90%;
		max-width: 500px;
	}

	button.close {
		position: absolute;
		top: var(--spacing-m);
		right: var(--spacing-m);
		background: none;
		border: none;
		cursor: pointer;
	}

	button.close span.material-icons {
		color: var(--color-primary);
	}
</style>
