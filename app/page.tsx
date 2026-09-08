"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TokenChip } from "./_components/TokenChip";
import tokenChipsHomeRaw from "@/data/tokenChipsHome.json";
import Logo from "@/components/Logo";

const tokenChipsHome = tokenChipsHomeRaw as Array<{
  label: string;
  type: "font" | "spacing" | "color";
  value?: string;
}>;

const tokenChips = tokenChipsHome.map((chip) => (
  <li key={chip.label}>
    <TokenChip type={chip.type} label={chip.label} value={chip.value} />
  </li>
));

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center overflow-hidden font-sans text-foreground-default bg-[radial-gradient(circle,#00000022_1px,transparent_1px)] dark:bg-[radial-gradient(circle,#ffffff22_1px,transparent_1px)] [background-size:12px_12px]">
      <main className="flex items-center justify-center flex-1 w-full max-w-7xl flex-col items-center py-32 px-16 sm:items-start">
        <section className="items-center text-center px-48 flex flex-col gap-6">
          <div className="flex flex-col gap-2 items-center">
            <Logo />
            <h1 className="text-8xl tracking-tighter">
              Just a Design Token Manager.
            </h1>
            <p>Visualize and edit your tokens</p>
          </div>
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/dashboard"></Link>}
          >
            Get started
          </Button>
        </section>
      </main>
      <div className="absolute top-8 -left-24 rotate-330 overflow-hidden w-[1000px] h-10">
        <ul className="flex gap-1 w-max animate-marquee">
          {tokenChips}
          {tokenChips}
        </ul>
      </div>

      {/* bottom-right ribbon */}
      <div className="absolute bottom-8 -right-24 rotate-330 overflow-hidden w-[1000px] h-10">
        <ul className="flex gap-1 w-max animate-marquee">
          {tokenChips}
          {tokenChips}
        </ul>
      </div>
    </div>
  );
}
