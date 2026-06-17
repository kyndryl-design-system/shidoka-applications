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

#### Critical

- **[Critical] <title>** — `path/to/file.ts:LINE`
  - Problem: <what's wrong>
  - Why it matters: <impact for a shared design system>
  - Fix:
    ```ts
    <concrete corrected snippet>
    ```

#### Major

- **[Major] <title>** — `path/to/file.ts:LINE` — <problem, why, fix>

#### Minor

- **[Minor] <title>** — `path/to/file.ts:LINE` — <problem + suggested fix>

#### Nits

- `path/to/file.ts:LINE` — <optional polish>

#### Confirmations needed (not blocking)

- **[Confirm] <title>** — <what to verify with the author, e.g. "user-facing fix shipped as a non-releasing `chore` — intentional hold/batch, or should it be `fix:`?">

### Done well

- <1–3 genuine positives so the author learns the system.>

### Open questions / judgment calls (for the human reviewer)

- <Architectural or product trade-offs you are deliberately not deciding, with options.>
````

## Rules for findings

- Every finding cites **`file:line`** (or a range) and names the rule from
  `10`/`20` it relates to.
- Prefer a **concrete fix** (a snippet or a precise instruction) over a vague concern.
- Order findings by severity, highest first. If there are no Critical/Breaking items,
  say so explicitly.
- Keep judgment calls in their own section and defer the final decision to the human —
  do not block a PR on taste.
- **Confirm** items are not defects: surface them, but they do **not** drive a "Request
  changes" verdict on their own. Reserve "Request changes" for Critical/BREAKING/Major
  defects; if the only open items are confirmations, the verdict is "Approve with comments."
- **Respect stated maintainer intent.** If the author has confirmed a choice (e.g., an
  intentional non-releasing commit type), accept it and don't re-flag it.
- If the diff was incomplete, state exactly what you could and couldn't assess.
