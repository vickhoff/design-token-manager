import { parseCssTokens } from "./tokens/parseTokensCss";
import { serializeCssTokens, serializeJsonTokens } from "./tokens/serializers";
import type { Token } from "./tokens/types";

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

export async function getFileContent(root: FileSystemDirectoryHandle) {
  for await (const [name, handle] of root.entries()) {
    if (name === "tokens.css" && handle.kind === "file") {
      const file = await handle.getFile();
      const content = await file.text();
      const title = file.name;

      if (content.trim().length === 0) {
        throw new Error("The file is empty");
      }
      return { content, title };
    }
  }
  throw new Error("tokens.json or tokens.css not found in this folder");
}

export async function loadTokenFile() {
  const root = await getFolder();
  directoryHandle = root;
  const rawFile = await getFileContent(root);
  const jsonFile = parseCssTokens(rawFile.content);
  return { rawFile, jsonFile };
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
    let jsonTokens: string | undefined;
    let cssTokens: string | undefined;

    if (selectedFormats.css) {
      cssTokens = serializeCssTokens(tokens);
    }
    if (selectedFormats.json) {
      jsonTokens = serializeJsonTokens(tokens);
    }

    return { cssTokens, jsonTokens };
  }
  throw new Error("No access granted");
}
