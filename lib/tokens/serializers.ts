import { type TokenType, type Token } from "./types";

function tokenProperty(
  type: TokenType,
  subgroup: string | undefined,
  name: string,
): string {
  return subgroup ? `--${type}-${subgroup}-${name}` : `--${type}-${name}`;
}

function tokenValue(token: Token): string {
  if (typeof token.value === "string") return token.value;
  if (typeof token.value === "object")
    return `${token.value.value}${token.value.unit}`;
  if (typeof token.value === "number") return String(token.value);

  return "Something went wrong";
}

function serializeCssTokens(tokens: Token[]): string {
  const lines = tokens.map((token) => {
    const property = tokenProperty(token.type, token.subgroup, token.name);
    const value = tokenValue(token);

    return `  ${property}: ${value};`;
  });

  const declarations = lines.join("\n");

  return `:root {\n${declarations}\n}\n`;
}

function tokenPath(token: Token): string[] {
  return [token.type, token.subgroup, token.name].filter(
    (segment): segment is string => segment !== undefined,
  );
}

function setPath(
  tree: Record<string, unknown>,
  path: string[],
  leaf: unknown,
): void {
  let current = tree;
  for (const key of path.slice(0, -1)) {
    if (typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[path[path.length - 1]] = leaf;
}

function serializeJsonTokens(tokens: Token[]): string {
  const tree: Record<string, unknown> = {};

  for (const token of tokens) {
    setPath(tree, tokenPath(token), {
      $type: token.type,
      $value: token.value,
    });
  }

  return JSON.stringify(tree, null, 2);
}

export { serializeCssTokens, serializeJsonTokens, tokenPath, setPath };
