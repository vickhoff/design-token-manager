# Value parsing and validation

Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

Originally scoped as "value-shape type inference" — **rescoped** while resolving the naming-convention ticket: `TokenType` is now read literally from the property name's first segment (`color`/`dimension`/`typography`), not inferred from the value's shape, and typography's composite assembly (which 3 declarations belong to one token) is handled by the naming convention's reserved-suffix mechanism, not by value shape. See [Naming-convention grouping](02-naming-convention-grouping.md)'s Answer for both.

What's left for this ticket: given a raw CSS value string and its **already-known** `TokenType` (and, for typography, its sub-field: `family`/`size`/`weight`), define how to parse and validate that value into the model's shape:

- **`color`**: what raw value patterns are accepted (hex, `rgb()`/`rgba()`, `hsl()`/`hsla()`, named colors like `red`?) — the model stores color as a plain string, so is this just a validation pass (reject anything that isn't a recognizable color pattern), or also a normalization pass (e.g. always store as-is vs. always normalize to hex)?
- **`dimension`**: parse a value like `8px` or `1.5rem` into `{ value: number; unit: string }` — what units are accepted, and what happens with unitless values or non-numeric values?
- **`typography` sub-fields**: `family` stores a raw string (font-family value) — any validation? `size` needs the same dimension parsing as above, reused. `weight` is `string | number` per the model — does `700` parse as a number and `bold` stay a string, or is there a stricter rule?
- **Fallback**: what happens when a value doesn't match its declared type's expected shape at all (e.g. `--color-brand-primary: 8px;`)? This is a validation failure, not a type-guessing failure — feeds into the malformed-input ticket.

## Answer

- **`color`**: valid iff hex (`#fff`/`#ffffff`/`#ffffffff`) or `rgb()`/`rgba()` — matches exactly what SPEC.md's color editor supports, so the parser never produces a token the editor can't display. Rejects `hsl()`/`hsla()` and named colors as invalid, not because they're invalid CSS but because nothing downstream can edit them yet. Stored as-is, no normalization — normalization is a display/editing-UI concern, not parsing.
- **`dimension`**: valid iff `<number><unit>` where unit ∈ `{px, rem, em, %}` (a whitelist, not "anything unit-shaped" — catches typos like `8xyz`). Unit is **always required, including for `0`** (`0px`, not bare `0`) — a minor deviation from idiomatic CSS, traded for zero special-casing in the parser. Parses to `{ value: number; unit: string }`.
- **`typography.family`**: any non-empty string, stored as-is (no font-stack array parsing).
- **`typography.size`**: reuses the dimension parser above verbatim.
- **`typography.weight`** (`string | number` per the model): a purely numeric raw value (`"700"`) parses to JS `number`; a recognized CSS weight keyword (`normal`/`bold`/`bolder`/`lighter`) stays a `string`; anything else is invalid. No numeric range validation (not restricted to 100–900) — CSS itself doesn't hard-require that.
- **Interface**: `parseValue(type, subField, rawValue)` returns the parsed value, or `null` on invalid input. No throwing, no result-object wrapper — this ticket's contract ends at "valid value in, parsed value or `null` out." All collecting/throwing/warning _strategy_ around a `null` belongs to the malformed-input ticket. Noted for later, not now: `null` could become a richer `{ reason }` shape if more descriptive errors are wanted down the line.

## Amendment (2026-09-01)

**Typography's `subField` parameter is gone**, following [Token/TokenGroup model shape](01-model-shape.md)'s amendment (no more composite value) and [Naming-convention grouping](02-naming-convention-grouping.md)'s amendment (no more reserved suffix). `parseValue` is now `parseValue(type: TokenType, rawValue: string)` — two parameters, not three. Since the naming convention no longer tells the parser which "kind" of typography value it's looking at, typography values are now classified **by shape**, tried in this order:

1. Matches the dimension pattern (`<number><unit>`, same whitelist as `dimension`) → parsed as a `DimensionValue` (a size).
2. Purely numeric (`"700"`) → parsed as a `number` (a weight).
3. A recognized CSS weight keyword (`normal`/`bold`/`bolder`/`lighter`) → kept as a `string` (a weight).
4. Otherwise, any non-empty string → kept as-is (a font family).

**This reintroduces a real gap, worth naming plainly**: unlike `color`/`dimension`, typography's final fallback (step 4) accepts _anything_ non-empty — there's no shape a font-family value has to match, since font stacks are inherently free-form text. That means a garbage or unsupported value on a `typography`-typed property — including `var(--x)`, which correctly gets rejected for `color`/`dimension` — silently succeeds as if it were a valid family string instead of producing a warning. This is an accepted, permanent asymmetry of this design, not a bug: there's no way to validate "is this a plausible font stack" the way there's a way to validate "is this a plausible hex color."
