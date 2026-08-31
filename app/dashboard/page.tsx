"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getFolder,
  getFileContent,
  DEFAULT_TOKENS,
} from "@/lib/tokenFileSystem";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TokenTable } from "./_components/TokenTable";

type Status = "empty" | "loading" | "loaded" | "error";

export default function Dashboard() {
  const [status, setStatus] = useState<Status>("empty");

  async function handleChooseFolder() {
    try {
      const root = await getFolder();
      const contents = await getFileContent(root);
      setStatus("loaded");
      console.log("loaded:", contents);
    } catch (error) {
      console.log("falling back to defaults:", DEFAULT_TOKENS, error);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans text-(--color-foreground-default)">
      <main className="flex items-center justify-center flex-1 w-full max-w-7xl flex-col py-32 px-16">
        {status === "loaded" && <TokenTable type="Color" />}
        {status === "empty" && (
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Choose folder</CardTitle>
              <CardDescription>
                Choose the folder containing your tokens. The file must be named
                tokens.css or tokens.json
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-8>">
              <Button className="w-full" onClick={handleChooseFolder}>
                Choose folder
              </Button>
              <Button variant="outline" className="w-full">
                Start with sample tokens
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
}
