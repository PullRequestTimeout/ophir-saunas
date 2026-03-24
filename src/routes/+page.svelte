<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import SeoHead from "$lib/components/SeoHead.svelte";
</script>

<!-- Default SEO head content -->
<SeoHead />

<section class="hero">
	<div class="hero-text">
		<h2 class="decorative-heading">Relaxation delivered right to your door</h2>
		<p class="subheading">Mobile sauna rentals in the West Kootenays, British Columbia</p>
		<PrimaryButton href="/booking" text="Book Now" />
	</div>
</section>
<section class="value-prop">
	<div class="value-prop-row1">
		<div class="value-prop-heading">
			<h3 class="long-heading">Bring wellness to your backyard, retreat, or cabin weekend.</h3>
			<p class="text-light">Elevate any gathering with a rejuvenating experience.</p>
		</div>
		<div class="value-prop-bullets">
			<div class="value-prop-bullet">
				<div class="icon-heading">
					<span class="material-icons">spa</span>
					<p>Restoration</p>
				</div>
				<p class="text-light">Unwind and recover after adventure</p>
			</div>
			<div class="value-prop-bullet">
				<div class="icon-heading">
					<span class="material-icons">groups</span>
					<p>Connection</p>
				</div>
				<p class="text-light">Perfect for intimate gatherings</p>
			</div>
			<div class="value-prop-bullet">
				<div class="icon-heading">
					<span class="material-icons">local_shipping</span>
					<p>Easy&nbsp;Delivery</p>
				</div>
				<p class="text-light">Hassle-free setup at your location</p>
			</div>
		</div>
	</div>
	<div class="value-prop-row2">
		<div class="value-prop-image">
			<img src="/assets/images/value-prop.jpg" alt="Sauna interior looking out on nature" />
		</div>
		<div class="value-prop-text-box bg-tan">
			<p class="text-semi-bold">Physical Recovery</p>
			<p class="text-light">Sauna use supports muscle recovery, improves circulation, and helps ease tension in the body.</p>
		</div>
		<div class="value-prop-text-box">
			<p class="text-semi-bold">Mental Reset</p>
			<p class="text-light">The steady heat promotes relaxation, reduces stress, and leaves you feeling clearer and more grounded.</p>
		</div>
	</div>
</section>

<style>
	section.hero {
		background: url(/assets/images/hero.jpg) center/cover no-repeat;
	}

	/* Value Prop */
	section.value-prop,
	div.value-prop-row1,
	div.value-prop-heading,
	div.value-prop-bullets,
	div.value-prop-bullet,
	div.value-prop-row2,
	div.value-prop-text-box {
		display: flex;
		flex-direction: column;
	}

	div.value-prop-row2 {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-m);
		grid-template-rows: repeat(3, 1fr);
	}

	section.value-prop,
	div.value-prop-row1,
	div.value-prop-row2 {
		gap: var(--spacing-m);
	}

	div.value-prop-heading,
	div.value-prop-bullet {
		gap: var(--spacing-s);
	}

	div.value-prop-bullets {
		gap: var(--spacing-m);
	}

	div.value-prop-heading p {
		font-size: var(--font-body-l);
	}

	div.value-prop-bullet > p,
	div.value-prop-text-box > p {
		font-size: var(--font-body-m);
	}

	div.value-prop-image {
		object-fit: cover;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	div.value-prop-text-box,
	div.value-prop-image {
		border-radius: var(--border-radius);
		max-height: 10rem;
	}

	div.value-prop-text-box {
		padding: var(--spacing-m);
		gap: var(--spacing-m);
		justify-content: center;
	}

	div.value-prop-text-box:last-child {
		border: var(--border-width) solid var(--color-primary-transparent);
	}

	@media screen and (min-width: 768px) {
		section.value-prop {
			gap: var(--spacing-l);
		}

		div.value-prop-bullets {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
		}

		div.value-prop-row2 {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
		}

		div.value-prop-image {
			grid-column: 1 / 3;
		}

		div.value-prop-text-box {
			padding: var(--spacing-l);
			gap: var(--spacing-s);
		}
	}

	@media screen and (min-width: 1024px) {
		div.value-prop-row1,
		div.value-prop-row2 {
			display: grid;
			gap: var(--spacing-m);
		}

		div.value-prop-row1 {
			grid-template-columns: repeat(2, 1fr);
		}

		div.value-prop-row2 {
			grid-template-columns: repeat(4, 1fr);
			grid-template-rows: 1fr;
		}

		div.value-prop-text-box {
			padding: var(--spacing-xl) var(--spacing-m);
			height: 100%;
		}

		div.value-prop-text-box p {
			font-size: var(--font-body-m);
		}

		div.value-prop-text-box,
		div.value-prop-image {
			max-height: 12rem;
		}
	}
</style>
