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
      const contents = await file.text();
      return contents;
    }
  }
  throw new Error("tokens.json or tokens.css not found in this folder");
}
