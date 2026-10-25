<script lang="ts">
	let { data } = $props();

	let selected = $state("rental-confirmed");
	let showText = $state(false);
	const email = $derived(data.emails.find((e) => e.id === selected) ?? data.emails[0]);
</script>

<svelte:head>
	<title>Email previews | Ophir Admin</title>
</svelte:head>

<h1>Email previews</h1>
<p>
	What customers and you receive, shown with sample bookings.
	{data.emailConfigured ? "Email is set up." : "Email isn't set up yet (no Resend API key), so nothing is being sent."}
</p>

<div class="card">
	<div class="controls">
		<label>
			Email
			<select bind:value={selected}>
				{#each data.emails as option (option.id)}
					<option value={option.id}>{option.label}</option>
				{/each}
			</select>
		</label>
		<label class="checkbox"><input type="checkbox" bind:checked={showText} /> Show plain-text version</label>
	</div>
	<p><strong>Subject:</strong> {email.subject}</p>
	{#if showText}
		<pre>{email.text}</pre>
	{:else}
		<iframe title="Preview of {email.label}" srcdoc={email.html} sandbox=""></iframe>
	{/if}
</div>

<style>
	div.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: var(--spacing-m);
	}

	iframe {
		width: 100%;
		height: 70vh;
		border: 1px solid var(--color-primary-transparent);
		border-radius: 12px;
		background-color: #faf3eb;
	}

	pre {
		white-space: pre-wrap;
		font-size: 14px;
		background-color: var(--color-background-white);
		padding: var(--spacing-m);
		border-radius: 12px;
	}
</style>
