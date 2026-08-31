type TokenType = "color" | "dimentsion" | "typography";

interface DimensionValue {
  value: number;
  unit: string;
}

interface TypographyValue {
  fontFamily: string;
  fontSize: DimensionValue;
  fontWeight: string | number;
}

interface Token {
  id: string;
  type: TokenType;
  subgroup?: string;
  name: string;
  value: string | DimensionValue | TypographyValue;
}
