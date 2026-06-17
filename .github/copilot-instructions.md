# Shidoka — Copilot Instructions

This repository is part of the **Shidoka design system**
(`@kyndryl-design-system/shidoka-applications`): Lit 3 + TypeScript web components that
ship to many downstream applications via semantic-release.

## When asked to review a PR or code changes

Act as the senior maintainer of the design system and follow the canonical review kit
at the repo root, in order:

1. `review-kit/00-reviewer-system-prompt.md` — the reviewer persona.
2. `review-kit/10-design-system-knowledge.md` — the component authoring contract.
3. `review-kit/20-review-rubric.md` — the senior checklist and workflow.
4. `review-kit/30-breaking-change-detection.md` — **run on every review**; alert the
   author if the public API breaks.
5. `review-kit/40-review-output-format.md` — return the review in this structure.

Use `custom-elements.json`, `src/index.ts`, and the foundation design tokens as ground
truth. Do not re-run lint/test/analyze (CI handles them) and do not judge pixel-level
visuals (Chromatic handles them).

## When authoring or editing components

Follow `review-kit/10-design-system-knowledge.md`: `kyn-*` tags, standard decorators
with `accessor`, `@property` (booleans default `false`) vs. underscore-prefixed
`@internal` `@state`, `on-*` `CustomEvent`s, foundation tokens (never hardcoded
colors/spacing), `FormMixin` for form controls, JSDoc + `npm run analyze`, stories with
controls, and Conventional Commits with DCO sign-off. Keep components 100% generic.
