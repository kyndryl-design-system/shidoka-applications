# Review Output Format

Return every review in this structure. Lead with the verdict and any breaking-change
alert so the most important information is never buried.

## Severity levels

| Level        | Meaning                                                                  | Examples                                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BREAKING** | Public-API break that will break consumers if shipped as-is              | Removed prop/event/slot/part, removed export, changed default behavior                                                                                                     |
| **Critical** | Must fix before merge                                                    | Mis-declared breaking change, a11y blocker, memory leak, XSS via `unsafeHTML`, broken form association                                                                     |
| **Major**    | Should fix before merge                                                  | Hardcoded color/token misuse, missing keyboard support, public API inconsistent with the system, missing manifest update on API change, app concern in a generic component |
| **Confirm**  | Maintainer judgment — surface, **don't block**. Not a defect on its own. | Non-releasing commit type that may be intentional, a deliberate API/behavior decision, an intentional hold/batch                                                           |
| **Minor**    | Worth fixing; not blocking                                               | Missing story control, incomplete JSDoc, weak test coverage of new behavior                                                                                                |
| **Nit**      | Optional polish                                                          | Naming of private helpers, internal readability, micro-optimizations                                                                                                       |
| **Praise**   | Done well                                                                | Correct pattern reuse, thorough tests, clean API design                                                                                                                    |

## Priority labels (P0–P3)

Tag every actionable finding with a priority so it reads as a discrete, triageable item.
The labels map onto the severity levels above:

| Priority | Maps to severity   | Meaning                                                                                                                                         | Blocks merge?      |
| -------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **P0**   | BREAKING, Critical | Will break consumers or ship a defect: undeclared/mis-declared API break, a11y blocker, memory leak, XSS, broken form association.              | **Yes**            |
| **P1**   | Major              | Should fix before merge: hardcoded color/token misuse, missing keyboard support, API inconsistent with the system, manifest drift, app concern. | Strongly preferred |
| **P2**   | Minor              | Worth fixing, not blocking: missing story control, incomplete JSDoc, thin test coverage of new behavior.                                        | No                 |
| **P3**   | Nit                | Optional polish: naming of private helpers, internal readability, micro-optimizations.                                                          | No                 |

**Confirm** and **Praise** are **not** P-rated — a Confirm is a question for the author
(surface it, don't block) and Praise is positive reinforcement. Undeclared **BREAKING**
items are P0 and must **also** appear in the top-of-review alert.

## Template

````markdown
## Shidoka PR Review — <component / area>

**Verdict:** Approve | Approve with comments | Request changes
**Suggested semver:** none | patch | minor | MAJOR
**Confidence:** high | medium | low — <note any missing context, e.g. base branch or visual output not available>

> ## BREAKING CHANGE DETECTED <!-- include this block only if applicable -->
>
> <table from 30-breaking-change-detection.md: what changed, file:line, impact, required action>
> Declared commit type: `<type>`. Required: `<type!>` / `BREAKING CHANGE:` or make backward compatible.

### Summary

<2–4 sentences: what the PR does and the overall assessment.>

### Breaking-change scan

<Always present. The "nothing breaks" or the detailed report from `30`.>

### Review coverage

| Area                                                          | Status                 | Notes |
| ------------------------------------------------------------- | ---------------------- | ----- |
| Breaking-change scan                                          | Pass/Warn/Fail/Confirm |       |
| Component contract (anatomy, props/state, events/slots/parts) | Pass/Warn/Fail/N/A     |       |
| Styling & design tokens                                       | …                      |       |
| Accessibility                                                 | …                      |       |
| Correctness, performance & lifecycle                          | …                      |       |
| Docs, stories, manifest & tests                               | …                      |       |
| Governance (commit type, versioning, exports, generic rule)   | …                      |       |

_Status: **Pass** none found · **Warn** minor/suggestions · **Fail** critical/major defect · **Confirm** maintainer judgment to verify · **N/A** not touched by this diff. Every area must appear, even if N/A._

### Findings

Emit **one standalone block per actionable item**, tagged with its priority (`P0`–`P3`),
ordered P0 → P3, so each item can be posted or pasted as an individual review comment.
Never bundle multiple issues into one block. If a priority level has no items, write "None."

#### [P0] <title> — `path/to/file.ts:LINE`

- **Problem:** <what's wrong>
- **Why it matters:** <impact for a shared design system / downstream consumers>
- **Fix:**
  ```ts
  <concrete corrected snippet>
  ```

#### [P1] <title> — `path/to/file.ts:LINE`

- **Problem / why / fix:** <what's wrong, why it matters, and the concrete fix>

#### [P2] <title> — `path/to/file.ts:LINE`

- <problem + suggested fix>

#### [P3] <title> — `path/to/file.ts:LINE`

- <optional polish>

### Confirmations (not blocking, not P-rated)

- **[Confirm] <title>** — <what to verify with the author, e.g. "user-facing fix shipped as a non-releasing `chore` — intentional hold/batch, or should it be `fix:`?">

### Done well

- <1–3 genuine positives so the author learns the system.>

### Open questions / judgment calls (for the human reviewer)

- <Architectural or product trade-offs you are deliberately not deciding, with options.>

### Proposed PR description (copy-paste)

Filled from this review; mirrors `.github/pull_request_template.md`. Wrapped in a fenced
block so it pastes as raw markdown. Tick only checklist items the diff/repo objectively
evidences; leave author-only items (local test run, Figma link) unchecked.

```markdown
## Summary

- <most important change, in one scannable bullet>
- <next change and/or its purpose>
- <…3–6 short bullets, one idea each; no single-paragraph summary>

## ADO Story or GitHub Issue Link

<link if referenced in the PR/diff, else N/A>

## Figma Link

<link if known, else N/A>

## Notes

- <substantive change note derived from the diff>
- <...>

## To Do

- <unresolved follow-ups this review surfaced, else "None">

## Checklist

- [ ] Used Conventional Commit messages as outlined in the contributing guide.
  - [ ] Noted breaking changes (if any).
- [ ] Documented/updated all props, events, slots, parts, etc with JSDoc.
  - [ ] Ran the `analyze` command to update Storybook docs.
- [ ] Added/updated Stories with controls to cover all variants.
- [ ] Ran `test` locally to address any failures.
- [ ] Added/updated the Figma link for the Story's Design tab.
- [ ] Added any new component exports to the src/index.ts file

## Testing Instructions

<concrete steps for a reviewer/tester to validate the change>

## Screenshots

(if any)
```
````

## Rules for findings

- Every finding cites **`file:line`** (or a range) and names the rule from
  `10`/`20` it relates to.
- Prefer a **concrete fix** (a snippet or a precise instruction) over a vague concern.
- Order findings by **priority (P0 → P3)**, highest first, and emit **one standalone block
  per item** so each maps cleanly to a single review comment — never bundle issues. If there
  are no P0 (Critical/BREAKING) items, say so explicitly.
- Keep judgment calls in their own section and defer the final decision to the human —
  do not block a PR on taste.
- **Confirm** items are not defects: surface them, but they do **not** drive a "Request
  changes" verdict on their own. Reserve "Request changes" for Critical/BREAKING/Major
  defects; if the only open items are confirmations, the verdict is "Approve with comments."
- **Respect stated maintainer intent.** If the author has confirmed a choice (e.g., an
  intentional non-releasing commit type), accept it and don't re-flag it.
- If the diff was incomplete, state exactly what you could and couldn't assess.

## PR description rules

Every review ends with the **Proposed PR description** section — a copy-paste block the
author can paste straight into the PR.

- **Structure:** use the repo's `.github/pull_request_template.md` when present (read it —
  it is the source of truth); otherwise use the embedded template above. Keep every heading.
- **Wrap it in a ` ```markdown ` fenced block** so it renders with a copy button and pastes
  as raw markdown.
- **Summary:** render as a **bulleted list (3–6 short, scannable bullets), never a single
  paragraph** — lead with the most important change, one idea per bullet. Do this even when
  the repo template shows a prose placeholder; the reader should be able to skim it at a glance.
- **Notes / Testing Instructions:** fill from your review — concise, specific, derived from
  the actual diff. Notes should bullet the substantive changes.
- **To Do:** list this review's unresolved findings (e.g., "run `analyze`", "add a
  regression test"); use "None" if clean.
- **Checklist — tick honestly from evidence only.** Check items the diff/repo objectively
  shows: JSDoc present, `custom-elements.json`/`analyze` updated, stories with controls
  added, exports added to `src/index.ts`, Conventional Commits used, breaking changes noted.
  Leave **author-only / process** items unchecked for the human — never tick "Ran `test`
  locally" or "Added the Figma link," which you cannot verify.
- **Links (ADO/GitHub issue, Figma):** fill only if referenced in the PR/diff; otherwise
  leave `N/A` or `<add link>`. Never invent a link.
