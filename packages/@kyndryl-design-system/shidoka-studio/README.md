# Shidoka Studio

**Shidoka Studio** is an MCP (Model Context Protocol) server for [Cursor](https://cursor.com) that gives the AI access to the **Shidoka Design System** context. When you ask Cursor to build a page or template, it can call this server to get the rules, component registry, and layout patterns—so generated code uses only `kyn-*` components and follows Shidoka spacing and structure.

You don’t need the design system repo. Install this package and add one block to your Cursor config.

---

## For internal app developers

If you're building an application with Shidoka (Vue, Next.js, React, Svelte, Vanilla JS, etc.) and already use the design system components in your app, **Shidoka Studio is a separate dev tool**: it runs locally and tells Cursor how to generate pages that use Shidoka correctly. Install it as a dev dependency in your app repo and configure Cursor once; framework-agnostic—Cursor will infer output format and paths from your project.

**If your org uses a private npm registry:** Install the same way you install other `@kyndryl-design-system` packages (ensure your `.npmrc` and registry are set up). Then follow **Configure Cursor** below.

---

## Install

**Project (recommended):**

```bash
npm install -D @kyndryl-design-system/shidoka-studio
```

**Global (use in every Cursor workspace):**

```bash
npm install -g @kyndryl-design-system/shidoka-studio
```

**Side-load (no registry):** You can distribute the package without publishing to any registry.

1. **You (releaser)** — From the design-system repo root, build and pack once:

   ```bash
   npm run build:shidoka-studio
   cd packages/@kyndryl-design-system/shidoka-studio && npm pack
   ```

   That creates **`kyndryl-design-system-shidoka-studio-1.0.0.tgz`** (version from package.json). Share that file (internal drive, CI artifact, or internal URL).

2. **Consumers** — From their app repo, install the tarball:

   ```bash
   npm install -D /path/to/kyndryl-design-system-shidoka-studio-1.0.0.tgz
   ```

   Or with a URL if you host the file: `npm install -D https://your-server.com/.../kyndryl-design-system-shidoka-studio-1.0.0.tgz`

   Then add the MCP block to `.cursor/mcp.json` (same as below; Cursor will run the installed package).

---

## Configure Cursor

Add the MCP server so Cursor can start it.

**Project install** — create or edit **`.cursor/mcp.json`** in your project root:

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

**Global install** — create or edit **`~/.cursor/mcp.json`**:

```json
{
  "mcpServers": {
    "shidoka-studio": {
      "command": "shidoka-studio"
    }
  }
}
```

Then **reload Cursor** (Command Palette → “Developer: Reload Window”).

---

## Use it

In Cursor chat, ask for a Shidoka page or template, for example:

- _“Build a Settings page with Shidoka shell, header, page title, and a form with toggles.”_
- _“Create an Orders list with Shidoka shell, toolbar with Filter and Export, and a data table with 5 rows.”_

Cursor will use the **get_shidoka_design_context** tool and generate code that follows the design system.

**What file format is generated?** The MCP does not dictate format. Cursor infers from your project: if you have Storybook and `src/stories/`, you’ll get a `.stories.js` (or `.stories.ts`) under PAGES; if you have Vue, Next.js, or another framework, the model will emit the appropriate file type (e.g. `.vue`, `app/…/page.tsx`). To avoid the wrong format, specify it in your prompt (e.g. "Generate as a Vue component at `src/views/SettingsPage.vue`") or in a project Cursor rule.

---

## Optional: Cursor rule (recommended — so the agent calls the tool first)

Without a rule, the model may not call `get_shidoka_design_context` when you ask for a page; it might infer from package types only and miss layout rules. **Copy the shipped rule** into your project so the agent is instructed to call the tool first (any framework):

```bash
mkdir -p .cursor/rules
cp node_modules/@kyndryl-design-system/shidoka-studio/cursor-examples/shidoka-generation.mdc.example .cursor/rules/shidoka-generation.mdc
```

Then reload Cursor. The rule is framework-agnostic (Vue, React, Next, Svelte, etc.); you can edit the rule’s `globs` to match your app’s page/view paths. See **context/consuming-app-setup-and-alignment.md** in the package (or the docs in the design-system repo) for the full setup and alignment checklist.

---

## Optional: override context source

- **`SHIDOKA_STUDIO_CONTEXT_PATH`** — Absolute path to a folder containing `considerations.md`, `component-registry.md`, `page-template-builder.md`. Overrides the bundled context.
- **`SHIDOKA_STUDIO_CONTEXT_URL`** — URL that returns the full context (markdown or JSON with a `content` string). Useful if your org serves the design system context from an internal docs site; then you don’t need to reinstall the package when the context changes.

Set these in your environment or in Cursor’s MCP server config if it supports per-server `env`.

---

## Requirements

- Node.js 18+
- Cursor with MCP support (project-level config: `.cursor/mcp.json`)

---

## Publishing

**Do not publish this package to the public npm registry (npmjs.com) without explicit permission.** The package includes a `prepublishOnly` guard that blocks publish when the registry is npmjs.org. Use your organization's private registry for internal distribution.

---

## Links

- [Shidoka Design System](https://github.com/kyndryl-design-system/shidoka-applications) (design system repo)
- [Cursor MCP docs](https://cursor.com/help/customization/mcp)
