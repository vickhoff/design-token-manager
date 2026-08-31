// PROTOTYPE — throwaway TUI for the css-to-json-parser wayfinder map.
//
// Question this prototype answers: do the resolved parsing rules (tickets
// 01/02/03/05 in .scratch/css-to-json-parser/issues/) actually hold together
// when run against representative tokens.css files — happy path, typography
// assembly across multiple declarations, and the malformed/edge-case list?
//
// Run: node .scratch/css-to-json-parser/prototype/run.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseCssTokens } from "./parser.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));

const fixtures = [
  { key: "1", name: "happy-path", file: "fixtures/happy-path.css" },
  {
    key: "2",
    name: "typography-assembly",
    file: "fixtures/typography-assembly.css",
  },
  {
    key: "3",
    name: "malformed-edge-cases",
    file: "fixtures/malformed-edge-cases.css",
  },
  { key: "4", name: "empty", file: "fixtures/empty.css" },
];

let selected = 0;

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

function render() {
  console.clear();
  const fixture = fixtures[selected];
  const cssText = readFileSync(path.join(dir, fixture.file), "utf8");
  const result = parseCssTokens(cssText);

  console.log(bold(`css-to-json-parser prototype — fixture: ${fixture.name}`));
  console.log(dim(fixture.file));
  console.log();

  console.log(bold("── raw tokens.css ──"));
  console.log(dim(cssText.trimEnd()));
  console.log();

  console.log(bold(`── tokens (${result.tokens.length}) ──`));
  console.log(JSON.stringify(result.tokens, null, 2));
  console.log();

  console.log(bold(`── warnings (${result.warnings.length}) ──`));
  if (result.warnings.length === 0) {
    console.log(dim("(none)"));
  } else {
    for (const w of result.warnings) {
      console.log(`${bold(w.property)}  ${dim(w.reason)}`);
    }
  }
  console.log();

  const shortcuts = fixtures
    .map((f) => `${bold(`[${f.key}]`)} ${dim(f.name)}`)
    .join("  ");
  console.log(`${shortcuts}  ${bold("[q]")} ${dim("quit")}`);
}

render();

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", (key) => {
  if (key === "q" || key === "") {
    console.clear();
    process.exit(0);
  }
  const index = fixtures.findIndex((f) => f.key === key);
  if (index !== -1) {
    selected = index;
    render();
  }
});
