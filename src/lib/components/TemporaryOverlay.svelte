<script lang="ts">
	import PrimaryButton from "$lib/components/PrimaryButton.svelte";
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
		const honeypot = formData.get("company");

		if (typeof honeypot === "string" && honeypot.trim() !== "") {
			form.reset();
			return;
		}

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

<main>
	<section class="temporary-hero">
		<h1 title="Ophir Mobile Saunas">
			<svg class="logo" viewBox="0 0 173 38" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M22.432 28.9064V34.9544C22.432 36.0424 22.88 37.0984 24.192 37.0984V37.4184H17.152V37.0984C18.464 37.0984 18.912 36.0424 18.912 34.9544V21.5784C18.912 20.4584 20.864 18.2504 22.432 16.6504V28.1064C23.584 29.0344 24.64 29.2264 25.728 29.2264C29.6 29.2264 31.392 25.2264 31.392 21.3864C31.392 17.8344 29.92 13.8344 26.336 13.8344C23.264 13.8344 21.248 16.6184 19.232 19.4024C17.12 22.3464 14.656 25.3224 10.08 25.3224C6.464 25.3224 3.936 23.2104 3.712 19.5944C3.616 20.1704 3.584 20.8104 3.584 21.4504C3.584 25.0664 5.248 29.2584 8.896 29.2584C11.392 29.2584 13.152 28.5864 13.728 26.6344C13.984 25.7704 14.784 25.1624 15.488 24.4264C15.776 24.1064 17.568 22.5384 17.856 22.1864C17.856 27.5304 13.536 29.8024 8.896 29.8024C3.616 29.8024 0 26.2504 0 21.4504C0 16.6504 3.616 13.0664 8.896 13.0664C13.888 13.0664 17.44 15.6904 17.76 20.2344L19.104 18.5704C19.136 18.2184 19.072 16.4264 19.072 16.0744C19.072 15.2744 18.912 13.9944 17.792 13.9944L17.664 13.6744L22.432 13.0664V14.7944C23.936 13.4504 25.344 13.0344 27.168 13.0344C32.352 13.0344 35.168 16.8744 35.168 21.2904C35.168 26.3784 31.744 29.7704 26.144 29.7704C24.832 29.7704 23.552 29.5464 22.432 28.9064ZM4.448 18.9224C4.448 22.5064 6.944 24.7144 10.016 24.7144C11.552 24.7144 12.768 24.4904 13.92 23.7224C14.176 22.7944 14.208 22.3464 14.208 21.4504C14.208 17.7704 12.576 13.6104 8.896 13.6104C6.24 13.6104 4.448 15.9144 4.448 18.9224Z"
				/>
				<path
					d="M39.9135 26.9864C39.9135 28.1064 40.2975 29.1624 41.6735 29.1624V29.4824H34.6335V29.1624C36.0095 29.1624 36.3935 28.1064 36.3935 26.9864V6.44243C36.3935 5.77043 36.2655 5.03443 35.2735 5.03443L35.1455 4.74643L39.9135 4.13843V15.0504C41.0975 13.8984 42.6975 13.2904 44.4895 13.2904C47.4975 13.2904 50.9855 14.5704 50.9855 17.7064V26.9864C50.9855 28.1064 51.3695 29.1624 52.7455 29.1624V29.4824H45.7055V29.1624C47.0815 29.1624 47.4655 28.1064 47.4655 26.9864V17.5784C47.4655 15.1144 46.0895 13.8344 44.1375 13.8344C42.5055 13.8344 41.2895 14.5704 39.9135 15.9784V26.9864Z"
				/>
				<path
					d="M56.961 27.0184C56.961 28.1384 57.345 29.1944 58.721 29.1944V29.5144H51.681V29.1944C53.057 29.1944 53.441 28.1384 53.441 27.0184V15.6584C53.441 14.9864 53.313 14.2824 52.321 14.2824L52.193 13.9624L56.961 13.3544V27.0184Z"
				/>
				<path
					d="M63.0595 27.0184C63.0595 28.1384 63.4435 29.1944 64.8195 29.1944V29.5144H57.7795V29.1944C59.1555 29.1944 59.5075 28.1384 59.5075 27.0184V15.6584C59.5075 14.9864 59.3795 14.2824 58.4195 14.2824L58.2915 13.9624L63.0595 13.3544V16.0744C64.8515 14.0584 66.3555 13.3224 68.2435 13.3224C69.5235 13.3224 70.9635 13.9304 71.7635 15.0824C72.3715 15.9464 71.9875 17.9944 70.1955 17.9944C69.0115 17.9944 68.2115 17.0984 68.2115 16.1384C68.2115 15.2104 68.6915 14.4744 69.5235 14.1864C69.1395 14.0264 68.6915 13.8664 68.3715 13.8664C66.3235 13.8664 64.9475 14.5064 63.0595 17.0664V27.0184Z"
				/>
				<path
					d="M92.8285 25.0024C92.8285 28.4584 89.0525 29.8024 85.7885 29.8024C83.2285 29.8024 80.3165 29.0024 78.4925 27.3064L78.9725 26.6984C81.0525 28.4904 83.8365 29.0664 85.7245 29.0664C87.4205 29.0664 89.5965 28.1384 89.5965 25.8024C89.5965 23.3384 86.5245 22.4424 84.1245 21.7064C83.1325 21.3864 82.2365 21.0984 81.8845 20.9384C80.1885 20.1704 79.0365 18.9864 79.0365 17.4504C79.0365 14.3144 82.4925 13.1624 85.4365 13.1624C86.7485 13.1624 88.9885 13.7704 90.7165 14.7624C92.4445 15.7544 91.8685 18.3784 89.7885 18.3784C87.5485 18.3784 87.1325 15.3704 89.3085 14.7624C88.0605 14.0264 86.7165 13.7384 85.3405 13.7384C83.9965 13.7384 82.1725 14.6984 82.1725 16.5864C82.1725 18.5384 84.0925 19.1464 86.2365 19.8504C89.3725 20.8424 92.8285 21.9944 92.8285 25.0024Z"
				/>
				<path
					d="M104.162 27.4664C103.202 28.9384 101.634 29.8344 98.9778 29.8344C95.8418 29.8344 93.0578 28.6824 93.0578 25.6424C93.0578 22.0904 96.3538 21.2264 99.5858 20.4264C101.058 20.0424 104.066 19.3064 104.066 17.3544C104.066 15.1144 102.85 13.8344 100.674 13.8344C99.0417 13.8344 96.5138 14.4104 95.0738 16.3624C95.3298 16.0104 95.8418 15.8184 96.3538 15.8184C97.1538 15.8184 98.0178 16.2984 98.0178 17.4504C98.0178 18.7304 97.0257 19.4024 96.0338 19.4344C93.8898 19.4984 93.5058 17.2584 94.6258 15.9464C96.2898 13.9944 98.4338 13.2264 101.154 13.2264C104.066 13.2264 107.618 14.6984 107.618 17.7704V27.4984C107.618 28.4264 107.906 28.8744 108.546 28.8744C108.802 28.8744 109.122 28.8104 109.506 28.6504L109.698 28.9064C109.058 29.4184 107.682 29.8344 106.498 29.8344C104.578 29.8344 104.162 28.6824 104.162 27.4664ZM96.8338 25.5144C96.8338 27.5304 97.8258 29.1624 99.4898 29.1624C101.698 29.1624 104.098 27.5304 104.098 25.4504V18.7624C103.81 19.6904 102.146 20.4264 101.09 20.7464C98.9778 21.4184 96.8338 22.1224 96.8338 25.5144Z"
				/>
				<path
					d="M135.737 13.5784C131.289 13.5784 127.385 17.5784 125.049 21.7064C122.745 25.7704 120.185 29.8984 115.961 29.8984C112.889 29.8984 109.401 28.5544 109.401 25.3864V15.5304C109.401 14.8584 109.241 14.1544 108.281 14.1544L108.153 13.8344L112.921 13.2264V25.3864C112.921 27.9464 114.232 29.2904 116.312 29.2904C117.753 29.2904 119.193 28.5544 120.537 27.1144V15.5304C120.537 14.8584 120.377 14.1544 119.417 14.1544L119.289 13.8344L124.057 13.2264V22.2184C124.857 20.7144 126.617 18.5064 127.993 16.7784L128.025 16.0424C128.057 14.7624 128.025 14.1224 126.937 14.1224L126.809 13.8024L131.545 13.2584V14.0584C132.761 13.4504 134.233 13.0344 135.801 13.0344C138.905 13.0344 143.096 14.1864 143.096 17.6424V26.9864C143.096 28.0744 144.057 29.1624 144.825 29.1624V29.4824H137.785V29.1624C138.521 29.1624 139.545 28.1064 139.545 26.9864V17.3224C139.545 14.8584 137.753 13.5784 135.737 13.5784ZM131.545 26.9864C131.545 28.1064 131.928 29.1624 133.305 29.1624V29.4824H126.265V29.1624C127.641 29.1624 127.993 28.0744 127.993 26.9864V19.6904C127.993 18.5704 129.817 16.8104 131.545 15.6904V26.9864ZM125.593 28.5864L125.753 28.8744C124.793 29.6424 123.545 29.9304 122.489 29.9304C121.401 29.9304 120.569 29.6104 120.569 29.1624C120.569 28.5864 121.401 28.1064 122.009 27.4344C123.193 26.1224 123.769 25.0664 123.961 24.7144H124.057V27.0824C124.057 28.3624 124.344 28.8104 124.825 28.8104C125.049 28.8104 125.305 28.7144 125.593 28.5864Z"
				/>
				<path
					d="M154.587 27.4664C153.627 28.9384 152.059 29.8344 149.403 29.8344C146.267 29.8344 143.483 28.6824 143.483 25.6424C143.483 22.0904 146.779 21.2264 150.011 20.4264C151.483 20.0424 154.491 19.3064 154.491 17.3544C154.491 15.1144 153.275 13.8344 151.099 13.8344C149.467 13.8344 146.939 14.4104 145.499 16.3624C145.755 16.0104 146.267 15.8184 146.779 15.8184C147.579 15.8184 148.443 16.2984 148.443 17.4504C148.443 18.7304 147.451 19.4024 146.459 19.4344C144.315 19.4984 143.931 17.2584 145.051 15.9464C146.715 13.9944 148.859 13.2264 151.579 13.2264C154.491 13.2264 158.043 14.6984 158.043 17.7704V27.4984C158.043 28.4264 158.331 28.8744 158.971 28.8744C159.227 28.8744 159.547 28.8104 159.931 28.6504L160.123 28.9064C159.483 29.4184 158.107 29.8344 156.923 29.8344C155.003 29.8344 154.587 28.6824 154.587 27.4664ZM147.259 25.5144C147.259 27.5304 148.251 29.1624 149.915 29.1624C152.123 29.1624 154.523 27.5304 154.523 25.4504V18.7624C154.235 19.6904 152.571 20.4264 151.515 20.7464C149.403 21.4184 147.259 22.1224 147.259 25.5144Z"
				/>
				<path
					d="M172.991 25.0024C172.991 28.4584 169.215 29.8024 165.951 29.8024C163.391 29.8024 160.479 29.0024 158.655 27.3064L159.135 26.6984C161.215 28.4904 163.999 29.0664 165.887 29.0664C167.583 29.0664 169.759 28.1384 169.759 25.8024C169.759 23.3384 166.687 22.4424 164.287 21.7064C163.295 21.3864 162.399 21.0984 162.047 20.9384C160.351 20.1704 159.199 18.9864 159.199 17.4504C159.199 14.3144 162.655 13.1624 165.599 13.1624C166.911 13.1624 169.151 13.7704 170.879 14.7624C172.607 15.7544 172.031 18.3784 169.951 18.3784C167.711 18.3784 167.295 15.3704 169.471 14.7624C168.223 14.0264 166.879 13.7384 165.503 13.7384C164.159 13.7384 162.335 14.6984 162.335 16.5864C162.335 18.5384 164.255 19.1464 166.399 19.8504C169.535 20.8424 172.991 21.9944 172.991 25.0024Z"
				/>
				<path
					d="M54.1249 0C54.1925 0.0338116 54.2602 0.0676231 54.3298 0.102459C54.3014 0.158063 54.273 0.213668 54.2438 0.270957C54.2067 0.344259 54.1696 0.417562 54.1313 0.493085C54.0945 0.565595 54.0576 0.638105 54.0196 0.712812C53.7259 1.32986 53.7192 2.03654 53.8732 2.69796C54.173 3.4567 54.747 4.08218 55.252 4.71313C56.1633 5.85872 56.8177 6.79839 56.7356 8.30641C56.5586 9.75453 55.613 11.0886 54.4899 11.9813C54.4371 12.0173 54.3843 12.0532 54.3298 12.0902C54.2622 12.0564 54.1946 12.0226 54.1249 11.9877C54.1583 11.9416 54.1917 11.8955 54.2262 11.8481C54.7902 11.0178 55.1015 10.0234 54.9446 9.01642C54.6594 8.02845 54.0773 7.19609 53.5102 6.35247C52.6205 5.02049 52.1396 4.09858 52.2806 2.45902C52.4949 1.39636 53.2946 0.641393 54.1249 0Z"
				/>
			</svg>
		</h1>
		<p class="text-light">Mobile sauna rentals in the West Kootenays, British Columbia</p>
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
	</section>
	<section class="temporary-contact">
		<h2 class="decorative-heading">Contact Us</h2>
		<form onsubmit={handleSubmit}>
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
			<input type="text" name="company" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
			<PrimaryButton type="submit" text="Send Message" />
		</form>
	</section>
	<section class="temporary-booking">
		<h2 class="decorative-heading">Book Now</h2>
		<script src="https://embed.ycb.me" async data-domain="ophirsaunas" data-displaymode="light"></script>
	</section>
	<footer>
		<p class="text-light">
			Website under construction by <a href="https://pixelmountain.ca" target="_blank" rel="noopener noreferrer"
				><img src="/assets/pixelmountain-logo-black.png" alt="Pixel Mountain Logo" /></a
			>
		</p>
	</footer>
</main>
{#if !!toastMessage}
	<div class="toast" transition:fly={{ y: 20, duration: 300 }}>
		<p><span class="material-icons">{icon}</span>{toastMessage}</p>
	</div>
{/if}

<style>
	main {
		position: fixed;
		inset: 0;
		background-color: var(--color-background-white);
		z-index: 9999; /* Ensure it appears above all other content */
		overflow-y: auto;
	}

	h2.decorative-heading {
		margin-bottom: var(--spacing-m);
		text-align: center;
	}

	section.temporary-hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	section.temporary-hero h1 {
		width: 20rem;
	}

	section.temporary-hero p {
		margin-top: var(--spacing-s);
		font-size: var(--font-body-l);
		max-width: 30rem;
	}

	h1 svg path {
		fill: var(--color-primary);
	}

	section.temporary-contact {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 var(--padding-inline);
	}

	div.contact-text-content {
		background-color: var(--color-background-green);
		padding: var(--spacing-l) var(--spacing-m);
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
		max-width: 600px;
		margin: 0 auto;
		margin-top: var(--spacing-l);
	}

	div.contact-text-content > div,
	div.contact-text-content > a {
		display: flex;
		gap: var(--spacing-s);
		font-size: var(--font-body-l);
		font-weight: 300;
	}
	div.contact-text-content > div span.material-icons,
	div.contact-text-content > a span.material-icons {
		transform: translateY(0.5rem);
	}

	footer p {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-s);
		font-size: var(--font-body-l);
	}

	footer p a {
		width: 220px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
	}

	form label {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
		font-size: var(--font-body-l);
		color: var(--color-primary);
	}

	form label input,
	form label textarea {
		font-size: var(--font-body-m);
		padding: var(--spacing-s);
		border: var(--border-width) solid var(--color-primary);
		border-radius: 10px;
		background-color: transparent;
		color: var(--color-primary);
	}

	form label input:focus-visible,
	form label textarea:focus-visible {
		outline: none;
		border-color: var(--color-secondary);
	}

	form label textarea {
		min-height: 150px;
		resize: none;
	}

	form .hp-field {
		position: absolute;
		left: -10000px;
		opacity: 0;
		pointer-events: none;
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
		form {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}

		form label:nth-child(5) {
			grid-column: 1 / -1;
		}
	}

	@media screen and (min-width: 1024px) {
		section.temporary-hero h1 {
			width: 30rem;
		}

		div.toast {
			width: 30rem;
			right: var(--padding-inline);
			left: unset;
			transform: unset;
		}
	}
</style>
