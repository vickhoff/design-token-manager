import LogoSymbol from "@/public/jadtm-logo.svg";

export default function Logo() {
  return (
    <div className="flex gap-2 items-center">
      <LogoSymbol
        className="h-3 w-auto text-foreground-default"
        aria-label="Logo"
      />
      <p className="uppercase font-bold tracking-widest text-sm">j.a.d.t.m</p>
    </div>
  );
}
