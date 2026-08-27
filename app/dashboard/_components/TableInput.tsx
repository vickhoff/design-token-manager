import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TableInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        " font-mono h-6 px-1.5 py-0.5 border-transparent hover:border hover:border-(--color-border-default)",
        className,
      )}
      {...props}
    />
  );
}
