# Story UI AI Considerations — Shidoka Applications

All component data (tags, attributes, slots, events, import paths) is in `component-registry.json`, auto-generated from `custom-elements.json`. Do not guess — look it up.

## The one rule

**Only use what's in the registry.** If a tag, attribute, or import path is not in `component-registry.json`, it does not exist in this project.

## Quick reference

- **Framework:** Lit web components, tag prefix `kyn-`
- **Lit import:** `import { html } from 'lit';` — the ONLY allowed lit import
- **Component imports:** relative paths from `src/stories/generated/`, e.g. `import '../../components/reusable/button/index';`
- **117 components** are registered — from `kyn-accordion` to `kyn-workspace-switcher`

## Intent mapping

| User says                   | Use                                                                                                                    | Import                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| "button" / "primary button" | `<kyn-button kind="primary">Label</kyn-button>`                                                                        | `../../components/reusable/button/index`                  |
| "ghost button"              | `<kyn-button kind="ghost">Label</kyn-button>`                                                                          | `../../components/reusable/button/index`                  |
| "card"                      | `<kyn-card>`                                                                                                           | `../../components/reusable/card/index`                    |
| "table" / "data table"      | `<kyn-table-container><kyn-table>...</kyn-table></kyn-table-container>` (see table example below)                      | `../../components/reusable/table/index`                   |
| "modal" / "dialog"          | `<kyn-modal>`                                                                                                          | `../../components/reusable/modal/index`                   |
| "page" / "app layout"       | `<kyn-ui-shell>` with header, main, footer                                                                             | `../../components/global/uiShell/index` + header + footer |
| "sidebar" / "drawer"        | `<kyn-side-drawer titleText="..." open>` (must have `open` to be visible; place as sibling of `<main>`, not inside it) | `../../components/reusable/sideDrawer/index`              |
| "input" / "text field"      | `<kyn-text-input>`                                                                                                     | `../../components/reusable/textInput/index`               |
| "dropdown" / "select"       | `<kyn-dropdown>` with `<kyn-dropdown-option>`                                                                          | `../../components/reusable/dropdown/index`                |
| "tabs"                      | `<kyn-tabs>` with `<kyn-tab>` and `<kyn-tab-panel>`                                                                    | `../../components/reusable/tabs/index`                    |

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
- Any custom element not in the registry

## Layout patterns

See `story-ui/docs/patterns/page-structure.md` for full-page layout patterns.
See `story-ui/docs/guidelines/constraints.md` for the complete constraint rules.

## Template / page generator

Generated stories serve as copy-pasteable templates. Produce complete, working examples that use only registered components with correct attributes.
