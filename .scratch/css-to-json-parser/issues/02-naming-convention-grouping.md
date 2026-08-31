# Naming-convention grouping algorithm

Type: grilling
Status: open
Blocked by: 01

## Question

Given the model's group-path representation (from the model-shape ticket) and SPEC.md's "one level of user-defined subgroups" constraint, define the algorithm for splitting a CSS custom property name like `--color-brand-primary` into group/subgroup/token-name segments.

How many hyphen-delimited segments map to group vs. subgroup vs. name? How are multi-word segments handled (e.g. is `--font-size-base` group=`font`, name=`size-base`, or something else)? What happens when a property name doesn't cleanly fit the convention (too few or too many segments)?
