# Shidoka Studio — Cursor MCP workflow

**Shidoka Studio** is the **Shidoka → Cursor MCP** path: an MCP server and docs that let Cursor’s AI generate pages and templates constrained to the Shidoka Design System. It is **separate from**:

- **`src/`** — Shidoka Applications components and app code (the design system itself).

This folder owns the **Cursor MCP workflow**: server, docs, packaging options, and Cursor config examples. In this repo, a prompt like "Build a Shidoka Settings page with ui-shell, header, footer, …" produces a **`.stories.js`** file that appears under **PAGES** in the local Storybook. In a consuming app (Vue, Next.js, etc.), output format is inferred from the project or should be specified in the prompt or a Cursor rule—see **docs/PACKAGING-FOR-CONSUMERS.md**.

---

## What’s here

| Path                 | Purpose                                                                                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **server/**          | MCP server (stdio). Tool: `get_shidoka_design_context`. Source of truth for the server; `packages/@kyndryl-design-system/shidoka-studio` is the built artifact for distribution. |
| **content/**         | Human-maintained context: `considerations.md`, `page-template-builder.md`. Copied into `context-src/` by the generator.                                                          |
| **scripts/**         | `generate-component-registry.js` (CEM → context-src), `build.js` (context-src → context + packages).                                                                             |
| **context/**         | Filled at build time from `context-src/`. Server reads this when no env override is set.                                                                                         |
| **docs/**            | Workflow (how to use in Cursor) and **packaging options** (npm package, Cursor extension, etc.).                                                                                 |
| **cursor-examples/** | Example `.cursor/mcp.json` and rule file you can copy into your project or `~/.cursor`.                                                                                          |

---

## How to run (in-repo)

1. **Generate context** (from repo root):
   ```bash
   npm run generate-component-registry
   ```
   Writes CEM-derived registry + design-system-context into `shidoka-studio/context-src/` and copies `content/` (considerations, page-template-builder) there.
2. **Build Shidoka Studio** (copies `context-src/` → `shidoka-studio/context/` and prepares `packages/@kyndryl-design-system/shidoka-studio`):
   ```bash
   npm run build:shidoka-studio
   ```
3. **Start the MCP server** (Cursor will do this when configured; or run manually to test):
   ```bash
   node shidoka-studio/server/index.js
   ```
   Or from repo root run the server directly: `node shidoka-studio/server/index.js` (e.g. to debug or see logs).

**Optional:** Set `SHIDOKA_STUDIO_CONTEXT_PATH` to `./shidoka-studio/context-src` (from repo root) so the server reads context directly from the generator output without copying into `shidoka-studio/context`.

---

## Cursor config

Copy from **cursor-examples/** or see **docs/CURSOR-MCP-WORKFLOW.md**. Project-level: `.cursor/mcp.json` and optionally `.cursor/rules/`. The examples reference the in-repo server path.

---

## Packaging and distribution

See **docs/PACKAGING-OPTIONS.md** for ways to package and distribute Shidoka Studio (npm package, Cursor extension, internal registry). No publishing is set up yet; the layout under `packages/@kyndryl-design-system/shidoka-studio/` is for when you’re ready.
