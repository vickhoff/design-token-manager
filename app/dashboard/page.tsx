"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_TOKENS, loadTokenFile } from "@/lib/tokenFileSystem";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { TokenTable } from "./_components/TokenTable";
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
  const hasWarnings = jsonFile !== null && jsonFile.warnings.length > 0;
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

  const sortedGrouped = Object.fromEntries(
    Object.entries(grouped).map(([type, tokens]) => [
      type,
      tokens?.toSorted((a, b) => a.id.localeCompare(b.id)) ?? [],
    ]),
  );

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans text-foreground-default">
      <main className="flex items-center justify-center flex-1 w-full max-w-7xl flex-col py-32 px-6">
        {isLoaded && (
          <>
            <section className=" flex flex-col gap-6 w-full">
              {hasWarnings && (
                <Alert variant="warning" className="max-w-md self-center">
                  <TriangleAlert />
                  <AlertTitle>
                    {jsonFile.warnings.length} of your tokens couldnt be
                    identified
                  </AlertTitle>
                  <AlertDescription className="text-foreground-on-warning">
                    Scroll down to see the unidentified tokens.
                  </AlertDescription>
                </Alert>
              )}
              {Object.entries(sortedGrouped).map(([type, tokens]) => (
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
            <CardFooter className="flex-col gap-2">
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
