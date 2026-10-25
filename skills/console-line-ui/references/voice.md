# Voice

Copy is part of the style. The look is calm and exact, so the words must be too. A UI in the right colours that talks like a marketing site is not console-line-ui.

## Principles

1. **Say the consequence, not the mechanism.** "Revokes every credential and token at once and sends a stop to all 3 running instances." not "This will trigger the kill workflow."
2. **Talk to one person about their work.** "Nothing needs you right now." · "Choose a request to see what the agent wants to do."
3. **Plain, short, complete sentences.** No exclamation marks, no "Oops", no "Awesome!", no emoji.
4. **Name things the same way every time.** Pick one word per concept (agent, instance, execution, approval) and never vary it for style.
5. **Be honest about uncertainty.** "Instances that are offline keep running until they reconnect, and will show as unconfirmed." Say what the system does *not* know.

## Casing

| Where | Case | Example |
|---|---|---|
| h1, h2, nav, buttons, badges, enum values | Sentence case | "Live activity", "Register agent", "Pending" |
| Mono labels (th, field labels, legends, dt, tabs, tally labels, stream) | **lower case**, applied by CSS; write them in sentence case in source | `Filter by state` renders as "filter by state" |
| Plate read-outs and tags | lower case, written that way | "4 active · 1 pending", "retired 3 →" |
| Identifiers, actions, scopes, env vars | as-is, in mono | `payments.send`, `APP_ENROLLMENT_TOKEN` |

Never use Title Case For Headings or ALL CAPS.

## Patterns

**Ledes:** one sentence on what the page is for. "Actions that agents may only take after a person agrees." · "Every agent, bot, and automation with access, and who answers for it."

**Status ledes** count what needs doing: "Nothing needs you right now." / "One thing needs a decision or a look." / "4 things need a decision or a look."

**Empty states** say what is absent, or that all is well:
- "No agent is waiting on a decision."
- "No one has paused, stopped, or killed anything yet."
- "All agents are healthy and no approvals are waiting."
- With a next step: "No agents yet. Register one to issue its enrollment token."
- With filters active: "No agents match these filters."

**Buttons:** a verb plus an object. "Save rule", "Issue enrollment token", "Pause feed" / "Resume feed" (the label flips with state), "Mark reviewed today". Avoid "Submit", "OK", "Yes", "Confirm" on their own. A destructive confirm repeats the action: "Kill identity", "Start offboarding".

**Hints** give a format, a consequence, or an audience:
- Format: "Lowercase letters, numbers, dots, dashes. Shown everywhere."
- Consequence: "Recorded in the audit log."
- Audience: "What it does and why it needs access. Reviewers read this." · "Optional. The agent and the audit log see it."

**Confirmations** state what happens and what stays: "Your name and reason are recorded in the audit log. Its access stays revoked."

**Secrets:** "Start the agent with `APP_ENROLLMENT_TOKEN` set to this value. Put it in the platform's secret store, never in source code." The button is "I've stored it".

**Loading:** "Loading overview…" (a real ellipsis character).

**Errors:** show the server's message as it is in an `error-note`. If you write one yourself, say what failed and what to do: "Couldn't save the rule. Check the action pattern and try again." Don't apologise or blame the user.

**Capabilities and roles** are described as what something *can do*: "Can wait for approval", "Can obey pause and stop", "Sends activity".

## Punctuation and typography

- Curly quotes “ ” around quoted human reasons. Real apostrophes ('), a real ellipsis (…), and an em dash (—) for "no value".
- ` · ` (a middle dot with spaces) separates meta.
- Arrows `→` / `←` only for directional navigation ("retired 3 →", "← back").
- The Oxford comma: "paused, stopped, or killed".

## Language

The source UI is in English (en-GB date formatting). For another language, keep the same principles: consequence first, sentence case, no exclamation marks. Keep identifiers and mono labels untranslated where they are code.
