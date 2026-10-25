# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/landing site for Ophir Mobile Saunas, a mobile sauna rental service in Rossland, BC (a Pixel Mountain Creative project). SvelteKit 2 + Svelte 5 (runes), TypeScript, plain CSS, deployed to Netlify via `@sveltejs/adapter-netlify` (`netlify.toml` builds with `npm run build` and publishes `build`).

## Commands

- `npm run dev` — Vite dev server
- `npm run build` / `npm run preview` — production build and local preview
- `npm run check` — `svelte-check` type checking (the closest thing to a test suite; there are no tests)
- `npm run lint` / `npm run format` — Prettier check / write

Prettier config: tabs, double quotes, no trailing commas, `printWidth` 150.

## Architecture

- **Pages** live in `src/routes/` (home, `about`, `contact`, `pricing`, `privacy`). Each page renders `<SeoHead title=… description=… />` to set title, description, OG/Twitter tags and canonical URL. The OG image is fixed at `/assets/images/og-image.jpg`.
- **Shared shell**: `src/routes/+layout.svelte` wraps every page with `Nav`, `FinalCTA`, `Footer` and a single global `BookingModal`. Don't add per-page booking modals.
- **Booking flow**: any "Book Now" button calls `openBookingModal()` from `src/lib/utils/globalStates.svelte.ts` (a `$state` store, `uiStore.bookingModalOpen`). `BookingModal.svelte` embeds the external YouCanBookMe widget (`https://embed.ycb.me`, domain `ophirsaunas`); booking itself is not handled in this codebase.
- **Content data**: FAQ content is in `src/lib/data/faqs.js` as `{ question, answer: [{ element, content }] }` entries rendered by `FAQ.svelte`.
- **Custom actions/events**: `use:clickOutside` dispatches `outclick`; `use:isIntersecting` adds a class (default `show`) when in view and dispatches `intersect`. The `onoutclick`/`onintersect` attribute types are declared in `src/app.d.ts`; extend that file when adding new custom events.
- **Scroll/text animations**: `SpanifyText` wraps each character in a staggered `<span>`; pair it with a `.heading-fade-in` parent plus `use:isIntersecting`. Other reveal classes (`.scroll-fade-up`, `.group-stagger-fade`) are in `static/global-noncritical.css` and are also triggered by the `show` class.

## Styling

- Global CSS is served from `static/`, not imported through Vite: `static/global.css` (critical: font-face, reset, design tokens, hero, heading animations) is loaded in `src/app.html` head; `static/global-noncritical.css` is loaded at the end of `<body>`. Component styles are scoped `<style>` blocks.
- Use the CSS custom properties defined on `:root` in `global.css` (`--color-*`, `--font-*`, `--spacing-*`, `--padding-inline`/`--padding-block`, `--border-radius`, etc.). Font sizes and page padding are redefined at the 768/1280/1440/1600px breakpoints, so prefer the tokens over hard-coded values.
- `--vh` is set by an inline script in `app.html` for mobile viewport height (used by the hero).
- Headings use the self-hosted `Abigail` font (`static/assets/fonts/`); icons come from the `material-icons` package (`<span class="material-icons">name</span>`), imported in the layout.

## Analytics

Plausible (`data-domain="ophirsaunas.ca"`, tagged-events script) is loaded in `app.html` and proxied through `_redirects` (`/js/script.tagged-events.js`, `/api/event`) to avoid ad blockers.
