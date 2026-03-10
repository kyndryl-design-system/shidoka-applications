# Shidoka Studio in consuming apps — MCP setup and page alignment

Shidoka is a **framework-agnostic** design system. This doc applies to **any** consuming app (Vue, React, Next.js, Svelte, Angular, etc.). It covers (1) **why** `get_shidoka_design_context` might not be called when building a page, (2) **how to fix it** so the MCP tool is available and used, and (3) a **checklist** to align an existing page with the Shidoka Studio context when it was built without the MCP.

---

## How the external project “knows” to call get_shidoka_design_context first

**This .md file does not make the model call the tool.** It is documentation for the **developer**. The thing that makes the model call `get_shidoka_design_context` first when building a page is a **Cursor rule** that lives **in the project** (e.g. `.cursor/rules/shidoka-generation.mdc`). That rule tells the agent: “When the user asks to build a page or template that uses Shidoka, **call the MCP tool get_shidoka_design_context first**, then generate code from that context.”

So the flow is:

1. **You (or your team) add the rule once** to the external project’s `.cursor/rules/`. The Shidoka Studio package ships a ready-made rule file so you don’t have to write it: copy `node_modules/@kyndryl-design-system/shidoka-studio/cursor-examples/shidoka-generation.mdc.example` to your project’s `.cursor/rules/shidoka-generation.mdc` (see section 2.2 below).
2. **You configure the MCP server** in the project’s `.cursor/mcp.json` so the tool is available (section 2.1).
3. After that, whenever someone in that project asks Cursor to build a Shidoka page (in any framework), the **rule** fires and instructs the agent to call `get_shidoka_design_context` first, then generate from that context. No per-framework or per-page setup is needed.

---

## 1. Why the MCP wasn’t called

- **The Shidoka Studio MCP server wasn’t configured** in the project, so Cursor never started it and the tool `get_shidoka_design_context` wasn’t available. Without that tool, the model can only infer from the design system’s npm packages (.d.ts, source) and will miss the layout rules in `page-template-builder.md`, `considerations.md`, and the component registry.
- **No Cursor rule** told the agent to call the tool when generating Shidoka pages, so even if the server was running, the model might not call it.

Result: the generated page follows package API inference but **not** the template’s shell order, main padding, table wrapper, title/toolbar rhythm, chart options, or global switcher pattern.

---

## 2. Fix: Make the MCP available in your project

### 2.1 Configure the MCP server

In the **project root** (Vue, React, Next, Svelte, etc.), create or edit **`.cursor/mcp.json`**:

```json
{
  "mcpServers": {
    "shidoka-studio": {
      "command": "node",
      "args": [
        "./node_modules/@kyndryl-design-system/shidoka-studio/bin/server.js"
      ],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

If you sideloaded by copying the built package into `node_modules/@kyndryl-design-system/shidoka-studio`, this path is correct. Alternatively:

```json
"command": "npx",
"args": ["-y", "@kyndryl-design-system/shidoka-studio"],
"cwd": "${workspaceFolder}"
```

### 2.2 Add a Cursor rule (so the agent calls the tool first)

**Copy the rule file from the package** so the agent is instructed to call `get_shidoka_design_context` first when building pages. One-time setup:

```bash
mkdir -p .cursor/rules
cp node_modules/@kyndryl-design-system/shidoka-studio/cursor-examples/shidoka-generation.mdc.example .cursor/rules/shidoka-generation.mdc
```

(On Windows, create `.cursor/rules` and copy the file; path may use `node_modules\@kyndryl-design-system\shidoka-studio\cursor-examples\shidoka-generation.mdc.example`.)

The shipped rule is framework-agnostic (globs cover `src/views/**/*`, `src/pages/**/*`, `app/**/page.*`, `pages/**/*`, etc.). You can edit `.cursor/rules/shidoka-generation.mdc` to adjust **globs** to your project (e.g. add `src/routes/**/*.svelte` for SvelteKit). The important part is that the rule tells the agent to **call get_shidoka_design_context first**, then generate from that context.

### 2.3 Reload Cursor

Reload the Cursor window so it picks up the MCP server and the new rule. After that, when you ask to build a Shidoka page, the agent should have `get_shidoka_design_context` available and (with the rule) should call it and follow the context.

### 2.4 Why the same prompt can produce different output in the Vue project

The **same page prompt** (e.g. UI shell, global switcher, workspace switcher, 5-row table, side drawer, line graph) should produce the **same structure** in the shidoka-applications repo and in your Vue app—same `kyn-header` (global nav + flyouts), same main (title, toolbar, drawer with **titleText**, table with **kyn-thead** and **kyn-th** headers, chart, footer). If the Vue-generated page looks different (e.g. workspace switcher inside the global nav, no table headers, no drawer title), the model is not fully applying the MCP context.

**Common causes:**

1. **Rule not firing or tool not called** — The Cursor rule must tell the agent to **call get_shidoka_design_context first**; without that, the model infers only from package types and skips layout/table/drawer rules.
2. **Stale sideload** — If you copied an old build of Shidoka Studio into the Vue project’s `node_modules`, the context (e.g. canonical-full-page, CRITICAL table/drawer/header rules) may be missing or outdated. Rebuild in shidoka-applications (`npm run build:shidoka-studio`) and replace the Vue project’s `node_modules/@kyndryl-design-system/shidoka-studio` with the new build, then reload Cursor.
3. **Context not prioritized** — The canonical full-page doc now includes **CRITICAL** blocks for: (a) do not put workspace switcher inside global nav, (b) table must have kyn-thead + kyn-th with text, (c) kyn-side-drawer must have titleText. After updating the build, start a **new chat** and run the same prompt so the model gets the full context.

After fixing the rule, sideload, and reload, regenerate the page; the output should align with the repo.

### 2.5 Why is the context different here than in the Vue project?

The MCP server **always** loads context from the **same place**: the `context/` folder **inside the Shidoka Studio package** that is running the server. The difference is **which copy** of that package is used.

- **In the shidoka-applications repo (“here”):** When Cursor runs the MCP, it starts the server from the package that the repo depends on. That package usually resolves to **`packages/@kyndryl-design-system/shidoka-studio`** (the built package in the monorepo). Its `context/` folder is updated **every time you run `npm run build:shidoka-studio`**. So “here” you’re almost always seeing the **latest** context (considerations, canonical-full-page, table/drawer/flyout rules, etc.).
- **In the Vue project:** The server runs from **the package inside the Vue project**, i.e. `VueProject/node_modules/@kyndryl-design-system/shidoka-studio`. That folder is **not** updated when you change the repo. It only changes when you:
  - **Sideload:** copy the newly built package from `packages/@kyndryl-design-system/shidoka-studio` (or run `bundle:sideload` and copy) into the Vue project’s `node_modules`, or
  - Reinstall from npm (which gives you whatever is **published**, often older).

So the context is “different” because the Vue project is using a **different, and usually older, snapshot** of the same `context/` files. The **code path** is the same (server → load from package `context/`), but the **physical files** in the Vue project’s copy of the package are stale until you rebuild in the repo and replace that copy.

To make the Vue project’s context match “here”: run `npm run build:shidoka-studio` in shidoka-applications, then replace the Vue project’s `node_modules/@kyndryl-design-system/shidoka-studio` with the built package (e.g. copy from `packages/@kyndryl-design-system/shidoka-studio`), then reload Cursor.

---

## 3. Align an existing page with the context

If you already have a page that was built **without** calling the MCP, you can align it with the Shidoka Studio context by applying the rules below. The structure is the same in any framework; express it in your template syntax (Vue, JSX, Svelte, etc.).

### 3.1 Shell order

Inside **kyn-ui-shell**, children must be in this order:

1. **kyn-header**
2. **kyn-local-nav** (optional)
3. **main**
4. **kyn-footer**

**Fix:** Add **kyn-footer** after `</main>` and before `</kyn-ui-shell>`. Structure:

```html
<kyn-footer rootUrl="/" logoAriaLabel="Home">
  <span slot="copyright">Copyright © … Kyndryl Inc. All rights reserved.</span>
</kyn-footer>
```

Use your framework’s way to inject the current year (e.g. `{{ new Date().getFullYear() }}`, `{new Date().getFullYear()}`, etc.).

### 3.2 Main padding

**Fix:** Set the required main padding so content isn’t edge-to-edge:

```html
<main style="padding: var(--kd-page-gutter, 1rem);">
  <!-- all main content here -->
</main>
```

Remove any section classes or custom margins that replace this; the template requires this exact style on `<main>`.

### 3.3 Layout rhythm: page title → toolbar → content

**Fix:** Add **kyn-page-title** and a **toolbar row** between the title and the main content (drawer anchor, buttons, then table/chart).

- Page title: `<kyn-page-title headLine="…" pageTitle="…"></kyn-page-title>`.
- Toolbar: a single row with `style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin: 1rem 0;"` containing the side-drawer (with its anchor button) and any primary buttons.
- Then spacing, then the table/chart.

Do not put the drawer anchor or actions directly under the title with no spacing.

### 3.4 Table wrapper

**Fix:** Wrap the table in a **scrollable outer div** with the required styles, then **kyn-table-container** and **kyn-table** inside. **Include a header row:** `kyn-thead` with one `kyn-header-tr` and one `kyn-th` per column (e.g. Name, Role, Status)—do not leave thead empty.

```html
<div
  style="width: 100%; overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px;"
>
  <kyn-table-container>
    <kyn-table>
      <kyn-thead>
        <kyn-header-tr>
          <kyn-th>Name</kyn-th>
          <kyn-th>Role</kyn-th>
          <kyn-th>Status</kyn-th>
        </kyn-header-tr>
      </kyn-thead>
      <kyn-tbody>…</kyn-tbody>
    </kyn-table>
  </kyn-table-container>
</div>
```

### 3.4b Side drawer title

**Fix:** Set **`titleText`** on `kyn-side-drawer` (e.g. `titleText="Drawer"` or `titleText="Sidebar"`) so the drawer panel shows a visible header/title. Optionally set `labelText` for accessibility.

### 3.5 Line chart

**Fix:** Apply the template’s chart rules:

- **Wrapper:** `<div style="width: 100%; margin-bottom: 1.5rem;">` around the chart.
- **Chart:** `<kd-chart>` with `style="width: 100%; display: block;"`, `height="280"`, and options: `maintainAspectRatio: false`, `responsive: true`.
- **Line chart specifically:** `type="line"`; each dataset has **`fill: false`**; **scales** in options so X and Y axes are visible, e.g. `scales: { x: { display: true, title: { display: true, text: 'Category' } }, y: { display: true, title: { display: true, text: 'Value' }, beginAtZero: true } }`.

### 3.6 Global switcher

**Fix:** Use **kyn-header-link** in **kyn-header-nav** for the global switcher (not a plain flyout with placeholder text):

- Do **not** set `hideSearch` on the main global switcher **kyn-header-link** so the flyout shows the search input.
- Use **kyn-header-category** with **heading="CATEGORY"** and multiple **kyn-header-link** children in `slot="links"` (e.g. Connections Management, Discovered Data, Visualization & Analytics, Topology, Settings).
- Ensure 6+ child links or set **searchThreshold="2"** so search appears.
- Header: **logo** in `slot="logo"` and `appTitle="Bridge"` for branding.

Reference: page-template-builder.md sections 5c and 5d; considerations.md “Workspace switcher and global switcher”.

---

## 4. Summary

| Gap                                | Fix                                                                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| No kyn-footer                      | Add kyn-footer after main, before closing kyn-ui-shell.                                                                               |
| Main padding                       | `<main style="padding: var(--kd-page-gutter, 1rem);">`.                                                                               |
| Table wrapper                      | Outer div with `width: 100%; overflow: auto; max-height: 360px; border: …; border-radius: 4px;` then kyn-table-container > kyn-table. |
| Missing table headers              | Include kyn-thead with kyn-header-tr and one kyn-th per column (e.g. Name, Role, Status); do not leave thead empty.                   |
| No kyn-page-title / toolbar rhythm | Add kyn-page-title, then toolbar row (flex, gap, margin 1rem 0), then content.                                                        |
| Side drawer no title               | Set titleText on kyn-side-drawer (e.g. titleText="Drawer") so the drawer shows a visible header.                                      |
| Line chart                         | Full-width wrapper; kd-chart with maintainAspectRatio: false, height 280; line: fill: false, scales for axes.                         |
| Global switcher                    | kyn-header-link in kyn-header-nav, search + kyn-header-category with CATEGORY and links.                                              |

After applying these and configuring the MCP + rule (section 2), future page generation in your project can use `get_shidoka_design_context` and pages will be informed by the Shidoka Studio context regardless of framework.
