# Naming-convention grouping algorithm

Type: grilling
Status: resolved
Blocked by: 01

## Question

Given the model's group-path representation (from the model-shape ticket) and SPEC.md's "one level of user-defined subgroups" constraint, define the algorithm for splitting a CSS custom property name like `--color-brand-primary` into group/subgroup/token-name segments.

How many hyphen-delimited segments map to group vs. subgroup vs. name? How are multi-word segments handled (e.g. is `--font-size-base` group=`font`, name=`size-base`, or something else)? What happens when a property name doesn't cleanly fit the convention (too few or too many segments)?

## Answer

Resolved this ticket in tandem with a foundational sub-decision: `TokenType` is read **literally** from the property name's first segment (must be exactly `color`, `dimension`, or `typography`) — not inferred from value shape. This settles a real ambiguity in SPEC.md's original phrasing, which separately mentioned "type inferred from value shape" and "groups inferred from a `--group-subgroup-name` naming convention" without saying how the two relate. Reasons: deterministic for a closed 3-value enum, matches the literal `--group-subgroup-name` convention and the `color.brand.primary` example, and avoids real shape ambiguity (e.g. a bare number like `700` could be a font-weight or a unitless dimension). **This narrows the type-inference ticket's scope** — see the note added there.

**Algorithm:**

1. Split the property name on `-` (after the leading `--`).
2. First segment must be exactly `color`, `dimension`, or `typography` → sets `TokenType`. Anything else is malformed (see the malformed-input ticket).
3. **For `color`/`dimension`** (remaining segments after type):
   - 1 segment → subgroup=none, name=that segment
   - 2+ segments → subgroup=2nd segment, name=remaining segments joined with `-`
   - 0 segments → malformed, no name
   - Examples: `--color-brand-primary` → subgroup=`brand`, name=`primary`. `--color-primary` → subgroup=none, name=`primary`. `--color-brand-primary-hover` → subgroup=`brand`, name=`primary-hover`. `--dimension-radius-sm` → subgroup=`radius`, name=`sm`.
4. **For `typography`** (remaining segments after type) — the composite type needs its 3 sub-fields assembled from 3 separate CSS declarations, since CSS has no native structured-value syntax:
   - Last segment must be exactly `family`, `size`, or `weight` → identifies which `TypographyValue` sub-field this declaration fills. Anything else is malformed.
   - Everything between `typography` and that reserved suffix gets the same subgroup/name split as color/dimension (1 segment → name only; 2+ → subgroup=first, name=rest joined).
   - Three declarations resolving to the same `type.subgroup.name` id merge into one `Token` with a `TypographyValue`. An incomplete triplet (1 or 2 of 3 present) is a malformed/edge case, not this ticket's concern — see the malformed-input ticket.
   - Examples: `--typography-heading-family` → subgroup=none, name=`heading`, sub-field=`family`. `--typography-nav-link-size` → subgroup=`nav`, name=`link`, sub-field=`size`.

## Amendment (2026-09-01)

**Step 4 above no longer applies — typography dropped its composite value in [Token/TokenGroup model shape](01-model-shape.md)'s amendment.** There's no more reserved suffix, no more assembly. Typography now follows **the exact same algorithm as step 3** (color/dimension) — one rule for all three types instead of two:

- `--typography-sans` → 1 remaining segment → subgroup=none, name=`sans`
- `--typography-size-lg` → 2 remaining segments → subgroup=`size`, name=`lg`
- `--typography-weight` → 1 remaining segment → subgroup=none, name=`weight`

Note that `size`/`weight`/`family`-ish words here are no longer structural keywords the algorithm looks for — they're just ordinary vocabulary the user happens to choose for subgroups/names, same as `brand`/`neutral` are for color. Nothing in the naming algorithm treats them specially anymore; the actual "is this a size or a weight or a family" question moved entirely into value parsing — see [Value parsing and validation](03-type-inference.md)'s amendment.
