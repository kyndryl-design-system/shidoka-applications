# Page structure (full-page layout)

Use this structure when the user asks for a "page", "UI shell", "app layout", or "full page" with header, main content, and footer.

## Rules

1. **kyn-ui-shell** must wrap the entire page. Inside it, include in order: **kyn-header**, (optional **kyn-local-nav**), **main**, **kyn-footer**. Never put only `<main>` inside the shell—always include header and footer so the app frame is visible.
2. **main** must have padding: `style="padding: var(--kd-page-gutter, 1rem);"`.
3. **Data tables** must be inside a scrollable wrapper so they don’t overflow: a `div` with `style="overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;"` (or similar), with **kyn-table** inside.
4. **Side drawer** goes inside `<main>`, with **kyn-button slot="anchor"** and the drawer content. Add a heading (e.g. `<h2>`) above the table for hierarchy.
5. For **fullscreen** stories, add a **decorator** that wraps the story in a div with `min-height: 100vh; width: 100%;` only. Do not use negative margin—that would cancel the main content indent; the main's padding provides the left/right indent.

## Full-page example (shell + header + main + table + drawer + footer)

```javascript
const meta: Meta = {
  title: 'Generated/Your Page Title',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (story) => html`
      <div style="min-height: 100vh; width: 100%;">
        ${typeof story === 'function' ? story() : story}
      </div>
    `,
  ],
};

// In the story render:
html`
  <kyn-ui-shell>
    <kyn-header rootUrl="/" appTitle="Your App Title"></kyn-header>

    <main style="padding: var(--kd-page-gutter, 1rem);">
      <kyn-side-drawer
        size="md"
        titleText="Sidebar"
        labelText="Open sidebar"
        submitBtnText="Done"
        cancelBtnText="Close"
      >
        <kyn-button slot="anchor">Open Sidebar</kyn-button>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="padding: 0.5rem 0;">Item 1</li>
          <li style="padding: 0.5rem 0;">Item 2</li>
        </ul>
      </kyn-side-drawer>

      <h2 style="margin: 0 0 1rem 0;">Data Table</h2>
      <div
        style="overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;"
      >
        <kyn-table>
          <kyn-thead>
            <kyn-header-tr>
              <kyn-th>Column 1</kyn-th>
              <kyn-th>Column 2</kyn-th>
              <kyn-th>Column 3</kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            <!-- kyn-tr / kyn-td rows here -->
          </kyn-tbody>
        </kyn-table>
      </div>
    </main>

    <kyn-footer rootUrl="/" logoAriaLabel="Home">
      <span slot="copyright"
        >© ${new Date().getFullYear()} Example. All rights reserved.</span
      >
    </kyn-footer>
  </kyn-ui-shell>
`;
```

## Imports for this pattern

- `../../components/global/uiShell/index`
- `../../components/global/header/index`
- `../../components/global/footer/index`
- `../../components/reusable/table/index`
- `../../components/reusable/sideDrawer/index`
- `../../components/reusable/button/index`

Use only these Shidoka components and `import { html } from 'lit';`. Do not use any `lit/*` or invented library imports.
