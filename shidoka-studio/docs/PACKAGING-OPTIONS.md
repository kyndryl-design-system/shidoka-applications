# Shidoka Studio — packaging and distribution options

When you’re ready to distribute **Shidoka Studio** so consuming developers (internal or external to the design system repo) can use it in Cursor, you can package it in one or more of the following ways. **No publishing is set up yet**; this doc is for planning.

---

## Option 1: npm package (recommended baseline)

**What:** Publish a package (e.g. `@kyndryl-design-system/shidoka-studio`) that contains the MCP server and a bundled snapshot of the design system context. Consumers install it and add one block to `.cursor/mcp.json`.

**Pros:**

- Works with any MCP-capable client (Cursor, Claude Desktop, etc.).
- Versioned releases; consumers can `npm update` to get new context.
- Fits internal npm registries (e.g. Artifactory) or public npm.

**Cons:**

- Context is fixed at publish time unless you use `SHIDOKA_STUDIO_CONTEXT_URL` (or republish often).

**How (when ready):**

- Build artifact lives in **`packages/@kyndryl-design-system/shidoka-studio/`**: server (from `shidoka-studio/server/`) + context (from `shidoka-studio/context-src/` at build time). Run `npm run build:shidoka-studio`, then from `packages/@kyndryl-design-system/shidoka-studio` run `npm publish` (with your registry/auth).
- Consumer: `npm install -D @kyndryl-design-system/shidoka-studio`, then in `.cursor/mcp.json`: `"command": "npx", "args": ["-y", "@kyndryl-design-system/shidoka-studio"]`.

**Details:** See **PACKAGING-FOR-CONSUMERS.md** in this folder for consumer and publisher steps.

---

## Option 2: Cursor extension

**What:** A Cursor/VS Code extension that either (a) bundles or launches the MCP server and registers it with Cursor, or (b) adds a “Enable Shidoka Studio” action that writes the MCP config for the user.

**Pros:**

- One-click or marketplace install; good discoverability.
- Could add a dedicated Shidoka panel, commands, or snippets.

**Cons:**

- Cursor’s extension model is VS Code–compatible; you need to confirm whether MCP servers can be bundled or must be configured via `mcp.json`. Extension docs may limit how the server is started.
- More build and maintenance (extension packaging, signing if required).

**How (when ready):**

- Implement a VS Code extension (e.g. with `yeoman` generator or a minimal extension template) that either spawns the Node MCP server or instructs the user to add the MCP block. The server code can be the same as in the npm package; the extension is another distribution channel.

---

## Option 3: Internal registry + env-based context

**What:** Publish the npm package to your internal registry only. Optionally, host the design system context at an internal URL (docs site or small API) and document `SHIDOKA_STUDIO_CONTEXT_URL` so enterprises can point at it; then consumers get the latest context without reinstalling the package.

**Pros:**

- Single internal source of truth for context; design system team updates the URL content.
- Package stays small; no need to republish for context-only changes.

**Cons:**

- Requires hosting and URL stability; network access from Cursor’s MCP process.

---

## Option 4: Monorepo / git dependency (no registry)

**What:** Consuming repos add the design system repo (or the `packages/@kyndryl-design-system/shidoka-studio` folder) as a git dependency or submodule, and point `.cursor/mcp.json` at the local server script.

**Pros:**

- No npm publish or registry; good for early adopters or internal-only.

**Cons:**

- Consumers need access to the repo; updates require pulling and rebuilding.

---

## Summary

| Option               | Best for                          | When to choose it                                           |
| -------------------- | --------------------------------- | ----------------------------------------------------------- |
| **npm package**      | Broad internal or external use    | Default; works with Cursor and other MCP clients.           |
| **Cursor extension** | Cursor-first UX / discoverability | When you want marketplace or one-click install.             |
| **Internal URL**     | Enterprise, always-fresh context  | Combine with npm package; set `SHIDOKA_STUDIO_CONTEXT_URL`. |
| **Git dependency**   | Early / internal-only             | When you’re not ready to publish to a registry.             |

The repo is set up so **Option 1 (npm package)** is the primary path: **`shidoka-studio/`** is the source (server + docs); **`packages/@kyndryl-design-system/shidoka-studio/`** is the built artifact for publish. Options 2–4 can be added on top when needed.
