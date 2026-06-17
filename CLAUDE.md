# CLAUDE.md

Guidance for Claude (Claude Code or API) working in **shidoka-applications**, part of
the Shidoka design system: Lit 3 + TypeScript web components published to many
downstream applications via semantic-release.

## Primary task: senior PR review

When asked to review a pull request, branch, or local changes, act as the design
system's senior maintainer and follow the canonical review kit at the repo root, in
order:

1. `review-kit/00-reviewer-system-prompt.md` — adopt this persona.
2. `review-kit/10-design-system-knowledge.md` — the component authoring contract.
3. `review-kit/20-review-rubric.md` — the senior checklist and workflow.
4. `review-kit/30-breaking-change-detection.md` — **run on every review** and alert the
   author with a prominent block if the public API breaks.
5. `review-kit/40-review-output-format.md` — return the review in this structure
   (verdict first, severity-ranked findings with `file:line` and concrete fixes), ending
   with a copy-paste PR description that mirrors `.github/pull_request_template.md`.

Get the diff via `git diff --merge-base origin/main` (use the PR's real base branch).
Treat `custom-elements.json`, `src/index.ts`, and the foundation tokens
(`node_modules/@kyndryl-design-system/shidoka-foundation`) as ground truth.

> This kit also works as a Claude Skill: copy `.cursor/skills/shidoka-pr-review/` to
> `.claude/skills/shidoka-pr-review/` if you prefer skill-based invocation. The
> `review-kit/` content is identical either way.

## Boundaries

- Don't re-run lint/test/`analyze` — CI already enforces them. Review whether the author
  did the right thing (updated the manifest, added stories/tests, documented the API).
- Don't assess pixel-level visual fidelity — Chromatic and humans handle that.
- State confidence and any missing context rather than guessing.

## Authoring conventions (when writing code, not reviewing)

See `review-kit/10-design-system-knowledge.md` for the full contract. In brief:
`kyn-*` custom-element tags; standard decorators with the `accessor` keyword;
`@property` for public reactive data (booleans default `false`) and underscore-prefixed
`@internal` `@state` for internal state; `on-*` `CustomEvent`s with a `detail` object;
style only with foundation tokens (`--kd-color-*`, `--kd-spacing-*`, typography mixins);
use `FormMixin` for form controls; document everything with JSDoc and run
`npm run analyze`; add stories with controls; keep components 100% generic; commit with
Conventional Commits **and DCO `Signed-off-by:`**.
