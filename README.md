# Junoon East — The Photography Society

Portfolio / informational site for Junoon East, a college photography society. Dark scrapbook aesthetic: warm near-black paper, film grain, sticky notes, washi tape, polaroids, and hand-drawn doodles, with coral/cobalt/yellow accents.

## Stack

- **React 19 + Vite** — SPA, no routing needed (single scrolling page)
- **Framer Motion** — scroll reveals, hero letter stagger, spring tilt cards, draggable sticky notes, lightbox transitions
- Plain CSS (`src/index.css`) with CSS custom properties for the theme palette

## Run it

```bash
npm install
npm run dev     # site on http://localhost:5173 + admin API on :3001
npm run build   # production build to dist/
npm start       # production: serves dist/ AND the admin API on one port (3001)
```

## Updating the Spotlight (admins only)

The "Photo of the Month" and "Photographer of the Month" content is **not** hardcoded — it lives
in `server/data/spotlight.json` and is served by a small Express API.

1. Open the hidden admin page: `http://<site>/#admin` (it is not linked anywhere on the site).
2. Edit the fields (image URLs, title, caption, name, bio, field notes).
3. Enter the admin password and hit **Save & Publish** — changes go live for every visitor immediately.

The password is set in `server/.env` (`ADMIN_TOKEN=...`), which is gitignored. Change it there and
restart the server. Writes without the correct password are rejected (HTTP 401).

Note: the admin flow needs the Node server running (any Node host — Render, Railway, a VPS —
via `npm start`). On static-only hosting (GitHub Pages etc.) the site still works but falls back
to the built-in defaults in `src/components/Spotlight.jsx`. Use HTTPS in production, since the
password travels as a bearer token.

## Features

- **Cursor glow** — a soft torch-light follows the mouse across the dark page
- **Hero** — staggered letter drop-in, parallax fade on scroll, *draggable* sticky notes, animated doodles, scroll cue, stage-light vignette
- **Marquee** — infinite scrolling yellow ticker strip (pauses on hover)
- **Spotlight** — prominent 3D spring-tilt "Photo of the Month" card with cursor-tracking glare, plus a compact photographer card with round avatar and handwritten notes
- **About** (bottom of page) — static intro text, count-up stat cards, polaroid, and a full-width washi-taped group photo placeholder
- **Film strip** — tilted 35mm film-strip divider with sprocket holes and scrolling frames
- **Gallery** — draggable 3D carousel ("dome") with inertia fling, auto-spin resume, and click-to-zoom polaroid lightbox (Esc to close)
- **Events** — "What's Next" timeline with animated dashed line, tape-decorated event cards
- **Back to top** — floating aperture button that springs in after scrolling
- **Nav** — scroll progress bar, active-section highlighting, animated mobile hamburger menu
- Respects `prefers-reduced-motion`; responsive down to mobile

## Swapping in real photos

All images currently come from `picsum.photos` placeholders. Replace the URLs in:

- `src/components/Gallery.jsx` — the `PHOTOS` array (member gallery)
- `src/components/Spotlight.jsx` — the `CARDS` array (photographer / photo of the month)
- `src/components/About.jsx` — the polaroid image and the group photo placeholder (`junooncrew` seed)
- `src/components/FilmStrip.jsx` — the `FRAMES` array (film-strip divider)

Event listings live in the `EVENTS` array in `src/components/Events.jsx`.

Content (names, captions, contact links, stats) lives as plain data arrays at the top of each component.
