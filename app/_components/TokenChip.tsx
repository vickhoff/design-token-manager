interface TokenChipProps {
  label: string;
  type: "font" | "spacing" | "color";
  value?: string;
}

function TokenChip({ label, type, value }: TokenChipProps) {
  return (
    <div className="flex items-center gap-2 p-1 border rounded-md border-border-default font-mono text-xs bg-surface-default">
      <div
        className={`flex items-center justify-center border-border-default text-foreground-subtle h-5 w-5 rounded-sm ${type === "color" ? "border" : "bg-surface-subtler"}`}
        style={type === "color" ? { backgroundColor: value } : undefined}
      >
        {type === "font" && <span className="text-xs font-medium">Ag</span>}
      </div>
      <span>{label}</span>
    </div>
  );
}

export { TokenChip };
