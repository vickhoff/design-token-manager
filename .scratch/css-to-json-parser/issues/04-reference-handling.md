# var() reference handling

Type: grilling
Status: open
Blocked by: 01

## Question

Define how `var(--x)` references in a CSS custom-property value are captured in the model as an unresolved reference (per the model-shape ticket's literal-vs-reference representation): how are fallback values (`var(--x, red)`) handled, and what happens when the referenced custom property doesn't exist in the file?

Confirm the boundary: this parser only records the reference — it does not resolve values or detect cycles (that's the Week 4 resolution engine per SPEC.md item 4, out of scope for this map).
