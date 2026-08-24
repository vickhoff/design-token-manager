"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center py-32 px-16 sm:items-start">
        <section className="items-center text-center px-48 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono uppercase font-medium">j.a.d.t.m</span>
            <h1 className="text-8xl tracking-tighter">
              Just a Design Token Manager.
            </h1>
            <p>Visualize and edit your tokens</p>
          </div>
          <Button size="lg" render={<Link href="/dashboard"></Link>}>
            Get started
          </Button>
        </section>
      </main>
    </div>
  );
}
