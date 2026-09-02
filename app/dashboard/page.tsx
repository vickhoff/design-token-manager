"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_TOKENS, loadTokenFile } from "@/lib/tokenFileSystem";
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
import { type ParseResult } from "@/lib/tokens/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setTokenFile,
  clearTokenFile,
} from "@/lib/state/features/tokenFile/tokenFileSlice";

type Status = "empty" | "loading" | "error";

export default function Dashboard() {
  const rawFile = useAppSelector((state) => state.tokenFile.rawFile);
  const jsonFile = useAppSelector((state) => state.tokenFile.jsonFile);
  const isLoaded = jsonFile !== null;
  const [status, setStatus] = useState<Status>("empty");
  const dispatch = useAppDispatch();

  async function handleChooseFolder() {
    try {
      const { rawFile, jsonFile } = await loadTokenFile();
      dispatch(setTokenFile({ rawFile, jsonFile }));
    } catch (error) {
      console.log("falling back to defaults:", DEFAULT_TOKENS, error);
      setStatus("error");
    }
  }

  function handleReset() {
    dispatch(clearTokenFile());
  }

  const grouped = isLoaded
    ? Object.groupBy(jsonFile?.tokens ?? [], (token) => token.type)
    : {};

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans text-(--color-foreground-default)">
      <main className="flex items-center justify-center flex-1 w-full max-w-7xl flex-col py-32 px-16">
        {isLoaded && (
          <>
            <Button onClick={handleReset}>Change folder</Button>
            <section className=" flex flex-col gap-6 w-full">
              {Object.entries(grouped).map(([type, tokens]) => (
                <TokenTable key={type} type={type} tokens={tokens} />
              ))}
            </section>
          </>
        )}
        {!isLoaded && status === "empty" && (
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
