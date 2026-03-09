# Shidoka Studio — packaging for consuming developers

**Shidoka Studio** is the MCP server that exposes the Shidoka Design System context to Cursor so any developer (internal, enterprise) can generate pages and templates constrained to Shidoka—without cloning the design system repo.

**Status:** In development. The package layout under `packages/shidoka-studio/` is ready for when you set up publishing; no npm publish is configured yet.

This doc covers: (1) **consumer perspective** — how external devs would install and use it in Cursor, and (2) **publisher perspective** — how the design system team would build and publish. It could be distributed as an **npm package** or, in theory, a **Cursor extension** (see end of doc).

---

## Consumer perspective: “I’m building an app with Shidoka; I want Cursor to know the design system”

### What you get

- **One npm package**: `@kyndryl-design-system/shidoka-studio` (or your org’s scope).
- **One MCP tool** in Cursor: `get_shidoka_design_context`. When you ask Cursor to “build a Shidoka settings page,” it calls this tool, gets the current rules and component registry, and generates code that uses only `kyn-*` components and follows layout/spacing rules.
- **No design system repo required** — the package ships with a **bundled snapshot** of the design system context (considerations, registry, page-template-builder). You don’t need access to the design system repo.

### Install (project or global)

**Option A — project (recommended for app repos)**

```bash
npm install -D @kyndryl-design-system/shidoka-studio
# or: yarn add -D @kyndryl-design-system/shidoka-studio
# or: pnpm add -D @kyndryl-design-system/shidoka-studio
```

**Option B — global (use Shidoka Studio in every Cursor workspace)**

```bash
npm install -g @kyndryl-design-system/shidoka-studio
```

### Configure Cursor

Add the MCP server so Cursor can start it.

**If you installed the package in the project:**

Create or edit **`.cursor/mcp.json`** in your project root:

```json
{
  "mcpServers": {
    "shidoka-studio": {
      "command": "npx",
      "args": ["-y", "@kyndryl-design-system/shidoka-studio"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

**If you installed globally:**

Create or edit **`~/.cursor/mcp.json`** (user-level):

```json
{
  "mcpServers": {
    "shidoka-studio": {
      "command": "shidoka-studio"
    }
  }
}
```

Then **reload Cursor** (e.g. Developer: Reload Window) so it picks up the config.

### Use it

In Cursor chat, ask for a Shidoka page or template, e.g.:

- _“Build a Settings page with Shidoka shell, header, page title, and a form with toggles.”_
- _“Create an Orders list with Shidoka shell, toolbar with Filter and Export, and a data table with 5 rows.”_

Cursor will call `get_shidoka_design_context` and generate code that follows the design system. You can also **add a Cursor rule** so the agent always uses the tool when generating pages (see [CURSOR-MCP-WORKFLOW.md](./CURSOR-MCP-WORKFLOW.md)); the package README can ship an optional rule snippet.

### Optional: override context source (enterprise)

If your org serves the design system context from an internal URL (e.g. docs site or CDN), you can point Shidoka Studio at it so devs get the latest context without reinstalling the package:

- **`SHIDOKA_STUDIO_CONTEXT_URL`** — URL to a JSON or markdown endpoint that returns the full context (or a URL to a single markdown file). When set, the MCP server fetches context from this URL instead of using the bundled snapshot.
- **`SHIDOKA_STUDIO_CONTEXT_PATH`** — Absolute path to a folder containing `considerations.md`, `component-registry.md`, `page-template-builder.md`. Useful for design system maintainers testing against local files.

Set these in your environment or in Cursor’s MCP server config (if your Cursor version supports `env` per server).

---

## Publisher perspective: design system team

### What to publish

- **Package name**: e.g. `@kyndryl-design-system/shidoka-studio`.
- **Contents**: MCP server (Node script speaking MCP over stdio) + **bundled context** (considerations, component-registry, page-template-builder, optionally design-system-context) generated from this repo’s CEM and `story-ui-considerations.md` / `page-template-builder.md`.

### Build and publish flow

1. **Generate context** (in the design system repo):

   ```bash
   npm run generate-component-registry
   ```

   This produces `story-ui-docs/considerations.md`, `component-registry.md`, `page-template-builder.md`, etc.

2. **Build the package** (in the design system repo):

   ```bash
   npm run build:shidoka-studio
   ```

   This runs `generate-component-registry` then copies `story-ui-docs/*.md` (considerations, component-registry, page-template-builder, design-system-context) into `packages/shidoka-studio/context/`. The MCP server and package layout already live in `packages/shidoka-studio/`; the build only refreshes the bundled context.

3. **Publish** to your internal npm registry (e.g. Kyndryl Artifactory):
   ```bash
   cd packages/shidoka-studio
   npm publish --access restricted
   ```
   (If your registry is scoped, ensure `publishConfig` in the package’s `package.json` points to it, or use `npm publish --registry https://your-registry/...`.) You can wire this into CI (e.g. on release of the design system).

### Keeping context up to date

- **Option A**: Republish the package when the design system changes (e.g. on every release or when CEM/considerations change). Consuming devs run `npm update @kyndryl-design-system/shidoka-studio` to get the latest.
- **Option B**: Publish the package once and have it fetch context from a **URL** (e.g. `SHIDOKA_STUDIO_CONTEXT_URL` pointing to your internal docs or a small API). The design system team updates the content at that URL; no need to republish the package for context-only changes.

---

## Summary

| Who                    | Action                                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Consuming dev**      | Install `@kyndryl-design-system/shidoka-studio`, add one block to `.cursor/mcp.json`, reload Cursor. Use Cursor chat to generate Shidoka pages/templates. |
| **Design system team** | Build package with bundled context, publish to internal npm. Optionally expose context via URL and document `SHIDOKA_STUDIO_CONTEXT_URL` for enterprises. |
| **Enterprise**         | Optional: host design system context at an internal URL and set `SHIDOKA_STUDIO_CONTEXT_URL` so all Cursor users get the same, up-to-date context.        |

This makes Shidoka Studio usable in **any internal, enterprise instance of Cursor** by developers who are external to the design system repo.

---

## Distribution options (when you’re ready)

- **npm package** — What we scaffolded: publish `@kyndryl-design-system/shidoka-studio` to your internal (or public) registry. Consuming devs `npm install` and add one block to `.cursor/mcp.json`. Works with any MCP-capable client (Cursor, Claude Desktop, etc.).
- **Cursor extension** — Theoretically, Shidoka Studio could be wrapped in a Cursor/VS Code extension that either (a) bundles the MCP server and registers it with Cursor, or (b) adds a one-click “Enable Shidoka Studio” that writes the MCP config for the user. Cursor’s extension model is VS Code–compatible; whether MCP servers can be bundled or only configured via `mcp.json` is something to confirm with Cursor’s docs. An extension could also add a dedicated “Shidoka” panel or commands. So: **npm package** is the path that’s ready today; **Cursor extension** is a possible future front-end or packaging option on top of the same MCP server.
