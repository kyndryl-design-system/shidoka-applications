# Shidoka Studio — Architecture

This document maps the basic architecture of **Shidoka Studio**: the path from the Shidoka Design System to Cursor’s LLM via MCP (Model Context Protocol).

---

## High-level flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        SHIDOKA DESIGN SYSTEM (source)                             │
│  custom-elements.json (CEM)  │  content/considerations.md  │  page-template-*   │
└─────────────────────────────┴──────────────────────────────┴────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CONTEXT GENERATION (build time)                            │
│  npm run generate-component-registry  →  context-src/                             │
│  npm run build:shidoka-studio          →  context/ + packages/shidoka-studio/     │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MCP SERVER (runtime)                                    │
│  shidoka-studio/server/index.js  (stdio transport)                                │
│  Tool: get_shidoka_design_context  →  returns concatenated markdown context       │
│  Context resolution: SHIDOKA_STUDIO_CONTEXT_PATH → CONTEXT_URL → bundled context │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CURSOR (IDE)                                            │
│  .cursor/mcp.json  →  spawns MCP server                                           │
│  .cursor/rules/*.mdc (optional)  →  “call get_shidoka_design_context when …”      │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           LLM (Cursor’s model)                                    │
│  User: “Build a Settings page with Shidoka shell, header, form…”                  │
│  → Calls get_shidoka_design_context  →  receives design system context           │
│  → Generates code (e.g. .stories.js, .vue, page.tsx) using only kyn-* components │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Design system sources

| Source                                              | Role                                                                                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **custom-elements.json (CEM)**                      | Single source of truth for component API: tags, attributes, slots, events, CSS custom properties, import paths. Produced by `npm run analyze` (CEM analyzer). |
| **shidoka-studio/content/considerations.md**        | Human-maintained: intent mapping (user says X → use component Y), layout rules, forbidden patterns. Not derivable from CEM.                                   |
| **shidoka-studio/content/page-template-builder.md** | Human-maintained: shell order, main padding, table wrapper, toolbar spacing, side-drawer usage.                                                               |

---

## 2. Context generation (build)

- **Script:** `shidoka-studio/scripts/generate-component-registry.js`

  - Reads **custom-elements.json** from repo root.
  - Writes into **shidoka-studio/context-src/**:
    - `design-system-context.md` — CEM-derived component docs (tags, attributes, slots, CSS vars, imports).
    - `component-registry.md` — tag → import table; “only these kyn-\* tags exist.”
    - `component-api.json` — structured API for tooling/LLM.
  - Copies from **shidoka-studio/content/** into **context-src/**:
    - `considerations.md`, `page-template-builder.md`.

- **Script:** `shidoka-studio/scripts/build.js`

  - Copies **context-src/** → **shidoka-studio/context/** (in-repo server).
  - Copies **context-src/** → **packages/shidoka-studio/context/** (publishable package).
  - Copies **shidoka-studio/server/index.js** → **packages/shidoka-studio/bin/server.js**.

- **Root command:** `npm run build:shidoka-studio` runs `generate-component-registry` then `build.js`, then clears generated stories.

---

## 3. MCP server

- **Source of truth:** `shidoka-studio/server/index.js` (in-repo). Packaged as `packages/shidoka-studio/bin/server.js`.
- **Protocol:** MCP over stdio (`@modelcontextprotocol/sdk`).
- **Tool:** `get_shidoka_design_context` (no parameters). Returns one text content block: concatenated markdown from:
  1. Considerations
  2. Component registry / design-system context
  3. Page-template-builder

**Context resolution order:**

1. **SHIDOKA_STUDIO_CONTEXT_PATH** — folder containing `considerations.md`, `component-registry.md`, `page-template-builder.md` (and optionally `design-system-context.md`). Used for local override or reading directly from context-src.
2. **SHIDOKA_STUDIO_CONTEXT_URL** — URL that returns full context (markdown or JSON with `content`). For org-hosted context without reinstalling the package.
3. **Bundled context** — `../context` relative to the server (in-repo: `shidoka-studio/context/`; in package: `packages/shidoka-studio/context/`).

---

## 4. Cursor integration

- **Config:** `.cursor/mcp.json` — registers the `shidoka-studio` MCP server (command: `node` + path to server, or `npx -y @kyndryl-design-system/shidoka-studio` when using the package).
- **Rules (optional):** `.cursor/rules/*.mdc` — e.g. “when generating Shidoka pages, call `get_shidoka_design_context` first and follow that context.” Example: `shidoka-studio/cursor-examples/shidoka-generation.mdc.example`.

Cursor spawns the MCP server and exposes its tools to the LLM. The model decides when to call the tool (or is nudged by the rule).

---

## 5. Output format and placement

The MCP server does **not** dictate file format or path. The LLM infers from the workspace:

- **This repo (shidoka-applications):** Storybook + `src/stories/` → generate `.stories.js` / `.stories.ts` under PAGES.
- **Consuming app (Vue, Next.js, etc.):** e.g. `.vue`, `app/…/page.tsx`; user or rule can specify path/format.

See **PACKAGING-FOR-CONSUMERS.md** for “What file format?” and “Where do generated files go?”.

---

## 6. Directory layout (summary)

```
shidoka-studio/
├── server/
│   └── index.js              # MCP server (source of truth)
├── content/                  # Human-maintained context
│   ├── considerations.md
│   └── page-template-builder.md
├── context-src/              # Generated + copied at build (output of generate-component-registry)
│   ├── considerations.md
│   ├── page-template-builder.md
│   ├── design-system-context.md
│   ├── component-registry.md
│   └── component-api.json
├── context/                  # Copied from context-src by build.js (server reads this in-repo)
├── scripts/
│   ├── generate-component-registry.js
│   ├── build.js
│   └── clear-generated-stories.js
├── docs/
│   ├── ARCHITECTURE.md       # This file
│   ├── CURSOR-MCP-WORKFLOW.md
│   ├── PACKAGING-OPTIONS.md
│   └── PACKAGING-FOR-CONSUMERS.md
└── cursor-examples/
    ├── mcp.json.example
    └── shidoka-generation.mdc.example

packages/shidoka-studio/       # Publishable package (built from above)
├── bin/
│   └── server.js             # Copy of shidoka-studio/server/index.js
├── context/                  # Copy of context-src at build
├── package.json
└── README.md
```

---

## 7. Dependencies

- **MCP:** `@modelcontextprotocol/sdk` (dev dependency in root package.json).
- **Node:** 18+.
- **Cursor:** MCP support and `.cursor/mcp.json` (project-level or global).

No model-specific or Cursor-internal APIs are used; the boundary is the MCP tool contract.
