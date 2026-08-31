# Prototype: validate parser rules against sample files

Type: prototype
Status: resolved
Blocked by: 02, 03, 04, 05

## Question

Build a throwaway prototype applying the decided model shape and parsing rules (model shape, naming-convention grouping, type inference, reference handling, malformed-input handling) against 2-3 representative sample `tokens.css` files — a clean happy-path file, one with typography and references, and one exercising the malformed/edge-case ticket's scenarios — to sanity-check the rules hold together before they're handed off as the final spec.

## Answer

**Verdict: the rules hold together as designed — no changes needed to any prior ticket.** Built a pure parsing module (`parseCssTokens`) implementing tickets 01/02/03/05 exactly, plus 4 fixture files and a small TUI to eyeball results interactively.

Location: `.scratch/css-to-json-parser/prototype/` — `parser.mjs` (pure logic, portable — no I/O), `fixtures/*.css` (happy-path, typography-assembly, malformed-edge-cases, empty), `run.mjs` (throwaway TUI shell, keys `1`-`4` switch fixture, `q` quits). Run with `node .scratch/css-to-json-parser/prototype/run.mjs`.

Headless run against all 4 fixtures confirmed:

- **happy-path**: 8 tokens (3 color incl. a `-hover` multi-word name, 4 dimension incl. border-radius via `dimension.radius.*`, 1 typography merged from 3 declarations), 0 warnings.
- **typography-assembly**: 3 typography tokens correctly assembled across different subgroups (`typography.body`, `typography.nav.link`, `typography.heading`) — confirms the reserved-suffix mechanism and subgroup/name split both work together.
- **malformed-edge-cases**: exactly 2 valid tokens survive; every scenario from the malformed-input ticket produced the expected warning (bad prefix, missing name, bad typography suffix, incomplete triplet, duplicate-last-wins, `var()` falling through to "invalid color value" with **no special-casing needed**) — confirms the ticket 05 answer's claim that `var()` needs no dedicated handling. Non-root and non-custom-property declarations were silently ignored as designed, comments were silently stripped.
- **empty**: `{ tokens: [], warnings: [] }`, no crash.

Not committed to a throwaway branch per the prototype skill's usual capture step — left as plain files in this directory instead, since committing wasn't requested. The map is now fully resolved (see map.md's Decisions so far / empty Not-yet-specified) — this was the last ticket.
