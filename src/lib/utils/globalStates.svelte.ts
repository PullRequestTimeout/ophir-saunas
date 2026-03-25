// Booking modal state management
export let uiStore = $state({ bookingModalOpen: false });

export function openBookingModal() {
	uiStore.bookingModalOpen = true;
}

export function closeBookingModal() {
	uiStore.bookingModalOpen = false;
}
