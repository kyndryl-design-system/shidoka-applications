# Page / template builder — Shidoka layout rules

Use this for **any prompt that asks for a full page, UI shell, or template** (e.g. "build a page with ui-shell, header, local nav, footer, data table, side drawer"). Follow the order and spacing below so the output is valid and consistent.

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

Use **kyn-thead**, **kyn-header-tr**, **kyn-th**, **kyn-tbody**, **kyn-tr**, **kyn-td** only (no native `<table>`).

## 5. Side drawer (inside main, anchor button)

**kyn-side-drawer** goes **inside** `<main>`. The trigger is a **kyn-button** with **slot="anchor"**. Use **kind="tertiary"** for the anchor when it is a secondary action (e.g. "Open message"). Example:

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

When the page includes a **workspace switcher** in the header, use **kyn-header-flyout** with a **span** in `slot="button"` (with `id="workspace-trigger-label"`) and **kyn-workspace-switcher** as the panel content.

- **Trigger:** Put a span in `slot="button"` with `id="workspace-trigger-label"` and the label text inside. Example:
  ```html
  <kyn-header-flyout label="…" hideMenuLabel hideButtonLabel noPadding>
    <span
      id="workspace-trigger-label"
      slot="button"
      style="display: flex; align-items: center; font-size: 14px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
      title="…"
      >Selected name only</span
    >
    <kyn-workspace-switcher
      id="workspace-switcher"
      style="width: 100%; max-height: var(--kyn-workspace-switcher-max-height, 70vh);"
      >…</kyn-workspace-switcher
    >
  </kyn-header-flyout>
  ```
- Set **hide-menu-label** and **hide-back-button** on the flyout. Wire the label via `id="workspace-trigger-label"` and boilerplate `setupWorkspaceSwitcher` (see considerations.md).

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
