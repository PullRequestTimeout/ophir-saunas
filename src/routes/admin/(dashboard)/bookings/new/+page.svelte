<script lang="ts">
	import { enhance } from "$app/forms";
	import Field from "$lib/components/admin/Field.svelte";
	import { dropInSlotLabels, type DropInSlot } from "$lib/types/booking";
	import { formatCents, formatDate } from "$lib/utils/format";

	let { data, form } = $props();

	const errors = $derived(form && "errors" in form && form.type === data.type ? form.errors : null);
	const slots = Object.keys(dropInSlotLabels) as DropInSlot[];
	let saving = $state(false);

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

<a class="back text-link" href="/admin/bookings"><span class="material-icons" aria-hidden="true">arrow_back</span>All bookings</a>
<h1>New booking</h1>
<p>
	For phone bookings and bookings moved over from YouCanBookMe. These are confirmed straight away and skip the website's rules for lead time, delivery
	days and times, but still can't overlap other bookings, drop-in days or time off.
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
	<form class="card" method="POST" action="?/rental" use:enhance={submit}>
		<fieldset>
			<legend>Rental</legend>
			<div class="grid">
				<Field label="Package" name="package_id" {errors}>
					{#snippet children(attrs)}
						<select required {...attrs}>
							<option value="">Choose a package</option>
							{#each data.packages as pkg (pkg.id)}
								<option value={pkg.id}>{pkg.name} · {formatCents(pkg.price_cents)}{pkg.active ? "" : " (hidden)"}</option>
							{/each}
						</select>
					{/snippet}
				</Field>
				<Field label="Drop-off date" name="delivery_date" hint="Pickup is set from the package's nights." {errors}>
					{#snippet children(attrs)}<input type="date" required {...attrs} />{/snippet}
				</Field>
				<Field label="Drop-off time" name="delivery_time" {errors}>
					{#snippet children(attrs)}<input type="time" required value={data.settings.delivery_window_start.slice(0, 5)} {...attrs} />{/snippet}
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
			<Field label="Address" name="address" {errors}>
				{#snippet children(attrs)}<textarea required maxlength="300" {...attrs}></textarea>{/snippet}
			</Field>
		</fieldset>

		{#if data.addOns.length}
			<fieldset>
				<legend>Add-ons</legend>
				<div class="grid">
					{#each data.addOns as addOn (addOn.id)}
						<Field label="{addOn.name} ({formatCents(addOn.price_cents)})" name="addon_{addOn.id}" hint="Up to {addOn.max_quantity}">
							{#snippet children(attrs)}<input type="number" min="0" max={addOn.max_quantity} value="0" inputmode="numeric" {...attrs} />{/snippet}
						</Field>
					{/each}
				</div>
			</fieldset>
		{/if}

		{@render contactFields()}
		{@render actions("Create rental")}
	</form>
{:else if data.days.length === 0}
	<div class="card">
		<p>There are no upcoming drop-in days. <a class="text-link" href="/admin/drop-ins">Add a drop-in day</a> first.</p>
	</div>
{:else}
	<form class="card" method="POST" action="?/dropIn" use:enhance={submit}>
		<fieldset>
			<legend>Drop-in session</legend>
			<div class="grid">
				<Field label="Day" name="day_id" {errors}>
					{#snippet children(attrs)}
						<select required {...attrs}>
							<option value="">Choose a day</option>
							{#each data.days as day (day.id)}
								<option value={day.id}>{formatDate(day.date, { year: true })} · {day.location}</option>
							{/each}
						</select>
					{/snippet}
				</Field>
				<Field label="Session" name="slot" {errors}>
					{#snippet children(attrs)}
						<select required {...attrs}>
							{#each slots as slot (slot)}
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
</style>
