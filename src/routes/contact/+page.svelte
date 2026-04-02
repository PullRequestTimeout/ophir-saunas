<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
	import SeoHead from "$lib/components/SeoHead.svelte";
	import { isIntersecting } from "$lib/utils/isIntersecting";
	import SpanifyText from "$lib/components/SpanifyText.svelte";
	import { fly } from "svelte/transition";

	let toastMessage: string = $state("");
	let icon = $state("");

	function handleToast(message: string) {
		toastMessage = message;
		if (message.toLowerCase().includes("failed")) {
			icon = "error_outline";
		} else {
			icon = "mail";
		}
		setTimeout(() => {
			toastMessage = "";
		}, 3000);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		try {
			const res = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				body: formData
			});

			const data = await res.json();

			if (data.success) {
				handleToast("Thanks for reaching out! We'll get back to you as soon as we can.");
				form.reset();
			} else {
				handleToast("Form submission failed. Please try again.");
				console.error("Form submission error:", data.message);
			}
		} catch (err) {
			handleToast("Form submission failed. Please try again.");
			console.error("Form submission error:", err);
		}
	}
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
			<h2 class="long-heading heading-fade-in" use:isIntersecting>
				<SpanifyText text="Have a question?" />
			</h2>
			<p class="text-light">If there's anything you'd like to ask or talk through, please don't hesitate to reach out at any time.</p>
		</div>
		<div class="contact-text-content scroll-fade-up" use:isIntersecting>
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
	<form onsubmit={handleSubmit} class="group-stagger-fade" use:isIntersecting>
		<label
			>First Name
			<input type="text" name="first_name" placeholder="Enter first name here" required />
		</label>
		<label
			>Last Name
			<input type="text" name="last_name" placeholder="Enter last name here" required />
		</label>
		<label
			>Email
			<input type="email" name="email" placeholder="Enter email address here" required />
		</label>
		<label
			>Phone Number
			<input type="tel" name="phone" placeholder="Enter phone number here" required />
		</label>
		<label
			>Message
			<textarea name="message" placeholder="Write your message here" required></textarea>
		</label>
		<input type="hidden" name="access_key" value="d915efa9-c213-41dd-9cad-a51ca2a8571d" />
		<PrimaryButton type="submit" text="Send Message" />
	</form>
</section>
{#if !!toastMessage}
	<div class="toast" transition:fly={{ y: 20, duration: 300 }}>
		<p><span class="material-icons">{icon}</span>{toastMessage}</p>
	</div>
{/if}

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
		font-size: var(--font-body-m);
		padding: var(--spacing-s);
		border: var(--border-width) solid var(--color-primary);
		border-radius: 10px;
		background-color: transparent;
		color: var(--color-primary);
	}

	section.contact form label input:focus-visible,
	section.contact form label textarea:focus-visible {
		outline: none;
		border-color: var(--color-secondary);
	}

	section.contact form label textarea {
		min-height: 150px;
		resize: none;
	}

	div.toast {
		position: fixed;
		bottom: var(--spacing-m);
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-background-white);
		color: var(--color-primary);
		padding: var(--spacing-m) var(--spacing-l);
		border-radius: var(--spacing-m);
		border: var(--border-width) solid var(--color-primary);
		box-shadow: var(--shadow);
		font-size: var(--font-body-l);
		width: calc(100vw - var(--padding-inline) * 2);
		z-index: 1000;
		display: flex;
		justify-content: center;
	}

	div.toast p {
		display: flex;
		align-items: center;
		gap: var(--spacing-m);
	}

	div.toast p span.material-icons {
		font-size: 32px;
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

		div.toast {
			width: 20rem;
			right: var(--padding-inline);
		}
	}
</style>
