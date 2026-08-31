# CSS to JSON Parser

## Destination

A design spec for (1) the shared `Token`/`TokenGroup` model and (2) the `tokens.css` → model parser described in SPEC.md item 1's CSS-inference path: value-shape type inference and `--group-subgroup-name` naming-convention grouping. Ready to hand off for implementation — this map produces a spec, not code. The DTCG-JSON-reading parser (the other half of SPEC.md item 1) is a separate future effort. References/aliases (`var(--x)`) are out of scope — see Out of scope.

## Notes

- Domain: design-token-manager, a solo 7-week bootcamp capstone (see SPEC.md for full MVP scope). Consult SPEC.md for constraints (one level of subgroups, token types in scope: color/dimension/typography). Note: references/aliases are cut from this map's scope entirely — see Out of scope.
- Parsing approach: hand-rolled string/regex parsing of `:root { --x: y; }` declarations — no CSS parsing library (postcss etc.). Decided directly during charting (2026-08-31), no ticket needed.
- Use `/grilling` and `/domain-modeling` to resolve tickets unless a ticket says otherwise.

## Decisions so far

- [Token/TokenGroup model shape](issues/01-model-shape.md) — flat normalized `Token[]` (no `TokenGroup` tree); typography is a composite value, dimension is split `{value, unit}`, color stays a string; `id` is a derived `type.subgroup.name` path string; references/aliases dropped from the model entirely for now (real MVP scope cut, not just a simplification — see the ticket).
- [Naming-convention grouping](issues/02-naming-convention-grouping.md) — `TokenType` read literally from the property name's first segment (`color`/`dimension`/`typography`), not inferred from value shape; second remaining segment is subgroup, rest joins into name; typography uses a reserved last-segment suffix (`family`/`size`/`weight`) to assemble 3 declarations into 1 composite token. This rescoped [Value parsing and validation](issues/03-type-inference.md) (formerly "type inference") — see that ticket.
- [Value parsing and validation](issues/03-type-inference.md) — color: hex/rgb(a) only, stored as-is; dimension: whitelisted units (`px`/`rem`/`em`/`%`), unit always required even for `0`; typography sub-fields reuse color/dimension rules plus a numeric-or-keyword rule for weight. `parseValue()` returns `null` on invalid input — no throw, no result object.
- [Malformed/edge-case CSS handling](issues/05-malformed-edge-cases.md) — skip-and-collect, never throw; returns `{ tokens, warnings }`. Non-token declarations silently ignored; duplicates last-wins-with-warning; bad values/incomplete typography triplets skipped-with-warning; empty file is not an error.
- [Prototype: validate parser rules](issues/06-prototype-validate-parser.md) — built and ran a reference implementation against 4 fixtures; all four resolved decisions (01/02/03/05) hold together with no changes needed. Prototype lives at `prototype/` in this directory.

## Not yet specified

(none — the frontier reached the destination)

## Out of scope

- DTCG-JSON-reading parser (parsing/validating/rewriting an uploaded `tokens.json` into the correct format) — SPEC.md item 1's other ingestion path. Ruled out during destination-naming: a separate future effort with its own open questions (what counts as "correct" format, how aggressive the rewrite is).
- Serializing the parsed model back out to `tokens.css` / regenerating CSS output — SPEC.md item 5's save/write-back concern, not parsing.
- References/aliases entirely (SPEC.md item 4) — not just cycle detection/resolution, but the literal-vs-reference representation itself. Dropped from the `Token`/`TokenGroup` model while resolving [Token/TokenGroup model shape](issues/01-model-shape.md); this is a real MVP scope cut, not a modeling simplification — worth revisiting whether SPEC.md itself should be updated. [var() reference handling](issues/04-reference-handling.md) was closed unresolved as a result — `var(--x)` in a `tokens.css` value is now just an unsupported value, handled by [Malformed / edge-case CSS handling](issues/05-malformed-edge-cases.md).
- UI/UX for surfacing parse `warnings` to the user, and wiring the parser into the folder-loading flow (`lib/tokenFileSystem.ts`) — the destination is a model+parser spec, not a UI spec. [Malformed/edge-case CSS handling](issues/05-malformed-edge-cases.md) defines the `{ tokens, warnings }` shape a future UI effort would consume.
