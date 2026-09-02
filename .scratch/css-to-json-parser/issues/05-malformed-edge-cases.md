# Malformed / edge-case CSS handling

Type: grilling
Status: resolved
Blocked by: 02, 03

## Question

Define the parser's behavior on CSS input that doesn't fit the happy path. Concrete scenarios identified so far (see [Naming-convention grouping](02-naming-convention-grouping.md) and [Value parsing and validation](03-type-inference.md) for where each comes from):

- Custom properties declared outside `:root`; non-custom-property declarations; CSS comments; a `tokens.css` with no custom properties at all
- Duplicate declarations for the same custom property
- First name segment isn't `color`/`dimension`/`typography` (naming-convention ticket, step 2)
- `color`/`dimension` property with no name segment left after the type keyword (naming-convention ticket, step 3)
- `typography` property whose last segment isn't `family`/`size`/`weight` (naming-convention ticket, step 4)
- An incomplete typography triplet — only 1 or 2 of the 3 expected declarations (`family`/`size`/`weight`) present for a given `type.subgroup.name` id (naming-convention ticket, step 4)
- A value that doesn't match its declared type's expected shape — e.g. `--color-brand-primary: 8px;` (value-parsing ticket's fallback)
- `var(--x)` references — unsupported now that references were dropped from the model (see the closed [reference-handling ticket](04-reference-handling.md))

Does the parser throw, skip-and-warn, or collect errors/warnings alongside the successfully parsed tokens? Does behavior differ across these scenarios (e.g. a bad single declaration is skippable, but should an incomplete typography triplet behave differently from a single bad color)?

## Answer

**Overall strategy: skip-and-collect, never throw for per-declaration issues.** Returns `{ tokens: Token[]; warnings: ParseWarning[] }`. A single typo in a 200-line file shouldn't lose the whole file — the user gets everything that parsed plus a list of what didn't. The UI for surfacing `warnings` isn't designed by this map (see Out of scope on the map) — this ticket only defines what the parser hands back.

Per-scenario behavior:

- **Declarations outside `:root` / non-custom-property declarations**: silently ignored, no warning — not broken, just not tokens.
- **Duplicate declarations for the same custom property**: last one wins (matches real CSS cascade semantics), but emits a warning — more likely a mistake than case above, in a file dedicated to tokens.
- **Bad type prefix, missing name after type keyword, bad typography reserved-suffix, `parseValue()` returning `null`**: each skips that declaration and adds a warning with a specific reason string.
- **`var(--x)` reference values**: no special-casing needed — `parseValue()` already returns `null` for a `var(...)` string since it matches no type's expected shape, so it flows through the same path as any other invalid value.
- **Incomplete typography triplet** (1 or 2 of 3 sub-declarations present): dropped with a warning — can't form a valid `TypographyValue` with a missing field, and the model doesn't allow partial/undefined fields.
- **CSS comments**: stripped during parsing, not warning-worthy.
- **Empty `tokens.css`** (file exists, zero custom properties): not an error — returns `{ tokens: [], warnings: [] }`. Whether the app tells the user "no tokens found" is a UI decision, out of this parser's concern.

## Amendment (2026-09-01)

Following the typography redesign (see amendments on [Token/TokenGroup model shape](01-model-shape.md), [Naming-convention grouping](02-naming-convention-grouping.md), and [Value parsing and validation](03-type-inference.md)):

- **"Incomplete typography triplet" no longer exists as a scenario.** There's no more assembly step, so there's nothing to be incomplete — each typography declaration is now an independent token, same as color/dimension. Remove this from the mental model of malformed scenarios.
- **A new, permanent asymmetry replaces it**: `var(--x)`'s "no special-casing needed" claim above (line 31) now only holds for `color`/`dimension`. For `typography`, a `var()` value — or any other value that doesn't look like a dimension or a weight — silently succeeds as a font-family string instead of producing a warning, per [Value parsing and validation](03-type-inference.md)'s amendment. This was a deliberate tradeoff accepted during that ticket's revision, not an oversight here.
