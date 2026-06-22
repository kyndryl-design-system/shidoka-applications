# Shidoka Code-Review Skills

This folder holds the **agent/skill-based code-review tools** for
`@kyndryl-design-system/shidoka-applications`. It is the home Cursor loads skills from
(`.cursor/skills/<name>/SKILL.md`), so this README is the front door for any Shidoka dev
who wants an AI reviewer to look at their work **before** it hits CI and human review.

> **Platform focus:** these instructions assume you're working in **Cursor**, since that's
> where Shidoka development is converging. The same review logic is wired up for other
> platforms too (see [Other platforms](#other-platforms-same-brain-different-door)), but if
> you're in Cursor, everything you need is here.

---

## The two skills, at a glance

| Skill                                                                                 | What it checks                                                                                                                                                                                                       | When to reach for it                                                        | Auto-invoked?                                         |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`shidoka-pr-review`](./shidoka-pr-review/SKILL.md)                                   | **Correctness _for the design system_:** public-API/semver breaking changes, design tokens, accessibility, component contract (`kyn-*`, decorators, events/slots/parts), manifest drift, Conventional Commits + DCO. | Every PR. The default "is this safe to ship to downstream consumers?" pass. | **Yes** — just ask for a review.                      |
| [`thermo-nuclear-code-quality-review`](./thermo-nuclear-code-quality-review/SKILL.md) | **Structural quality:** abstraction quality, "code-judo" simplifications, files crossing ~1k lines, spaghetti conditionals, leaky boundaries, needless casts/optionality. Design-system-agnostic.                    | Larger refactors, or any change that "works but feels messy."               | **No** — opt-in only; you must explicitly ask for it. |

**They are complementary, not redundant.** `shidoka-pr-review` deliberately treats internal
structure/readability as _non-blocking suggestions_; `thermo-nuclear` escalates exactly
those into first-class findings. Run the first on every PR; add the second when structure
matters. See [When to use which](#when-to-use-which).

---

## Using them in Cursor

### Run `shidoka-pr-review` (the everyday reviewer)

It's model-invokable, so you just ask in the Cursor chat. Natural prompts that trigger it:

- `Review my current branch against Shidoka standards.`
- `Do a Shidoka PR review of PR #123.`
- `Check these changes for breaking changes / token misuse / a11y issues.`

What it does:

1. Reads the canonical kit at the repo root (`review-kit/00`→`40`).
2. Resolves the target and gets the diff:
   - **PR id/URL given** → that PR (`gh pr diff <id>` against its base branch).
   - **Nothing specified (default)** → current branch vs `main`
     (`git diff --merge-base origin/main HEAD`), with uncommitted changes noted separately.
3. Runs **breaking-change detection** every time (this is what protects the auto-release).
4. Consults ground truth — `custom-elements.json`, `src/index.ts`, foundation tokens —
   instead of guessing.
5. Returns a structured review: verdict first, then **one standalone block per finding**
   tagged `P0`–`P3`, ending with a copy-paste PR description.

If an open PR exists and `gh` is authenticated, it can offer to post each `P0`–`P3` item as
a separate PR comment; otherwise the blocks are copy-paste ready.

### Run `thermo-nuclear-code-quality-review` (the deep structural pass)

This skill sets `disable-model-invocation: true`, so it will **not** fire on its own — that's
intentional. It's a deliberately harsh pass you opt into. Invoke it explicitly:

- `Run the thermo-nuclear code quality review on my branch.`
- `Do a thermonuclear / deep maintainability audit of these changes.`

It pushes hard for ambitious, behavior-preserving restructurings: deleting whole branches or
layers, decomposing files before they sprawl past 1k lines, and replacing ad-hoc conditionals
with cleaner models. Expect a small number of high-conviction structural comments rather than
a long list of nits.

### A good two-pass workflow

1. **Before opening a PR**, ask for a `shidoka-pr-review` of your branch. Fix the `P0`/`P1`s.
2. **For a meaningful refactor or new component**, follow up with the `thermo-nuclear` pass
   to catch structural debt the first pass intentionally leaves as soft suggestions.
3. Open the PR using the generated PR description. **Bugbot** (below) is the automated
   backstop once the PR exists.

---

## When to use which

- **Just want it to be safe to merge?** → `shidoka-pr-review`. It owns the things that
  auto-release straight to consumers: breaking changes, tokens, accessibility, the manifest.
- **Want it to also be _well-built_?** → add `thermo-nuclear`. It owns architecture and
  maintainability, and is repo-agnostic (no Shidoka knowledge baked in).
- **Not sure?** Start with `shidoka-pr-review`. Reach for `thermo-nuclear` if the diff is
  large, touches a shared base/mixin, or you sense the implementation got tangled.

---

## How this fits the rest of the review system

These skills are **Cursor adapters** over a single source of truth, the `review-kit/` at the
repo root. Don't duplicate review rules here — edit the kit, and every platform follows.

- `review-kit/00-reviewer-system-prompt.md` — reviewer persona.
- `review-kit/10-design-system-knowledge.md` — the authoring contract.
- `review-kit/20-review-rubric.md` — the senior checklist & workflow.
- `review-kit/30-breaking-change-detection.md` — run on every review.
- `review-kit/40-review-output-format.md` — the exact output structure.

(`thermo-nuclear` is the exception: it's self-contained and intentionally domain-agnostic, so
it lives entirely in its own `SKILL.md` rather than in the kit.)

## Other platforms (same brain, different door)

The same `review-kit/` powers every platform, so reviews stay consistent no matter who runs them:

| Platform                | Entry point                                       | How it loads                                |
| ----------------------- | ------------------------------------------------- | ------------------------------------------- |
| **Cursor**              | `.cursor/skills/shidoka-pr-review/` (this folder) | Ask for a review in chat.                   |
| **Cursor Bugbot**       | `.cursor/BUGBOT.md`                               | Automated review once a PR is open.         |
| **GitHub Copilot**      | `.github/copilot-instructions.md`                 | Auto-loaded into Copilot Chat.              |
| **Claude (Code / API)** | `CLAUDE.md`                                       | Auto-loaded; also usable as a Claude Skill. |
| **Any model / CI**      | `review-kit/00-reviewer-system-prompt.md`         | Use as the system prompt; attach `10`–`40`. |

---

## Adding or editing a skill

- A skill is a folder here with a `SKILL.md` whose front matter has a `name` and a
  `description` (the `description` is what Cursor matches on to auto-invoke it). Set
  `disable-model-invocation: true` when a skill should only run when explicitly requested.
- **Keep design-system review rules in `review-kit/`, not in a skill.** Skills should be thin
  pointers that load the kit, so the four platform adapters never drift apart.
- After changing a skill's `description`, sanity-check that the prompts you expect to trigger
  it actually do (and that ones you _don't_ want triggering it don't).
