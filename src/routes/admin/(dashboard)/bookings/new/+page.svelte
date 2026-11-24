<script lang="ts">
	import { enhance } from "$app/forms";
	import { tick } from "svelte";
	import Field from "$lib/components/admin/Field.svelte";
	import BookingCalendar from "$lib/components/booking/BookingCalendar.svelte";
	import { AvailabilityMonths } from "$lib/components/booking/availabilityMonths.svelte";
	import { dropInSlotLabels, type Package } from "$lib/types/booking";
	import { addDays, formatCents, formatDate, formatTime, formatWeekdays } from "$lib/utils/format";
	import { canDeliver, deliveryTimes } from "$lib/utils/availability";
	import { addOnSections } from "$lib/utils/addOns";

	let { data, form } = $props();

	const errors = $derived(form && "errors" in form && form.type === data.type ? form.errors : null);
	let dayId = $state("");
	const selectedDay = $derived(data.days.find((d) => d.id === dayId));
	let chosenSlot = $state("");

	// A new day has different sessions, so choose again (a day with only one session picks it).
	function chooseDay(id: string) {
		const sessions = data.days.find((d) => d.id === id)?.sessions ?? [];
		chosenSlot = sessions.length === 1 ? sessions[0] : "";
	}
	const addOnGroups = $derived(addOnSections(data.addOns));
	let packageId = $state("");
	const selectedPackage = $derived(data.packages.find((p) => p.id === packageId));
	let saving = $state(false);

	// Drop-off date: the customer calendar, greying out days the package can't drop off on. Admins may book today and,
	// with the box ticked, on any weekday; overlaps stay blocked (the server checks both again).
	const months = new AvailabilityMonths();
	let ignoreWeekdays = $state(false);
	let deliveryDate = $state("");
	let dateCleared = $state(false);
	const fits = (pkg: Package | undefined, date: string, anyWeekday: boolean) => {
		const availability = months.availabilityFor(date);
		return !!pkg && (!availability || canDeliver(availability.calendar, pkg, date, { allowToday: true, anyWeekday }));
	};

	/** After the package or the weekday box changes, drop a date that no longer works (and say so) */
	function recheckDate(pkg: Package | undefined, anyWeekday: boolean) {
		dateCleared = !!deliveryDate && !fits(pkg, deliveryDate, anyWeekday);
		if (dateCleared) deliveryDate = "";
	}

	function chooseDate(date: string) {
		deliveryDate = date;
		dateCleared = missingDate = false;
	}

	// A hidden input can't be `required`, so a missing date is caught before submitting; server errors land here too.
	let missingDate = $state(false);
	const dateError = $derived(missingDate ? "Choose a drop-off date" : errors?.delivery_date?.[0]);
	let dateField = $state<HTMLElement>();
	const focusCalendar = () =>
		(dateField?.querySelector<HTMLElement>("button.day[aria-pressed='true'], button.day:not(:disabled)") ?? dateField)?.focus();

	const submitRental = ({ cancel }: { cancel: () => void }) => {
		if (!deliveryDate) {
			cancel();
			missingDate = true;
			focusCalendar();
			return;
		}
		saving = true;
		return async ({ update }: { update: (options?: { reset?: boolean }) => Promise<void> }) => {
			await update({ reset: false });
			saving = false;
			if (dateError) {
				await tick();
				focusCalendar();
			}
		};
	};

	// Drop-off time: the website's options, or any time via "Other time…"
	const times = $derived(deliveryTimes(data.settings));
	// svelte-ignore state_referenced_locally
	let timeChoice = $state(deliveryTimes(data.settings)[0] ?? "other");
	// svelte-ignore state_referenced_locally
	let otherTime = $state(data.settings.delivery_window_start.slice(0, 5));

	const submit = () => {
		saving = true;
		return async ({ update }: { update: (options?: { reset?: boolean }) => Promise<void> }) => {
			await update({ reset: false });
			saving = false;
		};
	};
</script>

<svelte:head>
	<title>New booking | Ophir Admin</title>
</svelte:head>

<a class="back text-link" href="/admin/bookings"><span class="material-icons" aria-hidden="true">arrow_back</span><span>All bookings</span></a>
<h1>New booking</h1>
<p>
	For bookings taken by phone or in person. These are confirmed straight away and skip the website's rules for lead time and drop-off times, but still
	can't overlap other bookings, drop-in days or time off. Each package's drop-off days still apply unless you choose to ignore them.
</p>

<nav class="tabs" aria-label="Booking type">
	<a href="/admin/bookings/new" aria-current={data.type === "rental" ? "page" : undefined}>Private rental</a>
	<a href="/admin/bookings/new?type=drop-in" aria-current={data.type === "drop-in" ? "page" : undefined}>Drop-in</a>
</nav>

{#snippet contactFields()}
	<fieldset>
		<legend>Customer</legend>
		<div class="grid">
			<Field label="Name" name="name" {errors}>
				{#snippet children(attrs)}<input type="text" autocomplete="off" required {...attrs} />{/snippet}
			</Field>
			<Field label="Email (optional)" name="email" {errors}>
				{#snippet children(attrs)}<input type="email" autocomplete="off" {...attrs} />{/snippet}
			</Field>
			<Field label="Phone (optional)" name="phone" {errors}>
				{#snippet children(attrs)}<input type="tel" autocomplete="off" {...attrs} />{/snippet}
			</Field>
		</div>
		<Field label="Customer's notes (optional)" name="notes" {errors}>
			{#snippet children(attrs)}<textarea maxlength="1000" {...attrs}></textarea>{/snippet}
		</Field>
		<Field
			label="Admin notes (optional)"
			name="admin_notes"
			hint="Only visible in the dashboard, e.g. “Paid by e-transfer” or “Moved from YCBM”."
			{errors}
		>
			{#snippet children(attrs)}<textarea maxlength="5000" {...attrs}></textarea>{/snippet}
		</Field>
		<label class="checkbox">
			<input type="checkbox" name="notify" />
			Email the customer a confirmation (needs an email address)
		</label>
		{#if !data.emailConfigured}
			<p class="hint">Email isn't set up yet, so no confirmation will be sent.</p>
		{/if}
	</fieldset>
{/snippet}

{#snippet actions(label: string)}
	<div class="actions">
		<button class="btn solid" type="submit" disabled={saving}>{saving ? "Saving…" : label}</button>
		{#if errors?.form}<p class="form-error" role="alert">{errors.form[0]}</p>{/if}
	</div>
{/snippet}

{#if data.type === "rental"}
	<form class="card" method="POST" action="?/rental" use:enhance={submitRental}>
		<fieldset>
			<legend>Rental</legend>
			<div class="grid">
				<Field label="Package" name="package_id" {errors}>
					{#snippet children(attrs)}
						<select
							required
							bind:value={packageId}
							onchange={(event) =>
								recheckDate(
									data.packages.find((p) => p.id === event.currentTarget.value),
									ignoreWeekdays
								)}
							{...attrs}
						>
							<option value="">Choose a package</option>
							{#each data.packages as pkg (pkg.id)}
								<option value={pkg.id}>{pkg.name} · {formatCents(pkg.price_cents)}{pkg.active ? "" : " (hidden)"}</option>
							{/each}
						</select>
					{/snippet}
				</Field>
			</div>
			<!-- Drop-off date: a calendar group named by the visible label, so it's wired up by hand rather than with Field -->
			<div class="date-field" bind:this={dateField} tabindex="-1">
				<p class="label" id="delivery_date-label">Drop-off date</p>
				{#if selectedPackage}
					{@const pkg = selectedPackage}
					<BookingCalendar
						source={months}
						labelledby="delivery_date-label"
						selected={deliveryDate || null}
						isAvailable={(date, availability) => canDeliver(availability.calendar, pkg, date, { allowToday: true, anyWeekday: ignoreWeekdays })}
						onselect={chooseDate}
						describedby="delivery_date-hint{dateError ? ' delivery_date-error' : ''}"
						empty="No free drop-off days for this package this month."
					/>
				{/if}
				<input type="hidden" name="delivery_date" value={deliveryDate} />
				<!-- Live, so choosing a day reads out the drop-off and pickup dates -->
				<small id="delivery_date-hint" class="hint" aria-live="polite">
					{#if !selectedPackage}
						Choose a package to see its drop-off days.
					{:else if deliveryDate}
						<strong>Drop-off {formatDate(deliveryDate)} · pickup {formatDate(addDays(deliveryDate, selectedPackage.nights))}</strong>
					{:else}
						Drops off {formatWeekdays(selectedPackage.allowed_delivery_weekdays)}; greyed-out days are booked, a drop-in day or time off.
					{/if}
				</small>
				<!-- Always present so the message is announced when it appears -->
				<div role="status">
					{#if dateCleared}
						<p class="note">
							<span class="material-icons" aria-hidden="true">info</span>That drop-off date doesn't fit any more, so it was cleared. Choose another.
						</p>
					{/if}
				</div>
				{#if dateError}
					<small id="delivery_date-error" class="field-error" role="alert">{dateError}</small>
				{/if}
			</div>
			<label class="checkbox">
				<input
					type="checkbox"
					name="ignore_weekdays"
					bind:checked={ignoreWeekdays}
					onchange={(event) => recheckDate(selectedPackage, event.currentTarget.checked)}
				/>
				Ignore the package's drop-off days (for one-off deals and moved bookings)
			</label>
			<div class="grid">
				<Field label="Drop-off time" name="time_choice" {errors}>
					{#snippet children(attrs)}
						<select bind:value={timeChoice} {...attrs}>
							{#each times as time (time)}
								<option value={time}>{formatTime(time)}</option>
							{/each}
							<option value="other">Other time…</option>
						</select>
					{/snippet}
				</Field>
				<Field label="Delivery area" name="zone_id" {errors}>
					{#snippet children(attrs)}
						<select required {...attrs}>
							<option value="">Choose an area</option>
							{#each data.zones as zone (zone.id)}
								<option value={zone.id}>{zone.name} · {formatCents(zone.price_cents)}{zone.active ? "" : " (hidden)"}</option>
							{/each}
						</select>
					{/snippet}
				</Field>
			</div>
			<!-- Its own row, so revealing it doesn't push "Delivery area" sideways -->
			{#if timeChoice === "other"}
				<div class="other-time">
					<Field label="Other drop-off time" name="delivery_time" hint="Any time, even outside the delivery window." {errors}>
						{#snippet children(attrs)}<input type="time" required bind:value={otherTime} {...attrs} />{/snippet}
					</Field>
				</div>
			{:else}
				<input type="hidden" name="delivery_time" value={timeChoice} />
			{/if}
			<Field label="Address" name="address" {errors}>
				{#snippet children(attrs)}<input type="text" required maxlength="300" autocomplete="off" {...attrs} />{/snippet}
			</Field>
		</fieldset>

		{#if data.addOns.length}
			<fieldset>
				<legend>Add-ons</legend>
				{#each addOnGroups as section, i (section.group || section.addOns[0].id)}
					{#if section.group}
						<!-- Submitted as addon_choice_N = the chosen add-on's id ("" for none) -->
						<fieldset class="choice-group">
							<legend>{section.group}</legend>
							<label class="checkbox"><input type="radio" name="addon_choice_{i}" value="" checked />None</label>
							{#each section.addOns as addOn (addOn.id)}
								<label class="checkbox">
									<input type="radio" name="addon_choice_{i}" value={addOn.id} />
									{addOn.name} ({formatCents(addOn.price_cents)}){addOn.active ? "" : " (hidden)"}
								</label>
							{/each}
						</fieldset>
					{:else}
						{@const addOn = section.addOns[0]}
						{#if addOn.max_quantity <= 1}
							<label class="checkbox">
								<input type="checkbox" name="addon_{addOn.id}" value="1" />
								{addOn.name} ({formatCents(addOn.price_cents)}){addOn.active ? "" : " (hidden)"}
							</label>
						{:else}
							<Field label="{addOn.name} ({formatCents(addOn.price_cents)})" name="addon_{addOn.id}" hint="Up to {addOn.max_quantity}">
								{#snippet children(attrs)}<input type="number" min="0" max={addOn.max_quantity} value="0" inputmode="numeric" {...attrs} />{/snippet}
							</Field>
						{/if}
					{/if}
				{/each}
			</fieldset>
		{/if}

		{@render contactFields()}
		{@render actions("Create rental")}
	</form>
{:else if data.days.length === 0}
	<div class="card">
		<p>There are no upcoming drop-in days. <a class="text-link" href="/admin/drop-ins?add">Add a drop-in day</a> first.</p>
	</div>
{:else}
	<form class="card" method="POST" action="?/dropIn" use:enhance={submit}>
		<fieldset>
			<legend>Drop-in session</legend>
			<div class="grid">
				<Field label="Day" name="day_id" {errors}>
					{#snippet children(attrs)}
						<select required bind:value={dayId} onchange={(event) => chooseDay(event.currentTarget.value)} {...attrs}>
							<option value="">Choose a day</option>
							{#each data.days as day (day.id)}
								<option value={day.id}>{formatDate(day.date, { year: true })} · {day.location}</option>
							{/each}
						</select>
					{/snippet}
				</Field>
				<Field label="Session" name="slot" hint="Sessions depend on the day you choose." {errors}>
					{#snippet children(attrs)}
						<select required disabled={!selectedDay} bind:value={chosenSlot} {...attrs}>
							<option value="">Choose a session</option>
							{#each selectedDay?.sessions ?? [] as slot (slot)}
								<option value={slot}>{dropInSlotLabels[slot]}</option>
							{/each}
						</select>
					{/snippet}
				</Field>
				<Field label="People" name="party_size" hint="Each session holds up to {data.settings.drop_in_capacity}." {errors}>
					{#snippet children(attrs)}<input
							type="number"
							min="1"
							max={data.settings.drop_in_capacity}
							value="1"
							required
							inputmode="numeric"
							{...attrs}
						/>{/snippet}
				</Field>
			</div>
		</fieldset>

		{@render contactFields()}
		{@render actions("Create drop-in booking")}
	</form>
{/if}

<style>
	fieldset {
		border: 0;
		padding: 0;
		margin: 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
	}

	legend {
		font-size: var(--font-heading-s);
		font-weight: 600;
		color: var(--color-primary);
		padding: 0;
		margin-bottom: var(--spacing-m);
	}

	fieldset.choice-group {
		gap: var(--spacing-s);
	}

	fieldset.choice-group legend {
		font-size: inherit;
		margin-bottom: var(--spacing-s);
	}

	div.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--spacing-m);
	}

	div.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-s);
	}

	div.date-field {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		max-width: 26rem;
	}

	/* Matches the calendar's width rather than stretching a time box across the card */
	div.other-time {
		max-width: 26rem;
	}

	div.date-field:focus {
		outline: none;
	}

	/* The modal reserves a line under the calendar for loading messages; here the hint follows straight on */
	div.date-field :global(div.calendar-status) {
		min-height: 0;
	}

	div.date-field :global(div.calendar-status:empty) {
		display: none;
	}

	/* A neutral notice, not an error: the form just reset a value */
	p.note {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-xs);
		font-size: 14px;
		line-height: 1.25rem;
		color: var(--color-primary);
	}

	p.note span.material-icons {
		font-size: 18px;
		color: inherit;
		line-height: 1.25rem;
	}

	/* Matches the admin field labels; a <p> because the calendar is a group, not a single control */
	p.label {
		font-weight: 600;
		color: var(--color-primary);
	}
</style>
