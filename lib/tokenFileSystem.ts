import { parseCssTokens } from "./tokens/parseTokensCss";
import { parseJsonTokens } from "./tokens/parseTokensJson";
import { serializeCssTokens, serializeJsonTokens } from "./tokens/serializers";
import type { ParseResult, Token } from "./tokens/types";
import { SAMPLE_TOKENS_JSON } from "./tokens/sampleTokens";

export const DEFAULT_TOKENS = {
  color: {
    primary: "#000000",
    background: "#ffffff",
  },
  spacing: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
};

let directoryHandle: FileSystemDirectoryHandle | null = null;

export async function getFolder() {
  return await window.showDirectoryPicker({ mode: "read" });
}

async function readFile(root: FileSystemDirectoryHandle, name: string) {
  const fileHandle = await root.getFileHandle(name);
  const file = await fileHandle.getFile();
  const content = await file.text();
  const title = file.name;
  return { content, title };
}

export async function getFileContent(root: FileSystemDirectoryHandle) {
  let result: { content: string; title: string };

  try {
    result = await readFile(root, "tokens.json");
  } catch (error) {
    try {
      result = await readFile(root, "tokens.css");
    } catch (error) {
      throw new Error("Neither tokens.json or tokens.css exists");
    }
  }
  if (result.content.trim().length === 0) {
    throw new Error("The file is empty");
  }
  return result;
}

export async function loadTokenFile() {
  const root = await getFolder();
  directoryHandle = root;
  const rawFile = await getFileContent(root);

  const jsonFile: ParseResult =
    rawFile.title === "tokens.json"
      ? parseJsonTokens(rawFile.content)
      : parseCssTokens(rawFile.content);
  console.log(jsonFile);
  return { rawFile, jsonFile };
}

export function loadSampleTokens() {
  const rawFile = { title: "tokens", content: SAMPLE_TOKENS_JSON };
  const jsonFile = parseJsonTokens(SAMPLE_TOKENS_JSON);

  return { rawFile, jsonFile };
}

async function createWritable(name: string, content: string) {
  const fileHandle = await directoryHandle?.getFileHandle(name, {
    create: true,
  });
  const writable = await fileHandle?.createWritable();
  await writable?.write(content);
  await writable?.close();
}

export async function saveTokenFile(
  tokens: Token[],
  selectedFormats: { json: boolean; css: boolean },
) {
  if (!directoryHandle) {
    const root = await getFolder();
    directoryHandle = root;
  }
  if (
    (await directoryHandle.requestPermission({ mode: "readwrite" })) ===
    "granted"
  ) {
    let serializedJsonTokens: string | undefined;
    let serializedCssTokens: string | undefined;
    let writables = [];

    if (selectedFormats.css) {
      serializedCssTokens = serializeCssTokens(tokens);
      const saveCssTokens = await createWritable(
        "tokens.css",
        serializedCssTokens,
      );
      writables.push(saveCssTokens);
    }
    if (selectedFormats.json) {
      serializedJsonTokens = serializeJsonTokens(tokens);
      const saveJsonTokens = await createWritable(
        "tokens.json",
        serializedJsonTokens,
      );
      writables.push(saveJsonTokens);
    }

    return { writables };
  }
  throw new Error("No access granted");
}
