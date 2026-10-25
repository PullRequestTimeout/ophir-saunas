<script lang="ts">
	let { booking }: { booking: { customer_name: string; customer_email: string; customer_phone: string; customer_notes: string } } = $props();
</script>

<section class="card" aria-labelledby="customer-heading">
	<h2 id="customer-heading">Customer</h2>
	<dl class="details">
		<div>
			<dt>Name</dt>
			<dd>{booking.customer_name}</dd>
		</div>
		<div>
			<dt>Phone</dt>
			<dd>
				{#if booking.customer_phone}<a href="tel:{booking.customer_phone}">{booking.customer_phone}</a>{:else}Not given{/if}
			</dd>
		</div>
		<div>
			<dt>Email</dt>
			<dd>
				{#if booking.customer_email}<a href="mailto:{booking.customer_email}">{booking.customer_email}</a>{:else}Not given{/if}
			</dd>
		</div>
		{#if booking.customer_notes}
			<div>
				<dt>Their notes</dt>
				<dd class="pre">{booking.customer_notes}</dd>
			</div>
		{/if}
	</dl>
</section>
