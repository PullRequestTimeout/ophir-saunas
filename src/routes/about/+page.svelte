<script lang="ts">
	import SeoHead from "$lib/components/SeoHead.svelte";
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import ServiceArea from "$lib/components/ServiceArea.svelte";
	import { openBookingModal } from "$lib/utils/globalStates.svelte";
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
<section class="gallery">
	<div class="gallery-heading">
		<h2 class="decorative-heading">Experience the restoration</h2>
		<p class="text-light">
			The sauna invites a simple rhythm: warm up, cool down, and rest. It’s a quiet ritual that leaves both body and mind feeling renewed.
		</p>
		<div class="gallery-cta-buttons">
			<PrimaryButton onAction={openBookingModal} text="Book Now" />
			<PrimaryButton href="/contact" text="Ask a Question" primary={false} />
		</div>
	</div>
	<div class="gallery-image-grid">
		<div class="gallery-image">
			<img src="/assets/images/sauna-preview-1.png" alt="Sauna interior with wooden benches and stove" />
		</div>
		<div class="gallery-image">
			<img src="/assets/images/footer.jpg" alt="Interior of the sauna with someone sitting on the bench and steam rising from the stove" />
		</div>
		<div class="gallery-image">
			<img src="/assets/images/sauna-preview-2.jpg" alt="Sauna exterior in a snowy landscape with pine trees in the background" />
		</div>
		<div class="gallery-image">
			<img src="/assets/images/sauna-preview-2.jpg" alt="Sauna exterior in a snowy landscape with pine trees in the background" />
		</div>
		<div class="gallery-image">
			<img src="/assets/images/sauna-preview-3.jpg" alt="Detail of the sauna stove with a kettle on top and steam rising from it" />
		</div>
		<div class="gallery-image">
			<img src="/assets/images/value-prop.jpg" alt="Sauna interior with view out of the window showing a lake and mountains in the background" />
		</div>
	</div>
</section>
<section class="whoitsfor">
	<div class="whoitsfor-heading">
		<h2 class="long-heading">Perfect for shared moments and quiet resets alike.</h2>
		<p class="text-light">
			From small gatherings to post-adventure recovery, the sauna creates a warm space to slow down, reconnect, and enjoy the moment.
		</p>
	</div>
	<div class="whoitsfor-dotpoints">
		<div class="whoitsfor-dotpoint">
			<div class="icon-heading">
				<span class="material-icons">cabin</span>
				<p>Cabin Weekends</p>
			</div>
			<p class="text-light">A traditional wood-fired heater produces a deep, even heat and rich steam that defines the authentic sauna experience.</p>
		</div>
		<div class="whoitsfor-dotpoint">
			<div class="icon-heading">
				<span class="material-icons">outdoor_grill</span>
				<p>Backyard Gatherings</p>
			</div>
			<p class="text-light">
				Turn an ordinary evening at home into something memorable, with warmth, conversation, and a simple ritual everyone can enjoy.
			</p>
		</div>
		<div class="whoitsfor-dotpoint">
			<div class="icon-heading">
				<span class="material-icons">downhill_skiing</span>
				<p>Adventure Recovery</p>
			</div>
			<p class="text-light">After long days skiing, riding, paddling, or hiking, the deep heat of the sauna helps the body relax and recover.</p>
		</div>
		<div class="whoitsfor-dotpoint">
			<div class="icon-heading">
				<span class="material-icons">self_improvement</span>
				<p>Retreats & Events</p>
			</div>
			<p class="text-light">
				A unique and memorable addition to wellness retreats, workshops, and small gatherings centred around rest and connection.
			</p>
		</div>
	</div>
</section>
<ServiceArea />

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

	/* Gallery */
	section.gallery {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-l);
	}

	section.gallery div.gallery-heading {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-s);
		width: 80%;
		margin: 0 auto;
	}

	section.gallery div.gallery-heading p {
		font-size: var(--font-body-l);
		margin-bottom: var(--spacing-m);
	}

	section.gallery div.gallery-cta-buttons {
		display: flex;
		gap: var(--spacing-m);
		align-items: center;
	}

	section.gallery div.gallery-image-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-m);
	}

	section.gallery div.gallery-image-grid div.gallery-image {
		border-radius: var(--border-radius);
		overflow: hidden;
	}

	section.gallery div.gallery-image-grid div.gallery-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (min-width: 600px) {
		section.gallery div.gallery-image-grid {
			grid-template-columns: 1fr 1fr;
		}

		section.gallery div.gallery-image {
			height: 12rem;
		}

		section.gallery div.gallery-image-grid div.gallery-image:first-child,
		section.gallery div.gallery-image-grid div.gallery-image:nth-child(4) {
			grid-column: 1/3;
		}
	}

	@media (min-width: 1024px) {
		section.gallery div.gallery-image-grid {
			grid-template-columns: repeat(4, 1fr);
		}

		section.gallery div.gallery-image {
			height: 14rem;
		}

		section.gallery div.gallery-image-grid div.gallery-image:nth-child(4) {
			grid-column: unset;
		}

		section.gallery div.gallery-image-grid div.gallery-image:last-child {
			grid-column: 3/5;
		}
	}

	@media (hover: hover) {
		section.gallery div.gallery-image-grid div.gallery-image img {
			transition: transform 0.3s ease;
		}

		section.gallery div.gallery-image-grid div.gallery-image img:hover {
			transform: scale(1.05);
		}
	}

	/* Who It's For */
	section.whoitsfor {
		padding: 0 var(--padding-inline);
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-l);
	}

	section.whoitsfor div.whoitsfor-heading h2,
	section.whoitsfor div.whoitsfor-dotpoint div.icon-heading {
		margin-bottom: var(--spacing-s);
	}

	section.whoitsfor div.whoitsfor-heading p {
		font-size: var(--font-body-l);
	}

	section.whoitsfor div.whoitsfor-dotpoints {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-m);
	}

	@media (min-width: 768px) {
		section.whoitsfor div.whoitsfor-dotpoints {
			grid-template-columns: 1fr 1fr;
			gap: var(--spacing-l) var(--spacing-xl);
		}
	}

	@media (min-width: 1024px) {
		section.whoitsfor div.whoitsfor-heading {
			width: 80%;
		}
	}

	@media (min-width: 1280px) {
		section.whoitsfor div.whoitsfor-dotpoints {
			grid-template-columns: repeat(4, 1fr);
			gap: var(--spacing-l);
		}
	}
</style>
