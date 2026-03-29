<section class="service-area">
	<div class="service-area-image">
		<h2 class="long-heading">Serving Rossland, Trail, Castlegar, Nelson, and Christina Lake</h2>
		<img
			class="service-area-image-small"
			src="/assets/images/service-area-small.jpg"
			alt="Map of service area in the West Kootenays, British Columbia"
		/>
		<img
			class="service-area-image-large"
			src="/assets/images/service-area-large.jpg"
			alt="Map of service area in the West Kootenays, British Columbia"
		/>
	</div>
</section>

<style>
	/* Service Area */
	section.service-area {
		display: grid;
		grid-template-columns: 1fr;
	}

	section.service-area div.service-area-image {
		border-radius: var(--border-radius);
		overflow: hidden;
		position: relative;
		box-shadow: var(--shadow);
		max-height: 25rem;
	}

	section.service-area div.service-area-image img {
		width: 105%;
		height: 100%;
		object-fit: cover;
	}

	section.service-area div.service-area-image h2 {
		position: absolute;
		top: calc(var(--spacing-l) + var(--padding-block));
		left: var(--padding-inline);
		transform: translate(0, -50%);
	}

	@media screen and (min-width: 640px) {
		section.service-area div.service-area-image img.service-area-image-large {
			display: none;
		}

		section.service-area div.service-area-image {
			max-height: 25rem;
		}

		section.service-area div.service-area-image img.service-area-image-small {
			display: none;
		}

		section.service-area div.service-area-image img.service-area-image-large {
			display: block;
		}

		section.service-area div.service-area-image h2 {
			top: 50%;
			width: 70%;
		}
	}

	@media screen and (min-width: 768px) {
		section.service-area div.service-area-image {
			max-height: 30rem;
		}

		section.service-area div.service-area-image h2 {
			top: 50%;
			width: 60%;
		}
	}

	@media screen and (min-width: 1024px) {
		section.service-area div.service-area-image {
			max-height: unset;
		}

		section.service-area div.service-area-image h2 {
			transform: translate(0, -50%);
			width: 50%;
		}
	}
</style>
