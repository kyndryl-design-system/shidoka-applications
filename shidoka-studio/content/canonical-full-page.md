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

**CRITICAL — Do not nest workspace switcher inside global switcher:**

- **Global switcher** = **kyn-header-nav** (left side). It contains **only** kyn-header-link(s) and kyn-header-category with links. Nothing else.
- **Workspace switcher** = a **kyn-header-flyout** that is a **sibling** of kyn-header-nav, **inside kyn-header-flyouts** (right side). The workspace flyout and kyn-workspace-switcher are **never** inside kyn-header-nav. If you put the workspace switcher inside the global nav, the UI will be broken (workspace panel will open inside the global panel). **Correct:** kyn-header has two siblings: kyn-header-nav (global only) and kyn-header-flyouts (workspace + notifications + help + user).

- **WRONG:** `<kyn-header-nav> ... <kyn-header-flyout> <kyn-workspace-switcher> ...` (workspace inside nav).
- **CORRECT:** `<kyn-header-nav> ... global links only ... </kyn-header-nav> <kyn-header-flyouts> <kyn-header-flyout> <kyn-workspace-switcher> ...` (workspace in flyouts, sibling of nav).

**Direct children of kyn-header** (in order):

1. **Logo** — `<span slot="logo" style="--kyn-header-logo-width: 120px;">` + logo SVG or text. Required so the rail has branding.
2. **kyn-header-nav** (has `slot="left"` by default) — **Global switcher only.** Inside: one **kyn-header-link** with `label="Applications"` (or similar), **do not** set `hideSearch`. Inside that link, **kyn-header-category** with `slot="links"` and `heading="CATEGORY"`, and **6+ kyn-header-link** children (e.g. Connections Management, Discovered Data, Visualization & Analytics, Topology, Settings, Support). **Do not put kyn-workspace-switcher or any kyn-header-flyout inside kyn-header-nav.** Set `style="--kyn-global-switcher-max-height: 70vh;"` on kyn-header-nav.
3. **kyn-header-flyouts** (default slot → right side). **Four flyouts** in this order:

   **(a) Workspace flyout — CRITICAL: you must provide the trigger.** Do **not** use `label="Workspace"` and then only put `kyn-workspace-switcher` inside with no slot="button" content; that leaves no visible trigger. Use `hide-menu-label` `hide-button-label` `no-padding`. **Trigger in slot="button":** a span with `style="display: flex; align-items: center; gap: 8px; font-size: 14px;"` containing: (1) span with `id="workspace-trigger-label"` and class `account-name` (truncation: max-width 200px, overflow hidden, text-overflow ellipsis), (2) span with class `account-chevron` containing chevron-down SVG. Wire: on flyout `@on-flyout-toggle` rotate chevron; on **kyn-workspace-switcher** `@on-click` (or equivalent) update the trigger label and CURRENT from the selected item’s **name** (never raw id). **WRONG:** flyout with no slot="button" content or only `label="Workspace"`. **CORRECT:** slot="button" contains the trigger (workspace name + chevron); kyn-workspace-switcher has id="workspace-switcher", class="ui-impl-switcher", width 625px; wire @on-flyout-toggle and @on-click. Give kyn-workspace-switcher `id="workspace-switcher"` and class `ui-impl-switcher`, width 625px (responsive). **CSS:** `.account-name { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }` and `.account-chevron { display: flex; transition: transform 0.2s; }`.

   **(b) Notifications flyout** — `hide-menu-label`. Icon in `slot="button"`, then **kyn-header-link** items.

   **(c) Help flyout** — Icon in `slot="button"`, then **kyn-header-link** items.

   **(d) User profile flyout** — `hide-menu-label`. User icon in `slot="button"`, then **kyn-header-user-profile**, then **kyn-header-link** (e.g. Profile Settings, Sign Out).

   **CRITICAL — Every flyout must have a visible trigger in slot="button".** If any flyout has **empty** slot="button", no icon or label appears and the header looks broken (no anchors on the right). (a) Workspace = label + chevron (see above). (b) Notifications = put a **span** in slot="button" containing a **bell/notification icon SVG** (e.g. width/height 20, viewBox 0 0 24 24). (c) Help = span in slot="button" with a **help/question-circle icon SVG**. (d) User = span in slot="button" with a **user avatar icon SVG**. Use inline SVGs so all four anchors render. **WRONG:** kyn-header-flyouts with no icons or only text in slot="button" for (b)(c)(d). **CORRECT:** each of the four flyouts has slot="button" filled — workspace with label+chevron, the other three with an SVG icon.

**Local nav (optional):** If you include **kyn-local-nav**, each **kyn-local-nav-link** (level 1) **must** have an **icon in slot="icon"** (16px). The design system requires it for level 1. Use a **placeholder SVG** in each link (e.g. grid, document, chart, settings icon; 16×16) so the left rail shows icons. **WRONG:** kyn-local-nav-link with no slot="icon" (icons missing, rail looks empty). **CORRECT:** each kyn-local-nav-link has `<span slot="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">...</svg></span>` (or similar) before the link text.

---

## Main (order and required pieces)

**CRITICAL — Table headers and drawer title (required every time):**

- **Data table:** You **must** include a **header row**: `kyn-thead` > `kyn-header-tr` > **one `kyn-th` per column** with the column name as **text content** (e.g. `<kyn-th>Name</kyn-th>`, `<kyn-th>Status</kyn-th>`). **WRONG:** table with only `kyn-tbody` or an empty thead. **CORRECT:** `<kyn-thead><kyn-header-tr><kyn-th>Name</kyn-th><kyn-th>Status</kyn-th>...</kyn-header-tr></kyn-thead>` so column labels are visible.
- **Side drawer:** You **must** set **`titleText`** on `kyn-side-drawer` (e.g. `titleText="Drawer"` or `titleText="Sidebar"`) so the drawer panel shows a **visible title** in its header. **WRONG:** `kyn-side-drawer` without `titleText`. **CORRECT:** `kyn-side-drawer titleText="Drawer"` (and optionally `labelText`). Without `titleText` the drawer looks broken.

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

| Element                             | Required detail                                                                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logo                                | slot="logo" on header                                                                                                                                                  |
| Global switcher                     | kyn-header-nav with kyn-header-link (label) + kyn-header-category (6+ links), no hideSearch                                                                            |
| Workspace flyout                    | hide-menu-label, hide-button-label, no-padding; slot="button" = trigger label + chevron; kyn-workspace-switcher with id and class ui-impl-switcher                     |
| Notifications / Help / User flyouts | **Each** must have slot="button" filled with an **icon SVG** (bell, help, user); empty slot = no anchor                                                                |
| Local nav (if used)                 | Each kyn-local-nav-link (level 1) must have **slot="icon"** with 16px placeholder SVG; required per CEM                                                                |
| Main padding                        | style="padding: var(--kd-page-gutter, 1rem);"                                                                                                                          |
| Page title                          | kyn-page-title before toolbar                                                                                                                                          |
| Toolbar                             | flex row with drawer (anchor "OPEN SESAME") + ghost button "MYSTERY"                                                                                                   |
| Side drawer                         | titleText set; kyn-button slot="anchor" kind="tertiary"                                                                                                                |
| Line chart                          | kd-chart, full width, fill: false, scales for axes                                                                                                                     |
| Table                               | **Header row required:** kyn-thead > kyn-header-tr > kyn-th per column with text (e.g. Name, Status). No table without thead. Scrollable wrapper; kyn-tbody with rows. |
| Footer                              | kyn-footer with copyright slot                                                                                                                                         |

When generating in a **consuming app** (e.g. Vue), use the **exact same structure** as above: same header (global nav + flyouts), same main (title, toolbar, drawer with **titleText**, chart, table with **kyn-thead + kyn-th**). Only the file format (.vue) and import style (package import) differ. If the generated page is missing table headers or drawer title, the context was not fully applied—ensure the Cursor rule calls get_shidoka_design_context first and the sideloaded package is the latest build.
