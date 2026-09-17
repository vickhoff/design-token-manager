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

export { serializeCssTokens };
