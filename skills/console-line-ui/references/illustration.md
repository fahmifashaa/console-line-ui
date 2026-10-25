# Illustration: Hairline figures

The style has exactly one kind of image: an **isometric line figure** drawn on the Hairline kernel by Lucas Marques (MIT, github.com/lucasmarkes/hairline). The UI took its look from these figures: the same ink, the same ground, the same 1px stroke, and the same rule that colour is information.

## When a figure earns its place

Use one only when it shows **live state better than a table can**, and it sits *above* the table that holds the same data (the figure never replaces the accessible data).

A worked example: a fleet floor where every agent is a small figure, and the floor reads left to right as the lifecycle:
- an egg in a nest (pending), rocking now and then, cracking on hover
- a robot on a turntable (active); with an instance online it watches the pointer, its antenna lamp blinks with the heartbeat, and a dot circles the plinth while work runs
- a robot asleep on a mat (suspended), with rising Z's, stirring on hover
- a robot behind bars (revoked) with a snapped antenna, twitching while termination is unconfirmed
- a graveyard of headstones (retired) on a second floor, oldest first; hover raises a dashed ghost

The lesson that carries over: **every visual difference encodes a state, and every motion encodes a live signal.** Nothing moves just to be alive.

Don't use figures as decoration, as empty-state art, as section headers, or as loading animations.

## Rules (from the Hairline study; a figure that breaks one is not finished)

1. **Hit areas don't move.** Hit-test the rest or target pose, never the pose currently on screen.
2. **Stagger by distance** from the pointer (30–60ms steps), not by index.
3. **Clamp the reach.** Nothing leaves the frame at the extremes.
4. **The stroke is the only highlight.** No fills, glows, or shadows. Exactly one bright mark (`hi`) at a time.
5. **Rest is designed.** The still frame is a composition, never a flat grid.
6. **Honest construction.** Plates are opaque in the ground colour, painted back to front. Guides are dashed and sit behind their plate.
7. **Loops sleep offscreen.** All motion goes through the kernel's `register(stage, tick)`. No own timers, `requestAnimationFrame`, or CSS animations.
8. **Two clocks.** Choices get a 700ms ease-out `(.32,.72,0,1)` tween; pointer position gets a spring (k 100, c 18, m 1).
9. **Round every corner, draw less.** A solid is a silhouette plus one dim crease. No vertical corner lines.
10. **No words inside the figure.** Names go to the corner read-out (`.plate-read`), never into the SVG.

Under reduced motion, everything lands at once.

## Palette

The kernel's classes are the whole palette: (none), `sil`, `hi`, `lo`, `nf`, `fo`, `dash`, `dot`, `dot m`, `dot off`. A figure sets no colour, width, or fill of its own. `console-line.css` points the kernel's `--hairline-*` variables at the UI tokens (see `tokens.md`), so figures follow the theme automatically.

## Building one

- **To draw a new figure**, use the `hairline-create` skill if it is installed (`npx skills add lucasmarkes/hairline`). It holds the kernel, the bench, the validator, and the visual check (`look.mjs`).
- **To turn an existing SVG into a figure**, use `hairline-adopt`.
- **To embed one in an app:** vendor `kernel.js` unchanged, with its MIT header and a LICENSE file crediting Lucas Marques. Write the scene as a module exporting `mount(stage, data, handlers) → { destroy }`, and wrap it in a component that remounts only when the drawn data changes (compare a JSON signature), not on every refetch.
- **Frame:** put the figure in a `.plate`, set the stage's `aspect-ratio` to the viewBox, `role="img"` with an `aria-label` summarising the state, a `.plate-tag` summary top-left, and a `.plate-read` (`aria-live="polite"`) top-right naming what is under the pointer ("invoice-bot · 2 online · 1 running").
- **Interaction:** hover names, click opens the object's page, and the cursor becomes a pointer only over a hit.

## Licence

The kernel is MIT. Keep its copyright header in the vendored file and ship its LICENSE alongside it. Credit it in the project README.
