# Cursor MCP workflow — Shidoka design system constraint

This doc describes the **Shidoka Studio** workflow: Cursor’s MCP (Model Context Protocol) used so the AI is constrained to the Shidoka Design System when generating pages and templates. No model “training” is required; the design system is injected as **context** via the MCP tool and Cursor rules.

---

## Setup (in-repo)

### 1. Generate design system context

From repo root:

```bash
npm run generate-component-registry
```

Then build Shidoka Studio context (copies into `shidoka-studio/context/`):

```bash
npm run build:shidoka-studio
```

### 2. Configure Cursor to use the MCP server

Create or edit **`.cursor/mcp.json`** in the repo root:

```json
{
  "mcpServers": {
    "shidoka-studio": {
      "command": "node",
      "args": ["shidoka-studio/server/index.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

Or use the example: **shidoka-studio/cursor-examples/mcp.json.example**.

### 3. Add a Cursor rule (optional)

Create **`.cursor/rules/shidoka-generation.mdc`** so the agent calls the tool when generating pages. See **shidoka-studio/cursor-examples/shidoka-generation.mdc.example**.

### 4. Reload Cursor

Reload the window so Cursor picks up the MCP server and rules.

---

## Workflow (daily use)

1. After CEM or considerations changes: `npm run generate-component-registry` then `npm run build:shidoka-studio`.
2. In Cursor chat, ask for a page or template (e.g. “Build a Support Tickets page with Shidoka shell, toolbar, side drawer, 5 ticket cards”).
3. Cursor calls `get_shidoka_design_context` and generates code that follows the design system.
4. **Output format** depends on the workspace. In **this repo** (shidoka-applications), Storybook and `src/stories/` are present, so the model generates a **`.stories.js`** (or `.stories.ts`) file that appears under **PAGES** in the Storybook sidebar. In a **consuming app** (Vue, Next.js, etc.), the model infers format from the project—e.g. `.vue`, `app/…/page.tsx`—or use an explicit prompt (e.g. "Generate as a Vue component at `src/views/SettingsPage.vue`"). See **PACKAGING-FOR-CONSUMERS.md** → "What file format will be generated?" and "Where do generated files go?".

In a Vue or Next.js app, Cursor can infer where to put the file but won't automatically wire the new view into routing. Ask explicitly for both generation and integration (e.g. "add it as a route at `/settings`"). See **PACKAGING-FOR-CONSUMERS.md** → "Will Cursor wire the new view so I can see it on localhost?"

---

## References

- [MCP integrations | Cursor Docs](https://cursor.com/help/customization/mcp)
- [Packaging options](./PACKAGING-OPTIONS.md) — npm package, Cursor extension, etc.
