# Malformed / edge-case CSS handling

Type: grilling
Status: open
Blocked by: 02, 03

## Question

Define the parser's behavior on CSS input that doesn't fit the happy path: custom properties declared outside `:root`, non-custom-property declarations, duplicate declarations for the same custom property, values matching no inferable type (the type-inference ticket's fallback) or no naming convention (the naming-convention ticket's fallback), CSS comments, and a `tokens.css` with no custom properties at all.

Does the parser throw, skip-and-warn, or collect errors/warnings alongside the successfully parsed tokens?
