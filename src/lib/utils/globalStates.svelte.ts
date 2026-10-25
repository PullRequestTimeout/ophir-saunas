// Booking modal state management
export type BookingService = "rental" | "drop-in";

export let uiStore = $state({ bookingModalOpen: false, bookingService: null as BookingService | null });

/** Opens the booking modal, optionally on one service. Accepts a click event so it can be passed straight to onAction. */
export function openBookingModal(service?: BookingService | Event) {
	uiStore.bookingService = typeof service === "string" ? service : null;
	uiStore.bookingModalOpen = true;
}

export function closeBookingModal() {
	uiStore.bookingModalOpen = false;
}
