# Shidoka PR Review Rubric

The senior checklist. Apply it after reading `10-design-system-knowledge.md`. Map every
finding to a severity (see `40-review-output-format.md`) and return results in that
format. **Breaking-change detection (`30`) is mandatory on every review.**

---

## Review workflow

Copy this checklist and work through it:

```
Review progress:
- [ ] 1. Establish context (what changed, base branch, commit type)
- [ ] 2. Run breaking-change detection (30-breaking-change-detection.md)
- [ ] 3. Component-contract review (anatomy, props/state, events/slots/parts)
- [ ] 4. Styling & tokens review
- [ ] 5. Accessibility review
- [ ] 6. Correctness, performance & lifecycle review
- [ ] 7. Docs, stories, manifest & tests review
- [ ] 8. Governance review (commit, versioning, exports, "generic" rule)
- [ ] 9. Severity-rank findings, note what's done well, write verdict
- [ ] 10. Emit the copy-paste PR description (see 40-review-output-format.md)
```

### Step 1 — Establish context

- **Resolve the review target.** If a PR id/URL was provided, review that PR
  (`gh pr diff <id>`, compared to its base branch). If none was specified, default to the
  **current branch vs `main`** (`git diff --merge-base origin/main HEAD`) and note any
  uncommitted working-tree changes separately.
- Identify changed files and whether the change is a new component, an edit to an
  existing one, a shared base/mixin change, a token change, or tooling.
- Determine the base branch (`main`, `beta`, `next`, or `N.x`). If you cannot see it,
  say so and scope confidence accordingly.
- Note the Conventional Commit type(s) on the PR — you'll confirm they match the
  actual change in Step 8.
- **A change to a shared base (`FormMixin`, a context provider, a common helper, or a
  foundation token) has blast radius across many components — review it with
  proportionally more scrutiny.**

### Step 2 — Breaking-change detection (mandatory)

Follow `30-breaking-change-detection.md` in full. Produce the breaking-change report
and, if anything broke, a prominent alert at the top of the review.

---

## Step 3 — Component-contract checklist

- [ ] Tag is `kyn-<kebab>`; class is `PascalCase extends LitElement` (or a Shidoka mixin).
- [ ] `HTMLElementTagNameMap` declaration present and correct.
- [ ] `static override styles = unsafeCSS(...)` from a co-located `.scss` (`?inline`).
- [ ] New class fields use the `accessor` keyword (standard decorators), not plain fields.
- [ ] Public reactive data uses `@property({ type })`; **boolean props default to `false`**.
- [ ] `reflect: true` used only where the attribute must mirror state; not by default.
- [ ] Internal state uses `@state()`, underscore prefix, and `@internal` JSDoc. Same for
      `@query*` and private methods.
- [ ] Option sets are enums in a co-located `defs.ts`, exported for stories.
- [ ] **Events** are `on-*` `CustomEvent`s with a `detail` object (`origEvent` when
      wrapping native events); `composed`/`bubbles` are intentional and documented.
- [ ] New props/events/slots/parts are **consistent with sibling components** (e.g.,
      reuse `kind`, `size`, `disabled` naming and value vocabularies rather than
      inventing new ones). Inconsistency with the rest of the system is a real defect.
- [ ] No public API duplicates something a base class/mixin already provides.

## Step 4 — Styling & tokens checklist

- [ ] No hardcoded colors where a `--kd-color-*` token exists (defect, not nitpick —
      it breaks theming/dark mode).
- [ ] Spacing uses `--kd-spacing-*`; typography uses the `typography.type-*` mixins or
      `--kd-font-weight-*` tokens.
- [ ] `:host` display is set intentionally (components default to `inline`).
- [ ] Styles are encapsulated; no leakage assumptions; theming via documented CSS parts
      / custom properties.
- [ ] SCSS uses the standard `@use` of `common/scss/global.scss` and foundation mixins.

## Step 5 — Accessibility checklist

- [ ] Interactive elements are keyboard-operable (Enter/Space/Arrow as appropriate) and
      focusable; focus is visible and managed (focus trap/return for overlays).
- [ ] Correct semantics/roles; `aria-*` used correctly (`aria-label`, `aria-expanded`,
      `aria-controls`, `aria-current`, etc.); no redundant/incorrect roles.
- [ ] Click handlers on non-button elements also handle keyboard (the
      `lit-a11y/click-events-have-key-events` rule warns — treat as must-fix for new code).
- [ ] Slotted content and shadow DOM don't break the accessibility tree or label
      associations; `delegatesFocus` used where appropriate.
- [ ] Color is not the only signal; contrast comes from tokens; motion is reasonable.
- [ ] Icon-only controls have an accessible name (`description`/`aria-label`).

## Step 6 — Correctness, performance & lifecycle checklist

- [ ] Every listener added in `connectedCallback` is removed in `disconnectedCallback`;
      both call `super`. (Global `window`/`document` listeners are the usual leak.)
- [ ] Resize/scroll/input handlers are debounced where appropriate.
- [ ] No unnecessary re-renders or `requestUpdate` loops; reactive properties drive
      updates; `updated`/`willUpdate` guarded by `changedProps.has(...)`.
- [ ] Lit directives used instead of manual DOM manipulation; `unsafeHTML`/`unsafeSVG`
      only on trusted content (XSS risk otherwise).
- [ ] SSR-safety: `window`/`document` access guarded for downstream SSR consumers.
- [ ] Edge cases handled: empty/long slot content, disabled state, RTL if relevant,
      rapid interaction, null/undefined inputs.

## Step 7 — Docs, stories, manifest & tests checklist

- [ ] JSDoc present on all public props, slots, events, parts.
- [ ] `custom-elements.json` regenerated (`npm run analyze`) and committed when the
      public API or docs changed. Manifest drift = defect.
- [ ] Stories exist with controls for every public property; enum controls built from
      `defs.ts`; meaningful variants (and a Gallery for rich components).
- [ ] Interaction/a11y `play` tests cover new behavior; shadow DOM traversed correctly;
      `await updateComplete` before assertions.
- [ ] Visually significant changes have story coverage so Chromatic can catch regressions.
- [ ] PR checklist items in `.github/pull_request_template.md` are satisfied.

## Step 8 — Governance checklist

- [ ] **Commit type matches the change** and the breaking-change declaration is correct:
      a removed/renamed public API must ship as a `feat!`/`BREAKING CHANGE:`, never a
      bare `fix:`/`feat:`.
- [ ] **Commit type isn't accidentally under-classified:** a user-facing fix/behavior
      change shipped as a non-releasing `chore`/`refactor`/`style` skips the release and
      changelog. This is often an intentional maintainer choice — raise it as a
      _confirmation_, not a blocking defect, and accept a stated rationale.
- [ ] Commits use Conventional Commit format and include DCO `Signed-off-by:`.
- [ ] New components are exported from `src/index.ts`.
- [ ] The "100% generic" rule holds — no application-specific concerns leaked into a
      component.
- [ ] Change is scoped; unrelated refactors/format churn aren't smuggled into the PR.

---

## Calibration: what is and isn't a senior-grade finding

- **Treat as defects (not nitpicks):** undeclared breaking changes; hardcoded colors;
  missing listener cleanup; missing accessible names/keyboard support; new public API
  inconsistent with the system; missing manifest update on API change; application
  concerns in a generic component; `fix:` on a breaking change.
- **Treat as suggestions/judgment:** internal structure/readability, naming of private
  helpers, optional performance micro-optimizations, test thoroughness beyond the new
  behavior, alternative API designs (present trade-offs, let the human decide).
- **Treat as confirmations (surface, don't block):** commit-type/release choices that may
  be intentional (e.g., a user-facing change deliberately held as a non-releasing `chore`)
  and other deliberate maintainer decisions. Raise them, accept stated intent, and don't
  let them force a "Request changes" verdict.
- **Out of scope / defer:** pixel-level visual fidelity (Chromatic + humans), product
  decisions, and anything requiring context the diff doesn't contain — say so explicitly.

Lead with the highest-severity items. Never let nitpicks bury a breaking change or an
accessibility blocker.
