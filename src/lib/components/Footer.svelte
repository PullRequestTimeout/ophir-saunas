<script lang="ts">
	function handleCookiePopup() {
		// Placeholder function for cookie popup logic
		alert("Cookie settings popup would appear here.");
	}

	let cookiePopupVisible = $state(false);
</script>

<footer>
	<div class="green-overlay">
		<div class="footer-body">
			<div class="footer-heading">
				<img src="/assets/ophir-logo.svg" alt="Ophir Saunas Logo" />
				<p class="semi-bold">Delivering relaxation right to your door in the West Kootenays of British Columbia.</p>
			</div>
			<div class="footer-quick-links">
				<p class="footer-subheading">Quick Links</p>
				<div>
					<a href="/">Home</a>
					<a href="/about">About Us</a>
					<a href="/pricing">Pricing</a>
					<a href="/contact">Contact</a>
				</div>
			</div>
			<div class="footer-contact">
				<p class="footer-subheading">Contact Us</p>
				<div>
					<p><span class="material-icons">phone</span><a href="tel:+12505551234"> +1 (250) 555-1234</a></p>
					<p><span class="material-icons">email</span> <a href="mailto:info@ophirsaunas.com">info@ophirsaunas.com</a></p>
					<p><span class="material-icons">location_on</span>Rossland, British Columbia</p>
				</div>
			</div>
			<div class="footer-policy">
				<p class="footer-subheading">Policy</p>
				<div>
					<button onclick={handleCookiePopup}>Cookies</button>
					<a href="/privacy">Privacy Policy</a>
				</div>
			</div>
		</div>
		<div class="footer-bottom">
			<div class="footer-socials">
				<a href="https://www.facebook.com/ophirsaunas" target="_blank" rel="noopener noreferrer">
					<span class="material-icons">facebook</span>
				</a>
				<a href="https://www.instagram.com/ophirsaunas" aria-label="instagram" target="_blank" rel="noopener noreferrer">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather feather-instagram"
						><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line
							x1="17.5"
							y1="6.5"
							x2="17.51"
							y2="6.5"
						></line></svg
					>
				</a>
			</div>
			<hr />
			<div class="footer-copyright">
				<p>&copy; {new Date().getFullYear()} Ophir Saunas</p>
				<a href="https://pixelmountain.ca/" target="_blank" rel="noopener noreferrer">
					<img src="/assets/pixelmountain-logo.png" alt="Pixel Mountain Logo" />
				</a>
			</div>
		</div>
	</div>
</footer>

<style>
	footer {
		background: url(/assets/images/footer.jpg) center/cover no-repeat;
		color: var(--color-white);
		padding: 0;
	}

	div.green-overlay,
	div.footer-body,
	div.footer-bottom {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-m);
	}

	div.footer-heading {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	div.footer-heading img {
		width: 12rem;
	}

	div.footer-heading p {
		font-size: var(--font-body-m);
		font-weight: 300;
	}

	p.footer-subheading {
		font-weight: 700;
		margin-bottom: var(--spacing-s);
	}

	footer div.green-overlay {
		background-color: #333d29e6;
		width: 100%;
		height: 100%;
		padding: var(--padding-block) var(--padding-inline);
		backdrop-filter: brightness(0.75);
	}

	div.footer-quick-links > div,
	div.footer-policy > div {
		display: grid;
		gap: var(--spacing-m);
		grid-template-columns: 1fr 1fr;
	}

	div.footer-policy > div a,
	div.footer-quick-links > div a,
	div.footer-policy > div button,
	div.footer-body p {
		font-size: var(--font-body-m);
	}

	div.footer-contact > div {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
	}

	div.footer-contact > div > p {
		display: flex;
		align-items: center;
		gap: var(--spacing-s);
	}

	div.footer-policy > div button {
		background: none;
		border: none;
		color: var(--color-white);
		cursor: pointer;
		padding: 0;
		width: fit-content;
	}

	div.footer-socials {
		display: flex;
		gap: var(--spacing-m);
	}

	div.footer-socials a {
		width: fit-content;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	div.footer-socials a span {
		font-size: 32px;
	}

	hr {
		border: 0;
		border-top: var(--border-width) solid var(--color-white);
	}

	div.footer-copyright {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-s);
	}

	div.footer-copyright a img {
		width: 150px;
	}

	span.material-icons {
		color: var(--color-white);
		font-size: 24px;
	}

	@media screen and (min-width: 1024px) {
		div.footer-body {
			grid-template-columns: 2fr 1fr 1.5fr auto;
			gap: var(--spacing-xl);
		}

		div.footer-policy > div,
		div.footer-quick-links > div {
			grid-template-columns: 1fr;
		}

		p.footer-subheading {
			margin-top: var(--spacing-m);
		}

		div.footer-policy > div a,
		div.footer-quick-links > div a,
		div.footer-policy > div button,
		div.footer-body p {
			font-size: var(--font-body-m);
		}

		div.footer-heading p {
			font-size: var(--font-body-l);
		}
	}
</style>
