# MCP and design system context — how we transmit info to the LLM

This doc describes how Shidoka Applications makes design system data available to the Story UI MCP and LLM so generated stories use only real components with correct attributes and imports.

## Source of truth: custom-elements.json (CEM)

**All component API (tags, attributes, slots, events, import paths) comes from `custom-elements.json`.** Nothing is hand-maintained. The generator (`npm run generate-component-registry`) reads CEM and emits markdown and JSON for the LLM and tooling. Considerations (intent mapping, table structure, forbidden patterns) supplement CEM with rules it does not encode.

## Goals

- **Single source of truth:** CEM. All generated component data is derived from it.
- **Rich context for the LLM:** CEM-derived design-system context plus considerations (intent mapping, usage rules) so the model does not guess.
- **MCP-friendly:** The Story UI server exposes design system context (e.g. at `/mcp/considerations`) so the panel and MCP clients send the same payload to the LLM.

## What we generate (all from CEM)

Running `npm run generate-component-registry` (or `npm run storybook-with-ui`, which runs it first):

1. **story-ui/docs/guidelines/component-registry.md**  
   Compact tag → import table + key attributes (all from CEM). Used in-repo and for small context windows.

2. **story-ui-docs/** (build-time, gitignored)
   - **component-registry.md** — same compact registry (from CEM).
   - **design-system-context.md** — every `kyn-*` tag with import path, attributes, slots, events (from CEM). Authoritative for the LLM.
   - **component-api.json** — CEM-derived JSON (tag → importPath, attributes, slots, events) for tooling or MCP.
   - **considerations.md** — copy of `story-ui/story-ui-considerations.md` (intent mapping, table structure, forbidden patterns, **page/template builder rules**).
   - **page-template-builder.md** — Shidoka layout order, spacing tokens, table wrapper, side-drawer anchor pattern; included so full-page prompts (ui-shell + header + local nav + footer + data table + side drawer) don’t overload the model.

The Story UI server (from `@tpitre/story-ui`) typically discovers design system docs from the project root. If it supports a `docsPath` or similar option, point it at `./story-ui-docs` so it can load:

- `design-system-context.md` (authoritative component API)
- `considerations.md` (Shidoka-specific rules and intent mapping)

The panel fetches considerations from the server (e.g. `GET /mcp/considerations`) and sends them in the generate request body as `considerations`. So the server should combine or serve the contents of `considerations.md` and, when possible, `design-system-context.md` (or a summary) so the LLM receives one coherent design system payload.

## Flow

1. **Build context**  
   `npm run generate-component-registry` reads **custom-elements.json** (source of truth) and writes:

   - `story-ui-docs/design-system-context.md` (full CEM-derived reference)
   - `story-ui-docs/component-registry.md` (compact)
   - `story-ui-docs/component-api.json` (CEM-derived JSON for tooling)
   - `story-ui-docs/considerations.md` (copy of considerations; rules CEM doesn’t encode)

2. **Server**  
   Story UI server starts with `npm run story-ui`. It loads config (`story-ui.config.js`) and, if supported, docs from `story-ui-docs/`. It exposes design system context via:

   - `/mcp/considerations` (or `/story-ui/considerations`) — returned to the panel and/or MCP clients.

3. **Panel**  
   Story UI panel calls the considerations API and sends the response as `considerations` in the body of the generate-story request. The LLM should treat this as authoritative.

4. **System prompt**  
   `story-ui.config.js` includes a custom `systemPrompt` that instructs the model to use any provided considerations/design-system context as authoritative and to only use tags/attributes/imports listed there.

## Improving sophistication

- **Already in place**

  - CEM-derived `design-system-context.md` with attributes, slots, events per component.
  - Structured `story-ui-considerations.md` with intent mapping, component-specific behaviors, table structure, and forbidden patterns.
  - System prompt telling the model to respect provided context.

- **Optional next steps**
  - If the Story UI server supports a `docsPath`, set it to `./story-ui-docs` and ensure it merges or serves `design-system-context.md` + `considerations.md` in the considerations response.
  - Use Storybook MCP (`@storybook/addon-mcp`) when available so the server can also fetch component docs and story patterns from Storybook for even richer context.
  - For very long context: serve a shortened “high-signal” summary (e.g. intent mapping + top N components + critical rules) and keep full design-system-context available for follow-up or tool use.

## References

- [Introducing Story UI (Southleft)](https://southleft.com/insights/design-systems/introducing-story-ui-accelerating-layout-generation-with-ai-mcp/)
- [@tpitre/story-ui on npm](https://www.npmjs.com/package/@tpitre/story-ui)
- [Story UI repo](https://github.com/southleft/story-ui)
- `story-ui/STORY_UI_POC.md` — how to run the POC and troubleshoot.
