# Shidoka Studio

**Shidoka Studio** is an MCP (Model Context Protocol) server for [Cursor](https://cursor.com) that gives the AI access to the **Shidoka Design System** context. When you ask Cursor to build a page or template, it can call this server to get the rules, component registry, and layout patterns—so generated code uses only `kyn-*` components and follows Shidoka spacing and structure.

You don’t need the design system repo. Install this package and add one block to your Cursor config.

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

---

## Optional: Cursor rule

To encourage the agent to always use Shidoka context when generating pages, add a rule. Create **`.cursor/rules/shidoka-studio.mdc`**:

```markdown
---
description: Use Shidoka Studio when generating pages or templates
globs: src/**/*.ts,src/**/*.tsx
alwaysApply: false
---

When the user asks to build a page, template, or layout that uses Shidoka (kyn-_ components), call the MCP tool **get_shidoka_design_context** first, then generate code that strictly follows that context (only kyn-_ tags, registry import paths, and page-template-builder layout rules).
```

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

## Links

- [Shidoka Design System](https://github.com/kyndryl-design-system/shidoka-applications) (design system repo)
- [Cursor MCP docs](https://cursor.com/help/customization/mcp)
