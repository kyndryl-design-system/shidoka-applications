# Shidoka Studio — packaging for consuming developers

**Status:** In development. The package layout under `packages/shidoka-studio/` is ready for when you set up publishing; no npm publish is configured yet.

This doc covers: (1) **consumer perspective** — how external devs would install and use Shidoka Studio in Cursor, and (2) **publisher perspective** — how the design system team would build and publish. For distribution options (npm vs Cursor extension vs internal URL), see **PACKAGING-OPTIONS.md**.

---

## Consumer perspective

### What you get

- One MCP tool in Cursor: `get_shidoka_design_context`. When you ask Cursor to “build a Shidoka settings page,” it calls this tool, gets the rules and component registry, and generates code that uses only `kyn-*` components.
- No design system repo required — the package ships with a bundled snapshot of the context (considerations, registry, page-template-builder).

### Install (when package is published)

**Project:** `npm install -D @kyndryl-design-system/shidoka-studio`  
**Global:** `npm install -g @kyndryl-design-system/shidoka-studio`

### Configure Cursor

**Project install** — `.cursor/mcp.json`:

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

**Global install** — `~/.cursor/mcp.json`: `"command": "shidoka-studio"`.

Then reload Cursor.

### Optional overrides

- **SHIDOKA_STUDIO_CONTEXT_PATH** — Path to a folder with `considerations.md`, `component-registry.md`, `page-template-builder.md`.
- **SHIDOKA_STUDIO_CONTEXT_URL** — URL that returns the full context (markdown or JSON with `content`). Useful when your org hosts context internally.

### What file format will be generated?

**Shidoka Studio does not specify output format.** The MCP context describes _how_ to use Shidoka components (tags, imports, layout rules), not _what_ to emit. Cursor infers format from the **open workspace**:

- **In the design-system repo (e.g. shidoka-applications):** Storybook and `src/stories/` are present, so the model typically generates a **`.stories.js`** (or `.stories.ts`) file and it appears under PAGES in the Storybook sidebar. That's appropriate there.
- **In a consuming app:** Format depends on the project. If the app has **no Storybook**, the model should _not_ emit a story file — it should emit whatever the app uses: e.g. a **Vue SFC** (`.vue`), a **Next.js page** (`app/settings/page.tsx` or `pages/settings.tsx`), or a **React component** (`.tsx`). The AI infers from the repo layout and file patterns.

To avoid wrong format (e.g. a `.stories.js` in an app that doesn't use Storybook), **be explicit in the prompt or in a project Cursor rule.** Examples: _"Generate as a Vue component at `src/views/SettingsPage.vue`"_, _"Generate as a Next.js page at `app/settings/page.tsx`"_, or in a rule: _"When generating Shidoka pages, output a Vue SFC in `src/views/`"_.

### Where do generated files go?

**Shidoka Studio does not write files.** It only exposes `get_shidoka_design_context`. Cursor (or the user) generates and saves the code. The package/extension **should not dictate** where pages or templates live in the consumer’s app — every repo has different structure (Next.js `app/`, SvelteKit `src/routes/`, Angular `src/app/`, plain `src/views/`, etc.).

**Recommendation:**

- **Do not** hard-code a single output path in the extension or in a shared rule. Let the **application repo** decide.
- In the **consuming app**, define a convention once and point the AI at it:
  - **Stories:** e.g. `src/stories/generated/` (if they use Storybook).
  - **Pages/templates:** e.g. `src/pages/`, `src/views/`, or `app/(dashboard)/generated/` — whatever matches the app. Document it in a Cursor rule (e.g. “When generating Shidoka pages, write to `src/pages/`”) or in the project README so the AI and the team stay consistent.
- The **design system package** can suggest defaults in its example rule (e.g. “or to the path the user specifies”) and in this doc, but the final say is the app’s.

That way the extension/package stays app-agnostic; each team gets one place for generated output without the package imposing a layout that doesn’t fit.

### Will Cursor wire the new view so I can see it on localhost?

**Short answer:** Cursor can often infer **where** to put the file from your project structure (e.g. `src/views/` in Vue, `app/` or `pages/` in Next.js). It will **not** reliably infer how to **wire** the new view into your app so it's reachable on localhost unless you ask for that explicitly.

- **Vue:** A new component in `src/views/SettingsPage.vue` is not reachable until something (e.g. Vue Router) has a route that renders it and, optionally, a nav link. Cursor can see your router and add a route if you ask.
- **Next.js (App Router):** A new view is reachable only if it lives in the right place (e.g. `app/settings/page.tsx` → `/settings`). Cursor can create that path if you specify the route.
- **Next.js (Pages Router):** A new file under `pages/` (e.g. `pages/settings.tsx`) is automatically a route. Cursor might put the file there if it sees the `pages/` structure.

**Recommendation — ask for both generation and integration in one prompt:**

- **Vue:** _"Generate a Shidoka Settings view and add it as a route at `/settings` in our Vue Router."_
- **Next.js (App Router):** _"Generate a Shidoka Settings page at the route `/settings` (create the file in `app/settings/page.tsx`)."_
- **Next.js (Pages Router):** _"Generate a Shidoka Settings page at `/settings` (add `pages/settings.tsx`)."_

If you only say "generate a Settings view," you may get a valid Shidoka component that's never connected to routing. One prompt that includes "add it as a route" or "at `/settings`" (and the path if your framework needs it) gets you a view you can open on localhost.

**Optional:** In your app repo, add a Cursor rule (e.g. `.cursor/rules/shidoka-views.mdc`) that states where Shidoka-generated views live and how routing works (e.g. "New Shidoka pages go in `src/views/`; add a route in `src/router/index.js` with path and component."). Then the first-time prompt can be shorter and the AI will still wire the view.

### Styling: required CSS and avoiding overrides

Your app must load Shidoka Foundation (and any applications/charts global CSS) so tokens and layout work. To prevent your application’s styles from overwriting the design system, use **CSS cascade layers** so Shidoka has higher precedence than app globals.

- **Required styles:** `@kyndryl-design-system/shidoka-foundation`: import `css/root.css` and `css/index.css` in your app entry. Add any applications or charts global CSS if you use those packages.
- **Layer order:** Declare `@layer app, shidoka` and load Shidoka into the `shidoka` layer and your app’s global styles into the `app` layer so Shidoka isn’t overwritten.

Full setup and examples: **shidoka-studio/docs/STYLING-FOR-CONSUMERS.md**.

---

## Publisher perspective (design system team)

### Build

From repo root:

```bash
npm run build:shidoka-studio
```

This (1) runs `generate-component-registry` (writes into `shidoka-studio/context-src/`), (2) copies `context-src/` into `shidoka-studio/context/` and `packages/shidoka-studio/context/`, and (3) copies `shidoka-studio/server/index.js` into `packages/shidoka-studio/bin/server.js`, so the publishable package is up to date.

### Publish (when ready)

```bash
cd packages/shidoka-studio
npm publish --access restricted
```

Use your registry and auth (e.g. internal Artifactory). No publish step is configured in CI yet.
