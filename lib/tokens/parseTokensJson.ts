// Parses a `tokens.json` file (DTCG format: nested groups of $type/$value
// leaves) into the same flat Token[] model that parseTokensCss.ts produces.
// Unlike the CSS parser, there's no shape-sniffing needed — $type is
// explicit and $value is already structured, so both are trusted as-is.
// The only structural assumption is the one this app's own serializer
// makes: top-level keys are token types, with one optional subgroup level
// beneath (type -> [subgroup] -> name), matching the CSS naming convention.

import {
  isTokenType,
  type TokenType,
  type Token,
  type ParseWarning,
  type ParseResult,
} from "./types";
import { tokenId } from "./parseTokensCss";

interface DtcgLeaf {
  $type: unknown;
  $value: unknown;
}

function isLeaf(node: unknown): node is DtcgLeaf {
  return (
    typeof node === "object" &&
    node !== null &&
    "$type" in node &&
    "$value" in node
  );
}

function isPlainObject(node: unknown): node is Record<string, unknown> {
  return typeof node === "object" && node !== null;
}

function walk(
  node: unknown,
  path: string[],
  tokens: Token[],
  warnings: ParseWarning[],
): void {
  if (!isPlainObject(node)) {
    warnings.push({
      property: path.join("."),
      reason: "expected an object at this path",
    });
    return;
  }

  if (isLeaf(node)) {
    const { $type, $value } = node;

    if (typeof $type !== "string" || !isTokenType($type)) {
      warnings.push({
        property: path.join("."),
        reason: `unknown $type "${String($type)}" — expected color/dimension/typography`,
      });
      return;
    }

    if (path.length < 2 || path.length > 3) {
      warnings.push({
        property: path.join("."),
        reason: "expected type/name or type/subgroup/name nesting",
      });
      return;
    }

    const [type, subgroup, name] =
      path.length === 3 ? path : [path[0], undefined, path[1]];

    tokens.push({
      id: tokenId(type as TokenType, subgroup, name as string),
      type: $type,
      subgroup,
      name: name as string,
      value: $value as Token["value"],
    });
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    walk(child, [...path, key], tokens, warnings);
  }
}

function parseJsonTokens(jsonText: string): ParseResult {
  const tokens: Token[] = [];
  const warnings: ParseWarning[] = [];

  let root: unknown;
  try {
    root = JSON.parse(jsonText);
  } catch {
    return { tokens, warnings: [{ property: "", reason: "Invalid JSON" }] };
  }

  if (!isPlainObject(root)) {
    return {
      tokens,
      warnings: [
        { property: "", reason: "Expected a JSON object at the root" },
      ],
    };
  }

  for (const [key, child] of Object.entries(root)) {
    walk(child, [key], tokens, warnings);
  }

  return { tokens, warnings };
}

export { parseJsonTokens };
