<!-- Approve / decline / cancel and resend-email buttons for a booking detail page. One form, so the
	"Email the customer" checkbox applies to whichever action is pressed. -->

<script lang="ts">
	import { enhance } from "$app/forms";
	import type { BookingStatus } from "$lib/types/booking";

	let { status, hasEmail, emailConfigured, error }: { status: BookingStatus; hasEmail: boolean; emailConfigured: boolean; error?: string | null } =
		$props();

	let busy = $state(false);
	const active = $derived(status === "pending" || status === "confirmed");
</script>

<section class="card" aria-labelledby="actions-heading">
	<h2 id="actions-heading">Actions</h2>
	{#if !emailConfigured}
		<p class="hint">Email isn't set up yet, so customers won't be emailed until a Resend API key is added.</p>
	{/if}
	<form
		method="POST"
		use:enhance={() => {
			busy = true;
			return async ({ update }) => {
				await update({ reset: false });
				busy = false;
			};
		}}
	>
		{#if active && hasEmail}
			<label class="checkbox">
				<input type="checkbox" name="notify" checked />
				Email the customer about this change
			</label>
		{/if}
		<div class="actions">
			{#if status === "pending"}
				<button class="btn solid" type="submit" formaction="?/approve" disabled={busy}>
					<span class="material-icons" aria-hidden="true">check</span>Approve
				</button>
				<button
					class="btn danger"
					type="submit"
					formaction="?/decline"
					disabled={busy}
					onclick={(event) => {
						if (!confirm("Decline this request? Its dates will open up for other bookings.")) event.preventDefault();
					}}
				>
					<span class="material-icons" aria-hidden="true">close</span>Decline
				</button>
			{/if}
			{#if active}
				<button
					class="btn danger"
					type="submit"
					formaction="?/cancel"
					disabled={busy}
					onclick={(event) => {
						if (!confirm("Cancel this booking? Its dates will open up for other bookings.")) event.preventDefault();
					}}
				>
					<span class="material-icons" aria-hidden="true">event_busy</span>Cancel booking
				</button>
			{/if}
			{#if hasEmail}
				<button class="btn" type="submit" formaction="?/resend" disabled={busy}>
					<span class="material-icons" aria-hidden="true">forward_to_inbox</span>Resend {status === "pending" ? "request received" : status} email
				</button>
			{/if}
		</div>
		{#if !active}
			<p class="hint">This booking is {status}, so its dates are free for other bookings.</p>
		{/if}
		{#if error}
			<p class="form-error" role="alert">{error}</p>
		{/if}
	</form>
</section>

<style>
	div.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-s);
	}
</style>
