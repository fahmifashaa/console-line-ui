# Boundaries

What sits outside the console-line-ui style, why, and what to do instead. Also how to extend the style without drifting.

**Breaking a rule in letter while claiming to keep its spirit is still breaking it.** "It's only a subtle shadow" is a shadow.

## Hard boundaries

These are never allowed. `scripts/check-style.mjs` flags most of them.

| # | Never | Why | Instead |
|---|---|---|---|
| B1 | `box-shadow` for elevation, drop shadows, glows, `filter: drop-shadow` | depth is drawn with lines; a shadow is decoration | 1px `--line` border. The only allowed box-shadows are `inset 0 0 0 1px var(--line)` (active nav, hollow lamp ring with `--ink-faint`) and `none` |
| B2 | Gradients (`linear-`, `radial-`, `conic-gradient`) | flat ground, honest construction | flat tokens. **Single exception:** the kill-switch guard stripe |
| B3 | `backdrop-filter`, glassmorphism, blur, translucent panels | it hides structure | an opaque `--surface` with a line |
| B4 | Hex/rgb/hsl colours in components | hues creep in one at a time | tokens only (`var(--…)`). Literals live only in the token blocks |
| B5 | A brand or accent hue for links, buttons, focus, selection | colour must stay information | ink. Links are ink, underlined; primary is inverted ink; focus is an ink outline |
| B6 | Signal colours as decoration (green "new" labels, red hearts, coloured categories or tags) | it dilutes the signal | neutral badges; tell categories apart by words |
| B7 | Colour as the only carrier of meaning | accessibility, and the style's own rule | lamp + `aria-label`, badge text, signal word |
| B8 | Web fonts, icon fonts, Inter, Roboto, Google Fonts | system stacks are part of the look, and fast | `--font`, `--mono` |
| B9 | `font-weight` 700+, bold headings | weight is a quiet tool | 400 / 500; 600 only for the wordmark |
| B10 | UPPERCASE text or `text-transform: uppercase` / `capitalize` | the label voice is lower-case mono | `text-transform: lowercase` on mono labels only |
| B11 | Radii other than 8px, 14px, the 1rem pill, 50% dots, the 4px guard, or the 2px/1px mark radius on dot-matrix cells | shape consistency | `--radius-control`, `--radius-panel` |
| B12 | Borders thicker than 1px (focus outline 1.5px), including a 1px border plus an inset ring that doubles it | the hairline is the style's name | 1px; emphasise by changing the border to ink, not by thickening it |
| B12b | New coloured feedback variants (a green "success" notice, a blue "info" banner), dismissible banners | success isn't a standing condition | success is muted `role="status"` text beside the control; only `.notice` (warn) and `.error-note` (danger) exist |
| B13 | Decorative icons, icon-led buttons, emoji, nav icons | geometry and words carry identity | words. Allowed glyphs: `×`, `→`, `←`, `·`, `—`, `…` |
| B14 | Spinners, skeleton shimmer, pulsing badges, bouncy or elastic easing, parallax, scroll-jacking, charts that animate on refetch | motion is for arrival and state only | "Loading …" text; a 1.6s ease-out arrival fade; the dot-matrix entrance on mount or view change; Hairline figures use their own springs |
| B15 | Ignoring `prefers-reduced-motion` | | every animation turns off under reduce |
| B16 | Stock or 3D illustration, photos, mascots in the UI chrome, filled vector art | | Hairline isometric line figures only (`illustration.md`) |
| B17 | Toasts, snackbars, auto-dismissing banners | the user may miss them; nothing pops | inline `role="status"` text or an `error-note` beside the control |
| B18 | More than one `.button--primary` in a view or dialog | one decision at a time | outlined `.button` for the rest |
| B19 | Destructive actions styled like routine ones, guarded below their tier, or a kill button styled like a normal one | safety is part of the look | the three tiers in `components.md`: danger-outline + confirm → ReasonDialog → kill switch with typed-name confirmation |
| B20 | Exclamation marks, "Oops", emoji, Title Case, marketing tone | see `voice.md` | |

## Soft boundaries (allowed with a reason)

| Case | Allowed when | How |
|---|---|---|
| A new signal meaning (e.g. "info") | it is a real operational state the user must act on or know about | reuse an existing signal or go neutral. Adding a fourth signal hue needs a token change in `console-line.css` and in this skill, with dark value, soft value, and AA text variant |
| Charts | the data really is a series (not a single number) | follow the Chart spec in `components.md`. Prefer tallies or a sparkline |
| Avatars | a real person's identity matters at a glance | 24px circle, 1px line border, initials in mono faint; no photos inside the app chrome |
| A third column or a denser table | real data density | `table.compact`; keep the 1px rules and mono headers |
| A large number (above step-2) | a single-metric screen such as a wallboard | up to step-3 at weight 400, tabular; never in coloured blocks |
| Marketing / landing page in the style | the product needs one | same tokens and voice; a centred column (max 70ch) with a wordmark, a Hairline figure in a plate as the only image, outlined buttons plus one primary. Still no gradients, hero colour bands, or stock art |
| Hairline figure on a page that isn't a dashboard | the figure shows a state, not decoration | see `illustration.md` |

## Outside the style entirely

Don't force console-line-ui onto:
- Consumer-facing brand campaigns that need photography, colour fields, or emotional imagery
- Data-heavy analytics (multi-series dashboards, heatmaps, maps); hand those to a dataviz system and keep only the shell, type, and tokens
- Documents meant for print, such as slides and PDFs (borrow the palette and type only)

Say so plainly when the request falls here, rather than half-applying the style.

## Extending without drifting

When nothing in `components.md` fits:

1. **Name what it must say.** What state or decision does it show? If you can't say, you don't need the component.
2. **Compose existing parts first:** a panel + plain-list + badge + button covers most new screens.
3. **If it's truly new, build it from the alphabet only:**
   - surface: `--surface` or `--surface-sunk`, never a new fill
   - frame: 1px `--line` (outer) / `--line-soft` (inner)
   - radius: control (8) or panel (14)
   - text: body sans in the three inks; meta in a mono 11px lower-case label
   - state: one signal, applied as a lamp, text, or a 45%-mix border, with the meaning written out in words
   - size: 32px / 26px controls, rem spacing in steps from 0.25 to 2.5
   - motion: none, or the arrival fade
4. **Check both themes and the 860px breakpoint.**
5. **Add it to `console-line.css` and `components.md`** (in the project's copy, and upstream in the skill if it's reusable). Write the class comment in the same voice as the rest ("The kill control: a guarded switch, set apart from routine actions.").

## Rationalisations

| Thought | Reality |
|---|---|
| "A tiny shadow makes the card feel clickable" | Clickability comes from a hover border change to ink-faint and the cursor. B1 |
| "The client wants their brand blue" | Brand blue can tint the wordmark quill's slot (replace `--brand`) and nothing else. Links and buttons stay ink |
| "Users need icons to scan the nav" | Short, distinct words scan faster than icons. B13 |
| "Bold makes the heading stand out" | Size + weight 500 + space do it. B9 |
| "The chart should animate to feel alive" | Only the dot matrix's entrance moves, once, when the data or the view changes. B14 |
| "Colour the failed-runs cells red" | Cells stay ink; the KPI delta says it got worse. B6 |
| "A spinner shows it's working" | "Loading …" text says *what* is loading. B14 |
| "Stat cards are standard for dashboards" | Tallies are the style's stat cards: one ruled row |
| "A toast is less intrusive" | It disappears before it's read. B17 |
| "Just this one place uses #3b82f6" | That is how the palette dies. B4 |
| "It looks too plain" | Plain is the point. If a screen feels empty, its content or signals are missing, not its decoration |
