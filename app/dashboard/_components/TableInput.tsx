import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ColorSwatch } from "./ColorSwatch";

const tableInputVariants = cva(
  "font-mono h-6 px-1.5 py-0.5 border-transparent hover:border hover:border-border-default",
  {
    variants: {
      variant: {
        default: "",
        color: "pl-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface TableInputProps
  extends
    React.ComponentProps<typeof Input>,
    VariantProps<typeof tableInputVariants> {
  colorValue?: string;
}

export function TableInput({
  className,
  variant,
  colorValue,
  ...props
}: TableInputProps) {
  if (variant === "color") {
    return (
      <InputGroup
        className={cn(tableInputVariants({ variant }), "h-6", className)}
      >
        <InputGroupAddon>
          <ColorSwatch colorValue={colorValue} />
        </InputGroupAddon>
        <InputGroupInput className="h-6 px-1.5 py-0.5" {...props} />
      </InputGroup>
    );
  }

  return (
    <Input
      className={cn(tableInputVariants({ variant }), className)}
      {...props}
    />
  );
}
