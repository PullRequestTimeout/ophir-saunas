<script lang="ts">
	import Toast from "$lib/components/admin/Toast.svelte";
	import BookingActions from "../../BookingActions.svelte";
	import CustomerCard from "../../CustomerCard.svelte";
	import NotesForm from "../../NotesForm.svelte";
	import { formatCents, formatDate, formatTime, formatTimestamp } from "$lib/utils/format";

	let { data, form } = $props();

	const rental = $derived(data.rental);
	const errors = $derived(form && "errors" in form ? form.errors : null);
	const toast = $derived(form && "message" in form ? form.message : null);
	const mapUrl = $derived(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rental.address)}`);
</script>

<svelte:head>
	<title>{rental.customer_name} · Rental | Ophir Admin</title>
</svelte:head>

<a class="back text-link" href="/admin/bookings"><span class="material-icons" aria-hidden="true">arrow_back</span>All bookings</a>

<header class="page-header">
	<h1>{rental.customer_name}</h1>
	<span class="badge {rental.status}">{rental.status}</span>
	{#if rental.source === "admin"}<span class="badge">Added by admin</span>{/if}
</header>

<div class="layout">
	<div class="column">
		<section class="card" aria-labelledby="rental-heading">
			<h2 id="rental-heading">Private rental</h2>
			<dl class="details">
				<div>
					<dt>Drop-off</dt>
					<dd>{formatDate(rental.delivery_date, { long: true, year: true })}, {formatTime(rental.delivery_time)}</dd>
				</div>
				<div>
					<dt>Pickup</dt>
					<dd>{formatDate(rental.pickup_date, { long: true, year: true })}, around {formatTime(rental.pickup_time)}</dd>
				</div>
				<div>
					<dt>Package</dt>
					<dd>{rental.package_name} ({rental.nights} {rental.nights === 1 ? "night" : "nights"})</dd>
				</div>
				<div>
					<dt>Delivery area</dt>
					<dd>{rental.delivery_zone_name}</dd>
				</div>
				<div>
					<dt>Address</dt>
					<dd>
						<span class="pre">{rental.address}</span><br />
						<a href={mapUrl} target="_blank" rel="noopener noreferrer"
							>Open in Google Maps<span class="visually-hidden"> (opens in a new tab)</span></a
						>
					</dd>
				</div>
			</dl>

			<table>
				<caption>Price breakdown</caption>
				<tbody>
					{#each rental.line_items as item, i (i)}
						<tr>
							<td>{item.label}{item.quantity > 1 ? ` × ${item.quantity}` : ""}</td>
							<td class="amount">{formatCents(item.total_cents)}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th scope="row">Total</th>
						<td class="amount total">{formatCents(rental.total_cents)}</td>
					</tr>
				</tfoot>
			</table>
		</section>

		<CustomerCard booking={rental} />
	</div>

	<div class="column">
		<BookingActions status={rental.status} hasEmail={!!rental.customer_email} emailConfigured={data.emailConfigured} error={errors?.form?.[0]} />
		<NotesForm notes={rental.admin_notes} {errors} />
		<p class="hint">Booked {formatTimestamp(rental.created_at)} · Reference {rental.id.slice(0, 8)}</p>
	</div>
</div>

<Toast message={toast} trigger={form} />
