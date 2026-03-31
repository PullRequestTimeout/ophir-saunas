<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import SeoHead from "$lib/components/SeoHead.svelte";
</script>

<SeoHead
	title="Contact | Ophir Mobile Saunas"
	description="Get in touch with Ophir Mobile Saunas. Whether you have questions, want to book a sauna experience, or need more information, we're here to help."
/>

<section class="hero">
	<div class="hero-text">
		<h1>Contact</h1>
		<h2 class="decorative-heading">The start of a good conversation</h2>
		<p class="subheading">Whether you're just curious or ready to book, we'd love to hear from you</p>
	</div>
</section>
<section class="contact">
	<div class="contact-text">
		<div class="contact-text-heading">
			<h2 class="long-heading">Have a question?</h2>
			<p class="text-light">If there's anything you'd like to ask or talk through, please don't hesitate to reach out at any time.</p>
		</div>
		<div class="contact-text-content">
			<a href="mailto:info@ophirsaunas.ca">
				<div class="icon-heading">
					<span class="material-icons">mail</span>
					<p>Email:</p>
				</div>
				<p>info@ophirsaunas.ca</p>
			</a>
			<div>
				<div class="icon-heading">
					<span class="material-icons">location_on</span>
					<p>Location:</p>
				</div>
				<p>Rossland, BC</p>
			</div>
		</div>
	</div>
	<form action="">
		<label
			>First Name
			<input type="text" placeholder="Please enter your first name" required />
		</label>
		<label
			>Last Name
			<input type="text" placeholder="Please enter your last name" required />
		</label>
		<label
			>Email
			<input type="email" placeholder="Please enter your email address" required />
		</label>
		<label
			>Phone Number
			<input type="tel" placeholder="Please enter your phone number" required />
		</label>
		<label
			>Message
			<textarea placeholder="Write your message here" required></textarea>
		</label>
		<PrimaryButton type="submit" text="Send Message" />
	</form>
</section>

<style>
	section.hero {
		background: url(/assets/images/value-prop.jpg) center/cover no-repeat;
	}

	section.contact {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-l);
	}

	section.contact div.contact-text {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
	}

	section.contact div.contact-text div.contact-text-heading {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	section.contact div.contact-text div.contact-text-heading p {
		font-size: var(--font-body-l);
	}

	section.contact div.contact-text div.contact-text-content {
		background-color: var(--color-background-green);
		padding: var(--spacing-l) var(--spacing-m);
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
	}

	section.contact div.contact-text div.contact-text-content > div,
	section.contact div.contact-text div.contact-text-content > a {
		display: flex;
		gap: var(--spacing-s);
		font-size: var(--font-body-l);
		font-weight: 300;
	}

	section.contact form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
	}

	section.contact form label {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
		font-size: var(--font-body-l);
		color: var(--color-primary);
	}

	section.contact form label input,
	section.contact form label textarea {
		font-size: var(--font-body-s);
		padding: var(--spacing-s);
		border: var(--border-width) solid var(--color-primary);
		border-radius: 10px;
		background-color: transparent;
		color: var(--color-primary);
	}

	section.contact form label textarea {
		min-height: 150px;
		resize: none;
	}

	@media screen and (min-width: 640px) {
		section.contact form {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}

		section.contact div.contact-text {
			gap: var(--spacing-l);
		}

		section.contact form label:nth-child(5) {
			grid-column: 1 / -1;
		}
	}

	@media screen and (min-width: 1024px) {
		section.contact {
			grid-template-columns: 1fr 1fr;
		}

		section.contact div.contact-text {
			gap: var(--spacing-m);
			justify-content: space-between;
		}

		section.contact div.contact-text div.contact-text-content {
			height: 150px;
			margin-bottom: calc(var(--spacing-m) + 2rem);
		}
	}
</style>
