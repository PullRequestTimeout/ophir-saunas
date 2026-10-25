<script lang="ts">
	import { enhance } from "$app/forms";
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";

	let { form } = $props();
	let submitting = $state(false);

	const errorProps = $derived(form?.message ? { "aria-invalid": true, "aria-describedby": "login-error" } : {});
</script>

<svelte:head>
	<title>Admin Login | Ophir Mobile Saunas</title>
</svelte:head>

<main>
	<div class="card">
		<img src="/assets/svgs/logo.svg" alt="Ophir Mobile Saunas logo" />
		<h1>Admin</h1>
		<form
			method="POST"
			aria-busy={submitting}
			use:enhance={({ cancel }) => {
				if (submitting) return cancel();
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
			<label>
				Email
				<input type="email" name="email" autocomplete="username" value={form?.email ?? ""} required {...errorProps} />
			</label>
			<label>
				Password
				<input type="password" name="password" autocomplete="current-password" required {...errorProps} />
			</label>
			{#if form?.message}
				<p id="login-error" class="form-error" role="alert">{form.message}</p>
			{/if}
			<div class="submit">
				<PrimaryButton type="submit" text="Sign in" />
			</div>
		</form>
	</div>
</main>

<style>
	main {
		min-height: 100vh;
		min-height: 100dvh;
		display: grid;
		place-items: center;
		padding: var(--spacing-m);
		background-color: var(--color-background-green);
	}

	div.card {
		width: 100%;
		max-width: 26rem;
		align-items: stretch;
	}

	img {
		width: 3.5rem;
		margin-inline: auto;
	}

	h1 {
		text-align: center;
	}

	div.submit :global(button) {
		width: 100%;
		min-height: 2.75rem;
	}

	form[aria-busy="true"] div.submit {
		opacity: 0.6;
		pointer-events: none;
	}
</style>
