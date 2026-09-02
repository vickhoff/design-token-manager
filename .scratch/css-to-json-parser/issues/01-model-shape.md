# Token/TokenGroup model shape

Type: grilling
Status: resolved

## Question

Define the `Token`/`TokenGroup` model shared by both the (future) DTCG-JSON parser and this map's CSS parser: what fields does a `Token` carry (value, inferred/explicit type, description?), how is a literal value distinguished from a reference to another token, and how is a token's group/subgroup path represented (SPEC.md item 2: one level of user-defined subgroups)?

Critically: does the model represent a composite value like typography (font family + size + weight) as a single `Token` with a structured value, or as multiple scalar `Token`s associated by group (e.g. `typography.heading.family`, `typography.heading.size`, `typography.heading.weight`)? This choice determines how the CSS parser's naming-convention and type-inference rules (see the naming-convention and type-inference tickets) map onto the model.

## Answer

Flat, normalized `Token[]` — no separate `TokenGroup` tree type. Grouping is a derived view (filter/group-by) wherever it's consumed, which also matches Redux Toolkit's normalized-state idiom (SPEC.md's Redux decision). The two-level cap (type, then one optional user-defined subgroup) doesn't justify a real tree.

```ts
type TokenType = "color" | "dimension" | "typography";

interface DimensionValue {
  value: number;
  unit: string;
}

interface TypographyValue {
  fontFamily: string;
  fontSize: DimensionValue;
  fontWeight: string | number;
}

interface Token {
  id: string; // derived: `${type}.${subgroup ? subgroup + "." : ""}${name}`
  type: TokenType;
  subgroup?: string; // one user-defined level, e.g. "brand" or "radius"
  name: string;
  value: string | DimensionValue | TypographyValue; // literal only — no references (see below)
}
```

Key decisions:

- **Typography is composite** (one `Token`, structured `TypographyValue`), not three scalar tokens sharing a group — matches real DTCG's `typography` composite type and the "one editor, three fields" UI description in SPEC.md.
- **Dimension is split** (`{ value: number; unit: string }`), not a plain string — mirrors the dimension editor's two separate inputs and avoids re-parsing `"16px"` on every render. **Color stays a plain string** — one input surface (the color picker), no structural split needed.
- **Border radius needs no new type** — it's a `dimension` token under a subgroup like `radius` (e.g. `dimension.radius.sm`), same shape as spacing. SPEC.md's out-of-scope "border" type is the composite (width+style+color+radius bundled); a bare radius value isn't that.
- **References/aliases are dropped from the model entirely, for now** — this is a real scope cut from SPEC.md item 4 ("any token value can be a literal or a reference"), not just a modeling simplification. `Token.value` is always literal. Every `Token` field (composite sub-fields included) is non-reference. **This invalidates the reference-handling ticket** (`04-reference-handling.md`) — closing it as out of scope rather than resolving it, since there's nothing left for it to decide. When/if references come back, `id`'s path-string format (`type.subgroup.name`) is already reference-path-shaped, which should make re-adding them cheaper later.
- **No `description` field** — nothing in SPEC.md's MVP calls for it; left out rather than added speculatively.
- **`id` is a derived path string** (`type.subgroup.name`), not an opaque generated id — human-readable in Redux DevTools, and avoids a second source of truth since type/subgroup/name are stored anyway. Renaming isn't a distinct MVP concern from delete+recreate.

## Amendment (2026-09-01)

**The "typography is composite" decision above is reversed.** Discovered during actual implementation (pairing on `lib/tokens/`) that the composite model didn't match the intended mental model: typography tokens are meant to be independent scales — `--typography-sans`, `--typography-size-lg`, `--typography-weight` — the same way Tailwind treats `font-sans`/`text-lg`/`font-bold` as separate scales, not one bundled `TypographyValue` object per "heading style."

```ts
interface Token {
  id: string;
  type: TokenType;
  subgroup?: string;
  name: string;
  value: string | number | DimensionValue; // TypographyValue removed
}
```

- `TypographyValue` is removed from the model. A `typography` token's value is now `string` (a font family), `number` (a numeric weight), or `DimensionValue` (a size) — the exact same value shapes color/dimension already use, just reused rather than wrapped in a composite object.
- Typography is now a flat namespace exactly like `color`/`dimension` — see the amendment on [Naming-convention grouping](02-naming-convention-grouping.md).
- **Known tradeoff, worth naming explicitly**: the original composite decision cited matching real DTCG's `typography` composite type as a reason in its favor. This revision no longer matches that — a conscious deviation from DTCG, not an oversight. Also, since `type: "typography"` alone no longer tells you which value shape to expect (unlike before), consumers (editor UI, future DTCG export) need another way to distinguish a family/size/weight token — currently that's inferred from the value's own shape at parse time (see [Value parsing and validation](03-type-inference.md)'s amendment), not stored anywhere on the `Token` itself.
