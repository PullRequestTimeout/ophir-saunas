<script lang="ts">
	import { homeFaqs } from "$lib/data/faqs";
	import { dropInSlotLabels } from "$lib/types/booking";
	import { formatCents, formatDate } from "$lib/utils/format";
	import StaySummary from "./StaySummary.svelte";
	import type { BookingFlow, Step } from "./flow.svelte";

	let { flow }: { flow: BookingFlow } = $props();

	const chosenAddOns = $derived(
		(flow.options?.addOns ?? [])
			.filter((a) => (flow.addOns[a.id] ?? 0) > 0)
			.map((a) => (flow.addOns[a.id] > 1 ? `${a.name} × ${flow.addOns[a.id]}` : a.name))
	);

	// The FAQ is the single source for the policy wording.
	const cancellationPolicy = homeFaqs.find((faq) => faq.question.toLowerCase().includes("cancellation"))?.answer[0]?.content;
</script>

{#snippet edit(step: Step, what: string)}
	<button type="button" class="link" aria-label="Edit {what}" onclick={() => flow.goTo(step)}>Edit</button>
{/snippet}

<div class="step">
	{#if flow.service === "rental"}
		<StaySummary {flow}>{@render edit("date", "dates")}</StaySummary>
	{/if}
	<dl>
		{#if flow.service === "rental"}
			<div>
				<dt>Package</dt>
				<dd>{flow.package?.name}</dd>
				<dd>{@render edit("package", "package")}</dd>
			</div>
			<div>
				<dt>Delivery</dt>
				<dd>{flow.zone?.name}<br />{flow.address}</dd>
				<dd>{@render edit("delivery", "delivery")}</dd>
			</div>
			{#if flow.steps.includes("addons")}
				<div>
					<dt>Extras</dt>
					<dd>{chosenAddOns.length ? chosenAddOns.join(", ") : "None"}</dd>
					<dd>{@render edit("addons", "extras")}</dd>
				</div>
			{/if}
		{:else if flow.dropInDay && flow.slot}
			<div>
				<dt>Session</dt>
				<dd>{formatDate(flow.dropInDay.date, { long: true })}, {dropInSlotLabels[flow.slot]}</dd>
				<dd>{@render edit("session-day", "session")}</dd>
			</div>
			<div>
				<dt>Location</dt>
				<dd>{flow.dropInDay.location}</dd>
			</div>
			<div>
				<dt>People</dt>
				<dd>{flow.partySize}</dd>
				<dd>{@render edit("session", "number of people")}</dd>
			</div>
		{/if}
		<div>
			<dt>Contact</dt>
			<dd>{flow.contact.name}<br />{flow.contact.email}<br />{flow.contact.phone}</dd>
			<dd>{@render edit("contact", "contact details")}</dd>
		</div>
		{#if flow.contact.notes.trim()}
			<div>
				<dt>Notes</dt>
				<dd class="notes">{flow.contact.notes}</dd>
			</div>
		{/if}
	</dl>

	<table>
		<caption class="visually-hidden">Estimated total</caption>
		<tbody>
			{#each flow.lineItems as item (item.label)}
				<tr>
					<th scope="row">{item.label}{item.quantity > 1 ? ` × ${item.quantity}` : ""}</th>
					<td>{formatCents(item.total_cents)}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th scope="row">Estimated total</th>
				<td>{formatCents(flow.totalCents)}</td>
			</tr>
		</tfoot>
	</table>

	<div class="notes-box">
		<p><strong>Nothing is charged now.</strong> We'll arrange payment with you directly{flow.service === "rental" ? " before drop-off" : ""}.</p>
		{#if cancellationPolicy}<p><strong>Cancellation policy:</strong> {cancellationPolicy}</p>{/if}
		{#if !flow.options?.settings.auto_confirm}
			<p>This is a booking request. We'll confirm it by email shortly.</p>
		{/if}
	</div>
</div>

<style>
	dl {
		margin: 0;
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--color-background-green);
	}

	dl > div {
		display: grid;
		grid-template-columns: 6rem 1fr auto;
		gap: var(--spacing-s);
		padding-block: var(--spacing-s);
		border-bottom: 1px solid var(--color-background-green);
		line-height: 1.5;
	}

	dt {
		font-weight: 600;
		color: var(--color-primary);
	}

	dd {
		margin: 0;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	dd :global(button.link) {
		min-height: 44px;
		margin-block: -0.6rem;
	}

	dd.notes {
		white-space: pre-line;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding-block: var(--spacing-xs);
		text-align: left;
		font-weight: 400;
	}

	td {
		text-align: right;
		white-space: nowrap;
	}

	tfoot th,
	tfoot td {
		padding-top: var(--spacing-s);
		border-top: 2px solid var(--color-primary);
		font-weight: 700;
		color: var(--color-primary);
	}

	div.notes-box {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
		font-size: 14px;
	}
</style>
