import { type Token } from "./types";

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

export { serializeJsonTokens, tokenPath, setPath };
