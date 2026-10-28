<script lang="ts">
	import { dropInSlotLabels, type DropInSlot } from "$lib/types/booking";
	import { addDays, formatDate, formatTime } from "$lib/utils/format";

	let { data } = $props();

	const slots = Object.keys(dropInSlotLabels) as DropInSlot[];

	type Event = { kind: "pickup" | "delivery" | "drop-in" | "away" | "out"; time?: string; label: string; href?: string; pending?: boolean };

	const awayOnly = (events: Event[]) => events.length === 1 && events[0].kind === "away";

	// Each day's events in the order they happen: pickups in the morning, drop-ins and drop-offs in the evening.
	// Back-to-back days with nothing but time off collapse into one entry running from `date` to `end`.
	const schedule = $derived.by(() => {
		const result: { date: string; end: string; events: Event[] }[] = [];
		for (let date = data.today; date <= data.end; date = addDays(date, 1)) {
			const events: Event[] = [];

			const off = data.timeOff.find((t) => t.start_date <= date && date <= t.end_date);
			if (off) events.push({ kind: "away", label: "Time off", href: "/admin/time-off" });

			for (const r of data.rentals) {
				const href = `/admin/bookings/rental/${r.id}`;
				const pending = r.status === "pending";
				if (r.pickup_date === date) events.push({ kind: "pickup", time: r.pickup_time, label: `Pickup: ${r.customer_name}`, href, pending });
				if (r.delivery_date === date)
					events.push({
						kind: "delivery",
						time: r.delivery_time,
						label: `Drop-off: ${r.customer_name} · ${r.package_name} · ${r.delivery_zone_name}`,
						href,
						pending
					});
				if (date === data.today && r.delivery_date < date && date < r.pickup_date)
					events.push({ kind: "out", label: `Out with ${r.customer_name} until ${formatDate(r.pickup_date)}`, href, pending });
			}

			const day = data.days.find((d) => d.date === date);
			if (day) {
				const counts = slots.map((slot) => {
					const taken = data.dropIns.filter((b) => b.drop_in_day_id === day.id && b.slot === slot).reduce((sum, b) => sum + b.party_size, 0);
					return `${dropInSlotLabels[slot]}: ${taken}/${data.capacity}`;
				});
				events.push({ kind: "drop-in", time: "17:00", label: `Drop-in at ${day.location} · ${counts.join(" · ")}`, href: "/admin/drop-ins" });
			}

			const order = { away: 0, out: 1, pickup: 2, "drop-in": 3, delivery: 4 };
			events.sort((a, b) => order[a.kind] - order[b.kind] || (a.time ?? "").localeCompare(b.time ?? ""));
			const last = result.at(-1);
			if (last && awayOnly(events) && awayOnly(last.events) && addDays(last.end, 1) === date) last.end = date;
			else if (events.length) result.push({ date, end: date, events });
		}
		return result;
	});

	const icons: Record<Event["kind"], string> = {
		pickup: "north_east",
		delivery: "local_shipping",
		"drop-in": "groups",
		away: "beach_access",
		out: "hot_tub"
	};

	const dayLabel = (date: string) =>
		date === data.today ? `Today, ${formatDate(date)}` : date === addDays(data.today, 1) ? `Tomorrow, ${formatDate(date)}` : formatDate(date);

	const pendingCount = $derived(data.pendingRentals.length + data.pendingDropIns.length);
</script>

<svelte:head>
	<title>Overview | Ophir Admin</title>
</svelte:head>

<header class="page-header spread">
	<h1>Overview</h1>
	<a class="btn solid" href="/admin/bookings/new"><span class="material-icons" aria-hidden="true">add</span><span>New booking</span></a>
</header>

<section class="card" aria-labelledby="requests-heading">
	<h2 id="requests-heading">Requests to review{pendingCount ? ` (${pendingCount})` : ""}</h2>
	{#if pendingCount === 0}
		<p>No requests waiting for approval.</p>
	{:else}
		<ul class="list">
			{#each data.pendingRentals as r (r.id)}
				<li>
					<a class="text-link" href="/admin/bookings/rental/{r.id}">{r.customer_name}</a>
					<span>{r.package_name}, {formatDate(r.delivery_date)} – {formatDate(r.pickup_date)}</span>
				</li>
			{/each}
			{#each data.pendingDropIns as b (b.id)}
				<li>
					<a class="text-link" href="/admin/bookings/drop-in/{b.id}">{b.customer_name}</a>
					<span>Drop-in, {formatDate(b.day.date)}, {dropInSlotLabels[b.slot]} · {b.party_size} {b.party_size === 1 ? "person" : "people"}</span>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<section class="card" aria-labelledby="schedule-heading">
	<h2 id="schedule-heading">Next two weeks</h2>
	{#if schedule.length === 0}
		<p>Nothing scheduled between {formatDate(data.today)} and {formatDate(data.end)}.</p>
	{:else}
		<ol class="schedule">
			{#each schedule as day (day.date)}
				<li>
					<h3>{day.end === day.date ? dayLabel(day.date) : `${dayLabel(day.date)} → ${formatDate(day.end)}`}</h3>
					<ul>
						{#each day.events as event, i (i)}
							<li class={event.kind}>
								<span class="material-icons" aria-hidden="true">{icons[event.kind]}</span>
								{#if event.time && event.kind !== "drop-in"}<span class="time">{formatTime(event.time)}</span>{/if}
								{#if event.href}<a class="text-link" href={event.href}>{event.label}</a>{:else}<span>{event.label}</span>{/if}
								{#if event.pending}<span class="badge pending">Pending</span>{/if}
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ol>
	{/if}
</section>

<section class="card" aria-labelledby="time-off-heading">
	<h2 id="time-off-heading">Time off</h2>
	{#if data.timeOff.length === 0}
		<p>No time off coming up. <a class="text-link" href="/admin/time-off">Add time off</a></p>
	{:else}
		<ul class="list">
			{#each data.timeOff as period (period.id)}
				<li>
					<span
						>{period.start_date === period.end_date
							? formatDate(period.start_date, { year: true })
							: `${formatDate(period.start_date)} – ${formatDate(period.end_date, { year: true })}`}</span
					>
					{#if period.start_date <= data.today}<span class="badge confirmed">Now</span>{/if}
					{#if period.show_banner}<span class="hint">Banner on the website</span>{/if}
				</li>
			{/each}
		</ul>
		<a class="text-link" href="/admin/time-off">Manage time off</a>
	{/if}
</section>

<style>
	.spread {
		justify-content: space-between;
	}

	ul.list,
	ol.schedule,
	ol.schedule ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	ul.list {
		display: flex;
		flex-direction: column;
	}

	ul.list li {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-xs) var(--spacing-s);
		padding-block: var(--spacing-s);
		border-bottom: 1px solid var(--color-primary-transparent);
	}

	ul.list a {
		font-weight: 600;
	}

	ol.schedule {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
	}

	h3 {
		font-size: 16px;
		color: var(--color-primary);
		margin-bottom: var(--spacing-xs);
	}

	ol.schedule ul li {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-xs) var(--spacing-s);
		padding: var(--spacing-xs) 0;
	}

	ol.schedule ul li span.material-icons {
		font-size: 20px;
	}

	span.time {
		font-weight: 600;
		min-width: 4.5rem;
	}

	li.away {
		color: var(--color-grey);
		font-style: italic;
	}
</style>
