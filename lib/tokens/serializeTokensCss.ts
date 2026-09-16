import {
  isTokenType,
  type TokenType,
  type DimensionValue,
  type Token,
  type ParseWarning,
  type ParseResult,
  type ParsedValue,
} from "./types";

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
