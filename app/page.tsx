"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { log } from "console";

export default function Home() {

  const options: OpenFilePickerOptions = {
    types: [
      {
        description: "Design tokens",
        accept: {
          "text/css": [".css"],
          "application/json": [".json"],
        },
      },
    ],
    excludeAcceptAllOption: true,
  };
  
  async function getFile() {
    // Open file picker and destructure the result the first handle
  
    const [fileHandle] = await window.showOpenFilePicker(options);
    const file = await fileHandle.getFile();
    const contents = await file.text();
    console.log(contents)
    return contents
  }

  async function getFolder() {
    const root = await window.showDirectoryPicker({ mode: 'read' })
  
    for await (const [name, handle] of root.entries()) {
      if (name === "tokens.json" && handle.kind === "file") {
        const file = await handle.getFile()
        const contents = await file.text()
        console.log(contents)
        return contents
      }
    }
  
    console.log("tokens.json not found in this folder")
    return null
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>Design token manager</h1>
        <Card>
          <CardHeader>
            <CardTitle>Choose your file</CardTitle>
            <CardDescription>Choose the file containing your tokens</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={getFolder}>Choose folder</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
