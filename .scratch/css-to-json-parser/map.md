# CSS to JSON Parser

## Destination

A design spec for (1) the shared `Token`/`TokenGroup` model and (2) the `tokens.css` → model parser described in SPEC.md item 1's CSS-inference path: value-shape type inference, `--group-subgroup-name` naming-convention grouping, and `var(--x)` reference handling. Ready to hand off for implementation — this map produces a spec, not code. The DTCG-JSON-reading parser (the other half of SPEC.md item 1) is a separate future effort.

## Notes

- Domain: design-token-manager, a solo 7-week bootcamp capstone (see SPEC.md for full MVP scope). Consult SPEC.md for constraints (one level of subgroups, token types in scope: color/dimension/typography, references via `var(--x)`).
- Parsing approach: hand-rolled string/regex parsing of `:root { --x: y; }` declarations — no CSS parsing library (postcss etc.). Decided directly during charting (2026-08-31), no ticket needed.
- Use `/grilling` and `/domain-modeling` to resolve tickets unless a ticket says otherwise.

## Decisions so far

(none yet)

## Not yet specified

- UI/UX for surfacing CSS parse errors/warnings to the user — depends on what the parser returns on malformed input (see the malformed/edge-case ticket) and on how the folder-loading flow (lib/tokenFileSystem.ts) wires the parser in. Too early to ticket until that shape is decided.

## Out of scope

- DTCG-JSON-reading parser (parsing/validating/rewriting an uploaded `tokens.json` into the correct format) — SPEC.md item 1's other ingestion path. Ruled out during destination-naming: a separate future effort with its own open questions (what counts as "correct" format, how aggressive the rewrite is).
- Serializing the parsed model back out to `tokens.css` / regenerating CSS output — SPEC.md item 5's save/write-back concern, not parsing.
- Reference cycle detection and full value resolution (SPEC.md item 4, the Week 4 resolution engine) — this map's reference-handling ticket only decides how `var()` syntax is captured as an unresolved reference in the model, not how it's resolved or cycle-checked.
