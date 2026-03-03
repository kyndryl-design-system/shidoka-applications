# MANDATORY RULES — Shidoka Story UI

These rules are absolute. Every generated story MUST comply. Violating any rule produces broken, non-rendering output.

## Rule 1: ONLY kyn-\* tags — NEVER <my-button>, <my-card>, <my-table>, <button>, etc.

In the story template, you MUST use ONLY real Shidoka `kyn-*` tags from the component registry.

FORBIDDEN tags (NEVER write these — they do NOT exist in this project):

- `<my-button>`, `<my-card>`, `<my-table>`, `<my-ui-shell>`, `<my-side-drawer>`, `<my-modal>`, `<my-input>`, or ANY `<my-*>` tag
- `<lit-button>`, `<lit-table>`, `<lit-card>`, or ANY `<lit-*>` tag
- `<app-shell>`, `<data-table>`, `<sidedrawer>`, `<nav-bar>`, or ANY invented tag
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>` — use `kyn-button`, `kyn-text-input`, `kyn-dropdown`, `kyn-text-area`, `kyn-table` instead

CORRECT: `<kyn-button kind="primary">GO HOME</kyn-button>`
WRONG: `<my-button variant="primary">GO HOME</my-button>`
WRONG: `<button>GO HOME</button>`

## Rule 2: ONLY Shidoka imports — NEVER your-library, my-library, lit/\*

FORBIDDEN imports (NEVER write these — they will crash the build):

- `import { Button } from 'your-library/button';` — "your-library" does NOT exist
- `import { Button } from 'my-library/button';` — "my-library" does NOT exist
- `import 'lit/button';`, `import 'lit/table';`, `import 'lit/card';` — lit does NOT export components
- ANY import from `your-library/*`, `my-library/*`, or `lit/*` (except `import { html } from 'lit';`)

CORRECT imports use relative paths from `src/stories/generated/`:

- `import { html } from 'lit';` — the ONLY allowed lit import
- `import '../../components/reusable/button/index';` — for kyn-button
- `import '../../components/reusable/table/index';` — for kyn-table
- `import '../../components/global/uiShell/index';` — for kyn-ui-shell

## Rule 3: Attributes must match the registry

For each kyn-\* tag, use ONLY the attributes listed in the component registry. Do not guess or invent attributes.

Example: kyn-button uses `kind` (not `variant`). Valid values: primary, secondary, tertiary, ghost, primary-destructive, secondary-destructive, tertiary-destructive, ghost-destructive, primary-ai, ghost-ai.

WRONG: `<kyn-button variant="primary">` — "variant" is NOT a valid attribute
CORRECT: `<kyn-button kind="primary">` — "kind" IS the correct attribute

## Rule 4: Allowed layout HTML

These plain HTML tags are allowed for structure and text ONLY:
`div`, `main`, `section`, `span`, `p`, `h1`–`h6`, `ul`, `ol`, `li`, `a`, `img`, `strong`, `em`

## Rule 5: Intent mapping — user says X, you use Y

| User says                   | CORRECT output                                                          | Import                                      |
| --------------------------- | ----------------------------------------------------------------------- | ------------------------------------------- |
| "button" / "primary button" | `<kyn-button kind="primary">Label</kyn-button>`                         | `../../components/reusable/button/index`    |
| "ghost button"              | `<kyn-button kind="ghost">Label</kyn-button>`                           | `../../components/reusable/button/index`    |
| "card"                      | `<kyn-card>`                                                            | `../../components/reusable/card/index`      |
| "table" / "data table"      | `<kyn-table-container><kyn-table>...</kyn-table></kyn-table-container>` | `../../components/reusable/table/index`     |
| "modal" / "dialog"          | `<kyn-modal>`                                                           | `../../components/reusable/modal/index`     |
| "input" / "text field"      | `<kyn-text-input>`                                                      | `../../components/reusable/textInput/index` |
| "page" / "app layout"       | `<kyn-ui-shell>` with header, main, footer                              | `../../components/global/uiShell/index`     |

## Rule 6: Complete button example

When the user asks for a button (e.g. "primary button that says GO HOME"):

```typescript
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '../../components/reusable/button/index';

const meta: Meta = {
  title: 'Generated/Go Home Button',
  id: 'go-home-button-HASH',
};
export default meta;
type Story = StoryObj;

export const GoHomeButton: Story = {
  render: () => html`<kyn-button kind="primary">GO HOME</kyn-button>`,
};
```

NEVER replace `<kyn-button>` with `<my-button>`, `<button>`, or any other tag. The button MUST be a real Shidoka kyn-button component.
