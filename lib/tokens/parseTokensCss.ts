// Parses a `tokens.css` file's `:root` custom properties into the flat
// Token[] model described in types.ts. Hand-rolled — no CSS parsing library.
//
// Naming convention: --<type>-[<subgroup>-]<name>, where <type> is
// color/dimension/typography. Typography has no special suffix or
// assembly step — it's a flat namespace exactly like color/dimension
// (e.g. --typography-sans, --typography-size-lg, --typography-weight).
// Since the name no longer signals which "kind" of typography value a
// declaration holds, parseValue infers it from the value's own shape.

import {
  isTokenType,
  type TokenType,
  type DimensionValue,
  type Token,
  type ParseWarning,
  type ParseResult,
} from "./types";

const DIMENSION_UNITS = new Set(["px", "rem", "em", "%"]);

const COLOR_RE =
  /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$|^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)$/;
const DIMENSION_RE = /^(-?\d*\.?\d+)(px|rem|em|%)$/;
const WEIGHT_KEYWORDS = new Set(["normal", "bold", "bolder", "lighter"]);

// --- naming-convention grouping ---------------------------------------

type NameSplit =
  { error: string } | { type: TokenType; subgroup?: string; name: string };

function splitPropertyName(rawProperty: string): NameSplit {
  // rawProperty includes the leading "--"
  const segments = rawProperty.replace(/^--/, "").split("-").filter(Boolean);
  const [type, ...rest] = segments;

  if (!isTokenType(type)) {
    return {
      error: `unknown type prefix "${type ?? ""}" — expected color/dimension/typography`,
    };
  }
  // past this point, TS knows `type` is `TokenType`, not just `string`

  if (rest.length === 0) {
    return { error: `${type} property missing a name segment` };
  }
  const [subgroup, name] = splitSubgroupAndName(rest);
  return { type, subgroup, name };
}

function splitSubgroupAndName(
  segments: string[],
): [string | undefined, string] {
  if (segments.length === 1) return [undefined, segments[0]];
  const [subgroup, ...nameParts] = segments;
  return [subgroup, nameParts.join("-")];
}

function tokenId(
  type: TokenType,
  subgroup: string | undefined,
  name: string,
): string {
  return subgroup ? `${type}.${subgroup}.${name}` : `${type}.${name}`;
}

// --- value parsing and validation ---------------------------------------

function parseDimension(value: string): DimensionValue | null {
  const match = DIMENSION_RE.exec(value);
  if (!match) return null;
  const [, num, unit] = match;
  if (!DIMENSION_UNITS.has(unit)) return null;
  return { value: Number(num), unit };
}

function parseValue(
  type: TokenType,
  rawValue: string,
): string | number | DimensionValue | null {
  const value = rawValue.trim();

  if (type === "color") {
    return COLOR_RE.test(value) ? value : null;
  }

  if (type === "dimension") {
    return parseDimension(value);
  }

  // typography: no naming signal for which "kind" of value this is, so
  // infer from shape — dimension-shaped -> size, numeric/keyword -> weight,
  // otherwise treat as a font-family string (which is why var(--x) and
  // other garbage silently pass through as "family" here, unlike color/
  // dimension — font-family values are inherently free-form, so there's
  // no shape check to reject against).
  const dimension = parseDimension(value);
  if (dimension !== null) return dimension;

  if (/^\d+$/.test(value)) return Number(value);
  if (WEIGHT_KEYWORDS.has(value)) return value;

  return value.length > 0 ? value : null;
}

// --- overall skip-and-collect pipeline ----------------------------------

function extractRootDeclarations(cssText: string): string[] {
  const noComments = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const rootMatch = /:root\s*\{([^}]*)\}/.exec(noComments);
  if (!rootMatch) return [];

  return rootMatch[1]
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean);
}

export function parseCssTokens(cssText: string): ParseResult {
  const warnings: ParseWarning[] = [];
  const declarations = extractRootDeclarations(cssText);

  // De-dupe with last-wins + warning, ignoring non-custom-property declarations silently.
  const byProperty = new Map<string, string>();
  for (const decl of declarations) {
    const colonIndex = decl.indexOf(":");
    if (colonIndex === -1) continue;
    const property = decl.slice(0, colonIndex).trim();
    const rawValue = decl.slice(colonIndex + 1).trim();
    if (!property.startsWith("--")) continue; // not a custom property — silently ignored

    if (byProperty.has(property)) {
      warnings.push({
        property,
        reason: "duplicate declaration — last value wins",
      });
    }
    byProperty.set(property, rawValue);
  }

  const tokens: Token[] = [];

  for (const [property, rawValue] of byProperty) {
    const split = splitPropertyName(property);
    if ("error" in split) {
      warnings.push({ property, reason: split.error });
      continue;
    }

    const { type, subgroup, name } = split;
    const parsed = parseValue(type, rawValue);
    if (parsed === null) {
      warnings.push({
        property,
        reason: `invalid ${type} value "${rawValue}"`,
      });
      continue;
    }

    tokens.push({
      id: tokenId(type, subgroup, name),
      type,
      subgroup,
      name,
      value: parsed,
    });
  }

  return { tokens, warnings };
}
