<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import SeoHead from "$lib/components/SeoHead.svelte";
	import FAQ from "$lib/components/FAQ.svelte";
	import ServiceArea from "$lib/components/ServiceArea.svelte";
	import { openBookingModal } from "$lib/utils/globalStates.svelte";
	import { homeFaqs } from "$lib/data/faqs";
	import { isIntersecting } from "$lib/utils/isIntersecting";
	import SpanifyText from "$lib/components/SpanifyText.svelte";
</script>

<!-- Default SEO head content -->
<SeoHead />

<section class="hero">
	<div class="hero-text">
		<h2 class="decorative-heading">Relaxation delivered right to your door</h2>
		<p class="subheading">Mobile sauna rentals in the West Kootenays, British Columbia</p>
		<PrimaryButton onAction={openBookingModal} text="Book Now" />
	</div>
</section>
<section class="value-prop">
	<div class="value-prop-row1">
		<div class="value-prop-heading">
			<h3 class="long-heading heading-fade-in" use:isIntersecting>
				<SpanifyText text="Bring wellness to your backyard, retreat, or cabin weekend." />
			</h3>
			<p class="text-light">Elevate any gathering with a rejuvenating experience.</p>
		</div>
		<div class="value-prop-bullets group-stagger-fade" use:isIntersecting>
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
	<div class="value-prop-row2 group-stagger-fade" use:isIntersecting>
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
<section class="howitworks">
	<div class="howitworks-heading">
		<h2 class="decorative-heading heading-fade-in" use:isIntersecting>
			<SpanifyText text="How it works" />
		</h2>
		<p class="text-light">Reservation to relaxation in just a few simple steps</p>
	</div>
	<div class="howitworks-steps">
		<div class="howitworks-step-card scroll-fade-up" use:isIntersecting>
			<div class="howitworks-step-card-icon">
				<img src="/assets/svgs/calendar.svg" alt="calendar icon" />
			</div>
			<div class="howitworks-step-card-text">
				<p class="text-semi-bold">1. Choose your date</p>
				<p class="text-light">Select your preferred dates and secure your booking in just a few minutes.</p>
			</div>
		</div>
		<div class="howitworks-step-card scroll-fade-up" use:isIntersecting>
			<div class="howitworks-step-card-icon">
				<img src="/assets/svgs/truck.svg" alt="truck icon" />
			</div>
			<div class="howitworks-step-card-text">
				<p class="text-semi-bold">2. We Deliver & Set Up</p>
				<p class="text-light">We bring the sauna to your location, position it safely, and get everything ready for use.</p>
			</div>
		</div>
		<div class="howitworks-step-card scroll-fade-up" use:isIntersecting>
			<div class="howitworks-step-card-icon">
				<img src="/assets/svgs/sauna.svg" alt="sauna icon" />
			</div>
			<div class="howitworks-step-card-text">
				<p class="text-semi-bold">3. Heat, relax, repeat</p>
				<p class="text-light">Fire it up, settle in, and enjoy the rhythm of hot and cold at your own pace.</p>
			</div>
		</div>
		<img src="/assets/svgs/arrow.svg" alt="arrow pointing down" class="howitworks-arrow" />
	</div>
	<PrimaryButton onAction={openBookingModal} text="Check Availability" primary={false} />
</section>
<section class="sauna-preview">
	<div class="sauna-preview-images group-stagger-fade" use:isIntersecting>
		<img src="/assets/images/sauna-preview-1.png" alt="Sauna interior with wood stove and bench seating" />
		<img src="/assets/images/sauna-preview-2.jpg" alt="Sauna exterior with wood stove and bench seating" />
		<img src="/assets/images/sauna-preview-3.jpg" alt="Sauna exterior with wood stove and bench seating" />
	</div>
	<div class="sauna-preview-text">
		<div class="sauna-preview-heading">
			<div class="icon-heading">
				<img src="/assets/svgs/maple-leaf.svg" alt="maple leaf icon" />
				<p>Canada-Made</p>
			</div>
			<h3 class="long-heading heading-fade-in" use:isIntersecting>
				<SpanifyText text="Designed and built locally in British Columbia by expert craftsmen." />
			</h3>
			<p class="text-light">Every detail is chosen to create a warm, balanced, and lasting sauna experience.</p>
			<PrimaryButton href="/about" text="Learn More" />
		</div>
		<div class="sauna-preview-dotpoints group-stagger-fade" use:isIntersecting>
			<div class="sauna-preview-dotpoint">
				<span class="material-icons">check_circle_outline</span>
				<p>Seats up to 6 in comfort</p>
			</div>
			<div class="sauna-preview-dotpoint">
				<span class="material-icons">check_circle_outline</span>
				<p>Premium wood-fire heating for operation anywhere</p>
			</div>
			<div class="sauna-preview-dotpoint">
				<span class="material-icons">check_circle_outline</span>
				<p>Constructed from sustainably sourced Western Red Cedar</p>
			</div>
			<div class="sauna-preview-dotpoint">
				<span class="material-icons">check_circle_outline</span>
				<p>Cold plunge and premium quality towels available</p>
			</div>
		</div>
	</div>
</section>
<ServiceArea />
<section class="pricing-preview">
	<div class="pricing-preview-text">
		<h2 class="long-heading heading-fade-in" use:isIntersecting>
			<SpanifyText text="A private sauna experience designed to help you unwind, recover, and reconnect – wherever you are." />
		</h2>
		<p class="text-light">Packages starting from $300.</p>
		<PrimaryButton href="/pricing" text="View Packages" primary />
	</div>
	<img src="/assets/images/footer.jpg" alt="Sauna interior" use:isIntersecting class="scroll-fade-up" />
</section>
<FAQ faqs={homeFaqs} />

<style>
	section.hero {
		background: url(/assets/images/hero-home.jpg) center/cover no-repeat;
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

	div.value-prop-text-box > p:first-child {
		font-size: var(--font-body-l);
	}

	div.value-prop-bullet > p,
	div.value-prop-text-box > p:last-child {
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
		gap: var(--spacing-s);
		justify-content: center;
	}

	div.value-prop-text-box:last-child {
		border: var(--border-width) solid var(--color-primary-transparent);
	}

	@media screen and (min-width: 640px) {
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
			padding: var(--spacing-m);
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

	/* How it works */
	section.howitworks {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-m);
		padding: 0 var(--padding-inline) var(--padding-block) var(--padding-inline);
	}

	section.howitworks div.howitworks-heading {
		text-align: center;
	}

	section.howitworks div.howitworks-heading p {
		font-size: var(--font-body-l);
	}

	div.howitworks-steps {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
		align-items: center;
	}

	div.howitworks-step-card {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr;
		width: 20rem;
		max-width: calc(100vw - 2 * var(--padding-inline));
		height: 6rem;
		min-height: fit-content;
		background-color: var(--color-background-white);
		border-radius: var(--border-radius);
		border: var(--border-width) solid var(--color-primary-transparent);
		box-shadow: var(--shadow);
		overflow: hidden;
		z-index: 1;
	}

	div.howitworks-step-card p:first-child {
		font-size: var(--font-body-m);
	}

	div.howitworks-step-card p:last-child {
		font-size: var(--font-body-s);
	}

	div.howitworks-step-card-icon {
		padding: var(--spacing-xs) var(--spacing-m);
		background-color: var(--color-background-green);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	div.howitworks-step-card-icon img {
		width: 3rem;
	}

	div.howitworks-step-card-text {
		padding: var(--spacing-s) var(--spacing-s);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
		justify-content: center;
	}

	img.howitworks-arrow {
		display: none;
	}

	@media screen and (min-width: 768px) {
		div.howitworks-steps {
			margin: var(--spacing-l) 0;
			gap: var(--spacing-m);
		}

		img.howitworks-arrow {
			display: block;
			position: absolute;
			bottom: -2.4rem;
			height: 120%;
		}

		div.howitworks-step-card {
			width: 25rem;
			height: 7rem;
		}

		div.howitworks-step-card p:last-child {
			font-size: var(--font-body-m);
		}

		div.howitworks-step-card:first-child {
			translate: -6rem 0;
		}

		div.howitworks-step-card:nth-child(2) {
			translate: 6rem 0;
		}

		div.howitworks-step-card:nth-child(3) {
			translate: -3rem -0.25rem;
		}
	}

	@media screen and (min-width: 1024px) {
		div.howitworks-steps {
			gap: var(--spacing-l);
			margin: 3rem 0;
		}

		img.howitworks-arrow {
			bottom: -3rem;
		}

		div.howitworks-step-card {
			width: 30rem;
			height: 8rem;
		}

		div.howitworks-step-card-icon img {
			width: 5rem;
		}

		div.howitworks-step-card-text {
			padding: var(--spacing-m);
		}

		div.howitworks-step-card:first-child {
			translate: -10rem 0;
		}

		div.howitworks-step-card:nth-child(2) {
			translate: 10rem 0;
		}

		div.howitworks-step-card:nth-child(3) {
			translate: -7rem -0.5rem;
		}

		@media screen and (min-width: 1280px) {
			div.howitworks-step-card {
				height: 9rem;
			}
		}
	}

	/* Sauna Preview */

	section.sauna-preview {
		background-color: var(--color-background-tan);
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-l);
	}

	div.sauna-preview-images {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: 12rem 8rem;
		gap: var(--spacing-m);
	}

	div.sauna-preview-images img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--border-radius);
	}

	div.sauna-preview-images img:first-child {
		grid-column: 1 / 3;
	}

	div.sauna-preview-text {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-l);
	}

	div.sauna-preview-heading {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	div.sauna-preview-heading div.icon-heading {
		margin-bottom: -0.5rem;
	}

	div.sauna-preview-heading > p.text-light {
		font-size: var(--font-body-l);
		margin-bottom: var(--spacing-m);
	}

	div.sauna-preview-dotpoints {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-m);
	}

	div.sauna-preview-dotpoint {
		display: flex;
		gap: var(--spacing-s);
	}

	div.sauna-preview-dotpoint span {
		translate: 0 1px;
	}

	div.sauna-preview-dotpoint p {
		font-size: var(--font-body-l);
		font-weight: 300;
		color: var(--color-primary);
	}

	@media screen and (min-width: 640px) {
		div.sauna-preview-images {
			grid-template-rows: 10rem 10rem;
		}

		div.sauna-preview-dotpoints {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media screen and (min-width: 1024px) {
		section.sauna-preview {
			grid-template-columns: 1fr 1fr;
		}

		div.sauna-preview-images {
			grid-template-rows: 16rem 12rem;
		}

		div.sauna-preview-text {
			justify-content: space-between;
		}

		div.sauna-preview-dotpoints {
			grid-template-columns: 1fr;
		}
	}

	@media screen and (min-width: 1280px) {
		div.sauna-preview-images {
			grid-template-rows: 20rem 16rem;
		}
	}

	/* Pricing Preview */
	section.pricing-preview {
		background-color: var(--color-background-green);
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 10rem;
		gap: var(--spacing-l);
	}

	div.pricing-preview-text h2 {
		text-wrap: unset;
	}

	div.pricing-preview-text {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	div.pricing-preview-text p {
		font-size: var(--font-body-l);
		margin-bottom: var(--spacing-s);
	}

	section.pricing-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--border-radius);
	}

	@media screen and (min-width: 1024px) {
		section.pricing-preview {
			grid-template-columns: 1.5fr 1fr;
			grid-template-rows: 12rem;
		}

		div.pricing-preview-text {
			justify-content: center;
		}
	}

	@media screen and (min-width: 1280px) {
		section.pricing-preview {
			grid-template-rows: 14rem;
		}
	}
</style>
