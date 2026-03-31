<script lang="ts">
	import { uiStore, closeBookingModal } from "$lib/utils/globalStates.svelte";
	import { clickOutside } from "$lib/utils/clickOutside";
	import { fade } from "svelte/transition";
</script>

{#if uiStore.bookingModalOpen}
	<div class="modal-overlay" transition:fade>
		<div class="modal-content" use:clickOutside onoutclick={closeBookingModal}>
			<button class="close" onclick={closeBookingModal}><span class="material-icons">close</span></button>
			<script src="https://embed.ycb.me" async data-domain="ophirsaunas" data-displaymode="light"></script>
		</div>
	</div>
{/if}

<style>
	div.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.75);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		cursor: pointer;
	}

	div.modal-content {
		background-color: var(--color-white);
		padding: 3rem 0;
		border-radius: var(--border-radius);
		position: relative;
		min-width: calc(100vw - var(--padding-inline) * 2);
		max-height: 90vh;
		overflow-y: auto;
		overscroll-behavior: contain;
		cursor: default;
		scrollbar-width: thin;
		scrollbar-color: var(--color-primary) transparent;
	}

	div.modal-content ::-webkit-scrollbar {
		width: 8px;
	}

	div.modal-content ::-webkit-scrollbar-track {
		background: transparent;
	}

	div.modal-content ::-webkit-scrollbar-thumb {
		background-color: var(--color-primary);
		border-radius: 4px;
		border: 2px solid transparent;
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
