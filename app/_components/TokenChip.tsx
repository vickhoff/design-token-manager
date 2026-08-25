interface TokenChipProps {
  label: string;
  type: "font" | "spacing" | "color";
  value?: string;
}

function TokenChip({ label, type, value }: TokenChipProps) {
  return (
    <div className="flex items-center gap-2 p-1 border rounded-md border-(--color-border-default) font-mono text-xs bg-(--color-surface-default)">
      <div
        className={`flex items-center justify-center border-(--color-border-default) text-(--color-foreground-subtle) h-5 w-5 rounded-sm ${type === "color" ? "border" : "bg-(--color-surface-subtler)"}`}
        style={type === "color" ? { backgroundColor: value } : undefined}
      >
        {type === "font" && <span className="text-xs font-medium">Ag</span>}
      </div>
      <span>{label}</span>
    </div>
  );
}

export { TokenChip };
