# Design system: "Reconciled"

The site reads as a settlement statement. Every component is a row, a rule, a stamp or a total.

## Color (tokens in `src/app/globals.css` `@theme`)
| Token | Value | Job |
|---|---|---|
| `paper` | `#0a192f` | Page ground (carried over from the first portfolio) |
| `paper-2` / `paper-3` | `#0d1f3a` / `#112848` | Recreation frames, hover on dark buttons |
| `rule` / `rule-strong` | `#1d3558` / `#2c4a75` | Ledger hairlines; double rules close a header |
| `ink` / `ink-2` / `ink-3` | `#e2e9f5` / `#a9b6cf` / `#8090ad` | Primary, body, data labels (all ≥ 4.5:1 on paper) |
| `mint` | `#62f9d5` | **Only** matched / reconciled / primary action / progress |
| `night` | `#050d1a` | Closing section ground, one step deeper than paper |

| `sun` | `#ffd23f` | Primary accent: hero, work, travel, CV, default cursor |
| `sky` | `#6ec8ff` | Experience |


Exactly three accents: sun, mint, sky. Coral/orange and violet were tried and removed at Kawser's request; don't reintroduce them. Pending/open states use sun.

**Section accents:**
- Each section sets `data-accent="sun|sky|mint"`. `bg-accent`, `text-accent` and `border-accent` read the nearest one, via `@theme inline` in `globals.css`.
- The last word of each section title, its first rule, its links and the primary buttons take the accent.
- Inside ledgers and demos, mint means matched and sun means pending/open.
- The cursor ring, dot, label and spotlight tween `--cursor` to the accent of the section under the pointer.

Selection, focus rings and scrollbars are themed from these.

## Type
- **Clash Display** (Fontshare, variable `wght` 200–700, loaded from Fontshare's CDN). `.stmt` is used for the name, section titles, company names and marquee: weight 600, tracking −0.035em, mixed case.
- **General Sans** (Fontshare, variable) for body text. `.stmt-wide` is its uppercase 600 weight tracked +0.08em, used for buttons and labels.
- **JetBrains Mono** in `.fig`: tabular, slashed zero. Only for codes, periods, figures, status and data captions.
- Clash Display and General Sans load from Fontshare's CDN (two `<link>`s in `layout.tsx`, one per variable font). Never commit their font files: the repo is public and the ITF Free Font License forbids redistribution.
- **Black Ops One** (Google Fonts via `next/font`) is used only for the hero's "5+" stat, chosen by Kawser.

## Components
- React Bits ports (`src/components/reactbits/`, MIT + Commons Clause, notice in `NOTICE.md`; ported to GSAP):
  - `ShinyText` on the hero name after its letter-rise intro. It sweeps silver-blue → white on lines 1–2 and yellow → white on "Shovon.", staggered 0.18s per line.
  - `RotatingText` in the hero line, a yellow pill cycling React / Next.js / TypeScript / Node.js / Express / MongoDB. The full stack sits in sr-only text.
  - `ClickSpark`: page-wide sparks in the section accent on click or tap. It draws on a fixed canvas and stays idle when nothing is drawing.
- `BackToTop`: appears after about one screen of scrolling. Its ring fills with reading progress in the `--cursor` colour; it scrolls via Lenis when active. 48px, on every page.
- The loader's own animated text uses `data-loader-rise`, never `data-rise`, and Choreography ignores anything inside `.loader`.
- `MobileMenu` (below lg): a Menu button with a two-bar icon that morphs to ✕, opening a full-screen panel of large Clash Display links (staggered in) plus Résumé, Email, LinkedIn and GitHub. It locks page scroll, closes on link or Escape, and moves focus in and back. The header keeps a direct **CV** link beside Résumé; below 400px Résumé is icon-only, and below 360px the logo shows only the monogram.
- Highlighter marks: `<span class="mark" data-mark>` (or `Highlight` with phrases) give a marker stroke in the section accent, swept in on scroll. Use spans, not `<mark>`, and keep the `mark` reset in base styles.
- `.blink`: a hard on/off blink. Used for the cursor block before every section meta line and the colons of the hero's Dhaka clock.
- Touch targets: on coarse pointers every control is at least 40px tall (`pointer-coarse:` utilities).
- `Logo`: the KS monogram (the favicon drawing, with a yellow double rule) plus "Shovon." in Clash Display with a yellow full stop. On hover the letters roll up into yellow copies (staggered) and the mark tips -6°. Past 160px of scroll the word tucks away and only the monogram remains.
- `SectionHead`: display title, data on the right, and a drawn double rule. No eyebrows above headings.
- Ledger row: code column (mono, `ink-3`), then item, then period, then status.
- `RecreationFrame`: a bordered frame for recreated UI. It always carries "Illustrative recreation · synthetic data".
- Stamp: mint border with an outline offset, rotated −7°, on paper.

## 3D and imagery
- **Earth** (`src/components/three/Globe.tsx`, three.js, client-only): a realistic globe with these layers:
  - NASA Blue Marble day map, Black Marble city lights on the night side, and an ocean mask for sun glints.
  - A drifting cloud layer and a fresnel atmosphere.
  - Textures live in `public/earth/`. They are NASA imagery, public domain, processed with OpenCV.
- **Props:** `places`, `focus`, `distance` and `spin`. Hero only: pins, pulsing halos and arcs out of Dhaka. It is centred on Dhaka: pitched forward by Dhaka's latitude (never rolled, so north stays straight up on screen), with `hold` making it sway gently around Dhaka instead of spinning, and ease back after a drag.
- **Travel map** (`TravelMap`): a flat Natural Earth projection built at build time in `src/lib/worldMap.ts` (world-atlas 110m base, 50m for visited countries; d3-geo).
  - On scroll (scrubbed) it zooms from the world into South and Southeast Asia while Bangladesh, then India, then Singapore and Malaysia light up, flight arcs draw from Dhaka and pins pop in with labels.
  - It is server-rendered in its final state.
- **Interaction:** drag to spin. The tilt follows the pointer only while it is over the globe, clamped.
- **Fallbacks:** it pauses offscreen, renders still under reduced motion, and the sections work without WebGL.
- **No photos of Kawser:** the processed portrait was removed at his request.
- **CV builder** (`/cv`):
  - `src/content/cv.ts` holds every toggleable item and `buildCv()`. One model feeds `CvSheet` (HTML A4 preview), `cvToText` (copy / .txt) and `CvPdf` (`@react-pdf/renderer`).
  - The PDF is single-column Helvetica with no hyphenation, so applicant tracking systems can read it.
  - Choices persist in localStorage.

## Motion (GSAP)
- **Loader** (`src/components/Loader.tsx`), only when needed:
  - Shown once per browser session. A `<head>` script adds `loader-skip` when the `kas-intro-seen` flag is in sessionStorage, so it never flashes on reloads.
  - Before the script runs, the cover shows an indeterminate bar, never a frozen counter.
  - If fonts and the page are ready within 300ms (and the visitor hasn't already waited), the cover just fades. Otherwise the 000 → 100% counter runs, then the curtain wipes up.
  - `loaded` gates the hero intro and Lenis.
- Grammar: rules draw left to right (`scaleX`), lines slide up and lock, statuses flip pending to matched, and the stamp lands with `back.out`.
- The hero plays once per page load. `Choreography` runs every `[data-ledger]` block once on scroll. Network arcs scrub with `DrawSVG`. The NeuString demo re-sorts with `Flip`.
- `Choreography` also handles the scroll motion:
  - `[data-split]`: headings rise letter by letter (SplitText).
  - `[data-ink]`: the summary inks in word by word, scrubbed.
  - `[data-parallax]`: the hero exit and recreation frames drift.
  - `[data-fill]`: a mint rule fills down each employer's entries while its header stays sticky.
  - `[data-page-progress]`: the header rule tracks reading progress.
  - `[data-scramble]`: codes, company names and API routes decode from noise (ScrambleText).
  - `[data-rise]`: recreated screens rise and tip up into place in 3D, then a light sheen crosses them.
  - `[data-mark]`: highlighter strokes sweep in behind key phrases.
  - `[data-tighten]`: the closing heading's tracking closes up.
- The Network map pins on desktop while routes draw. Marquee: the frontend row always runs left to right and the backend row right to left. Scrolling speeds them up but never reverses them.
- Section anchors: `scroll-mt-0 lg:-scroll-mt-6`, with Lenis anchor offset 0 / 24, so headings land about 24px under the header.
- Inner scroll areas (the CV preview) carry `data-lenis-prevent` so the wheel scrolls them, not the page.
- **Cursor** (fine pointers only, with motion allowed):
  - A trailing ring and dot accompany the native cursor.
  - The ring grows over interactive elements.
  - `[data-cursor="Label"]` shows a mint label pill beside the pointer.
  - `[data-magnetic]` buttons lean toward the pointer.
  - A spotlight trails the pointer behind the content: a soft mint glow plus a 56px ledger grid masked to a circle around the pointer. It brightens and widens over interactive elements. Opaque surfaces (header, recreation frames, closing section) cover it on purpose.
- Don't use `data-ink` near the page bottom, because its scrub can't finish there.
- Content is visible by default. `.js [data-enter]` hides hero items only when JS is on and motion is allowed, with a 3.5s CSS failsafe. Everything is wrapped in `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.

## Engineering notes
- **Cache Components is off** (`next.config.ts`). Its hidden-route preservation kept old pages in the DOM and re-ran GSAP effects on return, which broke ScrollTrigger. The site is fully static and doesn't need it.
- **Never use `once: true` on ScrollTriggers.** Use `toggleActions: "play none none none"`. A `once` trigger kills itself when it fires during creation (for example, landing on `/#cv` already past it), which corrupts ScrollTrigger's list mid-refresh ("Cannot read properties of undefined (reading 'end')").
- `Choreography` only animates rendered elements and sets up one frame after mount.
- **Link preview** is a static `src/app/opengraph-image.png` (1200×630): a frozen capture of the hero (pill on "TypeScript"), chosen by Kawser. Regenerate it after hero changes.
