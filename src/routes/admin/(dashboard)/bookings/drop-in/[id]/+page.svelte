<script lang="ts">
	import Toast from "$lib/components/admin/Toast.svelte";
	import BookingActions from "../../BookingActions.svelte";
	import CustomerCard from "../../CustomerCard.svelte";
	import NotesForm from "../../NotesForm.svelte";
	import { dropInSlotLabels } from "$lib/types/booking";
	import { formatCents, formatDate, formatTimestamp } from "$lib/utils/format";

	let { data, form } = $props();

	const booking = $derived(data.booking);
	const errors = $derived(form && "errors" in form ? form.errors : null);
	const toast = $derived(form && "message" in form ? form.message : null);
</script>

<svelte:head>
	<title>{booking.customer_name} · Drop-in | Ophir Admin</title>
</svelte:head>

<a class="back text-link" href="/admin/bookings"><span class="material-icons" aria-hidden="true">arrow_back</span>All bookings</a>

<header class="page-header">
	<h1>{booking.customer_name}</h1>
	<span class="badge {booking.status}">{booking.status}</span>
	{#if booking.source === "admin"}<span class="badge">Added by admin</span>{/if}
</header>

<div class="layout">
	<div class="column">
		<section class="card" aria-labelledby="session-heading">
			<h2 id="session-heading">Drop-in session</h2>
			<dl class="details">
				<div>
					<dt>Date</dt>
					<dd>{formatDate(booking.day.date, { long: true, year: true })}</dd>
				</div>
				<div>
					<dt>Time</dt>
					<dd>{dropInSlotLabels[booking.slot]}</dd>
				</div>
				<div>
					<dt>Location</dt>
					<dd>{booking.day.location}</dd>
				</div>
				<div>
					<dt>People</dt>
					<dd>{booking.party_size}</dd>
				</div>
				<div>
					<dt>Total</dt>
					<dd>{booking.party_size} × {formatCents(booking.price_cents)} = <strong>{formatCents(booking.total_cents)}</strong></dd>
				</div>
			</dl>
			<a class="text-link" href="/admin/drop-ins">See everyone booked on drop-in days</a>
		</section>

		<CustomerCard {booking} />
	</div>

	<div class="column">
		<BookingActions status={booking.status} hasEmail={!!booking.customer_email} emailConfigured={data.emailConfigured} error={errors?.form?.[0]} />
		<NotesForm notes={booking.admin_notes} {errors} />
		<p class="hint">Booked {formatTimestamp(booking.created_at)} · Reference {booking.id.slice(0, 8)}</p>
	</div>
</div>

<Toast message={toast} trigger={form} />
