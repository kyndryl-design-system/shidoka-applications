# Shidoka Design System Considerations

**Source of truth for component API: custom-elements.json (CEM).** All tags, attributes, slots, events, CSS custom properties, and import paths are defined there. The design-system context (`design-system-context.md`) and structured API (`component-api.json`) are generated from CEM — do not guess; use only what appears in that context. The distributed package includes both so the LLM and tooling can use components as designed.

**Use components as designed.** Infer sizing, behavior, and composition from the CEM-derived context: component descriptions, slot descriptions, CSS custom properties (e.g. `--kyn-workspace-switcher-max-height`), attributes, and events. Do not rely on app-specific boilerplate files for API or sizing; the design system is the authority.

**This file adds only what CEM does not encode:** intent mapping (user says X → use component Y), layout and spacing rules (shell order, main padding, table structure), and forbidden patterns.

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
- **kyn-workspace-switcher:** Use inside `kyn-header-flyout`. The component fits 100% of its container (see CEM description); size the overlay via the container and the component's CSS custom properties (e.g. `--kyn-workspace-switcher-max-height`) as listed in the design-system context. Use slot `left` for the CURRENT area (see slot descriptions in design-system context). Infer all sizing and API from CEM—do not depend on a boilerplate file for dimensions or attributes.
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

1. **Shell order (fixed):** Inside **kyn-ui-shell**: **kyn-header** → (optional **kyn-local-nav**) → **main** → **kyn-footer**. Never omit header or footer for a full page. **kyn-footer** defaults to copyright text "Copyright © {year} Kyndryl Inc. All rights reserved." — omit the `slot="copyright"` unless the user asks for custom copyright.
2. **Main padding (required):** Every `<main>` must have left/right padding so content is visibly indented. Always use `<main style="padding: var(--kd-page-gutter, 1rem);">`. Do not omit this—without it the content will sit flush to the viewport edges.
3. **Spacing and layout rhythm:** Use `var(--kd-page-gutter, 1rem)` for main; use a fullscreen decorator with only `min-height: 100vh; width: 100%;` (no negative margin); use `1rem` or `var(--kd-spacing-16, 1rem)` for section gaps. When the page has **kyn-page-title** and actions (e.g. drawer anchor, primary button), put a **toolbar row** between the title and the content: `display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin: 1rem 0;` so the title is not flush against the button and spacing is consistent.
4. **Data table:** Wrap in a scrollable div: `style="overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;"` with **kyn-table-container** > **kyn-table** inside. Use **kyn-thead**, **kyn-header-tr**, **kyn-th**, **kyn-tbody**, **kyn-tr**, **kyn-td** only.
5. **Side drawer:** Place **inside** `<main>`. Trigger = `<kyn-button slot="anchor" kind="tertiary">USER_LABEL</kyn-button>` (e.g. "OPEN SESAME"). Put drawer content (e.g. list) after the button. **Do not add `open`** unless the user explicitly asks for the drawer open by default.
6. **Fullscreen story:** Use `parameters: { layout: 'fullscreen' }` and a decorator with `min-height: 100vh; width: 100%;` only. Do **not** use negative margin on the decorator—that cancels the main content indent; header/footer stay full width and the main body is indented by the main's padding.
7. **Row count:** If the user asks for N rows (e.g. 9-row data table), generate exactly N **kyn-tr** rows.

Full reference: **shidoka-studio/content/page-template-builder.md** (or the built context in shidoka-studio/context/).

## Workspace switcher and global switcher

**Infer from the design-system context.** Use the CEM-derived component reference for `kyn-workspace-switcher` and `kyn-workspace-switcher-menu-item` (slots, attributes, CSS custom properties, descriptions). Size the switcher from its container and the component's CSS custom properties; do not rely on a boilerplate file for width, min-width, or height.

Sizing and API come from the design-system context (CSS custom properties, slot descriptions); the rules below are behavioral and composition only.

1. **Placement:** Use `kyn-workspace-switcher` inside `kyn-header-flyout`. Set **hide-menu-label** and **hide-back-button** on the flyout. Put a **span** (or element) with `id="workspace-trigger-label"` in the flyout’s `slot="button"` for the trigger label.
2. **Workspace counts:** Each left-list workspace item (e.g. Global Zone (All), Account Tenants, Compute Zones) must show a **count** (`.count` on `kyn-workspace-switcher-menu-item`). Global Zone (All) count = sum of all other workspace counts; its `itemsByWorkspace.global` = union of all child workspace items.
3. **Nav rail (header trigger):** The selected account **name** (not id) is shown in the flyout trigger. Use a span with `id="workspace-trigger-label"` and wire it so it updates when the user selects an item (use the menu item's `.name` property, not `getAttribute('name')`). **Truncate long names** in the nav rail with ellipsis: use class `account-name` with `max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` and set the element's `title` to the full name for tooltip.
4. **Workspace trigger (dropdown look):** Use a wrapper span in `slot="button"` with `style="display: flex; align-items: center; gap: 8px; font-size: 14px;"` containing: (1) the label span with `id="workspace-trigger-label"` and class `account-name`, and (2) a chevron span with class `account-chevron` containing the chevron-down SVG. Rotate the chevron on open/close via `@on-flyout-toggle` (e.g. `chevron.style.transform = detail.open ? 'rotate(180deg)' : 'rotate(0deg)'`). Include CSS: `.account-chevron { display: flex; transition: transform 0.2s; }` and hide the chevron on small viewports if desired. Give the switcher panel class `ui-impl-switcher` and width e.g. `625px` (with responsive max-width) so the dropdown panel matches the reference.
5. **No flyout menu label:** The workspace switcher panel must **never** show the flyout's label (e.g. "WORKSPACE") at the top. Always set **hide-menu-label** on the **kyn-header-flyout** that wraps the workspace switcher so the panel shows only the switcher content (CURRENT, WORKSPACES list, etc.). Do not rely on omitting the label attribute—explicitly set **hide-menu-label** so the red menu label never appears.
   5b. **No back arrow in workspace flyout:** The flyout's left-arrow back button is for mobile drill-down only. For the workspace switcher (dropdown-style) set **hide-back-button** on the **kyn-header-flyout** so the back arrow is never shown.
6. **Semi-opaque backdrop (standalone flyout):** When the workspace switcher uses a **standalone** kyn-header-flyout in the nav rail (not inside kyn-header-flyouts), the header does not show its built-in overlay. The page must provide a semi-opaque backdrop when the flyout is open, matching the "UI Implementation" story (Global Components/Workspace Switcher): listen for **on-flyout-toggle** on the flyout, and when `detail.open` is true show a fixed overlay with `background: var(--kd-color-background-opacity-inverse-backdrop)` and `z-index: calc(var(--kd-z-header) - 1)`; hide it when the flyout closes.
7. **CURRENT (slot="left"):** In the switcher's **slot="left"** show the selected account/workspace info (e.g. name, id, country). Use a span with the account name so setup can update it when the user picks a different item; wire selection to update that label when the user picks from the list.

**Workspace switcher default (self-contained, no boilerplate):** Do **not** import or reference a separate boilerplate file. When generating a page with a workspace switcher, **inline** the default data and wiring in the same story/file so the pattern is self-contained and mimics the design system defaults.

- **Default data shape:** `accountDetails: { accountId, country }`; `workspaces: [{ id, name, count }, ...]` with e.g. Global Zone (All) (count = sum of others), Account Tenants, Compute Zones; `itemsByWorkspace: { global: [...], tenants: [...], compute: [...] }` where each item is `{ id, name }` and `global` is the union of all. Initial trigger label = first item's **name** from `itemsByWorkspace.global[0].name` (e.g. "Acme Corporation").
- **Wiring (inline in story play() or as a small helper in the same file):** Listen for `on-click` on the switcher (`#workspace-switcher`). **Critical:** When updating the nav rail trigger (`#workspace-trigger-label`) and CURRENT (`.account-meta-info__name`), **always use the item display name, never the raw id.** Resolve name from data: given `value` (item id), look up name by searching `itemsByWorkspace` (e.g. `Object.values(data.itemsByWorkspace).flat().find(it => it.id === value)?.name ?? value`). Left-list click: set `switcher.view = 'detail'`, update left-list selection, clear and repopulate right-list from data; when creating right-list items attach a click handler that updates trigger and CURRENT using the name-from-data lookup. Right-list click: use the same name-from-data lookup for the clicked value and update trigger and CURRENT. No component source changes.
- **Global switcher:** If the user does not supply nav JSON, use the **full global switcher pattern** so the flyout matches the design (search bar at top, CATEGORY section with links). (1) **Header:** Use **kyn-header** with `appTitle="Bridge"` and a **logo** in `slot="logo"` (e.g. Bridge logo SVG, `style="--kyn-header-logo-width: 120px;"`) so the nav rail shows "kyndryl bridge" branding. (2) **Global switcher flyout:** Use one **kyn-header-link** in **kyn-header-nav** as the main switcher trigger. Do **not** set `hideSearch` on this link so the flyout shows the search input at the top. Ensure the flyout has at least 6 child links (so search appears by default) or set `searchThreshold="2"` on the link so search shows with fewer items. In `slot="links"` use **kyn-header-category** with **heading="CATEGORY"** and multiple **kyn-header-link** children (e.g. Connections Management, Discovered Data, Visualization & Analytics, Topology, Settings). Optionally set `style="--kyn-global-switcher-max-height: 70vh;"` on **kyn-header-nav** for flyout height. (3) **Reference:** **Global Components/Header/Global Switcher** stories and **src/stories/globalSwitcher/** (SlottedHTMLSwitcher, example_global_switcher_data.json) in shidoka-applications.

**Nav rail reference (when generating UI shell with header):** To match the canonical "UI Implementation" look (dark header with Bridge branding, workspace dropdown with chevron, Notifications/Help/User icons), generate the header as follows. **Reference:** **Global Components/Workspace Switcher** → **UIImplementation** story in shidoka-applications. (1) **Logo and title:** `<span slot="logo" style="--kyn-header-logo-width: 120px;">` with Bridge logo SVG; `appTitle="Bridge"`. (2) **kyn-header-nav:** Global switcher link(s) as above (with search + CATEGORY). (3) **kyn-header-flyouts:** (a) Workspace flyout with trigger = span wrapper containing `#workspace-trigger-label` (class `account-name`) + chevron span (class `account-chevron`) with chevron-down SVG; `hideMenuLabel` `hideButtonLabel` `noPadding`; `@on-flyout-toggle` to rotate chevron; switcher with `id="workspace-switcher"` and class `ui-impl-switcher`. (b) Notifications flyout: `hideMenuLabel`, icon in `slot="button"`, then **kyn-header-link** items. (c) Help flyout: icon in `slot="button"`, then **kyn-header-link** items. (d) User Profile flyout: `hideMenuLabel`, user icon in `slot="button"`, **kyn-header-user-profile**, then **kyn-header-link** (Profile Settings, Sign Out). (4) **CSS:** Include in the story decorator or page: `.account-name { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`; `.account-chevron { display: flex; transition: transform 0.2s; }`; `.ui-impl-switcher { width: 625px; }` with responsive max-width (e.g. 375px below 52rem, 100% below 42rem); hide `.account-chevron` on small viewports if desired.

## Layout patterns

- Page/template: follow "Page / template builder" above; see **shidoka-studio/content/page-template-builder.md** for the complete pattern.
- Constraints: only kyn-\* tags and registry imports (see "Forbidden" above).

## Template / page generator

Generated output should be copy-pasteable. For full-page prompts, apply the layout order and spacing above and produce complete, working examples that use only registered components with correct attributes and imports.

**Where to put generated page output:**

- **When running locally in the shidoka-applications repo (design-system repo):** Always write generated Storybook page stories to **src/stories/pages/generated/** (e.g. `src/stories/pages/generated/MyPage.stories.js`). This folder is cleared on `npm run dev` and on `git push`; generated files are for testing only and must not be committed. Use import paths relative to that folder for **components only** (e.g. `../../../components/global/...`, `../../../components/reusable/...`). **Do not** import from a workspace-switcher boilerplate file; inline the workspace switcher data and wiring in the generated story so the pattern is self-contained. Do not write generated pages to `src/stories/pages/` (that directory is for canonical, hand-authored stories only).
- **When generating for an external/consuming application:** Infer the output path and file format from the project structure (e.g. `src/views/`, `app/(dashboard)/`, `pages/`, `src/pages/`) and use import paths appropriate to that app. Do not use the shidoka-applications path; the MCP/LLM should detect that the workspace is not the design-system repo and place the file where it fits the consuming app’s layout.

## Consuming applications (styling)

When generating pages or templates for a **consuming app** (not the design-system repo), remind the user to: (1) **Load required Shidoka styles:** import `@kyndryl-design-system/shidoka-foundation/css/root.css` and `css/index.css` in the app entry; add any applications or charts global CSS if those packages are used. (2) **Avoid app styles overwriting Shidoka:** use CSS cascade layers — declare `@layer app, shidoka`, put Shidoka in the `shidoka` layer and the app’s global styles in the `app` layer so design system tokens and layout are not overridden. Full guide: **shidoka-studio/docs/STYLING-FOR-CONSUMERS.md**.
