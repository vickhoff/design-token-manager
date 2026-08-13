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

export default function Home() {

  const options = {
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
            <Button>Choose file</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
