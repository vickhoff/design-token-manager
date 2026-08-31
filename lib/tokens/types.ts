const TOKEN_TYPES = ["color", "dimension", "typography"] as const;
type TokenType = (typeof TOKEN_TYPES)[number];

function isTokenType(value: string): value is TokenType {
  return (TOKEN_TYPES as readonly string[]).includes(value);
}

const TYPOGRAPHY_SUBFIELDS = ["family", "size", "weight"] as const;
type TypographySubField = (typeof TYPOGRAPHY_SUBFIELDS)[number];

function isTypographySubField(value: string): value is TypographySubField {
  return (TYPOGRAPHY_SUBFIELDS as readonly string[]).includes(value);
}

interface DimensionValue {
  value: number;
  unit: string;
}

interface TypographyValue {
  fontFamily: string;
  fontSize: DimensionValue;
  fontWeight: string | number;
}
interface TypographyParts {
  subgroup?: string;
  name: string;
  family?: string;
  size?: DimensionValue;
  weight?: string | number;
}

interface Token {
  id: string;
  type: TokenType;
  subgroup?: string;
  name: string;
  value: string | DimensionValue | TypographyValue;
}

interface ParseWarning {
  property: string;
  reason: string;
}

interface ParseResult {
  tokens: Token[];
  warnings: ParseWarning[];
}

export {
  TOKEN_TYPES,
  TYPOGRAPHY_SUBFIELDS,
  isTypographySubField,
  isTokenType,
  type TokenType,
  type DimensionValue,
  type TypographyValue,
  type TypographyParts,
  type TypographySubField,
  type Token,
  type ParseWarning,
  type ParseResult,
};
