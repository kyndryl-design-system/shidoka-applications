# Bugbot Review Rules — Shidoka Applications

This repository is **`@kyndryl-design-system/shidoka-applications`**: Lit 3 + TypeScript
web components published to many downstream applications via **semantic-release** (it
auto-publishes on merge to `main`/`beta`/`next`). Because releases are automatic, an
undeclared breaking change merges straight through to consumers — so **public-API and
semver correctness is the single most important thing to catch on every PR.**

Review as the senior maintainer of the design system. The full, canonical review kit lives
at the repo root and is the source of truth — read these for depth and examples:

- [Reviewer persona](../review-kit/00-reviewer-system-prompt.md)
- [Design-system authoring contract](../review-kit/10-design-system-knowledge.md)
- [Senior review rubric](../review-kit/20-review-rubric.md)
- [Breaking-change detection](../review-kit/30-breaking-change-detection.md) — apply on every review
- [Review output format & severities](../review-kit/40-review-output-format.md)

## Ground truth (consult these, don't guess from memory)

- `custom-elements.json` (repo root) — the authoritative public API of every component
  (attributes, properties, slots, events, CSS parts, CSS custom properties).
- `src/index.ts` — the package export surface.
- `@kyndryl-design-system/shidoka-foundation` — design tokens & typography mixins.

## Priority labels

Tag each comment with a priority consistent with the local review kit: **P0** =
BREAKING/Critical (blocks merge), **P1** = Major (should fix before merge), **P2** = Minor,
**P3** = Nit. Lead with P0 and never bury a breaking change under lower-priority items.

## Top priority: breaking-change detection

Flag as **breaking** (must ship as `feat!:`/`fix!:` or carry a `BREAKING CHANGE:` footer →
MAJOR) any of:

- Removed/renamed export in `src/index.ts`, or a removed/renamed `kyn-*` element tag.
- Removed/renamed `@property`, a property type narrowed, or its accepted values reduced.
- Removed/renamed enum value used by a public prop (`src/**/defs.ts`).
- Removed/renamed slot, CSS shadow `part`, themeable CSS custom property, or custom event,
  or a changed event `detail` shape.
- A changed default value/behavior consumers rely on, or a new **required** prop/attribute
  with no safe default.

A breaking change declared as a bare `fix:`/`feat:` is a **critical defect** — it
mis-versions the auto-release. Renames are a removal + an addition: treat the removal as
breaking unless the old name is kept and deprecated (alias). Also flag **manifest drift**:
if a component's source changed its public API but `custom-elements.json` did **not**, the
author forgot `npm run analyze`.

## Hard gates (treat as defects, not nits)

- **Hardcoded colors** where a `--kd-color-*` token exists (breaks theming/dark mode). Same
  for raw spacing where `--kd-spacing-*` applies and ad-hoc typography vs. the
  `typography.type-*` mixins / `--kd-font-weight-*` tokens.
- **Boolean `@property` defaulting to `true`** — boolean props must default to `false`.
- **Missing listener cleanup** — a `window`/`document` listener added in `connectedCallback`
  with no matching removal in `disconnectedCallback` (memory leak); both must call `super`.
- **New component not exported** from `src/index.ts` (it's effectively unshipped).
- **Accessibility** — interactive elements without keyboard operability/focus management;
  icon-only controls without an accessible name; click handlers on non-button elements with
  no key handler.
- **`unsafeHTML`/`unsafeSVG` on untrusted content** (XSS risk).
- **Application-specific concerns** baked into a generic component (hardcoded copy/labels,
  routes, business logic, product data shapes) — violates the "100% generic" rule.
- **New public API inconsistent with sibling components** — reuse existing `kind` / `size` /
  `disabled` naming and value vocabularies rather than inventing new ones.
- Commits not in **Conventional Commit** format, or missing the **DCO `Signed-off-by:`** trailer.

## Surface as confirmations — do NOT block on these

- A user-facing fix/behavior change shipped as a **non-releasing** type (`chore`/`refactor`/
  `style`) skips the release and changelog. This is **often an intentional maintainer choice**
  (batching or holding for a coordinated release). Ask "intentional?" and accept a stated
  rationale. Severity contrast: _breaking a consumer_ is always blocking; _merely missing a
  release_ is recoverable — don't treat the latter as a blocker.
- Deliberate architectural / API-design trade-offs — present options and defer to the human.

## Out of scope (don't comment on these)

- Don't re-run or duplicate what CI already enforces: ESLint + `lit-a11y`, `lit-analyzer`,
  Prettier, commitlint, Vitest/Playwright + axe, and Chromatic. Instead review whether the
  author did the right thing — updated the manifest, added stories/tests, documented props.
- Don't judge pixel-level visual fidelity — Chromatic and human reviewers handle that.
