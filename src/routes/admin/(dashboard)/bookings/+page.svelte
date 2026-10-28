<script lang="ts">
	import { formatCents, formatDate } from "$lib/utils/format";
	import { views, type View } from "./views";

	let { data } = $props();

	const viewHref = (view: View) => {
		const params = new URLSearchParams();
		if (view !== "upcoming") params.set("view", view);
		if (data.type !== "all") params.set("type", data.type);
		if (data.search) params.set("q", data.search);
		const query = params.toString();
		return `/admin/bookings${query ? `?${query}` : ""}`;
	};

	const empty: Record<View, string> = {
		upcoming: "No upcoming bookings.",
		requests: "No requests waiting for approval.",
		past: "No past bookings.",
		cancelled: "No declined or cancelled bookings."
	};
</script>

<svelte:head>
	<title>Bookings | Ophir Admin</title>
</svelte:head>

<header class="page-header spread">
	<h1>Bookings</h1>
	<a class="btn solid" href="/admin/bookings/new"><span class="material-icons" aria-hidden="true">add</span><span>New booking</span></a>
</header>

<nav class="tabs wrap" aria-label="Booking lists">
	{#each Object.entries(views) as [view, label] (view)}
		<a href={viewHref(view as View)} aria-current={data.view === view ? "page" : undefined}>{label}</a>
	{/each}
</nav>

<form class="filters card" method="GET" role="search" aria-label="Filter bookings">
	{#if data.view !== "upcoming"}<input type="hidden" name="view" value={data.view} />{/if}
	<label>
		Type
		<select name="type" value={data.type}>
			<option value="all">Rentals and drop-ins</option>
			<option value="rental">Rentals</option>
			<option value="drop-in">Drop-ins</option>
		</select>
	</label>
	<label>
		Search
		<input type="search" name="q" value={data.search} placeholder="Name, email or phone" />
	</label>
	<button class="btn" type="submit"><span class="material-icons" aria-hidden="true">filter_list</span><span>Apply</span></button>
</form>

{#if data.rows.length === 0}
	<div class="card">
		<p>{data.search ? `No bookings match “${data.search}”.` : empty[data.view]}</p>
	</div>
{:else}
	<div class="card">
		<!-- Focusable so keyboard users can scroll the table sideways on narrow screens -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div class="table-wrap" tabindex="0" role="region" aria-label="Bookings">
			<table>
				<thead>
					<tr>
						<th scope="col">Date</th>
						<th scope="col">Customer</th>
						<th scope="col">Booking</th>
						<th scope="col">Status</th>
						<th scope="col" class="amount">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each data.rows as row (row.type + row.id)}
						<tr>
							<td class="nowrap">{formatDate(row.date)}{row.endDate ? ` – ${formatDate(row.endDate)}` : ""}</td>
							<td><a class="text-link" href="/admin/bookings/{row.type}/{row.id}">{row.customer}</a></td>
							<td>{row.summary}</td>
							<td><span class="badge {row.status}">{row.status}</span></td>
							<td class="amount">{formatCents(row.total_cents)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if data.limited}
			<p class="hint">Showing the first {data.rows.length} bookings. Search to narrow the list.</p>
		{/if}
	</div>
{/if}

<style>
	.spread {
		justify-content: space-between;
	}

	nav.wrap {
		flex-wrap: wrap;
	}

	form.filters {
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: var(--spacing-m);
	}

	form.filters label {
		flex: 1 1 12rem;
	}

	th.amount {
		text-align: right;
	}

	td.nowrap {
		white-space: nowrap;
	}
</style>
