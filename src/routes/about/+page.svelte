<script lang="ts">
	import SeoHead from "$lib/components/SeoHead.svelte";
</script>

<SeoHead
	title="About Us | Ophir Mobile Saunas"
	description="Learn more about Ophir Mobile Saunas, a mobile sauna company based in Rossland, British Columbia. Discover our story, values, and commitment to quality craftsmanship in creating unique sauna experiences for our customers."
/>

<section class="hero">
	<div class="hero-text">
		<h1>About Us</h1>
		<h2 class="decorative-heading">An artfully built sauna for recovery and connection</h2>
		<p class="subheading">Crafted locally in British Columbia and delivered to your location</p>
	</div>
</section>
<section class="story">
	<div class="story-primary-text">
		<h2 class="long-heading">Built out of a love for winter, water, and community.</h2>
		<p class="text-light">
			Sauna has long been part of life in cold northern climates, where heat, water, and community naturally come together. The tradition invites
			people to slow down, warm up, and share quiet moments between rounds of steam and cold air. What began centuries ago as a simple wooden room and
			a fire has endured as a ritual that brings people together.
		</p>
	</div>
	<div class="story-secondary-text">
		<div class="icon-heading">
			<span class="material-icons">spa</span>
			<p>Restorative by Nature</p>
		</div>
		<p class="text-light">
			The cycle of heat and cooling has long been associated with relaxation, improved circulation, and muscle recovery. Whether used after a day
			outdoors or simply to unwind, sauna offers a natural way to slow down, reset, and support overall wellbeing.
		</p>
	</div>
</section>
<section class="sauna">
	<div class="sauna-image">
		<img src="/assets/images/about-sauna.jpg" alt="Interior of an Ophir sauna, showing the wood bench and stove" />
	</div>
	<div class="sauna-text">
		<div class="sauna-text-heading">
			<div class="icon-heading">
				<img src="/assets/svgs/maple.svg" alt="maple leaf icon" />
				<p>Canada-Made</p>
			</div>
			<h2 class="long-heading">Designed and built locally in British Columbia by expert craftsmen.</h2>
			<p class="text-light">Every detail is chosen to create a warm, balanced, and lasting sauna experience.</p>
		</div>
		<div class="sauna-text-dotpoints">
			<div class="sauna-text-dotpoint">
				<div class="icon-heading">
					<span class="material-icons">local_fire_department</span>
					<p>Woodfired Heater</p>
				</div>
				<p class="text-light">
					A traditional wood-fired heater produces a deep, even heat and rich steam that defines the authentic sauna experience.
				</p>
			</div>
			<div class="sauna-text-dotpoint">
				<div class="icon-heading">
					<span class="material-icons">park</span>
					<p>Built for the Outdoors</p>
				</div>
				<p class="text-light">Sustainably constructed with Western Red Cedar suited to the changing weather and landscapes of the West Kootenays.</p>
			</div>
			<div class="sauna-text-dotpoint">
				<div class="icon-heading">
					<span class="material-icons">groups</span>
					<p>Comfortable Size</p>
				</div>
				<p class="text-light">
					The spacious interior comfortably accommodates groups of up to 6, making it ideal for sharing the experience with friends or family.
				</p>
			</div>
			<div class="sauna-text-dotpoint">
				<div class="icon-heading">
					<span class="material-icons">local_shipping</span>
					<p>Easy Delivery</p>
				</div>
				<p class="text-light">
					The sauna is delivered, positioned, and prepared for your booking so you can focus on relaxing from the moment it arrives.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	section.hero {
		background: url(/assets/images/hero-about.jpg) center/cover no-repeat;
	}

	/* Story */
	section.story {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-l);
	}

	section.story p {
		font-size: var(--font-body-l);
		line-height: 1.3;
	}

	section.story h2,
	section.story .icon-heading {
		margin-bottom: var(--spacing-s);
	}

	section.story div.story-secondary-text {
		background-color: var(--color-background-tan);
		padding: var(--spacing-m);
		border-radius: var(--border-radius);
	}

	@media (min-width: 1024px) {
		section.story {
			grid-template-columns: 1fr 1fr;
			gap: var(--spacing-xl);
		}

		section.story div.story-secondary-text {
			padding: var(--spacing-l);
		}
	}

	/* Sauna */
	section.sauna {
		background-color: var(--color-background-green);
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-l);
	}

	section.sauna div.sauna-image {
		border-radius: var(--border-radius);
		overflow: hidden;
	}

	section.sauna div.sauna-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	section.sauna div.sauna-text {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
	}

	section.sauna div.sauna-text-heading h2,
	section.sauna div.sauna-text-dotpoint div.icon-heading {
		margin-bottom: var(--spacing-s);
	}

	section.sauna div.sauna-text-heading p {
		font-size: var(--font-body-l);
	}

	section.sauna div.sauna-text-dotpoints {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-m);
	}

	section.sauna div.sauna-text-dotpoint > p {
		font-size: var(--font-body-m);
	}

	@media (min-width: 768px) {
		section.sauna div.sauna-text-dotpoints {
			grid-template-columns: 1fr 1fr;
			gap: var(--spacing-l);
		}
	}

	@media (min-width: 1024px) {
		section.sauna {
			grid-template-columns: 1fr 1fr;
			gap: var(--spacing-xl);
		}

		section.sauna div.sauna-text {
			gap: var(--spacing-l);
		}
	}
</style>
