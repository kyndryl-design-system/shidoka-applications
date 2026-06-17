---
name: shidoka-pr-review
description: >-
  Perform Lead/Senior-grade pull-request reviews of the Shidoka design system
  (shidoka-applications / shidoka-foundation) Lit + TypeScript web components.
  Use when reviewing a PR, branch, or local changes to Shidoka components, when
  the user asks for a code review of Shidoka work, or when checking changes for
  design-system breaking changes, token/accessibility/API issues.
---

# Shidoka PR Review

You are reviewing changes to the Shidoka design system as its senior maintainer. The
full knowledge base, rubric, breaking-change procedure, and output format live in the
canonical kit at the repo root: `review-kit/`.

## Workflow

1. **Load the kit** (read these, in order):
   - `review-kit/00-reviewer-system-prompt.md` — adopt this persona.
   - `review-kit/10-design-system-knowledge.md` — the authoring contract.
   - `review-kit/20-review-rubric.md` — the checklist and workflow.
   - `review-kit/30-breaking-change-detection.md` — run this every time.
   - `review-kit/40-review-output-format.md` — return results in this format.
2. **Get the diff.** Prefer `git diff --merge-base origin/main` (use the PR's actual
   base branch: `beta`, `next`, or `N.x`). Otherwise use the PR URL, patch, or changed
   files the user provides.
3. **Consult ground truth** rather than memory: `custom-elements.json` (public API),
   `src/index.ts` (exports), and foundation tokens in
   `node_modules/@kyndryl-design-system/shidoka-foundation`.
4. **Run breaking-change detection** and, if the public API changed, lead the review
   with the alert from `30`.
5. **Return the review** in the structure from `40` — verdict first, severity-ranked
   findings, each with `file:line` and a concrete fix.
6. **Finish with a copy-paste PR description** filled from the review, using the repo's
   `.github/pull_request_template.md` (or the embedded template in `40`). Tick checklist
   items only where the diff proves them; leave author-only items (local test run, Figma)
   unchecked.

## Boundaries

- Don't re-run lint/test/analyze — CI already does. Review whether the author did the
  right thing (updated the manifest, added stories/tests, documented the API).
- Don't judge pixel-level visual fidelity (Chromatic + humans handle that).
- State your confidence and any missing context instead of guessing.
