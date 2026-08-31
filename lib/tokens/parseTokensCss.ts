// PROTOTYPE — pure parsing logic for the css-to-json-parser wayfinder map.
// Implements the resolved design from tickets 01/02/03/05 in
// .scratch/css-to-json-parser/issues/. Portable: no I/O, no console.log.
//
// Token shape (see 01-model-shape.md):
//   { id, type: 'color'|'dimension'|'typography', subgroup?, name, value }
//   value is: string (color) | { value, unit } (dimension) |
//             { fontFamily, fontSize, fontWeight } (typography)
//
// parseCssTokens(cssText) -> { tokens: Token[], warnings: ParseWarning[] }
// ParseWarning: { property: string, reason: string }

import {
  isTokenType,
  isTypographySubField,
  TYPOGRAPHY_SUBFIELDS,
  type TokenType,
  type TypographySubField,
  type DimensionValue,
  type TypographyValue,
  type Token,
  type ParseWarning,
  type ParseResult,
  type TypographyParts,
} from "./types";

const DIMENSION_UNITS = new Set(["px", "rem", "em", "%"]);

const COLOR_RE =
  /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$|^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)$/;
const DIMENSION_RE = /^(-?\d*\.?\d+)(px|rem|em|%)$/;
const WEIGHT_KEYWORDS = new Set(["normal", "bold", "bolder", "lighter"]);

// --- 02: naming-convention grouping ---------------------------------------

type NameSplit =
  | { error: string }
  | {
      type: "typography";
      subgroup?: string;
      name: string;
      subField: TypographySubField;
    }
  | { type: "color" | "dimension"; subgroup?: string; name: string };

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

  if (type === "typography") {
    if (rest.length === 0) {
      return {
        error: "typography property missing name and family/size/weight suffix",
      };
    }
    const subField = rest[rest.length - 1];
    if (!isTypographySubField(subField)) {
      return {
        error: `typography property must end in family/size/weight, got "${subField}"`,
      };
    }
    // past this point, TS knows `subField` is `TypographySubField`, not just `string`
    const nameSegments = rest.slice(0, -1);
    if (nameSegments.length === 0) {
      return {
        error:
          "typography property missing name before the family/size/weight suffix",
      };
    }
    const [subgroup, name] = splitSubgroupAndName(nameSegments);
    return { type, subgroup, name, subField };
  }

  // color / dimension
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

// --- 03: value parsing and validation ---------------------------------------

function parseValue(
  type: TokenType,
  subField: TypographySubField | undefined,
  rawValue: string,
): string | number | DimensionValue | null {
  const value = rawValue.trim();

  if (type === "color") {
    return COLOR_RE.test(value) ? value : null;
  }

  if (type === "dimension" || subField === "size") {
    const match = DIMENSION_RE.exec(value);
    if (!match) return null;
    const [, num, unit] = match;
    if (!DIMENSION_UNITS.has(unit)) return null;
    return { value: Number(num), unit };
  }

  if (subField === "family") {
    return value.length > 0 ? value : null;
  }

  if (subField === "weight") {
    if (/^\d+$/.test(value)) return Number(value);
    if (WEIGHT_KEYWORDS.has(value)) return value;
    return null;
  }

  return null;
}

// --- 05: overall skip-and-collect pipeline ----------------------------------

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

  const scalarTokens: Token[] = [];
  const typographyParts = new Map<string, TypographyParts>();

  for (const [property, rawValue] of byProperty) {
    const split = splitPropertyName(property);
    if ("error" in split) {
      warnings.push({ property, reason: split.error });
      continue;
    }

    if (split.type === "typography") {
      const { subgroup, name, subField } = split;
      const parsed = parseValue("typography", subField, rawValue);
      if (parsed === null) {
        warnings.push({
          property,
          reason: `invalid ${subField} value "${rawValue}"`,
        });
        continue;
      }
      const id = tokenId("typography", subgroup, name);
      const entry = typographyParts.get(id) ?? { subgroup, name };
      // Assigned per-field (not `entry[subField] = parsed`) because writing
      // through a union of keys forces TS to demand the value satisfy every
      // possible field's type at once — see the parseValue return type above.
      if (subField === "family") {
        entry.family = parsed as string;
      } else if (subField === "size") {
        entry.size = parsed as DimensionValue;
      } else {
        entry.weight = parsed as string | number;
      }
      typographyParts.set(id, entry);
      continue;
    }

    const { type, subgroup, name } = split;
    const parsed = parseValue(type, undefined, rawValue);
    if (parsed === null) {
      warnings.push({
        property,
        reason: `invalid ${type} value "${rawValue}"`,
      });
      continue;
    }
    scalarTokens.push({
      id: tokenId(type, subgroup, name),
      type,
      subgroup,
      name,
      // `type` here is "color" | "dimension", so parseValue can only have
      // returned a string or a DimensionValue — never the `number` branch
      // (that's only reachable for typography's `weight` subField).
      value: parsed as string | DimensionValue,
    });
  }

  const typographyTokens: Token[] = [];
  for (const [id, entry] of typographyParts) {
    const { subgroup, name, family, size, weight } = entry;
    if (family === undefined || size === undefined || weight === undefined) {
      const missing = TYPOGRAPHY_SUBFIELDS.filter(
        (f) => entry[f] === undefined,
      );
      warnings.push({
        property: id,
        reason: `incomplete typography token — missing ${missing.join(", ")}`,
      });
      continue;
    }
    typographyTokens.push({
      id,
      type: "typography",
      subgroup,
      name,
      value: { fontFamily: family, fontSize: size, fontWeight: weight },
    });
  }

  return { tokens: [...scalarTokens, ...typographyTokens], warnings };
}
