export async function getFolder() {
  return await window.showDirectoryPicker({ mode: "read" });
}

export async function getFileContent(root: FileSystemDirectoryHandle) {
  for await (const [name, handle] of root.entries()) {
    if (
      (name === "tokens.json" || name === "tokens.css") &&
      handle.kind === "file"
    ) {
      const file = await handle.getFile();
      const contents = await file.text();
      console.log(contents);
      return contents;
    }
  }

  console.log("tokens.json or tokens.css not found in this folder");
  return null;
}
