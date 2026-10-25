# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website and booking service for Ophir Mobile Saunas, a mobile sauna rental service in Rossland, BC (a Pixel Mountain Creative project). Customers book private multi-night rentals and drop-in sessions on the site; the owner manages bookings, prices and availability in an admin dashboard. SvelteKit 2 + Svelte 5 (runes), TypeScript, plain CSS, Supabase (Postgres + Auth), Resend for email, deployed to Netlify via `@sveltejs/adapter-netlify` (`netlify.toml` builds with `npm run build` and publishes `build`).

## Commands

- `npm run dev` — Vite dev server
- `npm run build` / `npm run preview` — production build and local preview
- `npm run check` — `svelte-check` type checking
- `npm test` — Vitest (calendar rules in `src/lib/utils/availability.test.ts`)
- `npm run lint` / `npm run format` — Prettier check / write. Many older files aren't formatted yet, so format only the files you touch.

Prettier config: tabs, double quotes, no trailing commas, `printWidth` 150.

Environment variables are listed in `.env.example` and read through `$env/dynamic/*`, so builds don't need them.

## Architecture

- **Public pages** live in the `src/routes/(site)/` group (home, `about`, `contact`, `pricing`, `privacy`). Each page renders `<SeoHead title=… description=… />` to set title, description, OG/Twitter tags and canonical URL. The OG image is fixed at `/assets/images/og-image.jpg`.
- **Shared shell**: `src/routes/(site)/+layout.svelte` wraps public pages with `Nav`, `FinalCTA`, `Footer` and a single global `BookingModal`. Don't add per-page booking modals. The root `+layout.svelte` only imports icons.
- **Booking flow**: any "Book Now" button calls `openBookingModal()` (optionally `openBookingModal("rental" | "drop-in")`) from `src/lib/utils/globalStates.svelte.ts`. `BookingModal.svelte` is a native `<dialog>` whose steps live in `src/lib/components/booking/`; all state is in the `BookingFlow` class (`flow.svelte.ts`). It reads `GET /api/booking/options` and `GET /api/availability?from&to`, and posts to `POST /api/bookings/rental` or `/api/bookings/drop-in`.
- **Database**: schema and functions are versioned in `supabase/migrations/` and run by hand in the Supabase SQL editor. Every table has RLS on with no public policies; the site only talks to Supabase from server code via `db()` (secret key) in `src/lib/server/supabase.ts`. New tables need explicit grants to `service_role`. Bookings are created only through the `create_rental` / `create_drop_in_booking` RPCs, which lock and re-check availability so nothing double-books. Bookings snapshot names and prices.
- **Calendar rules** exist twice and must stay in sync: SQL `rental_conflict()` / `drop_in_day_conflict()` (authoritative) and `src/lib/utils/availability.ts` (used to grey out dates). Dates are `YYYY-MM-DD` local days in America/Vancouver; use the helpers in `src/lib/utils/format.ts`.
- **Admin** (`src/routes/admin/`): Supabase email/password login; `src/hooks.server.ts` checks the session with `getClaims()` and `ADMIN_EMAILS`. Pages are in the `(dashboard)` group and use SvelteKit form actions with `update({ reset: false })`. Shared styles and markup patterns are documented in `admin.css`; `Field.svelte` wires labels, hints and errors. Booking detail actions (approve/decline/cancel, notes, resend email) are in `src/lib/server/adminBookings.ts`.
- **Emails**: `src/lib/server/email/` (`send.ts`, a branded layout in `render.ts`, content in `templates.ts`); `src/lib/server/bookings.ts` loads bookings and sends the right email. Without `RESEND_API_KEY`, emails are logged instead of sent, and an email failure never fails a booking. Previews: `/admin/emails`.
- **Reminders**: `netlify/functions/send-reminders.mts` runs daily and calls `POST /api/cron/reminders` with `CRON_SECRET`; the endpoint stamps `reminder_sent_at`, so it's safe to re-run.
- **Content data**: FAQ content is in `src/lib/data/faqs.js` as `{ question, answer: [{ element, content }] }` entries rendered by `FAQ.svelte`. The booking modal and emails quote the cancellation-policy answer, so keep "cancellation" in that question.
- **Custom actions/events**: `use:clickOutside` dispatches `outclick`; `use:isIntersecting` adds a class (default `show`) when in view and dispatches `intersect`. The `onoutclick`/`onintersect` attribute types are declared in `src/app.d.ts`; extend that file when adding new custom events.
- **Scroll/text animations**: `SpanifyText` wraps each character in a staggered `<span>`; pair it with a `.heading-fade-in` parent plus `use:isIntersecting`. Other reveal classes (`.scroll-fade-up`, `.group-stagger-fade`) are in `static/global-noncritical.css` and are also triggered by the `show` class.

## Styling

- Global CSS is served from `static/`, not imported through Vite: `static/global.css` (critical: font-face, reset, design tokens, hero, heading animations) is loaded in `src/app.html` head; `static/global-noncritical.css` is loaded at the end of `<body>`. Component styles are scoped `<style>` blocks; the booking modal's shared step styles are in `src/lib/components/booking/booking.css`.
- Use the CSS custom properties defined on `:root` in `global.css` (`--color-*`, `--font-*`, `--spacing-*`, `--padding-inline`/`--padding-block`, `--border-radius`, etc.). Font sizes and page padding are redefined at the 768/1280/1440/1600px breakpoints, so prefer the tokens over hard-coded values.
- `--vh` is set by an inline script in `app.html` for mobile viewport height (used by the hero).
- Headings use the self-hosted `Abigail` font (`static/assets/fonts/`); icons come from the `material-icons` package (`<span class="material-icons">name</span>`), imported in the layout.

## Analytics

Plausible (`data-domain="ophirsaunas.ca"`, tagged-events script) is loaded in `app.html` and proxied through `_redirects` (`/js/script.tagged-events.js`, `/api/event`) to avoid ad blockers.
