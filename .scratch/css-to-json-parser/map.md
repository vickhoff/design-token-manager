# CSS to JSON Parser

## Destination

A design spec for (1) the shared `Token`/`TokenGroup` model and (2) the `tokens.css` → model parser described in SPEC.md item 1's CSS-inference path: value-shape type inference and `--group-subgroup-name` naming-convention grouping. Ready to hand off for implementation — this map produces a spec, not code. The DTCG-JSON-reading parser (the other half of SPEC.md item 1) is a separate future effort. References/aliases (`var(--x)`) are out of scope — see Out of scope.

## Notes

- Domain: design-token-manager, a solo 7-week bootcamp capstone (see SPEC.md for full MVP scope). Consult SPEC.md for constraints (one level of subgroups, token types in scope: color/dimension/typography). Note: references/aliases are cut from this map's scope entirely — see Out of scope.
- Parsing approach: hand-rolled string/regex parsing of `:root { --x: y; }` declarations — no CSS parsing library (postcss etc.). Decided directly during charting (2026-08-31), no ticket needed.
- Use `/grilling` and `/domain-modeling` to resolve tickets unless a ticket says otherwise.

## Decisions so far

_(Several entries below carry a 2026-09-01 amendment made during actual implementation, after the map was first walked — typography's composite/merge design was reversed in favor of treating it as a flat namespace like color/dimension. Each ticket's own Amendment section has the reasoning; this index reflects the current, amended state.)_

- [Token/TokenGroup model shape](issues/01-model-shape.md) — flat normalized `Token[]` (no `TokenGroup` tree); dimension is split `{value, unit}`, color stays a string; `id` is a derived `type.subgroup.name` path string; references/aliases dropped from the model entirely for now (real MVP scope cut, not just a simplification — see the ticket). **Amended:** typography is no longer composite — no `TypographyValue`, `Token.value` is `string | number | DimensionValue`, reusing the same shapes as color/dimension.
- [Naming-convention grouping](issues/02-naming-convention-grouping.md) — `TokenType` read literally from the property name's first segment (`color`/`dimension`/`typography`), not inferred from value shape; second remaining segment is subgroup, rest joins into name. **Amended:** typography now follows this exact same algorithm — the reserved `family`/`size`/`weight` suffix and 3-declarations-merge-into-1 mechanism are gone.
- [Value parsing and validation](issues/03-type-inference.md) — color: hex/rgb(a) only, stored as-is; dimension: whitelisted units (`px`/`rem`/`em`/`%`), unit always required even for `0`. `parseValue()` returns `null` on invalid input — no throw, no result object. **Amended:** `parseValue` dropped its `subField` parameter; typography values are now classified by shape (dimension-shaped → size, numeric/keyword → weight, else → family string). Accepted tradeoff: unlike color/dimension, invalid typography values (including `var()`) silently pass through as a family string rather than warning.
- [Malformed/edge-case CSS handling](issues/05-malformed-edge-cases.md) — skip-and-collect, never throw; returns `{ tokens, warnings }`. Non-token declarations silently ignored; duplicates last-wins-with-warning; empty file is not an error. **Amended:** "incomplete typography triplet" no longer exists as a scenario (nothing to assemble); see ticket 03's amendment for the new typography/`var()` asymmetry that replaces it.
- [Prototype: validate parser rules](issues/06-prototype-validate-parser.md) — built and ran a reference implementation against 4 fixtures; all four resolved decisions (01/02/03/05) held together at the time. **Amended:** this prototype validated the pre-revision composite design and is now a historical record, not current — `lib/tokens/` in the app itself is the live source of truth.

## Not yet specified

(none — the frontier reached the destination)

## Out of scope

- DTCG-JSON-reading parser (parsing/validating/rewriting an uploaded `tokens.json` into the correct format) — SPEC.md item 1's other ingestion path. Ruled out during destination-naming: a separate future effort with its own open questions (what counts as "correct" format, how aggressive the rewrite is).
- Serializing the parsed model back out to `tokens.css` / regenerating CSS output — SPEC.md item 5's save/write-back concern, not parsing.
- References/aliases entirely (SPEC.md item 4) — not just cycle detection/resolution, but the literal-vs-reference representation itself. Dropped from the `Token`/`TokenGroup` model while resolving [Token/TokenGroup model shape](issues/01-model-shape.md); this is a real MVP scope cut, not a modeling simplification — worth revisiting whether SPEC.md itself should be updated. [var() reference handling](issues/04-reference-handling.md) was closed unresolved as a result — `var(--x)` in a `tokens.css` value is now just an unsupported value, handled by [Malformed / edge-case CSS handling](issues/05-malformed-edge-cases.md).
- UI/UX for surfacing parse `warnings` to the user, and wiring the parser into the folder-loading flow (`lib/tokenFileSystem.ts`) — the destination is a model+parser spec, not a UI spec. [Malformed/edge-case CSS handling](issues/05-malformed-edge-cases.md) defines the `{ tokens, warnings }` shape a future UI effort would consume.
