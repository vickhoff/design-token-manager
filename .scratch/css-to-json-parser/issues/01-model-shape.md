# Token/TokenGroup model shape

Type: grilling
Status: open

## Question

Define the `Token`/`TokenGroup` model shared by both the (future) DTCG-JSON parser and this map's CSS parser: what fields does a `Token` carry (value, inferred/explicit type, description?), how is a literal value distinguished from a reference to another token, and how is a token's group/subgroup path represented (SPEC.md item 2: one level of user-defined subgroups)?

Critically: does the model represent a composite value like typography (font family + size + weight) as a single `Token` with a structured value, or as multiple scalar `Token`s associated by group (e.g. `typography.heading.family`, `typography.heading.size`, `typography.heading.weight`)? This choice determines how the CSS parser's naming-convention and type-inference rules (see the naming-convention and type-inference tickets) map onto the model.
