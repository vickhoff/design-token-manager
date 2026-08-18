async function getFolder() {
  const root = await window.showDirectoryPicker({ mode: "read" });
  return root;
}

async function getFileContent() {
  const root = await getFolder();

  for await (const [name, handle] of root.entries()) {
    if (name === "tokens.json" && handle.kind === "file") {
      const file = await handle.getFile();
      const contents = await file.text();
      console.log(contents);
      return contents;
    }
  }

  console.log("tokens.json not found in this folder");
  return null;
}
