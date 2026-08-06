# OZMO Digital — Design System

A brand & component system for **OZMO Digital**, a website design, maintenance, and marketing company serving small businesses across the Midwest. This system is a brand guide plus a working component library — it is intentionally *not* a website. It gives designers and agents everything needed to build on-brand assets: slides, mocks, marketing pages, proposals, social graphics, and app UIs.

## Sources
- `uploads/ozmo-logo-bo.png` — the primary logo supplied by the client (copied into `assets/`). No other codebase, Figma, or brand files were provided.
- Palette (client-specified): Primary Navy `#1F3A5F`, Secondary Terracotta `#C1622D`, Background Cream `#F5EFE6`, Ink `#2A2725`.
- Type (client-specified): **Fraunces** (soft serif, headlines) + **Karla** (grotesque, body). Both loaded from Google Fonts.

> **Font note / substitution:** Fraunces and Karla are loaded live from Google Fonts (`tokens/fonts.css`) — no self-hosted font binaries were provided. If you need offline/self-hosted webfonts, send the `.woff2` files and I'll add `@font-face` rules.

---

## Brand at a glance
OZMO is **"classic trust, warmed up."** Navy carries the established, capable, dependable feeling a small business owner wants from the people running their website; terracotta and a warm cream background keep it human, local, and relationship-driven rather than cold or corporate. The logo's bright **spark orange** (`#F05000`) is the energy note — used sparingly to point at the single most important action.

---

## Content fundamentals
**Voice:** warm, plain-spoken, confident, and practical — a knowledgeable neighbor, not an agency showing off. We talk to Main-Street business owners, not marketers.

- **Person:** "we" (OZMO) speaking to "you" (the owner). Never third-person or faceless ("the client should…").
- **Casing:** Sentence case for headlines and buttons ("Get a quote", not "Get A Quote" or "GET A QUOTE"). ALL-CAPS is reserved for small eyebrow labels only, with wide letter-spacing.
- **Tone:** reassuring and concrete. Lead with the customer's outcome, not our process. Short sentences. Plain words over jargon ("we keep your site online" > "we ensure maximal uptime SLAs").
- **Verbs:** active and grounded — build, grow, keep, fix, care, launch.
- **Numbers:** specific and honest ("99.9% uptime", "back to you within one business day"). Tabular/mono for stats.
- **Emoji:** not used in the brand voice. Iconography does the visual lifting instead.
- **Examples of on-brand copy:**
  - Headline: *"Websites that work as hard as you do."*
  - Sub: *"We build fast, friendly websites for Midwest small businesses — and stick around to keep them running."*
  - CTA: *"Get a quote"* / *"See our work"* / *"Talk to us"*
  - Eyebrow: `MARKETING · MAINTENANCE`
- **Avoid:** hype ("revolutionary", "cutting-edge"), fear-selling, dense marketing jargon, exclamation-point stacking.

---

## Visual foundations
- **Color:** Navy is the anchor (headers, footers, feature bands, primary buttons, headings). Terracotta is the workhorse warm accent (secondary buttons, links, eyebrows, tags, focus rings). Cream is the default page — roughly 80% of surfaces sit on cream or paper. Spark orange is *energy only* — one high-emphasis CTA or a status ping per view, never body text. Max 1–2 background colors per layout (cream + a navy band).
- **Type:** Fraunces for headlines and big numbers only, `SOFT 40` optical setting for a rounded, friendly cut; occasional *italic* Fraunces for warmth. Karla for everything else — body, UI, labels, captions. IBM Plex Mono for data/URLs/code. Tight tracking on display (`-0.02em`); wide tracking on uppercase eyebrows (`0.14em`).
- **Backgrounds:** solid warm fields, not photography-heavy or gradient-heavy. The one sanctioned gradient is the **navy→terracotta** blend inside the logo mark — do not invent new gradients or use bluish-purple ones. No noisy textures; optional very subtle paper warmth via the `paper` token.
- **Spacing & layout:** 4px base scale, generous whitespace, `1200px` max container (`720px` for reading). Airy, not dense.
- **Corners:** soft but not pill-happy — `sm 6 / md 10 / lg 16 / xl 24`; cards default to `lg (16px)`. Pills reserved for badges and toggles.
- **Cards:** warm **paper** (`#FBF8F2`) lifted just off the cream with a soft, **navy-tinted** shadow and a hairline `border-subtle`. Feature cards invert to solid navy with cream text. No colored-left-border cards, no hard grey drop shadows.
- **Shadows:** always navy-tinted and soft (`shadow-sm/md/lg`); a terracotta-tinted shadow (`shadow-terra`) lifts warm/secondary CTAs. No pure-black or harsh shadows.
- **Borders:** hairline `border-subtle` (cream-300) on cards; `border-strong` (navy-300) for outlined/ghost controls; `1.5–2px` weights, never heavier.
- **Motion:** purposeful and gentle. Standard ease `cubic-bezier(0.22,0.61,0.36,1)`, ~220ms. Signature moves: **loop draw** (the ring rotates/draws in), **rise-in** (headlines fade + translate up), **spark pulse** (attention ping on a CTA/status), **wipe underline** (terracotta wipes under links/headings). A single soft-bounce ease is allowed on toggles. Nothing flashy, spinny, or jittery.
- **Hover:** links get a terracotta color shift + underline; buttons keep color but lift slightly. **Press:** a subtle `translateY(1px) scale(0.99)` — press *down*, don't recolor drastically.
- **Focus:** 3px terracotta-100 ring + terracotta border. Always visible, never removed.
- **Transparency & blur:** used minimally — light tint overlays on navy imagery if needed; no heavy glassmorphism.
- **Imagery vibe:** if photography is used, warm-toned, natural light, real Midwest small-business settings and people — not stocky, cool, or corporate. Black-and-white only for subtle background texture behind navy.

---

## Iconography
- **No custom icon set was provided.** The recommended system is **Lucide** (`https://unpkg.com/lucide-static`) — its `2px`, rounded-cap stroke style matches OZMO's soft, friendly geometry and pairs cleanly with Karla. Load from CDN; use `currentColor` so icons inherit navy/terracotta.
- **Substitution flagged:** Lucide is a substitute chosen to fit the brand, not a client-provided set. If OZMO has a preferred icon library, send it and I'll swap it in.
- Icons are **line, not filled**, sized 20–24px in UI, stroke inherits text color. Terracotta or spark fills reserved for the rare emphasis glyph.
- **Emoji:** not used. **Unicode arrows** (→) are acceptable inside buttons/links as directional affordances.
- The **loop mark** (`assets/ozmo-mark.png`) doubles as the brand's hero glyph — favicon, avatar, app icon, loading spinner.

---

## Components
Reusable React primitives live in `components/core/` (namespace exposed on `window.OZMODigitalDesignSystem_5d9d0c`):

- **Button** — primary (navy), secondary (terracotta), energy (spark), ghost, link; sizes sm/md/lg; icon slots; disabled.
- **Badge** — uppercase pill; tones navy / terracotta / success / spark / neutral; soft or solid.
- **Card** — warm paper surface; default / feature (navy) / outline; eyebrow, title, footer slots.
- **Input** — labelled field with terracotta focus ring, hint and error states.
- **Checkbox** — terracotta checked fill.
- **Switch** — on/off toggle with soft-bounce thumb.
- **Alert** — inline callout with accent bar; info / success / warning / danger.

### Intentional additions
No source defined a component inventory, so a standard brand-guidelines set was authored. **Alert** and **Switch** are included as commonly-needed feedback/form primitives for a marketing + client-portal context.

---

## Index / manifest
- `styles.css` — entry point (import list only). Consumers link this one file.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css` (radius/shadow/motion), `fonts.css`, `base.css`.
- `components/core/` — Button, Badge, Card, Input, Checkbox, Switch, Alert (+ `.d.ts`, `.prompt.md`, card HTML).
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `assets/` — logo lockups (`ozmo-logo-full/cream/navy/ink/white.png`) and the standalone `ozmo-mark.png`.
- `thumbnail.html` — homepage tile. `SKILL.md` — Agent-Skills wrapper.

The **Design System tab** renders every specimen and component card automatically.
