<!-- The site's one booking modal (rendered by the (site) layout). Steps live in $lib/components/booking/. -->

<script lang="ts">
	import { tick, untrack } from "svelte";
	import { uiStore, closeBookingModal } from "$lib/utils/globalStates.svelte";
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import { BookingFlow, type Step } from "./booking/flow.svelte";
	import ServiceStep from "./booking/ServiceStep.svelte";
	import PackageStep from "./booking/PackageStep.svelte";
	import DateStep from "./booking/DateStep.svelte";
	import DeliveryStep from "./booking/DeliveryStep.svelte";
	import AddOnsStep from "./booking/AddOnsStep.svelte";
	import SessionDayStep from "./booking/SessionDayStep.svelte";
	import SessionStep from "./booking/SessionStep.svelte";
	import ContactStep from "./booking/ContactStep.svelte";
	import ReviewStep from "./booking/ReviewStep.svelte";
	import SuccessStep from "./booking/SuccessStep.svelte";
	import "./booking/booking.css";

	const flow = new BookingFlow();

	let dialog: HTMLDialogElement | undefined = $state();
	let heading: HTMLHeadingElement | undefined = $state();

	const titles: Record<Exclude<Step, "success">, string> = {
		service: "What would you like to book?",
		package: "Choose your package",
		date: "Pick your drop-off date",
		delivery: "Where should we deliver?",
		addons: "Add extras",
		"session-day": "Choose a drop-in day",
		session: "Choose your session",
		contact: "Your details",
		review: "Review your booking"
	};

	const autoConfirm = $derived(flow.options?.settings.auto_confirm ?? true);
	const title = $derived(
		flow.step === "success"
			? flow.result?.status === "confirmed"
				? "Booking confirmed"
				: "Request received"
			: flow.step === "review" && !autoConfirm
				? "Review your request"
				: titles[flow.step]
	);

	$effect(() => {
		if (!dialog) return;
		if (uiStore.bookingModalOpen) {
			untrack(() => flow.open(uiStore.bookingService));
			if (!dialog.open) dialog.showModal();
		} else {
			if (dialog.open) dialog.close();
			// Closing abandons the booking, so the next open starts again from the choice of booking type.
			untrack(() => flow.reset());
		}
	});

	// Move focus to the new step's heading so screen readers announce it and keyboard users start at the top.
	$effect(() => {
		flow.step;
		untrack(() => {
			if (!dialog?.open) return;
			tick().then(() => {
				heading?.focus();
				body?.scrollTo({ top: 0 });
			});
		});
	});

	let body: HTMLDivElement | undefined = $state();
	let errorBox: HTMLDivElement | undefined = $state();

	// Errors sit below the step's fields, which may be scrolled out of view.
	$effect(() => {
		if (flow.error) tick().then(() => errorBox?.scrollIntoView({ block: "nearest" }));
	});

	/** Validates the step and moves on, or takes the customer to what needs fixing */
	async function continueStep() {
		flow.next();
		if (!flow.error) return;
		await tick();
		const invalid = body?.querySelector<HTMLElement>('[aria-invalid="true"]');
		(invalid ?? errorBox)?.focus();
	}

	// Enter in a text field continues, like submitting a form. Not in the notes textarea, and not on the review step,
	// where submitting should be a deliberate click.
	function onBodyKeydown(event: KeyboardEvent) {
		if (event.key !== "Enter" || flow.step === "review" || !(event.target instanceof HTMLInputElement)) return;
		if (event.target.type === "checkbox" || event.target.type === "radio") return;
		event.preventDefault();
		continueStep();
	}

	// Closing resets the flow, so it waits while a booking is being sent (otherwise the customer would never see the result)
	// and checks before throwing away a booking in progress.
	function close() {
		if (flow.submitting) return;
		if (flow.started && flow.step !== "success" && !confirm("Leave your booking? What you've entered so far will be cleared.")) return;
		closeBookingModal();
	}

	// Only close on a click that started and ended on the backdrop, not a text selection dragged out of a field.
	let pressedBackdrop = false;
	function onBackdropClick(event: MouseEvent) {
		if (pressedBackdrop && event.target === dialog) close();
		pressedBackdrop = false;
	}
</script>

<dialog
	bind:this={dialog}
	class="booking"
	aria-labelledby="booking-title"
	onkeydown={(event) => {
		// Esc goes through the same checks as the close button. Handled here rather than in oncancel: Chrome stops letting
		// a page cancel repeated Esc presses, so a second Esc would close (and clear) the booking without asking.
		if (event.key !== "Escape") return;
		event.preventDefault();
		close();
	}}
	oncancel={(event) => {
		// Other close requests, e.g. Android's back gesture
		event.preventDefault();
		close();
	}}
	onclose={closeBookingModal}
	onpointerdown={(event) => (pressedBackdrop = event.target === dialog)}
	onclick={onBackdropClick}
>
	<div class="panel">
		<header>
			<div>
				{#if flow.steps.includes(flow.step)}
					<p class="progress">
						{flow.service === "rental" ? "Private rental" : "Drop-in session"} · Step {flow.stepNumber} of {flow.steps.length}
					</p>
				{/if}
				<h2 id="booking-title" tabindex="-1" bind:this={heading}>{title}</h2>
			</div>
			<button type="button" class="close" onclick={close} disabled={flow.submitting} aria-label="Close booking">
				<span class="material-icons" aria-hidden="true">close</span>
			</button>
		</header>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="body" bind:this={body} onkeydown={onBodyKeydown}>
			{#if flow.optionsError}
				<div class="step">
					<p class="error" role="alert">We couldn't load booking options. Check your connection and try again.</p>
					<PrimaryButton text="Try again" onAction={() => flow.loadOptions()} />
				</div>
			{:else if !flow.options}
				<p role="status">Loading…</p>
			{:else if flow.step === "service"}
				<ServiceStep {flow} />
			{:else if flow.step === "package"}
				<PackageStep {flow} />
			{:else if flow.step === "date"}
				<DateStep {flow} />
			{:else if flow.step === "delivery"}
				<DeliveryStep {flow} />
			{:else if flow.step === "addons"}
				<AddOnsStep {flow} />
			{:else if flow.step === "session-day"}
				<SessionDayStep {flow} />
			{:else if flow.step === "session"}
				<SessionStep {flow} />
			{:else if flow.step === "contact"}
				<ContactStep {flow} />
			{:else if flow.step === "review"}
				<ReviewStep {flow} />
			{:else if flow.step === "success"}
				<SuccessStep {flow} />
			{/if}

			{#if flow.error}
				<div class="step-error" tabindex="-1" bind:this={errorBox}>
					<p class="error" role="alert">{flow.error}</p>
					{#if flow.conflict}
						<button type="button" class="link" onclick={() => flow.goTo(flow.service === "rental" ? "date" : "session-day")}>
							{flow.service === "rental" ? "Choose different dates" : "Choose a different session"}
						</button>
					{/if}
				</div>
			{/if}
		</div>

		{#if flow.options && flow.step !== "service"}
			<footer>
				{#if flow.step === "success"}
					<PrimaryButton text="Done" onAction={closeBookingModal} />
				{:else}
					<button type="button" class="back" onclick={() => flow.back()}>
						<span class="material-icons" aria-hidden="true">arrow_back</span>Back
					</button>
					{#if flow.step === "review"}
						<PrimaryButton
							text={flow.submitting ? "Sending…" : autoConfirm ? "Confirm booking" : "Send request"}
							disabled={flow.submitting}
							onAction={() => flow.submit()}
						/>
						<p class="visually-hidden" role="status">{flow.submitting ? "Sending your booking…" : ""}</p>
					{:else}
						<PrimaryButton text={flow.returnToReview ? "Save and review" : "Continue"} onAction={continueStep} />
					{/if}
				{/if}
			</footer>
		{/if}
	</div>
</dialog>

<style>
	dialog.booking {
		padding: 0;
		border: 0;
		margin: 0;
		width: 100%;
		max-width: 100%;
		height: 100%;
		max-height: 100%;
		background-color: var(--color-background-white);
		overscroll-behavior: contain;
	}

	dialog.booking[open] {
		animation: booking-in 0.2s ease-out;
	}

	dialog.booking::backdrop {
		background-color: rgba(0, 0, 0, 0.75);
	}

	:global(html:has(dialog.booking[open])) {
		overflow: hidden;
	}

	@keyframes booking-in {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		dialog.booking[open] {
			animation: none;
		}
	}

	div.panel {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--spacing-m);
		padding: var(--spacing-m) var(--spacing-m) var(--spacing-s);
	}

	p.progress {
		font-size: 14px;
		color: var(--color-grey);
	}

	h2 {
		font-family: var(--font-heading);
		font-size: var(--font-heading-m);
		font-weight: 400;
		line-height: 1.1;
		color: var(--color-primary);
		margin: 0;
	}

	h2:focus {
		outline: none;
	}

	button.close {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		border: 0;
		border-radius: 50%;
		background: none;
	}

	button.close:hover {
		background-color: var(--color-background-green);
	}

	div.body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: var(--spacing-s) var(--spacing-m) var(--spacing-l);
		scrollbar-width: thin;
	}

	div.step-error:focus {
		outline: none;
	}

	div.step-error {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-s);
		margin-top: var(--spacing-m);
	}

	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-m);
		padding: var(--spacing-s) var(--spacing-m);
		padding-bottom: max(var(--spacing-s), env(safe-area-inset-bottom));
		border-top: 1px solid var(--color-background-green);
	}

	footer:has(> :only-child) {
		justify-content: flex-end;
	}

	button.back {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		min-height: 44px;
		padding-inline: var(--spacing-s);
		border: 0;
		background: none;
		font-weight: 600;
		color: var(--color-primary);
	}

	button.back span.material-icons {
		font-size: 20px;
	}

	@media screen and (min-width: 768px) {
		dialog.booking {
			margin: auto;
			width: min(40rem, calc(100vw - var(--padding-inline) * 2));
			height: fit-content;
			max-height: min(90vh, 52rem);
			border-radius: var(--border-radius);
			box-shadow: var(--shadow);
		}

		div.panel {
			height: auto;
			max-height: min(90vh, 52rem);
		}

		div.body {
			flex: 1 1 auto;
		}

		header,
		div.body,
		footer {
			padding-inline: var(--spacing-l);
		}

		header {
			padding-top: var(--spacing-l);
		}
	}
</style>
