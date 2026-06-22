# Shidoka PR Review Kit

A **model- and platform-agnostic** knowledge base + rubric that lets any capable AI
assistant (Cursor, GitHub Copilot, Claude, or a raw API call) perform
**Lead/Senior-grade pull-request reviews** of the Shidoka design system
(`shidoka-applications`, `shidoka-foundation`, and siblings).

This folder is the **single source of truth**. The platform adapters elsewhere in
the repo are thin pointers that load these files and nothing else.

## What's in here

| File                              | Purpose                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `00-reviewer-system-prompt.md`    | The reviewer persona. Paste into any chat/API/CI as the system prompt.                         |
| `10-design-system-knowledge.md`   | The full authoring contract: component anatomy, tokens, mixins, events, structure, governance. |
| `20-review-rubric.md`             | The senior review checklist, severity levels, and step-by-step review workflow.                |
| `30-breaking-change-detection.md` | How to automatically detect public-API breaks and alert the author.                            |
| `40-review-output-format.md`      | The exact structure every review must be returned in.                                          |

## Ground truth that stays current automatically

You do **not** need to hand-maintain a catalog of every component. Two artifacts the
repo already generates are authoritative and always up to date:

- **`custom-elements.json`** (repo root) — a machine-readable manifest of every
  component's public API (attributes, properties, slots, events, CSS parts, CSS
  custom properties). This is the canonical "what exists" reference and the basis
  for breaking-change detection.
- **`@kyndryl-design-system/shidoka-foundation`** (`node_modules/.../css/*.css`,
  `scss/`) — the design tokens, typography mixins, and reset that components must
  style against.

The rubric tells the reviewer to consult these directly rather than trusting a
stale, copied list.

## How each platform loads this kit

| Platform                 | Adapter (entry point)                       | Mechanism                                                              |
| ------------------------ | ------------------------------------------- | ---------------------------------------------------------------------- |
| **Cursor**               | `.cursor/skills/shidoka-pr-review/SKILL.md` | Invoked when you ask to review a PR/changes against Shidoka standards. |
| **GitHub Copilot**       | `.github/copilot-instructions.md`           | Auto-loaded into Copilot Chat for this repo.                           |
| **Claude (Code / API)**  | `CLAUDE.md`                                 | Auto-loaded by Claude Code; also usable as a Claude Skill.             |
| **Any model / CI / API** | `review-kit/00-reviewer-system-prompt.md`   | Use as the system prompt; attach the other files as context.           |

## Using it from any model or CI pipeline

1. Send `00-reviewer-system-prompt.md` as the system prompt.
2. Attach `10`, `20`, `30`, and `40` as context (or let the agent read them).
3. Provide the diff. Good options, in order of richness:
   - `git diff --merge-base origin/main` (or the PR's base branch), or
   - the PR URL / patch, or
   - the changed files.
4. The model returns a review in the format from `40-review-output-format.md`,
   including a prominent breaking-change alert when applicable.

## Exporting to another repo

This folder is self-contained. To reuse it in a consumer app or another library:

1. Copy the `review-kit/` folder into the target repo.
2. Copy whichever adapter(s) you need (`.cursor/skills/...`, `.github/copilot-instructions.md`, `CLAUDE.md`).
3. If the target repo _consumes_ Shidoka rather than _builds_ it, adjust the persona
   focus in `00-reviewer-system-prompt.md` from "authoring" to "correct usage"
   (the rubric notes which checks apply to each case).

## Maintenance

- Keep this kit accurate when authoring conventions change. The conventions, not the
  component list, are what need hand-maintenance.
- Re-read `10-design-system-knowledge.md` after major refactors to the base classes
  (`FormMixin`, context providers) or token system.
