# Shidoka Design System — Authoring Knowledge

This is the body of knowledge a senior reviewer applies. It encodes the **contract**
every Shidoka component follows. Pair it with the live ground truth:

- `custom-elements.json` (repo root) — authoritative public API of every component.
- `src/index.ts` — the public export surface of the package.
- `@kyndryl-design-system/shidoka-foundation` — design tokens, typography mixins, reset.
- `component-template/` and `scripts/create-component.js` — the canonical scaffold.

---

## 1. Stack and module conventions

- **Lit 3** (`lit@^3`) web components in **TypeScript**, built with Rollup, published
  from `dist/`.
- **Standard decorators with the `accessor` keyword** — not legacy
  `experimentalDecorators`. `tsconfig.json` has `experimentalDecorators` disabled and
  `useDefineForClassFields: false`. New class fields must use `accessor`.
- ESM only (`"type": "module"`). Import extensions follow the ESLint `import/extensions`
  rule: **`.js` imports always include the extension; `.ts` never does.**
- `tsconfig` is **strict** (`strict`, `noUnusedLocals`, `noUnusedParameters`,
  `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`). Overrides
  of base-class methods must use the `override` keyword.

---

## 2. Component anatomy (the contract)

Every component folder contains: `index.ts`, `<name>.ts`, `<name>.scss`,
`<Name>.stories.js`. Subcomponents share their parent's folder.

A canonical component:

```ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import stylesheet from './myComponent.scss?inline';

/**
 * My component description.
 * @slot unnamed - Slot for child content.
 * @slot icon - Slot for an icon.
 * @fires on-click - Emits the original click event. `detail:{ origEvent: Event }`
 * @part button - The internal button element.
 */
@customElement('kyn-my-component')
export class MyComponent extends LitElement {
  static override styles = unsafeCSS(stylesheet);

  /** Public, documented reactive property. */
  @property({ type: String })
  accessor label = '';

  /** Booleans MUST default to false. Use reflect when the attribute must mirror state. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Internal reactive state. Prefix with underscore + mark @internal.
   * @internal
   */
  @state()
  accessor _open = false;

  /** Element reference. Not populated until after the update lifecycle.
   * @internal
   */
  @query('.root')
  accessor _root!: HTMLElement;

  override render() {
    return html`
      <div class="root" class=${classMap({ open: this._open })}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-my-component': MyComponent;
  }
}
```

### Required conventions

- **Tag name:** `kyn-<kebab-case>`, registered with `@customElement`.
- **Class name:** `PascalCase`, `extends LitElement` (or a mixin that extends it).
- **Styles:** `static override styles = unsafeCSS(stylesheet)` where styles are
  imported from a co-located `.scss` file via the `?inline` query.
- **Global type registration:** every component declares its tag in
  `HTMLElementTagNameMap`.
- **Public props** use `@property({ type: ... })` on an `accessor` field, documented
  with JSDoc. **Boolean properties always default to `false`.**
- **Internal state** uses `@state()`, an underscore-prefixed name, and an `@internal`
  JSDoc tag. The same applies to `@query`, `@queryAssignedElements`,
  `@queryAssignedNodes`, and private helper methods.
- **Enums / option sets** live in a co-located `defs.ts` and are exported so stories
  can build control dropdowns (see §6). Example: `BUTTON_KINDS`, `BUTTON_SIZES`.

---

## 3. Events, slots, and parts (the public surface)

These are **public API**. Renaming or removing any of them is a breaking change
(see `30-breaking-change-detection.md`).

- **Custom events** are named `on-*` (e.g., `on-click`, `on-input`, `on-change`),
  dispatched as `CustomEvent` with a `detail` object that includes `origEvent` when
  wrapping a native event:

  ```ts
  this.dispatchEvent(new CustomEvent('on-click', { detail: { origEvent: e } }));
  ```

  Document every event with `@fires on-x - description. \`detail:{ ... }\``.
If an event must cross shadow boundaries, set `composed: true`(and usually`bubbles: true`) deliberately and document it.

- **Slots** are documented with `@slot name - description`; the default slot is
  `@slot unnamed - ...`.
- **CSS Shadow Parts** (`part="..."`) are documented with `@part name - description`
  and are a theming contract consumers depend on.
- **CSS custom properties** a component reads for theming are documented with
  `@cssprop` and are also public API.

---

## 4. Styling and design tokens

Components must style against **foundation tokens**, never hardcoded values.

- SCSS files typically start with:

  ```scss
  @use '../../../common/scss/global.scss';
  @use '@kyndryl-design-system/shidoka-foundation/scss/mixins/typography.scss';
  ```

- **Color:** `var(--kd-color-...)` (e.g., `--kd-color-background-button-primary-state-default`,
  `--kd-color-text-forms-label-primary`). Never raw hex/rgb when a token exists.
- **Spacing:** `var(--kd-spacing-...)` (e.g., `--kd-spacing-16`). Avoid magic px for
  layout spacing.
- **Typography:** `@include typography.type-...` mixins (e.g., `type-ui-02`) or
  `--kd-font-weight-...` tokens and the `kd-type--*` utility classes in stories.
- **Host display:** web components are `display: inline` by default — set
  `:host { display: block; }` (or the intended value) explicitly.
- **Dark mode / theming** is token-driven. Hardcoded colors break theming and are a
  defect, not a nitpick.

---

## 5. Shared base patterns

Reviewers must know these so they can flag re-implementations of solved problems.

### FormMixin (`src/common/mixins/form-input.ts`)

Form-associated controls extend `FormMixin(LitElement)` instead of re-implementing
form plumbing. It provides:

- `static formAssociated = true`, `delegatesFocus`, and `_internals = attachInternals()`.
- Public `value`, `name`, `invalidText`, `warnText` properties.
- `checkValidity()`, `reportValidity()`, and `validity` / `validationMessage` getters
  that delegate to `ElementInternals`.
- An abstract `_validate(interacted: boolean, report: boolean)` each control implements.
- Automatic `setFormValue` on `value` change and `invalid`-event wiring.

A new input component that hand-rolls validation or form association instead of using
`FormMixin` is a red flag.

### `@lit/context` for compound components

Multi-part components (e.g., Table) share state via `@lit/context`
(`createContext`, `@provide`, `@consume`, `ContextProvider`/`ContextConsumer`) rather
than prop-drilling or querying across components. See `src/components/reusable/table/`.

### Helpers (`src/common/helpers/`)

Reuse shared helpers instead of duplicating: `debounce`, `createOptionsArray`
(builds story option arrays from enums), `stringToReactHtml`, gridstack/swiper/
flatpickr configs.

### Lifecycle and performance

- Add listeners in `connectedCallback` and **always remove them in
  `disconnectedCallback`** (call `super` in both). Unremoved global listeners
  (`window`/`document`) are memory leaks — a recurring, high-value review catch.
- `debounce` resize/scroll handlers.
- Prefer Lit directives (`ifDefined`, `classMap`, `styleMap`, `repeat`, `unsafeSVG`)
  over manual DOM work.
- Web components do **not** server-render; guard `window`/`document` access for SSR
  consumers (Next.js, etc.).

---

## 6. Stories and documentation (required for every component)

- One `<Name>.stories.js` per component with `title: 'Components/...'` and
  `component: 'kyn-...'`.
- **Controls for every public property.** Enum props use `argTypes` with options built
  from `defs.ts` via `createOptionsArray` and labeled defaults.
- Bind correctly in templates: attributes `attr=${...}`, booleans `?bool=${...}`,
  properties `.prop=${...}`, events `@on-event=${action('on-event')}`.
- Provide meaningful variants and (for rich components) a `Gallery` story showing all
  kinds/sizes/states.
- Compound components include subcomponents in the story so Storybook renders their
  args tables.
- **JSDoc is mandatory** on all props, slots, events, parts. After any doc/API change,
  the author must run `npm run analyze` to regenerate `custom-elements.json` (Storybook
  args derive from it). A public-API change with no manifest update is a defect.

---

## 7. Testing expectations

- **Interaction & a11y tests** via Storybook `play` functions using `storybook/test`
  (`expect`, `userEvent`, `waitFor`). Traverse shadow DOM explicitly
  (`el.shadowRoot.querySelector(...)`) and `await el.updateComplete` before asserting.
  Test files use the `*.test.stories.js` suffix and usually `tags: ['!autodocs']`.
- **Accessibility** is validated by the Storybook a11y addon / test-runner (axe).
  New interactive components should not regress a11y; keyboard operability and ARIA
  are part of "done."
- **Unit tests** for pure helpers use Vitest (`*.test.ts`).
- **Visual regression** is handled by Chromatic in CI — the reviewer does not judge
  pixels, but should confirm visually significant changes have story coverage so
  Chromatic can catch them.

---

## 8. File structure and exports

- Components live under `src/components/{ai,global,reusable}/<camelCase>/`.
  - `ai` — AI-specific components.
  - `global` — app-shell/global components (header, footer, localNav, uiShell).
  - `reusable` — the general component library.
- `index.ts` re-exports the class: `export { MyComponent } from './myComponent';`.
- **New components must be exported from `src/index.ts`.** A new component that isn't
  exported there is effectively unshipped — flag it.
- `scripts/create-component.js` (`npm run create:component`) scaffolds all of this and
  wires the exports; deviations from its output usually indicate a convention miss.

---

## 9. The "100% generic" rule

From `CONTRIBUTING.md`: _"Everything in the design system should be 100% generic.
Remember that these components could be used to build any application. Application
concerns must be separated."_

Flag anything that bakes application-specific assumptions into a component:
hardcoded copy/labels that should be slots or props, business logic, app routes,
product-specific data shapes, or coupling to a particular backend.

---

## 10. Governance: commits, versioning, releases

- **Conventional Commits** (enforced by commitlint). Prefix drives the release:
  - `fix:` → patch, `feat:` → minor, `BREAKING CHANGE:` footer or `!` → **major**.
  - Other types (`chore`, `docs`, `refactor`, `test`, `build`, `ci`, `style`) don't
    release on their own.
- **DCO sign-off is required** on every commit (`Signed-off-by:`), enforced by the
  `commit-msg` hook. Use `git commit -s` (or `git.alwaysSignOff` in the editor).
- **semantic-release** publishes automatically on merge to `main` (stable) and
  `beta`/`next` (prerelease); `N.x` branches are maintenance lines. Because release is
  automatic, **all correctness must be verified at the PR stage.**
- Branch naming: `feature/`, `bugfix/`, `hotfix/`.
- Because this package is consumed by many applications, **commit type and breaking-
  change declaration must match the actual change.** A breaking change shipped as a
  `fix:` is a serious defect (see `30-breaking-change-detection.md`).

---

## 11. Lint/format/type gates (already enforced in CI)

Don't re-run these, but know what they cover so you focus review effort elsewhere:

- **ESLint:** `eslint:recommended`, `@typescript-eslint/recommended`,
  `plugin:storybook/recommended`, `plugin:lit-a11y/recommended`. Notable: unused vars
  warn (ignore `^_`), `lit-a11y/click-events-have-key-events` warns,
  `import/extensions` enforces the `.js`-always/`.ts`-never rule.
- **Prettier:** single quotes, semicolons, 2-space indent, `trailingComma: es5`,
  `arrowParens: always`.
- **lit-analyzer** (`ts-lit-plugin`, strict): template type-checking, attribute
  binding correctness.

Focus your human-grade attention on what these tools **cannot** see: API stability,
accessibility semantics, token correctness, naming/consistency with sibling
components, event/slot/part design, performance, and the "generic" rule.
