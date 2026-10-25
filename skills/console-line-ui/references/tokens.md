# Tokens

`assets/console-line.css` is the single source of these tokens. This file explains each token, gives its contrast, and shows how to carry the set into other stacks.

## Colour

The palette is deliberately small: a ground, three inks, two lines, three signals, and one brand note. If a design seems to need more, it is trying to say something with colour that should be said with words, weight, or position.

### Neutrals

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--ground` | `#ffffff` | `#08090a` | page background |
| `--surface` | `#ffffff` | `#08090a` | panels, tables, dialogs. **The same as ground on purpose**: a frame is a line, not a different fill |
| `--surface-sunk` | `#f4f4f6` | `#131417` | recessed: code blocks, secrets, JSON inputs, nav hover, row hover (55% mix), new-row flash |
| `--accent` | `#232327` | `#d0d6e0` | equals ink. The accent *is* the ink; there is no brand hue |
| `--accent-ink` | `#ffffff` | `#08090a` | text on accent |
| `--accent-soft` | `#f0f0f2` | `#17181b` | rare neutral tint (selected backgrounds when a line is not enough) |
| `--ink` | `#232327` | `#d0d6e0` | body text, headings, primary button fill, focus ring, selected tab underline |
| `--ink-soft` | `#4b4b53` | `#a9aeb8` | ledes, descriptions, secondary body, payload text |
| `--ink-faint` | `#6f6f78` | `#8a8c95` | labels, table headers, timestamps, inactive nav, hints, empty states, hover borders |
| `--line` | `#e0e0e4` | `#29292d` | frame borders, control borders, header rules |
| `--line-soft` | `#ececef` | `#1c1c20` | row dividers and separators *inside* a frame |
| `--scrim` | `rgba(8,9,10,.5)` | same | dialog backdrop |

Dark mode is not inverted grey. Its ink is a cool blue-grey (`#d0d6e0`) on a near-black with a faint green-blue cast. Keep that pair; don't substitute pure `#fff` on `#000`.

### Signals

| Token | Light | Dark | Means |
|---|---|---|---|
| `--ok` | `#1f8a5b` | `#3fbf86` | healthy, live, allowed, approved, done |
| `--warn` | `#b8720a` | `#e2a33a` | needs attention, waiting, paused, suspended, degraded |
| `--danger` | `#c8322b` | `#f06a5f` | failed, revoked, rejected, destructive, high or critical risk |
| `--ok-text` | `#1a7d52` | `#3fbf86` | `--ok` when used as **text** |
| `--warn-text` | `#9a6008` | `#e2a33a` | `--warn` when used as **text** |
| `--danger-ink` | `#ffffff` | `#08090a` | text on a solid danger fill |
| `--warn-soft` | `#fbf3e4` | `#2a2114` | notice and warning row backgrounds |
| `--danger-soft` | `#fbeceb` | `#2a1716` | error-note background, kill-switch body |

The **idle** signal has no colour. It is a hollow lamp, an inset 1px ring of `--ink-faint`.

Signal borders use `color-mix(in srgb, var(--signal) 45%, transparent)` so a badge's outline stays a hairline rather than a stroke. Danger outline buttons use 50%, the danger dialog border 55%.

### Brand

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brand` | `#8a4b2a` | `#d08a62` | **only** the wordmark quill (and the favicon). Never text, never a button, never a chart series |

**In another product:** keep the quill *shape* as the mark slot and the product's name as the wordmark. The product may replace `--brand` (light and dark values, each at least 3:1 on its ground) with its own single brand colour, which is still used only in the mark and favicon. Everything else stays ink.

The quill is a 0.55rem × 1.35rem leaf (`border-radius: 1rem 0.2rem`) rotated 18°. Favicon: `<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#232327"/><rect x="13" y="6" width="6" height="20" rx="3" transform="rotate(18 16 16)" fill="#c27a4f"/></svg>`.

### Hairline figure palette

These come from the Hairline kernel. `console-line.css` sets them through `--hairline-*` so figures share the UI's ground and ink.

| Var | Light | Dark | Role in a figure |
|---|---|---|---|
| `--hairline-plate` | ground | ground | fill of opaque plates |
| `--hairline-hi` | ink | ink | the one highlight stroke / bright dot |
| `--hairline-edge` | `#a4a4ac` | `#5b5d64` | silhouettes |
| `--hairline-mid` | `#c3c3c9` | `#3e3e44` | default stroke, creases |
| `--hairline-lo` | line | line | dim strokes, off dots |

## Contrast (WCAG 2.x, measured)

| Pair | Light | Dark | Verdict |
|---|---|---|---|
| ink / ground | 15.7 | 13.6 | AAA |
| ink-soft / ground | 8.6 | 9.0 | AAA |
| ink-faint / ground | 5.0 | 6.0 | AA (also on sunk: 4.5 / 5.5) |
| ok / ground | 4.3 | 8.6 | light: **non-text only** (lamps, borders) → use `--ok-text` (5.1) for text |
| warn / ground | 3.9 | 9.1 | light: **non-text only** → use `--warn-text` (5.2) for text |
| danger / ground | 5.3 | 6.6 | AA as text |
| danger / danger-soft | 4.6 | 5.6 | AA |
| danger-ink / danger | 5.3 | 6.6 | AA (dark uses near-black text; white would be 3.0) |
| line / ground | 1.3 | 1.4 | decorative structure only; never the sole boundary of a control's *state* |

The 1.3:1 line means focus can never be shown by a border colour change alone. Focus is always the 1.5px ink outline.

## Type

| Token | Size | Use |
|---|---|---|
| `--label` | 0.6875rem (11px) | mono labels, buttons, badges, th, timestamps, crumbs |
| `--step--1` | 0.8125rem (13px) | table body, hints, list meta, `.small` |
| `--step-0` | 0.875rem (14px) | body |
| `--step-1` | 1.0625rem (17px) | h2, wordmark, approval reason |
| `--step-2` | 1.375rem (22px) | tally values, large wordmark |
| `--step-3` | 1.75rem (28px) | h1, the largest type in the app |

- `--font`: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
- `--mono`: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
- Body line-height 1.5; headings 1.2. h1 tracking -0.02em, wordmark -0.01em, mono labels +0.02em.
- `font-variant-numeric: tabular-nums` everywhere, so numbers line up in tallies and tables.
- Inline `code`/`.mono` is 0.86em of its context.

## Shape, size, space

| Token | Value | Use |
|---|---|---|
| `--radius-control` | 8px | buttons, inputs, nav items, notices, queue items, secrets |
| `--radius-panel` | 14px | table frames, panels, dialogs, plates, login card |
| (pill) | 1rem | badges and counts only |
| (guard) | 4px | kill-switch guard only |
| `--control-h` | 32px | buttons, inputs, selects |
| `--control-h-small` | 26px | table-row and paging buttons |
| stroke | 1px | every border; focus outline 1.5px |
| rail width | 13.5rem | |
| content max | 92rem | `main` |
| prose max | 65–80ch | ledes 70ch, notices 80ch, reasons 65ch |
| breakpoint | 860px | one breakpoint; the rail becomes a top bar |

## Porting

### Tailwind (v3 `tailwind.config.js` or v4 `@theme`)

Keep `console-line.css`'s `:root` blocks as the source and point Tailwind at the variables. Don't paste the hex values.

```js
// tailwind.config.js
export default {
  darkMode: ["variant", ["@media (prefers-color-scheme: dark) { &:not([data-theme=light] *) }", "&:is([data-theme=dark] *)"]],
  theme: {
    colors: {
      transparent: "transparent", current: "currentColor",
      ground: "var(--ground)", surface: "var(--surface)", sunk: "var(--surface-sunk)",
      ink: { DEFAULT: "var(--ink)", soft: "var(--ink-soft)", faint: "var(--ink-faint)" },
      line: { DEFAULT: "var(--line)", soft: "var(--line-soft)" },
      ok: { DEFAULT: "var(--ok)", text: "var(--ok-text)" },
      warn: { DEFAULT: "var(--warn)", text: "var(--warn-text)", soft: "var(--warn-soft)" },
      danger: { DEFAULT: "var(--danger)", ink: "var(--danger-ink)", soft: "var(--danger-soft)" },
      brand: "var(--brand)",
    },
    fontFamily: { sans: "var(--font)", mono: "var(--mono)" },
    fontSize: { label: "var(--label)", sm: "var(--step--1)", base: "var(--step-0)", lg: "var(--step-1)", xl: "var(--step-2)", "2xl": "var(--step-3)" },
    fontWeight: { normal: "400", medium: "500", semibold: "600" },
    borderRadius: { none: "0", control: "var(--radius-control)", panel: "var(--radius-panel)", pill: "1rem", full: "9999px" },
    boxShadow: { none: "none", hairline: "inset 0 0 0 1px var(--line)" },
    extend: {},
  },
};
```

Replacing (not extending) `colors`, `boxShadow`, and `fontWeight` is deliberate: it removes `shadow-lg`, `bg-blue-500`, and `font-bold` from the vocabulary, so drift fails to compile instead of slipping through. A mono label is `font-mono text-label lowercase tracking-[0.02em] text-ink-faint`; wrap it in a component rather than repeating it.

### CSS-in-JS / design tokens JSON

Export the same names. Components read `var(--token)` at runtime, so the theme switch stays a CSS concern:

```ts
export const t = {
  ground: "var(--ground)", surface: "var(--surface)", sunk: "var(--surface-sunk)",
  ink: "var(--ink)", inkSoft: "var(--ink-soft)", inkFaint: "var(--ink-faint)",
  line: "var(--line)", lineSoft: "var(--line-soft)",
  ok: "var(--ok)", okText: "var(--ok-text)", warn: "var(--warn)", warnText: "var(--warn-text)", danger: "var(--danger)",
  mono: "var(--mono)", label: "var(--label)", radiusControl: "var(--radius-control)", radiusPanel: "var(--radius-panel)",
} as const;
```

### Theme switching

Three states: system (no attribute), `data-theme="light"`, and `data-theme="dark"` on `<html>`. The stylesheet handles all three. A toggle writes the attribute and remembers it, wrapping storage access in try/catch. If a toggle is shown, it is a `.link-button` or a small outlined `.button` with the words "light" / "dark" / "system", never a sun/moon icon.
