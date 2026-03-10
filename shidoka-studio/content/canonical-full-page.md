# Canonical full-page structure (reference for MCP context)

This is the **single reference structure** for a full UI shell with global switcher, workspace switcher, page title, toolbar (side drawer + ghost button), line chart, and data table. Use this exact pattern when the user asks for a page with those elements. Translate to the target framework (Vue, React, Lit, etc.); the **tags, order, and key attributes** must match.

---

## Why this file exists

In the design-system repo, the model can read Storybook stories and component source to see the full header (logo, global switcher, workspace flyout with trigger+chevron, notifications, help, user). In a **consuming app**, the MCP only sends markdown context. This file bundles that same knowledge into one place so the transmitted context is **not limited** compared to the repo: follow this structure and you get the same result.

---

## Shell order (unchanging)

```
kyn-ui-shell
  → kyn-header (with logo, nav, flyouts)
  → kyn-local-nav (optional)
  → main (padding + title + toolbar + chart + table)
  → kyn-footer (copyright)
```

---

## Header (full nav rail)

**Direct children of kyn-header** (in order):

1. **Logo** — `<span slot="logo" style="--kyn-header-logo-width: 120px;">` + logo SVG or text. Required so the rail has branding.
2. **kyn-header-nav** (has `slot="left"` by default) — Global switcher. Inside: one **kyn-header-link** with `label="Applications"` (or similar), **do not** set `hideSearch`. Inside that link, **kyn-header-category** with `slot="links"` and `heading="CATEGORY"`, and **6+ kyn-header-link** children (e.g. Connections Management, Discovered Data, Visualization & Analytics, Topology, Settings, Support). Set `style="--kyn-global-switcher-max-height: 70vh;"` on kyn-header-nav.
3. **kyn-header-flyouts** (default slot → right side). **Four flyouts** in this order:

   **(a) Workspace flyout** — `hide-menu-label` `hide-button-label` `no-padding`. **Trigger in slot="button":** a span with `style="display: flex; align-items: center; gap: 8px; font-size: 14px;"` containing: (1) span with `id="workspace-trigger-label"` and class `account-name` (truncation: max-width 200px, overflow hidden, text-overflow ellipsis), (2) span with class `account-chevron` containing chevron-down SVG. Wire: on flyout `@on-flyout-toggle` rotate chevron; on **kyn-workspace-switcher** `@on-click` (or equivalent) update the trigger label and CURRENT from the selected item’s **name** (never raw id). Give kyn-workspace-switcher `id="workspace-switcher"` and class `ui-impl-switcher`, width 625px (responsive). **CSS:** `.account-name { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }` and `.account-chevron { display: flex; transition: transform 0.2s; }`.

   **(b) Notifications flyout** — `hide-menu-label`. Icon in `slot="button"`, then **kyn-header-link** items.

   **(c) Help flyout** — Icon in `slot="button"`, then **kyn-header-link** items.

   **(d) User profile flyout** — `hide-menu-label`. User icon in `slot="button"`, then **kyn-header-user-profile**, then **kyn-header-link** (e.g. Profile Settings, Sign Out).

---

## Main (order and required pieces)

```text
<main style="padding: var(--kd-page-gutter, 1rem);">
  1. kyn-page-title (headLine, pageTitle)
  2. Toolbar div: style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin: 1rem 0;"
     - kyn-side-drawer with titleText (required), labelText, size="md"
       - kyn-button slot="anchor" kind="tertiary" → user label e.g. "OPEN SESAME"
       - drawer content (e.g. list)
     - kyn-button kind="ghost" → e.g. "MYSTERY"
  3. Chart wrapper: div style="width: 100%; margin-bottom: 1.5rem;"
     - kd-chart type="line", height="280", style="width: 100%; display: block;"
       - labels, datasets (fill: false), options (maintainAspectRatio: false, responsive: true, scales with x/y display and beginAtZero)
  4. Table wrapper: div style="width: 100%; overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;"
     - kyn-table-container > kyn-table
       - kyn-thead > kyn-header-tr > one kyn-th per column (text content: e.g. Name, Status, Value)
       - kyn-tbody > kyn-tr (v-for or repeat) > kyn-td per column
</main>
```

- **Table headers:** Put the column label **inside** each `<kyn-th>`, e.g. `<kyn-th>Name</kyn-th>`. Do not leave thead empty.
- **Side drawer:** Always set `titleText` on kyn-side-drawer so the drawer panel shows a visible title.

---

## Footer

`<kyn-footer rootUrl="/" logoAriaLabel="Home"><span slot="copyright">Copyright © … Kyndryl Inc. All rights reserved.</span></kyn-footer>`. Use the current year in your framework’s syntax.

---

## Summary checklist (must all be present)

| Element                     | Required detail                                                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logo                        | slot="logo" on header                                                                                                                              |
| Global switcher             | kyn-header-nav with kyn-header-link (label) + kyn-header-category (6+ links), no hideSearch                                                        |
| Workspace flyout            | hide-menu-label, hide-button-label, no-padding; slot="button" = trigger label + chevron; kyn-workspace-switcher with id and class ui-impl-switcher |
| Notifications / Help / User | Three more flyouts with icons and links                                                                                                            |
| Main padding                | style="padding: var(--kd-page-gutter, 1rem);"                                                                                                      |
| Page title                  | kyn-page-title before toolbar                                                                                                                      |
| Toolbar                     | flex row with drawer (anchor "OPEN SESAME") + ghost button "MYSTERY"                                                                               |
| Side drawer                 | titleText set; kyn-button slot="anchor" kind="tertiary"                                                                                            |
| Line chart                  | kd-chart, full width, fill: false, scales for axes                                                                                                 |
| Table                       | Scrollable wrapper; kyn-thead with kyn-header-tr and kyn-th (text content); kyn-tbody with rows                                                    |
| Footer                      | kyn-footer with copyright slot                                                                                                                     |

When generating in a consuming app, use the same structure; only the file format (e.g. .vue) and import style (package import) differ.
