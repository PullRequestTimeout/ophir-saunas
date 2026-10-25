<script lang="ts">
	import { enhance } from "$app/forms";
	import Field from "$lib/components/admin/Field.svelte";

	let { notes, errors = null }: { notes: string; errors?: Record<string, string[] | undefined> | null } = $props();

	let saving = $state(false);
</script>

<section class="card" aria-labelledby="notes-heading">
	<h2 id="notes-heading">Admin notes</h2>
	<form
		method="POST"
		action="?/notes"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				await update({ reset: false });
				saving = false;
			};
		}}
	>
		<Field label="Notes (only visible here)" name="admin_notes" hint="Payment received, gate codes, anything to remember." {errors}>
			{#snippet children(attrs)}<textarea maxlength="5000" {...attrs}>{notes}</textarea>{/snippet}
		</Field>
		<button class="btn solid" type="submit" disabled={saving}>Save notes</button>
	</form>
</section>
