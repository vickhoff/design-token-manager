# Value-shape type inference

Type: grilling
Status: open
Blocked by: 01

## Question

Define the value-shape heuristics for inferring a token's type from its raw CSS custom-property value: what patterns identify color (hex, `rgb()`/`rgba()`, `hsl()`/`hsla()`, named colors?), what patterns identify dimension (number + unit)?

And — per the model-shape ticket's decision on composite values — how does typography (font family/size/weight) get inferred and associated, given there's no single CSS value shape for a "typography token"? What's the fallback when a value matches no known type?
