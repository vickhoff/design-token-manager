"use client";

import { Button } from "@/components/ui/button";
import { getFolder, getFileContent, DEFAULT_TOKENS } from "@/lib/tokenFiles";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  async function handleChooseFolder() {
    const root = await getFolder();
    try {
      const contents = await getFileContent(root);
      console.log("loaded:", contents);
    } catch (error) {
      console.log("falling back to defaults:", DEFAULT_TOKENS);
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>Design token manager</h1>
        <Card>
          <CardHeader>
            <CardTitle>Choose your file</CardTitle>
            <CardDescription>
              Choose the file containing your tokens
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleChooseFolder}>Choose folder</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
