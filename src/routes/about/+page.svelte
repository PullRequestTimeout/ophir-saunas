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
</style>
