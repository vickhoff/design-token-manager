# var() reference handling

Type: grilling
Status: closed (out of scope)

## Question

Define how `var(--x)` references in a CSS custom-property value are captured in the model as an unresolved reference (per the model-shape ticket's literal-vs-reference representation): how are fallback values (`var(--x, red)`) handled, and what happens when the referenced custom property doesn't exist in the file?

Confirm the boundary: this parser only records the reference — it does not resolve values or detect cycles (that's the Week 4 resolution engine per SPEC.md item 4, out of scope for this map).

## Out of scope

Closed without resolving. While resolving [Token/TokenGroup model shape](01-model-shape.md), references/aliases were dropped from the model entirely for now (a real scope cut from SPEC.md item 4, not just a modeling simplification) — `Token.value` is always literal. With no reference representation in the model, there's nothing left for this ticket to decide. `var(--x)` encountered while parsing `tokens.css` is now just an unsupported value shape, folded into [Malformed / edge-case CSS handling](05-malformed-edge-cases.md).
