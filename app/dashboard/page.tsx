"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { loadTokenFile, loadSampleTokens } from "@/lib/tokenFileSystem";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { SaveDialog } from "./_components/SaveDialog";

import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert, X } from "lucide-react";
import { TokenTable } from "./_components/TokenTable";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import {
  setTokenFile,
  clearTokenFile,
} from "@/lib/state/features/tokenFile/tokenFileSlice";

import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { WarningsTable } from "./_components/WarningsTable";

type Status = "empty" | "loading" | "error";

export default function Dashboard() {
  const rawFile = useAppSelector((state) => state.tokenFile.rawFile);
  const jsonFile = useAppSelector((state) => state.tokenFile.jsonFile);
  const originalFile = useAppSelector((state) => state.tokenFile.originalFile);

  const fileHasChanged =
    JSON.stringify(jsonFile?.tokens) !== JSON.stringify(originalFile?.tokens);
  const isLoaded = jsonFile !== null;
  const hasWarnings = jsonFile !== null && jsonFile.warnings.length > 0;

  const [status, setStatus] = useState<Status>("empty");

  const dispatch = useAppDispatch();

  async function handleChooseFolder() {
    try {
      const { rawFile, jsonFile } = await loadTokenFile();
      dispatch(setTokenFile({ rawFile, jsonFile, originalFile: jsonFile }));
    } catch (error) {
      console.log(error);
      setStatus("empty");
    }
  }

  function handleChooseSampleTokens() {
    const { rawFile, jsonFile } = loadSampleTokens();
    dispatch(setTokenFile({ rawFile, jsonFile, originalFile: jsonFile }));
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
      <main className="flex items-center flex-1 w-full max-w-7xl flex-col py-32 px-6">
        {isLoaded && (
          <section className="items-center flex flex-col gap-6 w-full">
            <Card className="w-full max-w-md text-center bg-surface-default">
              <CardContent className="flex justify-between">
                <ButtonGroup aria-label="Button group">
                  <Button onClick={handleReset} variant="outline" size="icon">
                    <X />
                  </Button>
                  <ButtonGroupText
                    render={<Label className="font-mono" htmlFor="name" />}
                  >
                    {rawFile?.title}
                  </ButtonGroupText>
                </ButtonGroup>
                <SaveDialog
                  tokens={jsonFile.tokens}
                  fileHasChanged={fileHasChanged}
                  hasWarnings={hasWarnings}
                />
              </CardContent>
              {hasWarnings && (
                <CardFooter className="flex-col gap-2 bg-surface-default">
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
                </CardFooter>
              )}
            </Card>
            {Object.entries(sortedGrouped).map(([type, tokens], i) => (
              <TokenTable index={i} key={type} type={type} tokens={tokens} />
            ))}
            {hasWarnings && (
              <WarningsTable
                index={Object.entries(sortedGrouped).length}
                warnings={jsonFile.warnings}
              />
            )}
          </section>
        )}

        {!isLoaded && status === "empty" && (
          <Card className="w-full max-w-md text-center animate-in fade-in slide-in-from-top-4 duration-300 fill-mode-both">
            <CardHeader>
              <CardTitle>Choose folder</CardTitle>
              <CardDescription>
                Choose the folder containing your tokens. The file must be named
                tokens.css or tokens.json
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Collapsible>
                <CollapsibleTrigger
                  render={
                    <button className="text-sm text-foreground-muted underline underline-offset-2">
                      How should the file be formatted?
                    </button>
                  }
                />
                <CollapsibleContent className="text-sm text-foreground-muted text-left space-y-4 pt-3">
                  <div className="space-y-4">
                    <p>
                      <strong>If you upload tokens.css</strong> — each token
                      should be written as a CSS variable, like{" "}
                      <code className="py-0.5 px-1 bg-surface-subtler rounded  border border-border-default">
                        --color-brand-primary
                      </code>
                      . The name shows what kind of token it is and how it's
                      grouped.
                    </p>
                    <pre className="bg-surface-subtler border border-border-default rounded-(--radius-md) p-3 overflow-x-auto text-xs font-mono">
                      {`:root {
  --color-brand-primary: #2563eb;
  --dimension-spacing-lg: 16px;
  --typography-weight-bold: 700;
}`}
                    </pre>
                  </div>
                  <div className="space-y-1.5">
                    <p>
                      <strong>If you upload tokens.json</strong> — each token is
                      an object with a <code>$type</code> and{" "}
                      <code>$value</code>, grouped and nested by name.
                    </p>
                    <pre className="bg-surface-subtler border border-border-default rounded-(--radius-md) p-3 overflow-x-auto text-xs font-mono">
                      {`{
  "color": {
    "brand": {
      "primary": { "$type": "color", "$value": "#2563eb" }
    }
  },
  "dimension": {
    "spacing": {
      "lg": {
        "$type": "dimension",
        "$value": { "value": 16, "unit": "px" }
      }
    }
  }
}`}
                    </pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full" onClick={handleChooseFolder}>
                Choose folder
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleChooseSampleTokens}
              >
                Start with sample tokens
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
}
