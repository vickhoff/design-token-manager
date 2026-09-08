"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Switch id="theme-toggle" disabled />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-3 text-sm w-full">
      <Label
        className="text-popover-foreground whitespace-nowrap grow font-normal"
        htmlFor="theme-toggle"
      >
        Dark mode
      </Label>
      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
}

export function DropdownMenuThemeSwitchItem() {
  return (
    <DropdownMenuItem closeOnClick={false}>
      <ThemeToggle />
    </DropdownMenuItem>
  );
}
