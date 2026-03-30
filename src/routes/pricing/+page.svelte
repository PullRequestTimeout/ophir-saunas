<script lang="ts">
	import SeoHead from "$lib/components/SeoHead.svelte";
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import { openBookingModal } from "$lib/utils/globalStates.svelte";
	import FAQ from "$lib/components/FAQ.svelte";
	import { homeFaqs } from "$lib/data/faqs";

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
		<h2 class="decorative-heading">Sauna Rental Rates</h2>
		<p class="text-light">Select the package that best suits you.</p>
	</div>
	<div class="pricing-section">
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
		<h3 class="long-heading">Available Add-Ons</h3>
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
	<div class="pricing-section">
		<h3 class="long-heading">Delivery Rates</h3>
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
	<PrimaryButton onAction={openBookingModal} text="Book Now" />
</section>
<FAQ faqs={homeFaqs} />

<style>
	section.hero {
		background: url(/assets/images/footer.jpg) center/cover no-repeat;
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
		margin: 0 4px;
	}

	div.pricing-item p.pricing-item-description {
		font-size: var(--font-body-m);
	}
</style>
