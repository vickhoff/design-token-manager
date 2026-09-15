import { parseCssTokens } from "./tokens/parseTokensCss";

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
  const rawFile = await getFileContent(root);
  const jsonFile = parseCssTokens(rawFile.content);
  return { rawFile, jsonFile };
}
