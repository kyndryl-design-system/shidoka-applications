# Shidoka Design System Considerations

**Source of truth for component API: custom-elements.json (CEM).** All tags, attributes, slots, events, and import paths are defined there. The design-system context (e.g. `design-system-context.md`, `component-api.json`) is generated from CEM — do not guess; use only what appears in that context.

**This file adds only what CEM does not encode:** intent mapping (user says X → use component Y), Shidoka-specific usage rules (e.g. table structure, modal/drawer visibility, layout and spacing), and forbidden patterns. The LLM should receive both the CEM-derived context and this considerations file.

## Adaptability (no one-off example files)

Do **not** create or rely on hand-authored example stories for each pattern (e.g. "inbox-side-drawer-example"). The LLM must **infer** how to use and consume the Shidoka Design System from: (1) the CEM-derived design-system context, (2) this considerations file, and (3) the page-template-builder layout and spacing rules. Generate output that follows those rules so layout, spacing, and component usage are correct without targeted example files.

## The one rule

**Only use tags, attributes, slots, and import paths that come from the CEM-derived context.** If something is not listed there, it does not exist in this project.

## Framework and imports

- **Framework:** Lit web components, tag prefix `kyn-`
- **Lit import:** `import { html } from 'lit';` — the ONLY allowed lit import
- **Component imports:** use relative paths appropriate to the consuming app (e.g. `import '../../components/reusable/button/index';` in this repo; in other apps use their paths from the registry).
- **Component count:** 117+ components — from `kyn-accordion` to `kyn-workspace-switcher` (exact count in design-system-context.md)

## Intent mapping (user says → use this)

| User says                   | Use                                                                                                                   | Import                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| "button" / "primary button" | `<kyn-button kind="primary">Label</kyn-button>`                                                                       | `../../components/reusable/button/index`                  |
| "ghost button"              | `<kyn-button kind="ghost">Label</kyn-button>`                                                                         | `../../components/reusable/button/index`                  |
| "card"                      | `<kyn-card>`                                                                                                          | `../../components/reusable/card/index`                    |
| "table" / "data table"      | `<kyn-table-container><kyn-table>...</kyn-table></kyn-table-container>` (see table example below)                     | `../../components/reusable/table/index`                   |
| "modal" / "dialog"          | `<kyn-modal>` (use `open` attribute to show)                                                                          | `../../components/reusable/modal/index`                   |
| "page" / "app layout"       | `<kyn-ui-shell>` with header, main, footer                                                                            | `../../components/global/uiShell/index` + header + footer |
| "sidebar" / "drawer"        | `<kyn-side-drawer>` inside `<main>` with `<kyn-button slot="anchor">` as trigger (use `kind="tertiary"` for tertiary) | `../../components/reusable/sideDrawer/index`              |
| "input" / "text field"      | `<kyn-text-input>`                                                                                                    | `../../components/reusable/textInput/index`               |
| "dropdown" / "select"       | `<kyn-dropdown>` with `<kyn-dropdown-option>`                                                                         | `../../components/reusable/dropdown/index`                |
| "tabs"                      | `<kyn-tabs>` with `<kyn-tab>` and `<kyn-tab-panel>`                                                                   | `../../components/reusable/tabs/index`                    |

## Component-specific behaviors (critical)

- **kyn-modal:** Requires `open` (boolean) to be visible. Use `titleText`, `size` (sm, md, lg, xl), `okText`, `cancelText` as needed.
- **kyn-side-drawer:** Place **inside** `<main>`. Use `<kyn-button slot="anchor" kind="tertiary">Label</kyn-button>` as the trigger (user's label e.g. "OPEN SESAME"). Use `titleText`, `labelText`, `size` (sm, md, lg). **Do not add the `open` attribute** unless the user explicitly asks for the drawer to be open by default; the drawer is closed by default and opens on anchor click.
- **kyn-button:** Use `kind` (not `variant`). Values: primary, secondary, tertiary, ghost, primary-destructive, secondary-destructive, tertiary-destructive, ghost-destructive, primary-ai, ghost-ai.
- **kyn-workspace-switcher:** When used inside a header flyout (e.g. `kyn-header-flyout`), size the overlay to fit its content so the left pane height and total width are not cramped. Apply inline style: `min-width: 520px` (the component’s left pane is 275px; 520px fits both panes), `width: max-content`, `max-width: 90vw`, `--kyn-workspace-switcher-max-height: min(480px, 70vh)`, and `min-height: 280px`. This makes the overlay height follow the left pane and total width fit the content.
- **Tables:** Use only `kyn-*` table elements — see "Table structure" below. Never use native `<table>`, `<tr>`, `<td>`, etc.

## Table structure (CRITICAL)

Tables use ONLY kyn-\* custom elements — NEVER native `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`.

Structure: `kyn-table-container > kyn-table > kyn-thead + kyn-tbody`. Headers use `kyn-header-tr > kyn-th`. Body rows use `kyn-tr > kyn-td`.

When the user provides JSON data or column definitions, generate columns and rows dynamically from their data. Use `.map()` in the Lit template to iterate over data arrays — never hardcode rows when data is provided.

```html
<kyn-table-container>
  <kyn-table>
    <kyn-thead>
      <kyn-header-tr>
        ${columns.map(col => html`<kyn-th>${col}</kyn-th>`)}
      </kyn-header-tr>
    </kyn-thead>
    <kyn-tbody>
      ${rows.map(row => html`
      <kyn-tr>
        ${columns.map(col => html`<kyn-td>${row[col]}</kyn-td>`)}
      </kyn-tr>
      `)}
    </kyn-tbody>
  </kyn-table>
</kyn-table-container>
```

## Forbidden (will break the build)

- `import 'your-library/...'` or `import 'my-library/...'` — these packages do not exist
- `import 'lit/card'`, `import 'lit/table'`, etc. — lit does not export components
- `<my-button>`, `<my-card>`, `<lit-table>`, `<app-shell>` — these tags do not exist
- Raw `<button>`, `<input>`, `<select>` for UI — use the `kyn-*` equivalent
- Native `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` — use `kyn-table`, `kyn-thead`, `kyn-tbody`, `kyn-tr`, `kyn-th`, `kyn-td`
- Any custom element or attribute not in the design-system context / registry

## Page / template builder (use for full-page prompts)

For prompts like "build a page with ui-shell, header, local nav, footer, data table, side drawer", follow these rules:

1. **Shell order (fixed):** Inside **kyn-ui-shell**: **kyn-header** → (optional **kyn-local-nav**) → **main** → **kyn-footer**. Never omit header or footer for a full page.
2. **Main padding (required):** Every `<main>` must have left/right padding so content is visibly indented. Always use `<main style="padding: var(--kd-page-gutter, 1rem);">`. Do not omit this—without it the content will sit flush to the viewport edges.
3. **Spacing and layout rhythm:** Use `var(--kd-page-gutter, 1rem)` for main; use a fullscreen decorator with only `min-height: 100vh; width: 100%;` (no negative margin); use `1rem` or `var(--kd-spacing-16, 1rem)` for section gaps. When the page has **kyn-page-title** and actions (e.g. drawer anchor, primary button), put a **toolbar row** between the title and the content: `display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin: 1rem 0;` so the title is not flush against the button and spacing is consistent.
4. **Data table:** Wrap in a scrollable div: `style="overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;"` with **kyn-table-container** > **kyn-table** inside. Use **kyn-thead**, **kyn-header-tr**, **kyn-th**, **kyn-tbody**, **kyn-tr**, **kyn-td** only.
5. **Side drawer:** Place **inside** `<main>`. Trigger = `<kyn-button slot="anchor" kind="tertiary">USER_LABEL</kyn-button>` (e.g. "OPEN SESAME"). Put drawer content (e.g. list) after the button. **Do not add `open`** unless the user explicitly asks for the drawer open by default.
6. **Fullscreen story:** Use `parameters: { layout: 'fullscreen' }` and a decorator with `min-height: 100vh; width: 100%;` only. Do **not** use negative margin on the decorator—that cancels the main content indent; header/footer stay full width and the main body is indented by the main's padding.
7. **Row count:** If the user asks for N rows (e.g. 9-row data table), generate exactly N **kyn-tr** rows.

Full reference: **shidoka-studio/content/page-template-builder.md** (or the built context in shidoka-studio/context/).

## Layout patterns

- Page/template: follow "Page / template builder" above; see **shidoka-studio/content/page-template-builder.md** for the complete pattern.
- Constraints: only kyn-\* tags and registry imports (see "Forbidden" above).

## Template / page generator

Generated output should be copy-pasteable. For full-page prompts, apply the layout order and spacing above and produce complete, working examples that use only registered components with correct attributes and imports.
