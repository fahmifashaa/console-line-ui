# Components

Every component the style has. Class names match `assets/console-line.css`. Each entry gives its anatomy, when to use it, and where it stops.

Before building anything new, check this list. Most "new" needs are one of these with different words.

---

## Layout

### Shell (rail + workspace)
```html
<div class="shell">
  <aside class="rail">
    <div class="wordmark"><span class="wordmark-mark" aria-hidden="true"></span>Product</div>
    <nav aria-label="Main">
      <a href="/" aria-current="page">Overview</a>
      <a href="/approvals">Approvals <span class="count" aria-label="3 waiting">3</span></a>
    </nav>
    <div class="rail-footer">
      <div class="whoami"><strong>Dewi Lestari</strong><span>Operator</span></div>
      <button class="link-button" type="button">Sign out</button>
    </div>
  </aside>
  <div class="workspace">
    <div class="stream stream--live"><span class="stream-dot" aria-hidden="true"></span><span>Live</span></div>
    <main>…</main>
  </div>
</div>
```
- The rail is a column of plain text links. Inactive links are `--ink-faint`; hover gets a sunk fill; the active link is ink with an **inset hairline ring** and no fill.
- Nav items carry **no icons**. The only adornment is a `.count` (a warn-outlined pill) for something waiting on the user.
- `.stream` is an optional connection read-out at the top right: dot + one lower-case word (live / connecting / reconnecting).
- At 860px and below the rail becomes a wrapping top bar. Don't add a hamburger menu.

### Page header
`<header class="page-header"><div><h1>Title</h1><p class="lede">One sentence on what this page is for.</p></div><div class="page-actions">…</div></header>`
- Every page has one, and the h1 is the only h1.
- The lede is one sentence in `--ink-soft`, at most 70ch, saying what the page is *for* (or, on a status page, what needs doing: "Nothing needs you right now.").
- `page-actions` holds at most the one primary action plus one or two outlined buttons. If the page's main task is a form further down (choose a plan, edit settings), that form's submit is the primary and the header holds outlined buttons only.
- The lede: on a **status** page (overview, queue, health) it says what needs doing ("One invoice is overdue."); on every other page it says what the page is for.
- Detail pages put a `.crumbs` link above the h1 (the parent, mono, faint) and may put a `.lamp` inside the h1 for the object's live state.

### Columns / split
- `.columns`: two equal columns, gap 2.5rem; `.columns--wide-left` is 2:1.
- `.split`: a list on the left (16–22rem) and a detail pane on the right, for a queue of things to decide.
- Both collapse to one column at 860px.

---

## Data display

### Attention panel
The top of a status page: one bordered panel listing only what needs a human.
```html
<section class="panel" aria-label="Needs attention">
  <h2>Needs attention</h2>
  <ul class="attention-list">
    <li>
      <span class="lamp lamp--warn" role="img" aria-label="Waiting for approval"></span>
      <div><a class="attention-title" href="…">invoice-bot wants to run <code class="mono">payments.send</code></a><p>Reason line.</p></div>
      <span class="label text-danger">High risk</span>
      <span class="muted nowrap">expires in 12 minutes</span>
    </li>
  </ul>
</section>
```
Grid: lamp | title + reason | signal word | time (8rem). With nothing to show, the empty state says everything is fine ("All agents are healthy and no approvals are waiting.").

### Tallies
A row of numbers between two `--line` rules, separated by `--line-soft`. **This replaces stat cards.**
`<section class="tallies"><div class="tally tally--warn"><span class="tally-value">2</span><span class="tally-label">instances silent</span></div>…</section>`
- The value is 22px at weight 400 with tabular figures. The label is a mono lower-case phrase that reads with the number: "2 instances silent", not "Silent instances: 2".
- Colour a tally (`--warn`, `--danger`) only when its value is non-zero *and* bad. Zero is always ink.
- No icons, sparklines, trend arrows, or percentage deltas.

### Table
```html
<div class="table-wrap"><table>
  <thead><tr><th aria-label="Signal"></th><th>Agent</th><th>State</th><th>Last contact</th><th></th></tr></thead>
  <tbody><tr>
    <td><span class="lamp lamp--ok" role="img" aria-label="Online"></span></td>
    <td><a class="strong-link" href="…">invoice-bot</a><div class="muted small">python, can wait for approval</div></td>
    <td><span class="badge badge--ok">Active</span></td>
    <td><time datetime="…" title="25 Oct 2026, 10:42:07">3 minutes ago</time></td>
    <td class="actions"><button class="button button--small">Edit</button></td>
  </tr></tbody>
</table></div>
```
- The frame is a 14px panel with a 1px line. Headers are mono, lower case, faint, weight 400. Rows are divided by `--line-soft`, with no zebra stripes.
- The first column may be a signal lamp, labelled with `th aria-label`.
- The primary cell is a `.strong-link` (weight 500) with a faint `.small` description under it.
- Muted (disabled or off) rows use `tr.is-muted`. New live rows use `tr.fresh` (a 1.6s fade from sunk).
- Missing values are written out ("None", "Never", "Not connected" in `.muted`) or shown as `—`, never left blank.
- Row actions are small outlined buttons, right-most, `nowrap`. Don't hide them in a kebab menu.
- Below 860px the table scrolls horizontally inside its frame (min-width 46rem); the page itself never scrolls sideways.

### Facts (definition grid)
`<dl class="facts"><div><dt>Owner</dt><dd>Dewi Lestari</dd></div>…</dl>`. The `dt` is a mono faint label; the `dd` is plain body text. Use `.facts--stacked` for two columns in a narrow pane. Use this for an object's properties instead of a two-column table or a card per field.

### Plain list
`.plain-list` gives rows separated by `--line-soft`: a lead line, a faint `.small` detail, then a `<time>`. Use it for feeds such as "Recent failures" or "Recent control actions". Paging is a `.list-more` row: a "View more" small button, then "Previous / Page 1 of 4 / Next" plus a "Show less" link-button.

### Timeline
`.timeline` is a 1px vertical line with dots: `--line` by default, `.timeline-item--warn` or `--danger` for a signal. A grid of a 5.5rem mono time and the text.

### Badge
`<span class="badge badge--ok">Active</span>`: an outlined pill with mono 11px text in sentence case.
- Modifiers: none (neutral: ink-soft text, line border), `--ok`, `--warn`, `--danger`.
- Map *states* to signals in code, not in CSS. Choose the signal for **any** state with this test:
  - **ok**: healthy or done as intended (active, running, approved, completed, paid)
  - **warn**: needs a human, or is time-sensitive, but can still be recovered (pending, requested, paused, suspended, overdue, expiring, over a soft limit)
  - **danger**: failed, lost, revoked, rejected, past a hard limit, or irreversible (failed, revoked, rejected, written off, terminated)
  - **neutral**: finished or out of play with nothing to do (refunded, cancelled, archived, retired, draft)

  When unsure between warn and danger, ask "can the user still fix this?" Yes → warn.
- Never filled, never uppercase, never with an icon. Two badges side by side get a 0.35rem gap.

### Lamp
`<span class="lamp lamp--ok" role="img" aria-label="Online" title="Online"></span>`: a 0.55rem dot (0.75rem inside an h1).
- `--ok`, `--warn`, `--danger` are filled; **idle is a hollow ring**. It always has an `aria-label` and `title` that say the state in words.
- Use it for the live state of a thing in a list or header. A lamp is never decoration and never a bullet point.

### Signal words
For a level such as risk, severity, or policy effect, use mono label text coloured by signal with no border: `<span class="label text-danger">High risk</span>`. Low is `.muted`, medium `.text-warn`, high and critical `.text-danger`. "Requires approval" stays ink, because it is neutral, not bad.

### Empty state
`<p class="empty">No agent is waiting on a decision.</p>`: faint text with 1rem vertical padding. **No illustration, no icon, no CTA card.** Say what is absent, or say that everything is fine. If there is an obvious next step, mention it in the sentence ("No agents yet. Register one to issue its enrollment token.") and keep the button in the page header.

### Loading
`<div class="boot">Loading overview…</div>`: words with a real ellipsis (…). No spinners or skeletons. Keep previous data on screen while refetching.

---

## Feedback

| Component | Look | Use |
|---|---|---|
| `.notice` | warn-soft fill, 1px warn left rule, square left corners | a standing condition the user should know ("3 executions are still running.") |
| `.error-note` (`role="alert"`) | danger text on danger-soft | an operation failed; placed right above the actions that caused it |
| `.warning-list > .warning` (`.warning--danger`) | soft-fill rows with a lamp | a set of health warnings on an object |
| `role="status"` muted text | plain faint text beside the button | success ("Saved"). No toast |

Never stack two kinds of feedback for the same event.

---

## Controls

### Buttons
| Class | Look | Use |
|---|---|---|
| `.button` | 32px, transparent, 1px line border, mono 11px, ink | the default for every action |
| `.button--primary` | filled ink, ground-coloured text; hover goes to ink-soft | **the one** main action of the view or dialog |
| `.button--danger` | filled danger, `--danger-ink` text | confirming a destructive action, inside its dialog only |
| `.button--danger-outline` | danger text, 50% danger border | starting a destructive or negative action (Reject, Delete rule) |
| `.button--small` | 26px | row actions, paging, plate controls |
| `.button--block` | full width | single-form cards (sign-in) |
| `.link-button` | mono underlined faint text | low-weight actions: Sign out, Show less |
| `.icon-button` | bare `×` at 1.4rem, faint | dialog close only |

- Labels are a verb plus an object in sentence case: "Register agent", "Save rule", "Issue new credential". For acknowledging a secret, "I've stored it".
- Disabled is 45% opacity with a not-allowed cursor. A disabled primary's label says what is missing ("Choose a plan"); once enabled, it says what will happen ("Upgrade to Enterprise"). Don't hide controls the user can't use, except role-gated ones.
- In a dialog, actions sit right-aligned in the order Cancel, then confirm. A destructive secondary action ("Delete") goes far left with `.push-left`.

### Destructive actions: three tiers
Pick the **lowest** tier that fits. Over-guarding is drift too.

| Tier | Example | Trigger | Confirm |
|---|---|---|---|
| 1. Reversible negative | Reject, Pause, Disable, Remove from list, Cancel subscription (resumable) | `.button--danger-outline` (or `.button` for neutral ones like Pause) | a plain dialog that states what happens and how to undo it. Ask for a reason only when it affects someone else or is audited |
| 2. Destructive | Delete a rule, Revoke a credential, Offboard | `.button--danger-outline` | ReasonDialog with `tone="danger"` and a `.button--danger` confirm. Add typed-name confirmation if data or access is lost for good |
| 3. Emergency, high blast radius | Kill an agent, stop every instance, wipe production | **kill switch** | `.dialog--danger` with reason **and** typed name; confirm disabled until both are filled in |

### Kill switch (tier 3 only)
```html
<button class="kill-switch" type="button"><span class="kill-switch-guard" aria-hidden="true"></span>Emergency kill</button>
```
A danger-soft body with a danger border and a striped guard square (the **only** gradient in the style). Pushed far right with `margin-left: auto`, apart from routine actions. It opens a `.dialog--danger` that requires **a reason** (recorded in the audit log) **and typing the object's name**. The `.button--danger` confirm stays disabled until both are filled in. The dialog states exactly what will happen and what won't ("Instances that are offline keep running until they reconnect").

Use it only for irreversible, high-blast-radius actions. At most one per screen.

### Forms
```html
<div class="field"><label for="n">Name</label><input id="n" … /><p class="hint">Lowercase letters, numbers, dots, dashes. Shown everywhere.</p></div>
```
- Labels sit above the input as mono lower-case faint text. There are no floating or placeholder-only labels.
- Inputs are 32px tall, transparent, with a 1px line border, ink-faint on hover, and the ink outline on focus.
- A hint under the field explains *consequence or format* in a sentence. Placeholders show an example value ("invoice-reconciler"), never an instruction.
- `.field-row` lays fields out in an auto-fit grid. `.filters` is a wrapping row of 12rem fields above a table. `.fieldset` groups checks under a mono legend. A `.check` is a native checkbox (`accent-color: ink`) with its label and hint stacked.
- Codes and identifiers use `.mono-input`.
- Validation uses native constraints. Show the server error as an `.error-note` above the actions.
- Settings forms are capped at 46rem (`.settings`).

### Options (choose one of a few)
```html
<fieldset class="options"><legend class="visually-hidden">Plan</legend>
  <label class="option"><input type="radio" name="plan" value="team" checked>
    <span><span class="option-title">Team <span class="badge">Current plan</span></span><span class="muted small">10 seats · 100k events</span></span></label>
  …
</fieldset>
```
Use for 2–4 mutually exclusive choices that need a line of explanation each (plans, modes, environments). Each option is outlined at 8px with a native radio. **Selected = ink border; nothing else changes**: no fill, no thicker ring, no check icon. Mark "current" with a neutral badge, separate from "selected". Five or more choices, or choices without explanation, go in a `<select>`. These are not cards: no shadows, no headers, no prices in giant type.

### Tabs
`.tabs > button.tab[role=tab][aria-selected]`: mono lower-case faint text; the selected tab is ink with a 1px ink underline sitting on the tabs' 1px line. No pills, no filled segments.

### Queue item
A full-width outlined button in a `.queue` list. `.is-selected` swaps its border to ink and nothing else changes. The title (weight 500, often mono) and the signal word sit on row 1; meta is on row 2.

### Dialog
A native `<dialog>` opened with `showModal()`. It has a 14px radius, a 1px line, a 50% near-black scrim, and a max width of 36rem. The header is h2 + `×`, then the body, then right-aligned actions. `.dialog--danger` tints the border. Any control action that changes another person's or an agent's world asks for a **reason** (ReasonDialog). Secrets show once in a `.secret` block (sunk, mono, `user-select: all`) with a hint on where to store them.

---

## Chart (when a series really is needed)
Prefer tallies. When the data is a series over time:
- Put it in a `.panel` with an h2 and the headline figure in words ("6.2k events today, 61% of the daily limit").
- **Data line:** 1.5px `--ink`, `vector-effect: non-scaling-stroke`. A second series uses `--ink-faint`. No more than two series; beyond that, use a table.
- **Area:** optional, `--surface-sunk`, with no gradient.
- **Gridlines:** 1px `--line-soft`, horizontal only, 3–4 of them, or none.
- **Threshold or limit:** a 1px `--ink-faint` line dashed `1 3`, labelled at its end in a mono label ("limit 10k").
- **Breach:** a `--warn` dot on the points over a soft limit (`--danger` for a hard limit), with the word "over" next to them. The line itself stays ink.
- **Labels:** mono `--label` and `--ink-faint`, placed at the line ends instead of a legend box. Keep text at real size: give the SVG a fixed pixel height and let only its width stretch (or cap the width), so 11px labels don't scale.
- **Accessibility:** `role="img"` with `<title>`/`<desc>` summarising the trend, plus the numbers available as a table or in prose nearby.
- No tooltips that carry information you can't get elsewhere, no animation on draw, no 3D, no pie or donut charts.

---

## Illustration plate
`.plate` is a bordered 14px frame that holds a Hairline figure (see `illustration.md`). Mono read-outs go in the corners: `.plate-tag` top-left (a summary such as "4 active · 1 pending") and `.plate-corner` top-right, holding `.plate-read` (the name and state of whatever is under the pointer) plus small buttons. The figure itself carries no text.

---

## Data formatting

- **Time:** use **relative** time for events (when something happened or will expire: "3 minutes ago", "in a moment", "just now", "never") inside `<time datetime>`, with the absolute value in `title` (`en-GB`, medium date and time). Use **absolute** dates for documents and calendar facts (invoice dates, due dates, schedules, birthdays): "15 Oct 2026", with the relative value in `title` if helpful.
- **Numbers in tables:** right-align amounts and counts with `th.num` / `td.num`.
- **Enums:** shown in sentence case with underscores turned into spaces (`require_approval` → "Require approval").
- **Separators:** a middle dot with spaces (` · `) between meta items.
- **Quotes:** curly quotes around human-written reasons (“…”).
- **Numbers:** tabular. Spell out a count of one in prose ("One thing needs a decision or a look."); use digits elsewhere.
- **Identifiers and API names:** `<code class="mono">` inline.
