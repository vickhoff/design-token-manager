# Design Token Manager

A single-user web app for viewing and editing [design tokens](https://tr.designtokens.org/format/) (color, spacing/dimension, typography) that reads and writes directly to a real project folder on your machine — editing a token in the app updates the actual `tokens.json`/`tokens.css` files.

This is a solo capstone project for the final 7-week individual project course of a 2-year frontend bootcamp. The full spec, scope decisions, and week-by-week plan live in [SPEC.md](./SPEC.md); domain terminology is in [CONTEXT.md](./CONTEXT.md).

## Browser requirement

Chromium-based browsers only (Chrome, Edge). Connecting a project folder uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) (`showDirectoryPicker()`), which Safari and Firefox don't support. Everything else in the app works without a connected folder, using a built-in sample token set.

## Features

- **Connect to a local folder** and auto-detect the token format:
  - `tokens.json` ([DTCG](https://tr.designtokens.org/format/) format) — parsed with full fidelity (explicit `$type`, nested groups, references).
  - `tokens.css` — parsed as a fallback source, inferring type from value shape and grouping from `--group-subgroup-name` naming.
  - No project connected — the dashboard loads a built-in sample token set instead.
- **Token table** grouped by type (color, dimension, typography), with inline editing.
- **Type-aware editing** — color swatch/picker for color tokens, plain value input for dimension and typography tokens.
- **Warnings table** surfacing tokens that failed to parse (unknown types, malformed values) instead of silently dropping them.
- **Save dialog** that writes changes back to the source format — `tokens.json` (+ regenerated `tokens.css`) if the project was JSON-based, or just `tokens.css` if that was the only source.
- **Light/dark theme** toggle for the app UI itself.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Redux Toolkit](https://redux-toolkit.js.org/) for token/file/UI state
- File System Access API for local folder read/write (isolated to client components)
- [Base UI](https://base-ui.com/) primitives + [shadcn](https://ui.shadcn.com/) for accessible, custom-styled components
- Tailwind CSS

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a Chromium-based browser. From there, "Get started" opens the dashboard with the sample token set, or use the toolbar to connect a real project folder containing `tokens.json` or `tokens.css`.

## Project structure

```
app/
  page.tsx              # Landing page
  dashboard/            # Main token editor (table, toolbar, save dialog, warnings)
lib/
  tokens/               # DTCG/CSS parsing, serialization, shared token types
  state/                # Redux store, token file slice, persistence
  tokenFileSystem.ts    # File System Access API wrapper
components/
  ui/                   # shadcn-based UI primitives
data/                   # Static data (e.g. landing page token chips)
```
