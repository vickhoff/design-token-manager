const TOKEN_TYPES = ["color", "dimension", "typography"] as const;
type TokenType = (typeof TOKEN_TYPES)[number];

function isTokenType(value: string): value is TokenType {
  return (TOKEN_TYPES as readonly string[]).includes(value);
}

interface FileObject {
  title: string;
  content: string;
}

interface DimensionValue {
  value: number;
  unit: string;
}

interface Token {
  id: string;
  type: TokenType;
  subgroup?: string;
  name: string;
  value: string | number | DimensionValue;
}

interface ParseWarning {
  property: string;
  reason: string;
}

type ParsedValue =
  | { ok: true; value: string | number | DimensionValue }
  | { ok: false; reason: string };

interface ParseResult {
  tokens: Token[];
  warnings: ParseWarning[];
}

export {
  TOKEN_TYPES,
  isTokenType,
  type TokenType,
  type DimensionValue,
  type Token,
  type ParseWarning,
  type ParseResult,
  type FileObject,
  type ParsedValue,
};
