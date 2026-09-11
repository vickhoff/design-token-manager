import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  colorValue?: string;
}

export function ColorSwatch({ colorValue }: ColorSwatchProps) {
  return (
    <div
      className={cn(
        "w-4 h-4 rounded-sm border",
        colorValue ? "border-border-default" : "border-destructive",
      )}
      style={{ backgroundColor: colorValue }}
    />
  );
}
