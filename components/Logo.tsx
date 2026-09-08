import LogoSymbol from "@/public/jadtm-logo.svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <LogoSymbol
        className="h-3 w-auto text-foreground-default"
        aria-label="Logo"
      />
      <p className="uppercase font-bold tracking-widest text-sm">j.a.d.t.m</p>
    </div>
  );
}
