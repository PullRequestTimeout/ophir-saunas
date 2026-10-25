<script lang="ts">
	import Toast from "$lib/components/admin/Toast.svelte";
	import PeriodForm from "./PeriodForm.svelte";
	import { formatDate, timeOffMessage } from "$lib/utils/format";

	let { data, form } = $props();

	const errorsFor = (key: string) => (form && "errors" in form && form.id === key ? form.errors : null);
	const toast = $derived(form && "saved" in form ? "Saved." : form && "deleted" in form ? "Deleted." : null);
	const overlaps = $derived((form && "overlaps" in form && form.overlaps) || []);

	const range = (start: string, end: string) =>
		start === end ? formatDate(start, { year: true }) : `${formatDate(start)} – ${formatDate(end, { year: true })}`;
</script>

<svelte:head>
	<title>Time Off | Ophir Admin</title>
</svelte:head>

<h1>Time off</h1>
<p>Dates you're away can't be booked for rentals or drop-ins. You can also show a banner on the homepage so customers know.</p>

{#if overlaps.length}
	<div class="card warning" role="alert">
		<h2><span class="material-icons" aria-hidden="true">warning</span>Some bookings fall in this time off</h2>
		<p>They haven't been cancelled. Contact these customers or move your dates:</p>
		<ul>
			{#each overlaps as overlap}<li>{overlap}</li>{/each}
		</ul>
	</div>
{/if}

{#if !data.showPast}
	<details class="card" open={!!errorsFor("new")}>
		<summary><span class="material-icons" aria-hidden="true">add</span>Add time off</summary>
		<PeriodForm errors={errorsFor("new")} today={data.today} />
	</details>
{/if}

<nav class="tabs" aria-label="Time off">
	<a href="/admin/time-off" aria-current={!data.showPast ? "page" : undefined}>Current &amp; upcoming</a>
	<a href="/admin/time-off?past" aria-current={data.showPast ? "page" : undefined}>Past</a>
</nav>

{#if data.periods.length === 0}
	<div class="card"><p>{data.showPast ? "No past time off." : "No time off scheduled."}</p></div>
{/if}

{#each data.periods as period (period.id)}
	<article class="card" aria-labelledby="off-{period.id}">
		<header>
			<h2 id="off-{period.id}">{range(period.start_date, period.end_date)}</h2>
			{#if period.start_date <= data.today && period.end_date >= data.today}<span class="badge pending">Now</span>{/if}
		</header>
		{#if period.show_banner}
			<p class="banner-preview"><span class="material-icons" aria-hidden="true">campaign</span>{timeOffMessage(period)}</p>
		{:else}
			<p>No homepage banner.</p>
		{/if}
		<details open={!!errorsFor(period.id)}>
			<summary>Edit</summary>
			<PeriodForm {period} errors={errorsFor(period.id)} today={data.today} />
		</details>
	</article>
{/each}

<Toast message={toast} trigger={form} />

<style>
	div.warning {
		background-color: var(--color-background-tan);
	}

	div.warning h2 {
		display: flex;
		align-items: center;
		gap: var(--spacing-s);
	}

	div.warning ul {
		padding-left: var(--spacing-l);
	}

	article header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-s);
	}

	p.banner-preview {
		display: flex;
		gap: var(--spacing-s);
		background-color: var(--color-background-white);
		border-radius: 12px;
		padding: var(--spacing-m);
	}

	p.banner-preview span.material-icons {
		font-size: 20px;
	}
</style>
