---
name: console-line-ui
description: 'Use when building, restyling, or reviewing any interface that should look like console-line-ui or "the console line style": a monochrome, Hairline-inspired UI with 1px borders, small lowercase monospace labels, and colour used only for signal states. Covers dashboards, admin consoles, internal tools, HTML artifacts, and landing pages in any project or framework. Also use when deciding whether a new colour, component, font, icon, shadow, illustration, or piece of UI copy stays in the style.'
---

# console-line-ui

## Overview

console-line-ui looks like a **signal box**: one neutral ink on a plain ground, structure drawn as 1px hairlines, small monospace lower-case labels, and colour that always *means* something. It was designed for operational consoles (fleets, queues, approvals, kill switches) and takes its line work from Lucas Marques' Hairline figures (MIT).

**Core principle: colour is information, structure is a hairline, emphasis is ink. Nothing in the style is decoration.**

Every rule in this skill follows from that sentence. If a choice isn't covered here, decide it with the sentence.

## When to use

- Building a new screen, page, component, or whole app "in the console-line-ui style"
- Porting the look to another project or stack (plain CSS, React, Vue, Svelte, Tailwind, an HTML artifact)
- Reviewing a UI for drift, or deciding whether an addition (a colour, card, chart, icon, animation, font, illustration) is allowed
- Writing UI copy for a console-line-ui interface

**Not for:** marketing visuals that need imagery or brand colour fields, or data-dense charting beyond simple sparklines and tallies. For those, see `references/boundaries.md` → "Outside the style entirely".

## The seven laws

1. **One ink, one ground.** Hierarchy comes from three ink weights (`--ink`, `--ink-soft`, `--ink-faint`), never from hue. White ground in light mode, near-black `#08090a` in dark.
2. **Colour is a signal.** `--ok`, `--warn`, `--danger` mark state only. `--brand` appears only on the brand quill. Every signal colour comes with a word or an `aria-label`; colour alone never carries meaning.
3. **Structure is a 1px line.** Use `--line` for borders and `--line-soft` for dividers inside a frame. No shadows, elevation, gradients, or glows. Depth is shown by a sunk surface (`--surface-sunk`) or by a line.
4. **Two typographic voices.** Content uses the system sans stack. Labels, meta, table headers, badges, buttons, and timestamps use 11px **monospace, lower case, 0.02em tracking**. Weights are 400 and 500, with 600 only for the wordmark. No web fonts.
5. **Two radii.** 8px for controls, 14px for panels. Pills (`1rem`) only for badges and counts; circles only for lamps and dots.
6. **Quiet controls.** Buttons are 32px tall, outlined, mono text. Each view gets **one** primary action (inverted ink). Danger is red and set apart, guarded in three tiers (reversible → confirm; destructive → reason; emergency → kill switch, reason, and typed name). Use the lowest tier that fits.
7. **Calm motion, plain words.** Motion shows only arrival or a change of state (fade from sunk surface, ≤1.6s ease-out) and is turned off under `prefers-reduced-motion`. Copy is sentence case and says the consequence: "Nothing needs you right now."

## Quick reference

| Role | Light | Dark | Use |
|---|---|---|---|
| `--ground` / `--surface` | `#ffffff` | `#08090a` | page and panels (same colour, separated by lines) |
| `--surface-sunk` | `#f4f4f6` | `#131417` | code, secrets, hover, "arrived" flash |
| `--ink` | `#232327` | `#d0d6e0` | text, primary button, focus ring |
| `--ink-soft` | `#4b4b53` | `#a9aeb8` | ledes, secondary text |
| `--ink-faint` | `#6f6f78` | `#8a8c95` | labels, meta, inactive nav |
| `--line` / `--line-soft` | `#e0e0e4` / `#ececef` | `#29292d` / `#1c1c20` | borders / inner dividers |
| `--ok` · `--warn` · `--danger` | `#1f8a5b` · `#b8720a` · `#c8322b` | `#3fbf86` · `#e2a33a` · `#f06a5f` | lamps, borders, fills |
| `--ok-text` · `--warn-text` | `#1a7d52` · `#9a6008` | same as signal | **signal-coloured text** (passes AA) |
| `--brand` | `#8a4b2a` | `#d08a62` | brand quill only |

Type: `--label` 11px · `--step--1` 13px · `--step-0` 14px (body) · `--step-1` 17px (h2) · `--step-2` 22px (tallies) · `--step-3` 28px (h1).
Space: rem steps from 0.25 to 2.5. Main padding is `1.75rem 2.25rem`; at 860px and below it becomes `1.25rem 1rem`.

Full token rationale, contrast table, and Tailwind / CSS-in-JS mappings are in `references/tokens.md`.

## How to apply

1. **Install the foundation.** Copy `assets/console-line.css` into the project and import it once. On Tailwind, or wherever classes aren't wanted, map the tokens as `references/tokens.md` shows. Never hand-copy hex values into components; always go through tokens.
2. **Compose from the catalogue.** Build screens from `references/components.md`: shell and rail, page header, attention panel, tallies, table, facts, badge (with the rule for choosing a signal), lamp, buttons, destructive tiers and kill switch, forms, options, dialog, tabs, queue/detail split, timeline, chart, notice, empty state. For React, start from `assets/react/ui.tsx`. Start a new component only after checking that none of these fits, and then follow "Extending" in `references/boundaries.md`.
3. **Write the words.** Follow `references/voice.md`: sentence case, consequence first, lower-case mono labels, humane empty states, verb + object on buttons.
4. **Illustrate only with Hairline figures,** and only when a figure is the clearest way to show state. Read `references/illustration.md` first.
5. **Verify.** Do every step below before saying it's done:
   - `node <skill>/scripts/check-style.mjs <css/tsx/html files or dirs>` exits 0, or every finding is justified in a comment.
   - Look at it in a real browser (headless Chrome/Playwright screenshots, Claude in Chrome, or by hand). If you can't, say plainly that it was not looked at.
   - Check light **and** dark (system setting plus `data-theme="dark"`/`"light"` on `<html>`).
   - Check the 860px breakpoint and keyboard focus. Every interactive element shows the 1.5px ink outline.
   - Compare side by side with `assets/specimen.html`. Nothing should look louder than the specimen.

## Boundaries at a glance

| Out of style | In style instead |
|---|---|
| Box/drop shadows, glows, elevation | 1px `--line` border; `inset 0 0 0 1px var(--line)` for an active nav item |
| Gradients, glass, blur | Flat `--surface` / `--surface-sunk` (the only gradient allowed is the kill-switch guard stripe) |
| A brand/accent hue (blue links, purple buttons) | Ink. The primary button is inverted ink; links are ink, underlined |
| Filled coloured chips or pills | Outlined badge: signal text plus a 45%-mix signal border |
| Coloured section backgrounds and hero bands | White ground, one bordered panel |
| UPPERCASE labels, bold headings, 700+ weights | lower-case mono labels; headings at weight 500 |
| Inter, Roboto, Google Fonts, icon fonts | System sans and system mono stacks |
| Icon-led buttons, emoji, decorative icons | Words. Glyphs limited to `×` (close), `→ ←` (paging), `·` (separator), `—` (no value) |
| Spinners, skeleton shimmer, bouncy or springy UI motion | Text "Loading overview…"; row arrival fades from sunk surface |
| Cards inside cards, a grid of stat cards | Tallies: one ruled row of numbers divided by hairlines |
| Toasts that pop and vanish | Inline `role="status"` text ("Saved") or an `error-note` beside the control |
| Stock illustrations, 3D renders, photos | Hairline isometric line figures only |

The complete list, with reasons and the rules for adding new things without drifting, is in `references/boundaries.md`.

## Red flags: stop and re-check

- Reaching for `box-shadow`, `linear-gradient`, `backdrop-filter`, or `font-weight: 700`
- Typing a hex colour inside a component
- A second filled (primary) button in the same view
- Colour used to make something "pop" rather than to say a state
- A signal colour shown with no word next to it
- An icon added "for scannability"
- An h1 above 28px, a hero section, or a centred marketing layout inside the app
- "It looks a bit plain". Plain is the style; the content and the signals do the work.

## Files

- `assets/console-line.css`: the portable stylesheet (tokens, both themes, every component)
- `assets/react/ui.tsx`: framework primitives (Lamp, Badge, PageHeader, Field, Check, Dialog, ReasonDialog, Time, Tally, Empty, ErrorNote)
- `assets/specimen.html`: a page showing every component, for visual comparison
- `scripts/check-style.mjs`: a linter for boundary violations in CSS, TSX/JSX, Vue, Svelte, and HTML
- `references/tokens.md`, `components.md`, `voice.md`, `boundaries.md`, `illustration.md`
