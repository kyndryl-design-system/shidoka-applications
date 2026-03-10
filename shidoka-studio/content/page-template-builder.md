# Page / template builder — Shidoka layout rules

Use this for **any prompt that asks for a full page, UI shell, or template** (e.g. "build a page with ui-shell, header, local nav, footer, data table, side drawer"). Follow the order and spacing below so the output is valid and consistent.

**Same page everywhere.** The **structure and content** of the page (shell order, header with global/workspace switcher, main with title, toolbar, chart, table, side drawer with user-specified anchor text, button labels, row count, dummy data) must be **identical** whether you generate a Storybook story (design-system repo) or a Vue/React/etc. component (consuming app). Only the **output format** differs: in the design-system repo write a `.stories.js` (or `.stories.ts`) file; in a consuming app write the appropriate framework file (e.g. `.vue`, `.tsx`) and use package imports. Same `kyn-*` tags, same layout, same labels (e.g. "OPEN SESAME", "MYSTERY"), same row count and chart data.

## 1. Shell order (fixed)

Inside **kyn-ui-shell**, children must appear in this order:

1. **kyn-header** (required)
2. **kyn-local-nav** (optional; include only if the user asks for local nav)
3. **main** (required)
4. **kyn-footer** (required)

Do not omit header or footer when building a full page. Never put only `<main>` inside the shell.

## 2. Main content: padding (required)

**main** must have visible left and right indentation so content is not flush to the edges. Always use the Shidoka page gutter:

```html
<main style="padding: var(--kd-page-gutter, 1rem);">
  <!-- content -->
</main>
```

- Use this **exact** style on every `<main>` for page/template stories. Do not omit it.
- The fallback `1rem` ensures readable inset when the token is not set. Content should never sit edge-to-edge inside main.

## 3. Spacing (use these tokens)

- **Page gutter (main padding):** `var(--kd-page-gutter, 1rem)`
- **Fullscreen decorator:** Use only `min-height: 100vh; width: 100%;` on the wrapper. Do **not** use negative margin on the decorator—that would pull the shell past the viewport and cancel the main content indent. The shell stays viewport width; the main's padding then gives visible left/right indent.
- **Section spacing (e.g. between heading and table):** `margin: 0 0 1rem 0` on headings, or `var(--kd-spacing-16, 1rem)` for gaps
- **Table wrapper:** use the wrapper in section 4 so the table does not overflow

Do not invent spacing values; use the tokens above or simple `1rem` / `0.5rem` for consistency.

## 3b. Layout rhythm: page title → toolbar → content

When the page has a **kyn-page-title** and one or more **actions** (e.g. "Open Message" drawer trigger, "Add" button):

1. **Page title:** Use `<kyn-page-title headLine="…" pageTitle="…"></kyn-page-title>`.
2. **Spacing after title:** Add a wrapper or margin so the next block is not flush under the title. Use `margin-bottom: 1rem` on the title wrapper, or a toolbar div with `margin-top: 1rem` (or `var(--kd-spacing-16, 1rem)`).
3. **Toolbar row:** When there are actions (drawer anchor, primary button, search), put them in a single row with consistent spacing:
   - Wrap in a div: `style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem;"` (or `margin: 1rem 0;`).
   - Put the side-drawer (with its anchor button) and/or primary action buttons in this row so they align horizontally and are clearly separated from the title.
4. **Content below:** After the toolbar, add spacing (e.g. `margin-top: 1rem` or use the same gap) before the main content (cards, table, list).

Never place the side-drawer anchor button directly under the page title with no spacing. Always use a toolbar or at least `margin-top: 1rem` between the title and the first action.

## 4. Data table (required wrapper)

Data tables must live inside a **scrollable wrapper** so they don't overflow the viewport. Put **kyn-table-container** (and **kyn-table** inside it) inside this div:

```html
<div
  style="overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;"
>
  <kyn-table-container>
    <kyn-table>
      <kyn-thead
        ><kyn-header-tr><kyn-th>Col1</kyn-th>...</kyn-header-tr></kyn-thead
      >
      <kyn-tbody>
        <!-- kyn-tr > kyn-td rows (e.g. 9 rows if user asks for 9-row table) -->
      </kyn-tbody>
    </kyn-table>
  </kyn-table-container>
</div>
```

Use **kyn-thead**, **kyn-header-tr**, **kyn-th**, **kyn-tbody**, **kyn-tr**, **kyn-td** only (no native `<table>`). **Table headers required:** Always include `kyn-thead` with one `kyn-header-tr` and one `kyn-th` per data column (e.g. Name, Role, Status). The header row must contain the column labels; do not leave thead empty or omit it. Give the table wrapper **full width:** `style="width: 100%; overflow: auto; max-height: 360px; border: ..."` so the table spans the main content area.

## 4b. Charts (line graph, bar chart, etc.)

**Always use the Shidoka charts component `<kd-chart>`.** Never implement a chart with raw `<svg>`, `<canvas>`, `<polyline>`, `<path>`, or any custom-drawn graphic. When the user asks for a line graph, bar chart, pie chart, or any chart, the only correct implementation is **`<kd-chart>`** with the appropriate `type`, `.labels`, `.datasets`, and `.options`. In Vue, React, or Lit, use `<kd-chart>` (and ensure the app has installed and registered `@kyndryl-design-system/shidoka-charts`).

When the page includes a **line graph**, **bar chart**, or other **kd-chart**, it must **span the full width** of the main content so output is consistent across runs. Do not use `max-width` or a narrow wrapper unless the user explicitly asks for one.

- **Wrapper:** `<div style="width: 100%; margin-bottom: 1.5rem;">` around the chart.
- **Chart:** `kd-chart` with `style="width: 100%; display: block;"` and `.options=${{ maintainAspectRatio: false, responsive: true }}` so it fills the wrapper. Set `height="280"` (or similar) for a fixed height; the width follows the container.
- **Import:** `import '@kyndryl-design-system/shidoka-charts/components/chart';` (or the path appropriate to the story file; see considerations.md "Import paths for story files").

### Line graph specifically (user asks for "line graph" or "line chart")

When the user asks for a **line graph** (or "line chart"), generate a **readable line chart**, not an area chart and not a chart without axes.

- **Type:** Always `type="line"`.
- **No area fill:** Each dataset must have **`fill: false`** so the chart shows a line only, not a filled area under the line. Do not use default fill.
- **Visible axes:** Set **`scales`** in options so the chart has visible X and Y axes and labels. Example: `scales: { x: { display: true, title: { display: true, text: 'Category' } }, y: { display: true, title: { display: true, text: 'Value' }, beginAtZero: true } }`. Without this, the chart can render with no axes and be unreadable.
- **Basic dummy data:** Use a **labels** array (e.g. `['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']`) and one or two **datasets** with a **data** array of numbers (e.g. `[12, 19, 8, 15, 22, 18]`). Include a **label** per dataset (e.g. `label: 'Series A'`).
- **Example (conceptual):** `labels: ['Jan','Feb','Mar','Apr','May','Jun']`, `datasets: [{ label: 'Series A', data: [12, 19, 8, 15, 22, 18], fill: false, borderColor: 'rgb(75, 192, 192)', tension: 0.3 }]`, `options: { ... existing ..., scales: { x: { display: true }, y: { display: true, beginAtZero: true } } }`.

## 5. Side drawer (inside main, anchor button)

**kyn-side-drawer** goes **inside** `<main>`. The trigger is a **kyn-button** with **slot="anchor"**. Use **kind="tertiary"** for the anchor when it is a secondary action (e.g. "Open message"). **Drawer title required:** Always set **`titleText`** on `kyn-side-drawer` (e.g. `titleText="Drawer"` or `titleText="Sidebar"`) so the drawer panel shows a visible header/title; optionally set `labelText` for accessibility. Example:

```html
<kyn-side-drawer size="md" titleText="Sidebar" labelText="Open sidebar">
  <kyn-button slot="anchor" kind="tertiary">OPEN SESAME</kyn-button>
  <ul style="list-style: none; padding: 0; margin: 0;">
    <li style="padding: 0.5rem 0;">Item 1</li>
  </ul>
</kyn-side-drawer>
```

**Do NOT add the `open` attribute** to kyn-side-drawer unless the user explicitly asks for "drawer open by default" or "drawer expanded on load". By default the drawer is closed and opens when the user clicks the anchor button. Use the exact label text the user asks for (e.g. "OPEN SESAME", "Open Message").

## 5b. Workspace switcher in header (when included)

When the page includes a **workspace switcher** in the header, use **kyn-header-flyout** with a trigger that has the label **and a chevron** (dropdown look) and **kyn-workspace-switcher** as the panel content.

- **Trigger (dropdown look):** Put a **wrapper span** in `slot="button"` with `style="display: flex; align-items: center; gap: 8px; font-size: 14px;"` containing: (1) a span with `id="workspace-trigger-label"` and class `account-name` (for truncation), and (2) a span with class `account-chevron` containing the chevron-down SVG. Add `@on-flyout-toggle` on the flyout to rotate the chevron (e.g. `detail.open ? 'rotate(180deg)' : 'rotate(0deg)'`). Give the **kyn-workspace-switcher** `id="workspace-switcher"` and class `ui-impl-switcher` and `style="max-height: var(--kyn-workspace-switcher-max-height, 70vh);"`.
- Set **hideMenuLabel**, **hideButtonLabel**, **noPadding** on the flyout. Wire the label via `id="workspace-trigger-label"` using the self-contained pattern (see considerations.md): inline the default data and wiring in the story's `play()` or as a helper in the same file; always set the trigger and CURRENT from the item's display name (look up by id in data), never the raw id.
- **CSS (include in decorator or page):** `.account-name { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`; `.account-chevron { display: flex; transition: transform 0.2s; }`; `.ui-impl-switcher { width: 625px; }` with responsive max-width (e.g. 375px below 52rem, 100% below 42rem); hide `.account-chevron` on small viewports if desired.

## 5c. Nav rail (canonical header look)

When the user asks for a **UI shell**, **nav rail**, or **header** and you want the canonical "UI Implementation" look (Bridge branding, workspace dropdown with chevron, Notifications/Help/User icons):

1. **kyn-header** with `appTitle="Bridge"` and **logo** in `slot="logo"`: `<span slot="logo" style="--kyn-header-logo-width: 120px;">` + Bridge logo SVG.
2. **kyn-header-nav:** Include the **global switcher** link(s) as in 5d (search + CATEGORY flyout).
3. **kyn-header-flyouts** in this order: (a) Workspace flyout (trigger with label + chevron, switcher as in 5b). (b) Notifications flyout: `hideMenuLabel`, icon in `slot="button"`, then **kyn-header-link** items. (c) Help flyout: icon in `slot="button"`, then **kyn-header-link** items. (d) User Profile flyout: `hideMenuLabel`, user icon in `slot="button"`, **kyn-header-user-profile**, then **kyn-header-link** (e.g. Profile Settings, Sign Out).
4. Include the CSS from 5b in the story decorator.

**Reference:** Global Components/Workspace Switcher → **UIImplementation** story; considerations.md "Nav rail reference".

## 5d. Global switcher flyout (search + CATEGORY)

When the page includes a **global switcher** (the flyout that opens from the nav with search bar and category list), use **kyn-header-link** in **kyn-header-nav** so the flyout matches the design:

- **Do not** set `hideSearch` on the main global switcher **kyn-header-link** so the flyout shows the **search input** at the top.
- Ensure **6+ child links** (so search appears by default) or set **searchThreshold="2"** on the link so search shows with fewer items.
- In `slot="links"` use **kyn-header-category** with **heading="CATEGORY"** and multiple **kyn-header-link** children (e.g. Connections Management, Discovered Data, Visualization & Analytics, Topology, Settings).
- Optionally set `style="--kyn-global-switcher-max-height: 70vh;"` on **kyn-header-nav** for flyout height.
- Header must have **logo** in `slot="logo"` and `appTitle="Bridge"` for "kyndryl bridge" branding in the rail.

**Reference:** Global Components/Header/Global Switcher stories; src/stories/globalSwitcher/ (SlottedHTMLSwitcher, example_global_switcher_data.json).

## 6. Full-page Storybook story (meta + decorator)

For full-page layouts, set **parameters.layout** to `'fullscreen'` and use a **decorator** so the story has full height. The decorator must **not** use negative margin (that would cancel the main content indent). Use only min-height and width:

```javascript
const meta: Meta = {
  title: 'Generated/Pages/Your Page Title',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (story) => html`
      <div style="min-height: 100vh; width: 100%;">
        ${typeof story === 'function' ? story() : story}
      </div>
    `,
  ],
};
```

## 7. Complete minimal example (shell + header + local nav + main + table + drawer + footer)

```javascript
// Imports: uiShell, header, localNav, footer, table, sideDrawer, button
html`
  <kyn-ui-shell>
    <kyn-header rootUrl="/" appTitle="App Title"></kyn-header>
    <kyn-local-nav>
      <kyn-local-nav-link href="#">Nav 1</kyn-local-nav-link>
    </kyn-local-nav>
    <main style="padding: var(--kd-page-gutter, 1rem);">
      <kyn-page-title
        headLine="Section"
        pageTitle="Data Table"
      ></kyn-page-title>
      <div
        style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin: 1rem 0;"
      >
        <kyn-side-drawer size="md" titleText="Drawer" labelText="Open drawer">
          <kyn-button slot="anchor" kind="tertiary">OPEN SESAME</kyn-button>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 0.5rem 0;">Item</li>
          </ul>
        </kyn-side-drawer>
      </div>
      <div
        style="overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;"
      >
        <kyn-table-container>
          <kyn-table>
            <kyn-thead>
              <kyn-header-tr>
                <kyn-th>Name</kyn-th>
                <kyn-th>Role</kyn-th>
              </kyn-header-tr>
            </kyn-thead>
            <kyn-tbody>
              ${Array.from(
                { length: 9 },
                (_, i) => html`
                  <kyn-tr
                    ><kyn-td>Row ${i + 1}</kyn-td><kyn-td>Role</kyn-td></kyn-tr
                  >
                `
              )}
            </kyn-tbody>
          </kyn-table>
        </kyn-table-container>
      </div>
    </main>
    <kyn-footer rootUrl="/" logoAriaLabel="Home">
      <span slot="copyright"
        >Copyright © ${new Date().getFullYear()} Kyndryl Inc. All rights reserved.</span
      >
    </kyn-footer>
  </kyn-ui-shell>
`;
```

When the user asks for a specific row count (e.g. 9 rows), generate that many **kyn-tr** rows. When they specify anchor text (e.g. "OPEN SESAME"), use it exactly on the **kyn-button** with **slot="anchor"**.
