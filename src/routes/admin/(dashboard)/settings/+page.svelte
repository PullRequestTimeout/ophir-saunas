<script lang="ts">
	import { enhance } from "$app/forms";
	import Field from "$lib/components/admin/Field.svelte";

	let { data, form } = $props();
	const s = $derived(data.settings);
	const errors = $derived(form?.errors ?? null);
</script>

<svelte:head>
	<title>Settings | Ophir Admin</title>
</svelte:head>

<h1>Settings</h1>

<form
	method="POST"
	use:enhance={() =>
		async ({ update }) =>
			update({ reset: false })}
>
	<section class="card">
		<h2>Bookings</h2>
		<label class="checkbox">
			<input type="checkbox" name="auto_confirm" checked={s.auto_confirm} aria-describedby="auto_confirm-hint" />
			Confirm bookings automatically
		</label>
		<small id="auto_confirm-hint" class="hint">
			When off, new bookings are held as requests until you approve them. The dates stay reserved while a request is pending.
		</small>
		<label class="checkbox">
			<input type="checkbox" name="same_day_turnaround" checked={s.same_day_turnaround} aria-describedby="turnaround-hint" />
			Allow same-day turnaround
		</label>
		<small id="turnaround-hint" class="hint">
			When on, a morning pickup and an evening delivery can happen on the same day. Changing this doesn't affect existing bookings.
		</small>
		<Field label="Send booking notifications to" name="owner_email" {errors}>
			{#snippet children(attrs)}<input type="email" value={s.owner_email} required {...attrs} />{/snippet}
		</Field>
		<Field label="Reminder emails (days before)" name="reminder_days_before" hint="0 sends the reminder on the day." {errors}>
			{#snippet children(attrs)}<input type="number" min="0" max="14" value={s.reminder_days_before} required {...attrs} />{/snippet}
		</Field>
		<a class="text-link" href="/admin/emails">Preview the booking emails</a>
	</section>

	<section class="card">
		<h2>Delivery &amp; pickup</h2>
		<div class="row">
			<Field label="Delivery window opens" name="delivery_window_start" {errors}>
				{#snippet children(attrs)}<input type="time" value={s.delivery_window_start.slice(0, 5)} required {...attrs} />{/snippet}
			</Field>
			<Field label="Delivery window closes" name="delivery_window_end" {errors}>
				{#snippet children(attrs)}<input type="time" value={s.delivery_window_end.slice(0, 5)} required {...attrs} />{/snippet}
			</Field>
		</div>
		<div class="row">
			<Field label="Delivery time options every" name="delivery_slot_minutes" {errors}>
				{#snippet children(attrs)}
					<select {...attrs}>
						{#each [15, 30, 60] as minutes}
							<option value={minutes} selected={s.delivery_slot_minutes === minutes}>{minutes} minutes</option>
						{/each}
					</select>
				{/snippet}
			</Field>
			<Field label="Expected pickup time" name="pickup_time" hint="Shown to customers on their pickup day." {errors}>
				{#snippet children(attrs)}<input type="time" value={s.pickup_time.slice(0, 5)} required {...attrs} />{/snippet}
			</Field>
		</div>
	</section>

	<section class="card">
		<h2>Drop-in sessions</h2>
		<Field label="Maximum people per time slot" name="drop_in_capacity" hint="The per-person price is on the Pricing page." {errors}>
			{#snippet children(attrs)}<input type="number" min="1" max="20" value={s.drop_in_capacity} required {...attrs} />{/snippet}
		</Field>
	</section>

	<div class="actions" aria-live="polite">
		<button class="btn solid" type="submit">Save settings</button>
		{#if form?.success}
			<p class="form-success">Settings saved.</p>
		{:else if errors?.form}
			<p class="form-error" role="alert">{errors.form[0]}</p>
		{:else if errors}
			<p class="form-error" role="alert">Please fix the highlighted fields.</p>
		{/if}
	</div>
</form>

<style>
	form {
		gap: var(--spacing-l);
		max-width: 48rem;
	}

	div.row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--spacing-m);
	}

	label.checkbox + small.hint {
		margin-top: calc(var(--spacing-s) * -1);
		padding-left: calc(1.25rem + var(--spacing-s));
	}

	div.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-m);
	}
</style>
