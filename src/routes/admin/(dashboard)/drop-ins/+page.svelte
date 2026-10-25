<script lang="ts">
	import Toast from "$lib/components/admin/Toast.svelte";
	import DayForm from "./DayForm.svelte";
	import { formatDate } from "$lib/utils/format";
	import { dropInSlotLabels, type DropInSlot } from "$lib/types/booking";

	let { data, form } = $props();

	const slots = Object.keys(dropInSlotLabels) as DropInSlot[];
	const errorsFor = (key: string) => (form && "errors" in form && form.id === key ? form.errors : null);
	const toast = $derived(form && "saved" in form ? "Saved." : form && "deleted" in form ? "Deleted." : null);

	const bookingsFor = (dayId: string, slot: DropInSlot) => data.bookings.filter((b) => b.drop_in_day_id === dayId && b.slot === slot);
	const taken = (dayId: string, slot: DropInSlot) =>
		bookingsFor(dayId, slot)
			.filter((b) => b.status === "pending" || b.status === "confirmed")
			.reduce((sum, b) => sum + b.party_size, 0);
</script>

<svelte:head>
	<title>Drop-ins | Ophir Admin</title>
</svelte:head>

<h1>Drop-in sessions</h1>
<p>
	On drop-in days the sauna can't be rented privately. Each day has two sessions ({slots.map((s) => dropInSlotLabels[s]).join(" and ")}) for up to {data.capacity}
	people each.
</p>

{#if !data.showPast}
	<details class="card add" open={!!errorsFor("new")}>
		<summary><span class="material-icons" aria-hidden="true">add</span>Add a drop-in day</summary>
		<DayForm errors={errorsFor("new")} today={data.today} />
	</details>
{/if}

<nav class="tabs" aria-label="Drop-in days">
	<a href="/admin/drop-ins" aria-current={!data.showPast ? "page" : undefined}>Upcoming</a>
	<a href="/admin/drop-ins?past" aria-current={data.showPast ? "page" : undefined}>Past</a>
</nav>

{#if data.days.length === 0}
	<div class="card">
		<p>{data.showPast ? "No past drop-in days." : "No upcoming drop-in days. Add one above to start taking drop-in bookings."}</p>
	</div>
{/if}

{#each data.days as day (day.id)}
	<article class="card" aria-labelledby="day-{day.id}">
		<header>
			<h2 id="day-{day.id}">{formatDate(day.date, { long: true, year: true })}</h2>
			{#if !day.active}<span class="badge cancelled">Hidden</span>{/if}
		</header>
		<p class="location"><span class="material-icons" aria-hidden="true">place</span>{day.location}</p>

		<div class="slots">
			{#each slots as slot}
				{@const bookings = bookingsFor(day.id, slot)}
				<section>
					<h3>{dropInSlotLabels[slot]}</h3>
					<p class="count">{taken(day.id, slot)} / {data.capacity} booked</p>
					{#if bookings.length}
						<ul>
							{#each bookings as booking (booking.id)}
								<li>
									<span class="who">{booking.customer_name} · {booking.party_size} {booking.party_size === 1 ? "person" : "people"}</span>
									<span class="badge {booking.status}">{booking.status}</span>
									<span class="contact">
										<a href="tel:{booking.customer_phone}">{booking.customer_phone}</a>
										<a href="mailto:{booking.customer_email}">{booking.customer_email}</a>
									</span>
								</li>
							{/each}
						</ul>
					{/if}
				</section>
			{/each}
		</div>

		<details open={!!errorsFor(day.id)}>
			<summary>Edit day</summary>
			<DayForm {day} errors={errorsFor(day.id)} today={data.today} />
		</details>
	</article>
{/each}

<Toast message={toast} trigger={form} />

<style>
	article header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-s);
	}

	p.location {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	p.location span.material-icons {
		font-size: 20px;
	}

	div.slots {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--spacing-m);
	}

	div.slots section {
		background-color: var(--color-background-white);
		border-radius: 12px;
		padding: var(--spacing-m);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
		min-width: 0;
	}

	h3 {
		color: var(--color-primary);
		font-size: 16px;
	}

	p.count {
		font-weight: 600;
	}

	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	li {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-xs) var(--spacing-s);
		padding-top: var(--spacing-s);
		border-top: 1px solid var(--color-primary-transparent);
	}

	span.who {
		font-weight: 600;
		color: var(--color-primary);
	}

	span.contact {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs) var(--spacing-m);
		width: 100%;
		font-size: 14px;
	}

	span.contact a {
		text-decoration: underline;
		overflow-wrap: anywhere;
	}
</style>
