# Cursor MCP workflow — Shidoka design system constraint

This doc describes a **streamlined workflow** that uses **Cursor’s MCP (Model Context Protocol)** so Cursor’s AI is constrained to the Shidoka Design System when generating pages and templates. No model “training” is required: the design system is injected as **context** via MCP tools/resources and Cursor rules.

## Current vs. proposed

| Aspect           | Current (Story UI panel)                          | Proposed (Cursor + MCP)                                                             |
| ---------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Where you prompt | Browser: Storybook → Story UI panel               | Editor: Cursor chat                                                                 |
| Context source   | Panel fetches considerations from Story UI server | Cursor calls MCP tool to get Shidoka context                                        |
| Generation       | LLM (OpenRouter/etc.) via Story UI server         | Same LLM via Cursor, or MCP tool returns context and Cursor generates               |
| Output           | Written to `src/stories/generated/` by server     | Cursor writes files (e.g. `src/stories/generated/` or path you specify)             |
| Constraint       | considerations + design-system-context in request | Same content via MCP; Cursor rule enforces “use this context when generating pages” |

## Benefits

1. **Single source of truth** — Same `story-ui-docs/` (or source: considerations, page-template-builder, CEM-derived registry) feeds both the Story UI panel and Cursor. Run `npm run generate-component-registry` once; both flows stay in sync.
2. **No extra “training”** — You don’t fine-tune a model. You **constrain** it at inference time by always giving it Shidoka context when the task is “build a page/template” (via MCP tool + Cursor rule).
3. **Work in the editor** — Generate or edit Shidoka pages/templates from Cursor chat; preview in Storybook when you want.
4. **Optional panel** — You can still use the Story UI panel in Storybook for quick one-off generations; MCP + Cursor is for a more integrated, rule-driven workflow.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Cursor                                                         │
│  • User: "Build an Orders page with Shidoka shell, table, ..."  │
│  • Rule: "For Shidoka pages, call get_shidoka_design_context"   │
│  • Agent calls MCP tool → gets considerations + registry +       │
│    page-template-builder                                         │
│  • Agent generates .stories.ts (or component) following context │
│  • Writes to src/stories/generated/ or user path                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Shidoka MCP server (stdio)                                      │
│  • Tool: get_shidoka_design_context                              │
│    → Reads story-ui-docs/ (or source files)                       │
│    → Returns merged: considerations + registry + page-template   │
│  • Optional: resource shidoka://context (same content)          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  story-ui-docs/ (from npm run generate-component-registry)      │
│  • considerations.md  • design-system-context.md                 │
│  • component-registry.md  • page-template-builder.md            │
│  Source of truth: custom-elements.json + story-ui-considerations │
└─────────────────────────────────────────────────────────────────┘
```

## Setup

### 1. Generate design system docs (already required for Story UI)

```bash
npm run generate-component-registry
```

This populates `story-ui-docs/` (or the in-repo sources the MCP server reads). Run after CEM or considerations change.

### 2. Install and run the Shidoka MCP server

The project includes a small MCP server under `story-ui/mcp-server/` that exposes:

- **Tool:** `get_shidoka_design_context` — Returns the full Shidoka context (considerations, component registry, page-template-builder) as markdown. Cursor’s agent calls this when generating pages/templates so the model is constrained.

Add to `package.json` scripts (if not already):

```json
"mcp:shidoka": "node story-ui/mcp-server/index.js"
```

Dependency: `@modelcontextprotocol/sdk` and `zod` (devDependencies).

### 3. Configure Cursor to use the MCP server

Create **`.cursor/mcp.json`** in the repo root (project-level so Cloud Agents use it too):

```json
{
  "mcpServers": {
    "shidoka": {
      "command": "node",
      "args": ["story-ui/mcp-server/index.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

Or use `npx` with a wrapper script. Cursor spawns the server via stdio and talks MCP.

### 4. Add a Cursor rule so the agent uses Shidoka context

Create **`.cursor/rules/shidoka-generation.mdc`** (or add to a single rule file):

```markdown
---
description: When generating Shidoka pages or templates, use design system context from MCP
globs: src/stories/generated/**/*.ts, **/*page*.ts, **/*template*
---

# Shidoka page/template generation

When the user asks to **build a page**, **create a template**, or **generate a Storybook story** that uses Shidoka components (kyn-\*):

1. **Call the MCP tool** `get_shidoka_design_context` to retrieve the authoritative Shidoka design system context (considerations, component registry, page-template-builder layout and spacing rules).
2. **Generate code** that strictly follows that context:
   - Only use `kyn-*` tags and attributes listed in the registry.
   - Use only import paths from the context.
   - Follow page-template-builder for full-page layouts (shell order, main padding, toolbar spacing, side drawer, table wrapper, fullscreen decorator without negative margin).
   - Do not add `open` to kyn-side-drawer unless the user asks for the drawer open by default.
3. **Write output** to `src/stories/generated/` for Storybook stories (use a kebab-case filename and a stable id in the meta), or to the path the user specifies.
4. **Do not** use `<my-button>`, `<button>`, native `<table>`, or any tag/import not in the design system context.
```

This keeps Cursor constrained to Shidoka whenever it’s generating pages or templates.

## Workflow (daily use)

1. **Regenerate context after CEM or rule changes**

   ```bash
   npm run generate-component-registry
   ```

2. **In Cursor**

   - Ask: _“Build a Support Tickets page with Shidoka shell, header, page title, toolbar with search and primary button, side drawer for filters (closed by default), and a list of 5 ticket cards.”_
   - Cursor (per rule) calls `get_shidoka_design_context`, then generates the story (or component) and writes it under `src/stories/generated/`.

3. **Preview**

   - Run `npm run storybook` and open the generated story.

4. **Optional**
   - Use the Story UI panel in Storybook for quick one-off prompts; it still uses the same considerations from the Story UI server.

## “Training” vs. context

- **Training** would mean fine-tuning a model on Shidoka examples; that’s not required here.
- **Constraining** means every time Cursor generates a page/template, it receives the same Shidoka context (via MCP) and is instructed (via rules) to follow it. So the model behaves as if it “knows” the design system for that task.

## Optional: MCP resource instead of (or in addition to) tool

The server can expose a **resource** `shidoka://context` that returns the same markdown. Some clients can list and read resources so the user (or agent) can “attach” the design system to a conversation. The tool is usually easier for “call when generating” flows.

## References

- [MCP integrations | Cursor Docs](https://cursor.com/help/customization/mcp)
- [Story UI MCP context](./MCP-CONTEXT.md)
- [Page template builder](./patterns/page-template-builder.md)
- [Story UI POC](../STORY_UI_POC.md)
