<script lang="ts">
	import SeoHead from "$lib/components/SeoHead.svelte";
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import { openBookingModal } from "$lib/utils/globalStates.svelte";
	import FAQ from "$lib/components/FAQ.svelte";
	import { homeFaqs } from "$lib/data/faqs";
	import { isIntersecting } from "$lib/utils/isIntersecting";
	import SpanifyText from "$lib/components/SpanifyText.svelte";

	const pricing = {
		rentalRates: [
			{
				title: "1 Night Mid-Week Rental*",
				price: "$300",
				description: "*Delivery must be scheduled for Monday through Thursday."
			},
			{
				title: "2 Night Mid-Week Rental*",
				price: "$350",
				description: "*Delivery must be scheduled for Monday through Wednesday."
			},
			{
				title: "3 Night Weekend Rental*",
				price: "$450",
				description:
					"*Friday Delivery, Monday Pickup. Delivery to your property or secure location on Friday at agreed upon time. Pick up scheduled for following Monday."
			},
			{
				title: "4 Night Weekday Rental*",
				price: "$450",
				description:
					"*Monday Delivery, Friday Pickup. 4 for the cost of 3! Delivery to your property or secure location on Monday & picked up Friday morning of the same week."
			}
		],
		addOns: [
			{
				title: "3 Hour Burn Wood Bundle",
				price: "$40",
				description: ""
			},
			{
				title: "6 Hour Burn Wood Bundle",
				price: "$80",
				description: ""
			},
			{
				title: "9 Hour Burn Wood Bundle",
				price: "$120",
				description: ""
			},
			{
				title: "Cold Plunge Pool Rental",
				price: "$50",
				description: ""
			}
		],
		deliveryRates: [
			{
				title: "Rossland",
				price: "$25",
				description: ""
			},
			{
				title: "Warfield",
				price: "$30",
				description: ""
			},
			{
				title: "Trail",
				price: "$35",
				description: ""
			},
			{
				title: "Montrose, Fruitvale, & Genelle",
				price: "$40",
				description: ""
			},
			{
				title: "Castlegar & Robson",
				price: "$60",
				description: ""
			},
			{
				title: "Nelson & Christina Lake",
				price: "$100",
				description: ""
			}
		]
	};
</script>

<SeoHead
	title="Pricing | Ophir Mobile Saunas"
	description="Discover the pricing options for Ophir Mobile Saunas, a mobile sauna company based in Rossland, British Columbia. Explore our packages and find the perfect sauna experience for your needs."
/>

<section class="hero">
	<div class="hero-text">
		<h1>Pricing</h1>
		<h2 class="decorative-heading">Simple options for slowing down</h2>
		<p class="subheading">Choose the package that fits your plans and we'll take care of the rest</p>
	</div>
</section>
<section class="pricing">
	<div class="pricing-heading">
		<h2 class="decorative-heading heading-fade-in" use:isIntersecting>
			<SpanifyText text="Sauna Rental Rates" />
		</h2>
		<p class="text-light">Select the package that best suits you.</p>
	</div>
	<div class="pricing-section group-stagger-fade" use:isIntersecting>
		{#each pricing.rentalRates as rate}
			<div class="pricing-item">
				<div class="pricing-item-heading">
					<p>{rate.title}</p>
					<div></div>
					<p>{rate.price}</p>
				</div>
				{#if rate.description.length > 0}
					<p class="text-light pricing-item-description">{rate.description}</p>
				{/if}
			</div>
		{/each}
	</div>
	<div class="pricing-section">
		<h3 class="long-heading heading-fade-in" use:isIntersecting>
			<SpanifyText text="Available Add-Ons" />
		</h3>
		<div class="pricing-section group-stagger-fade" use:isIntersecting>
			{#each pricing.addOns as addOn}
				<div class="pricing-item">
					<div class="pricing-item-heading">
						<p>{addOn.title}</p>
						<div></div>
						<p>{addOn.price}</p>
					</div>
					{#if addOn.description.length > 0}
						<p class="text-light pricing-item-description">{addOn.description}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div class="pricing-section">
		<h3 class="long-heading heading-fade-in" use:isIntersecting>
			<SpanifyText text="Delivery Rates" />
		</h3>
		<div class="pricing-section group-stagger-fade" use:isIntersecting>
			{#each pricing.deliveryRates as rate}
				<div class="pricing-item">
					<div class="pricing-item-heading">
						<p>{rate.title}</p>
						<div></div>
						<p>{rate.price}</p>
					</div>
					{#if rate.description.length > 0}
						<p class="text-light pricing-item-description">{rate.description}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<PrimaryButton onAction={openBookingModal} text="Book Now" />
</section>
<section class="sauna-preview">
	<div class="sauna-preview-images group-stagger-fade" use:isIntersecting>
		<div class="sauna-preview-image">
			<img src="/assets/images/sauna-preview-1.png" alt="Sauna interior with wood stove and bench seating" />
		</div>
		<div class="sauna-preview-image">
			<img src="/assets/images/sauna-preview-2.jpg" alt="Sauna exterior with wood stove and bench seating" />
		</div>
		<div class="sauna-preview-image">
			<img src="/assets/images/sauna-preview-3.jpg" alt="Sauna exterior with wood stove and bench seating" />
		</div>
	</div>
	<div class="sauna-preview-text">
		<div class="sauna-preview-heading">
			<div class="icon-heading">
				<img src="/assets/svgs/package.svg" alt="package icon" />
				<p>Complete Package</p>
			</div>
			<h2 class="long-heading heading-fade-in" use:isIntersecting>
				<SpanifyText text="Everything you need for a complete sauna experience" />
			</h2>
			<p class="text-light">
				Each rental is thoughtfully equipped and prepared, so you can focus on relaxing from the moment the heat begins to build.
			</p>
			<PrimaryButton onAction={openBookingModal} text="Check Availability" />
		</div>
		<div class="sauna-preview-dotpoints group-stagger-fade" use:isIntersecting>
			<div class="sauna-preview-dotpoint">
				<span class="material-icons">check_circle_outline</span>
				<p>Wood-fired Sauna Heater</p>
			</div>
			<div class="sauna-preview-dotpoint">
				<span class="material-icons">check_circle_outline</span>
				<p>Sauna stones, water bucket, and ladle for steam</p>
			</div>
			<div class="sauna-preview-dotpoint">
				<span class="material-icons">check_circle_outline</span>
				<p>Interior bench seating for up to 6</p>
			</div>
			<div class="sauna-preview-dotpoint">
				<span class="material-icons">check_circle_outline</span>
				<p>Fully cleaned and prepared before each booking</p>
			</div>
		</div>
	</div>
</section>
<FAQ faqs={homeFaqs} />

<style>
	section.hero {
		background: url(/assets/images/footer.jpg) center/cover no-repeat;
		height: calc(var(--vh) * 80);
	}

	/* Pricing */
	section.pricing {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-l);
	}

	section.pricing div.pricing-heading {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-s);
	}

	section.pricing div.pricing-heading p {
		font-size: var(--font-body-l);
	}

	section.pricing div.pricing-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
	}

	section.pricing div.pricing-section h3 {
		margin-bottom: var(--spacing-s);
	}

	section.pricing div.pricing-section div.pricing-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	section.pricing div.pricing-section div.pricing-item div.pricing-item-heading {
		color: var(--color-primary);
		font-weight: 600;
		font-size: var(--font-body-l);
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	section.pricing div.pricing-section div.pricing-item div.pricing-item-heading p {
		min-width: fit-content;
	}

	section.pricing div.pricing-section div.pricing-item div.pricing-item-heading div {
		border-bottom: var(--border-width) dotted var(--color-primary);
		width: 100%;
		height: 1rem;
		margin: 0 0.5rem;
	}

	div.pricing-item p.pricing-item-description {
		font-size: var(--font-body-m);
	}

	/* Sauna Preview */
	section.sauna-preview {
		background-color: var(--color-background-green);
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

	div.sauna-preview-images div.sauna-preview-image {
		border-radius: var(--border-radius);
		overflow: hidden;
	}

	div.sauna-preview-images img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	div.sauna-preview-images div.sauna-preview-image:first-child {
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
</style>
