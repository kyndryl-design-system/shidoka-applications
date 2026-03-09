# Story UI POC – Shidoka Applications

Proof of concept for [Story UI](https://github.com/southleft/story-ui): AI-powered Storybook story generation using your design system components. See the intro post: [Introducing Story UI: Accelerating Layout Generation with AI + MCP](https://southleft.com/insights/design-systems/introducing-story-ui-accelerating-layout-generation-with-ai-mcp/).

## What’s in place

- **@tpitre/story-ui** installed (dev)
- **story-ui.config.js** – Web Components (Shidoka), `kyn-*` components, LLM provider, generated stories in `src/stories/generated/`, custom system prompt that tells the LLM to use provided design-system context as authoritative
- **story-ui-considerations.md** – Shidoka-specific rules: intent mapping, component-specific behaviors, table structure, forbidden patterns. Referenced by the AI and copied into `story-ui-docs/` when generating the registry.
- **Design system context (source of truth: custom-elements.json)** – Running `npm run generate-component-registry` reads CEM and writes:
  - **story-ui-docs/design-system-context.md** – every `kyn-*` tag with import path, attributes, slots, events (for the LLM)
  - **story-ui-docs/component-registry.md** – compact tag → import table
  - **story-ui-docs/component-api.json** – CEM-derived JSON for tooling/MCP
  - **story-ui-docs/considerations.md** – copy of story-ui-considerations.md (includes **page/template builder** layout and spacing rules)
  - **story-ui-docs/page-template-builder.md** – shell order, main padding, table wrapper, side-drawer anchor, spacing tokens (for full-page prompts)  
    The Story UI server can load from `story-ui-docs/` and expose via `/mcp/considerations`. Story UI is vetted primarily as a **page/template builder**; layout rules and spacing are in considerations and page-template-builder so complex prompts don’t overload the model. See **story-ui/docs/MCP-CONTEXT.md**.
- **Storybook** – Story UI panel under **Story UI → Story Generator** (MDX in `src/stories/story-ui-panel/`). The panel uses **Shidoka components** (e.g. `kyn-button`, `kyn-tag`) for the connection badge, New Chat, Send, welcome chips, and sidebar toggle.
- **Scripts**
  - `npm run generate-component-registry` – rebuild registry + design-system-context + copy considerations into story-ui-docs
  - `npm run story-ui` – start Story UI server (port 4001)
  - `npm run storybook` – start Storybook (port 6006)
  - `npm run storybook-with-ui` – run generate-component-registry then both (Storybook + Story UI)

## Prerequisites

1. **API key or local LLM**  
   In a `.env` file in the project root, set one of:

   - **Ollama:**  
     `OLLAMA_BASE_URL=http://localhost:11434/v1/chat/completions`  
     `OLLAMA_API_KEY=your-key` (optional for local)  
     `OLLAMA_MODEL=qwen2.5-coder:7b` (recommended for code/story generation; run `ollama list` to see names, `ollama pull <name>` to install)  
     Run `ollama serve` and pull a model first. The UI will show "Ollama" as the provider. **Recommended free model for Story UI:** `qwen2.5-coder:7b` (code-focused, 32K context, ~4.7GB). Alternatives: `codestral` (22B, best quality, ~13GB), `deepseek-coder:6.7b` (3.8GB), `llama3.3:8b` (general). If you get "model not found", set `OLLAMA_MODEL` to a name from `ollama list` or run `ollama pull qwen2.5-coder:7b`.
   - **Claude:** `ANTHROPIC_API_KEY=sk-ant-...` and set `llmProvider: 'claude'` in `story-ui.config.js`
   - **OpenAI:** `OPENAI_API_KEY=sk-...` and `llmProvider: 'openai'`
   - **Gemini:** `GEMINI_API_KEY=...` and `llmProvider: 'gemini'`

1. **Environment variables**  
   The Story UI **server** (Node) loads `.env` from the project root via `dotenv` and reads `process.env.OLLAMA_API_KEY`, `process.env.OLLAMA_BASE_URL`, etc. **Vite** (Storybook) only exposes variables prefixed with `VITE_` to the browser (e.g. `VITE_STORY_UI_PORT`). So `OLLAMA_*` and other API keys are for the server only—use plain names in `.env`; the server sees them as `process.env.OLLAMA_API_KEY`.

1. **Two processes**  
   For the POC you need both:
   - Storybook (so you can see the panel and generated stories)
   - Story UI server (so the panel can call the AI and write stories)

## How to run the POC

1. Add your provider config to `.env` (e.g. for Ollama: `OLLAMA_BASE_URL=...`, `OLLAMA_API_KEY=...`, `OLLAMA_MODEL=...`; or Claude: `ANTHROPIC_API_KEY=sk-ant-...`).

2. Start both services (from repo root):

   ```bash
   npm run storybook-with-ui
   ```

   Or in two terminals:

   ```bash
   npm run storybook    # Terminal 1 – http://localhost:6006
   npm run story-ui     # Terminal 2 – Story UI server on 4001
   ```

3. In the browser, open Storybook (e.g. http://localhost:6006).

4. In the sidebar, open **Story UI → Story Generator**.

5. In the panel, describe a layout in natural language, e.g.:

   - “Generate a 3×3 grid of cards”
   - “Create a settings page with user profile and toggles”
   - “A product card with image, title, price, and add to cart button”

6. Generated stories are written under `src/stories/generated/` and show up under **Generated** in the sidebar. You can iterate by chatting again (e.g. “Make the button green”). Each generated story is intended to **serve as a template or page generator**—copy patterns from a story into a full page or use them as section building blocks (see **Template / Page Generator** in `story-ui-considerations.md`).

## Optimal free Ollama model

For **code/story generation** (React, Storybook, TypeScript), the best free option is **qwen2.5-coder:7b**:

- Code-focused (vs general-purpose Llama), 32K context, ~4.7GB RAM.
- Install: `ollama pull qwen2.5-coder:7b`, then set `OLLAMA_MODEL=qwen2.5-coder:7b` in `.env` (or leave unset; it’s the default).

**Alternatives:** `codestral` (22B, highest quality, ~13GB); `deepseek-coder:6.7b` (3.8GB); `llama3.3:8b` (general-purpose). Use a name from `ollama list` or pull first with `ollama pull <name>`.

## Configuration

- **story-ui.config.js** – framework, paths, `importExamples`, `layoutRules` (main padding, table wrapper, full-page shell order), LLM provider, `storyPrefix`, custom `systemPrompt` that instructs the model to use provided considerations/design-system context as authoritative. Optional `docsPath: './story-ui-docs'` if the server supports it.
- **story-ui-considerations.md** – design system rules: intent mapping (user says X → use Y), component-specific behaviors (e.g. kyn-modal uses `open` to show; kyn-side-drawer must not use `open` unless the user asks for it open by default), table structure (kyn-\* only), forbidden imports/tags. Copied to `story-ui-docs/considerations.md` by the registry script.
- **story-ui-docs/** (generated, gitignored) – Populated by `npm run generate-component-registry` from **custom-elements.json**. Contains **design-system-context.md**, **component-registry.md**, **component-api.json** (CEM-derived), and **considerations.md**. The Story UI server may load these and serve via `/mcp/considerations`.
- **story-ui/docs/** – in-repo docs: **guidelines/component-registry.md**, **guidelines/constraints.md**, **patterns/page-structure.md**, **MCP-CONTEXT.md** (how we transmit design system info to the LLM).

## MCP (optional)

You can use Story UI from Claude Desktop or other MCP clients:

- **Local:** after `npm run story-ui`, MCP endpoint: `http://localhost:4001/mcp-remote/mcp`
- Add as a custom connector in Claude Desktop (Settings → Connectors) or via Claude Code.

## Troubleshooting

- **npm install hangs or fails with SELF_SIGNED_CERT_IN_CHAIN** – The project `.npmrc` sets `strict-ssl=false` so installs work behind corporate proxies. For a more secure setup, use your org’s CA: `npm config set cafile /path/to/corporate-ca.pem` or set `NODE_EXTRA_CA_CERTS=/path/to/ca.pem`; then you can remove `strict-ssl=false` from `.npmrc`.
- **Panel doesn’t load** – Ensure Story UI server is running (`npm run story-ui`) and `.env` has the correct API key.
- **Stories don’t appear** – Check that files are created in `src/stories/generated/` and that the Storybook stories glob in `.storybook/main.js` includes them (it does by default).
- **Wrong imports/tags** – Adjust `importExamples` in `story-ui.config.js` and the “Import Guidelines” in `story-ui-considerations.md` to match your components.
- **“Failed to fetch dynamically imported module”** – The generated story likely uses invalid imports (e.g. `lit/card`, `my-card`). Fix the story to use only Shidoka components and import paths from `story-ui.config.js` (see **Error Patterns to Avoid** in `story-ui-considerations.md`).

## Current scope: local development

This POC is intended for **local development only**. It depends on:

- Ollama (or another LLM) running on the developer machine or a local server
- The Story UI server and Storybook running locally

No production deployment or scaling is implied by the current setup.

## Future: production-ready / scalable migration

When you need something scalable and production-ready, options include:

1. **Hosted LLM instead of local Ollama**  
   Switch to a managed provider (Claude, OpenAI, Gemini, or an OpenAI-compatible API). Set the provider’s API key in production env and `llmProvider` in config. No local `ollama serve`; the Story UI server in production calls the provider’s API.

2. **Deploy Story UI + Storybook**  
   Story UI supports deployment (e.g. [Railway](https://github.com/southleft/story-ui#production-deployment)). Deploy the Story UI server (and optionally Storybook) and configure env (API keys, `OLLAMA_BASE_URL` if you use a hosted Ollama-compatible endpoint). Use secrets/env for keys, not `.env` in the repo.

3. **Self-hosted LLM at scale**  
   If you keep an Ollama-like or OpenAI-compatible API in your own infra, run it as a separate scalable service (e.g. Kubernetes, managed VMs). Point Story UI at that service’s base URL in production env. Same pattern as local, with a shared LLM endpoint and proper auth/keys.

4. **MCP in production**  
   For production MCP usage (e.g. Claude Desktop/Code), point the MCP client at your deployed Story UI URL (e.g. `https://your-story-ui.example.com/mcp-remote/mcp`) instead of localhost.

Migration is mainly config and env: same `story-ui.config.js` and panel; change env (and optionally deployment) to use a scalable LLM and a deployed Story UI server.

## Patches (your-library / my-library)

Some LLMs emit placeholder imports like `import "your-library/button"` or `import 'my-library/button'`, which break the build (no such package exists). This repo applies a **sanitizer** inside `@tpitre/story-ui` so that before a generated story is written, any `your-library/*` or `my-library/*` import is replaced with the correct Shidoka path from `story-ui.config.js` `importExamples`. Patched files:

- `node_modules/@tpitre/story-ui/dist/story-generator/postProcessStory.js` – exports `sanitizeFakeLibraryImports(code, config)`
- `node_modules/@tpitre/story-ui/dist/mcp-server/routes/generateStory.js` – calls the sanitizer after `postProcessStory`
- `node_modules/@tpitre/story-ui/dist/mcp-server/routes/generateStoryStream.js` – same for the streaming route

**If you run `npm install` and the error comes back,** re-apply these edits (or use [patch-package](https://www.npmjs.com/package/patch-package) to persist the patch). The considerations file (`story-ui-considerations.md`) also instructs the AI never to use `your-library` or `my-library`.

## References

- [Story UI repo](https://github.com/southleft/story-ui)
- [Southleft – Introducing Story UI](https://southleft.com/insights/design-systems/introducing-story-ui-accelerating-layout-generation-with-ai-mcp/)
- [NPM – @tpitre/story-ui](https://www.npmjs.com/package/@tpitre/story-ui)
