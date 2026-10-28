<script lang="ts">
	import { page } from "$app/state";

	let { data, children } = $props();

	const links = [
		{ href: "/admin", label: "Overview", icon: "dashboard" },
		{ href: "/admin/bookings", label: "Bookings", icon: "event" },
		{ href: "/admin/drop-ins", label: "Drop-ins", icon: "groups" },
		{ href: "/admin/time-off", label: "Time Off", icon: "beach_access" },
		{ href: "/admin/pricing", label: "Pricing", icon: "sell" },
		{ href: "/admin/help", label: "Help", icon: "help_outline" },
		{ href: "/admin/settings", label: "Settings", icon: "settings" }
	];

	const isActive = (href: string) => (href === "/admin" ? page.url.pathname === "/admin" : page.url.pathname.startsWith(href));
</script>

<a class="skip" href="#main">Skip to content</a>
<div class="shell">
	<header>
		<a href="/admin" class="brand">
			<img src="/assets/svgs/logo-inverted.svg" alt="" />
			<span>Ophir Admin</span>
		</a>
		<nav aria-label="Admin">
			{#each links as link (link.href)}
				<a href={link.href} aria-current={isActive(link.href) ? "page" : undefined}>
					<span class="material-icons" aria-hidden="true">{link.icon}</span>
					<span>{link.label}</span>
				</a>
			{/each}
		</nav>
		<div class="account">
			<a href="/" class="view-site">View site</a>
			<p>{data.admin?.email}</p>
			<form method="POST" action="/admin/logout">
				<button class="btn" type="submit" aria-label="Sign out {data.admin?.email ?? ''}"
					><span class="material-icons" aria-hidden="true">logout</span><span>Sign out</span></button
				>
			</form>
		</div>
	</header>
	<main id="main" tabindex="-1">
		{@render children()}
	</main>
</div>

<style>
	a.skip {
		position: absolute;
		top: var(--spacing-s);
		left: var(--spacing-s);
		z-index: 10;
		padding: var(--spacing-s) var(--spacing-m);
		border-radius: var(--border-radius);
		background-color: var(--color-background-white);
		color: var(--color-primary);
		font-weight: 600;
		transform: translateY(-200%);
	}

	a.skip:focus {
		transform: none;
	}

	div.shell {
		min-height: 100vh;
		min-height: 100dvh;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-content: start;
	}

	header {
		background-color: var(--color-primary);
		padding: var(--spacing-m);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-m);
		min-width: 0;
	}

	/* The site-wide focus ring is primary green, which disappears on the dark header */
	header :global(a:focus-visible),
	header :global(button:focus-visible) {
		outline: 3px solid var(--color-background-white);
		outline-offset: 2px;
	}

	a.brand {
		display: flex;
		align-items: center;
		gap: var(--spacing-s);
		font-size: var(--font-heading-s);
		color: var(--color-white);
		width: fit-content;
	}

	/* global.css gives every non-heading element the body font, so the heading font goes on the span itself.
	   Abigail sits high in its line box; trimming to the cap height centres it on the logo. */
	a.brand span {
		font-family: var(--font-heading);
		text-box: trim-both cap alphabetic;
	}

	/* Optical nudge: the logo's ink is bottom-heavy, so geometric centring reads as sitting low */
	a.brand img {
		width: 2rem;
		translate: 0 -0.25rem;
	}

	/* Wraps into a grid on small screens so every section stays visible */
	nav {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
		gap: var(--spacing-xs);
	}

	nav a {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: var(--spacing-s);
		border-radius: 12px;
		color: var(--color-background-white);
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
		transition: background-color 0.2s ease-out;
	}

	nav a span.material-icons {
		font-size: 20px;
		color: inherit;
	}

	/* Stacked under the icon on small screens, the label keeps its full line height */
	nav a span:not(.material-icons) {
		text-box: normal;
	}

	nav a[aria-current="page"] {
		background-color: var(--color-background-white);
		color: var(--color-primary);
	}

	@media (hover: hover) {
		nav a:not([aria-current="page"]):hover {
			background-color: var(--color-primary-light);
		}
	}

	div.account {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-s);
	}

	div.account p {
		display: none;
		color: var(--color-background-white);
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	div.account a.view-site {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		color: var(--color-background-white);
		font-size: 14px;
		text-decoration: underline;
	}

	div.account :global(.btn) {
		border-color: var(--color-background-white);
		color: var(--color-background-white);
	}

	main {
		padding: var(--spacing-l) var(--spacing-m);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-l);
		min-width: 0;
	}

	main:focus {
		outline: none;
	}

	@media screen and (min-width: 1024px) {
		div.shell {
			grid-template-columns: 15rem minmax(0, 1fr);
		}

		header {
			position: sticky;
			top: 0;
			height: 100vh;
			height: 100dvh;
			overflow-y: auto;
			padding: var(--spacing-l) var(--spacing-m);
		}

		nav {
			display: flex;
			flex-direction: column;
			margin-bottom: auto;
		}

		nav a {
			flex-direction: row;
			gap: var(--spacing-s);
			padding: var(--spacing-s) var(--spacing-m);
			border-radius: var(--border-radius);
			font-size: 16px;
		}

		nav a span:not(.material-icons) {
			text-box: trim-both cap alphabetic;
		}

		div.account {
			flex-direction: column;
			align-items: flex-start;
		}

		div.account p {
			display: block;
			max-width: 100%;
		}

		div.account a.view-site {
			min-height: 1.5rem;
		}

		/* The site's page padding grows to 8rem on wide screens; keep more room for tables beside the sidebar */
		main {
			padding: var(--spacing-l) var(--spacing-xl);
		}
	}
</style>
