# Breaking-Change Detection

**Run this on every review.** Shidoka ships to many downstream applications via
semantic-release, so a breaking change that isn't declared as one will auto-publish and
break consumers. Detecting these and **alerting the author** is the highest-value job of
this reviewer.

A change is **breaking (MAJOR)** if it removes or alters any part of the public API that
a consumer could depend on. The public API surface is: package exports, custom-element
tag names, attributes/properties, custom events, slots, CSS shadow parts, themeable CSS
custom properties, and the documented behavior/defaults of all of the above.

---

## Workflow

```
Breaking-change scan:
- [ ] A. Diff the public API surface against the base branch
- [ ] B. Classify each change (none / patch / minor / MAJOR)
- [ ] C. Cross-check the declared commit type / PR semver intent
- [ ] D. Emit a Breaking-Change Report (and a top-of-review alert if MAJOR)
```

### A. Diff the public API surface

Prefer real diffs over eyeballing. If you have shell access, compute them against the
PR's base branch (substitute `origin/main` with `origin/beta`, `origin/next`, or the
`N.x` line as appropriate):

```bash
# Make sure the base is available, then diff against the merge-base.
git fetch origin

# 1. Package export surface — removed/renamed exports are breaking.
git diff --merge-base origin/main -- src/index.ts

# 2. Option/enum vocabularies — removed/renamed enum values are breaking.
git diff --merge-base origin/main -- 'src/**/defs.ts'

# 3. The authoritative public-API manifest (attributes, props, events, slots,
#    CSS parts, CSS custom properties for every component).
git diff --merge-base origin/main -- custom-elements.json

# 4. Component sources — focus on decorators, JSDoc surface tags, and event names.
git diff --merge-base origin/main -- 'src/components/**/*.ts'
```

If you cannot run git (e.g., you were handed only a patch or file list), inspect the
provided diff for the same signals and state that detection was limited to the supplied
context.

`custom-elements.json` is the richest signal: a removed entry under a component's
`attributes`, `members`, `events`, `slots`, `cssParts`, or `cssProperties` is almost
always breaking. **Note also the inverse:** if a component's source clearly changed its
public API but `custom-elements.json` did **not** change, the author forgot to run
`npm run analyze` — flag the manifest drift.

**Surface vs. behavior.** The diffs above catch _structural_ breaks (removed/renamed
API). They will **not** show **behavioral** changes to existing props, events, or
defaults — e.g., a prop that now interacts differently with another prop, a changed
default, or reworked event-firing conditions. Always read the changed `render`,
event-handler, and lifecycle logic and reason about runtime behavior, not just the
surface diff.

### B. Classify each change

| Change                                                                              | Severity                                                                              |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Removed/renamed export from `src/index.ts`                                          | **MAJOR**                                                                             |
| Removed/renamed custom element tag (`kyn-*`)                                        | **MAJOR**                                                                             |
| Removed/renamed `@property` (attribute/prop)                                        | **MAJOR**                                                                             |
| Changed a property's type in an incompatible way, or narrowed accepted values       | **MAJOR**                                                                             |
| Removed/renamed enum value used by a public prop (e.g., a `kind`)                   | **MAJOR**                                                                             |
| Renamed/removed a slot, CSS part, or themeable CSS custom property                  | **MAJOR**                                                                             |
| Renamed/removed a custom event, or changed its `detail` shape                       | **MAJOR**                                                                             |
| Changed a default value or default behavior consumers rely on                       | **MAJOR** (usually)                                                                   |
| Changed runtime behavior/interaction of an existing prop, no surface change         | **PATCH** (`fix`) if backward compatible; **MAJOR** if consumers rely on old behavior |
| DOM structure change that breaks documented `part`/selector targeting               | **MAJOR**                                                                             |
| Added a **new required** property/attribute (no safe default)                       | **MAJOR**                                                                             |
| Added a new optional property/event/slot/part (backward compatible)                 | **MINOR** (`feat`)                                                                    |
| Bug fix with no public-API change                                                   | **PATCH** (`fix`)                                                                     |
| Internal-only change (underscore/`@internal` members, private methods, build, docs) | none / non-releasing                                                                  |

Renames are **two** events (a removal + an addition) — treat the removal as breaking
even when an alias is added, unless the old name is kept and deprecated.

### C. Cross-check the declared intent

- A **MAJOR** change must ship as `feat!:` / `fix!:` (or include a `BREAKING CHANGE:`
  footer). A breaking change declared as a bare `fix:` or `feat:` is a
  **critical defect** — it will mis-version the release.
- A **new feature** (new optional API) should be a `feat:` (minor), not a `fix:`.
- Internal-only changes shouldn't claim `feat`/`fix` that trigger an unintended release.
- **The inverse is a _confirm_, not a hard defect:** a user-facing bug fix or behavior
  change shipped as a non-releasing type (`chore`, `refactor`, `style`) won't release or
  appear in the changelog. This is **often an intentional maintainer choice** (batching,
  holding for a coordinated release, or a not-yet-consumed component). Surface it as a
  confirmation — "non-releasing type for a user-facing change; intentional?" — and accept
  a stated rationale. If it was unintentional, a behavioral fix should be `fix:` (patch).
- **Severity contrast (important):** _missing a release_ (a fix shipped as `chore`) is
  recoverable and often deliberate → **Confirm, non-blocking**. _Breaking consumers_ (a
  breaking change shipped without a major bump) actively corrupts semver downstream →
  **Critical, blocking**. Hold the hard line only on the latter.
- If the breaking change is intentional, confirm the PR documents the migration path
  (what consumers must change) and, where feasible, that a deprecation/alias was
  considered before outright removal.

### D. Emit the Breaking-Change Report

Always include this section in the review, even when nothing broke.

**When nothing breaks:**

```
### Breaking-change scan
No public-API breaking changes detected (export surface, custom-elements.json,
enums, events/slots/parts unchanged or only additive). Suggested semver: MINOR
(new optional `<x>` property) / PATCH / none.
```

**When something breaks — lead the review with this alert:**

```
> ## BREAKING CHANGE DETECTED
> This PR changes the public API in ways that will break downstream consumers.
>
> | What changed | File:line | Impact | Required action |
> |--------------|-----------|--------|-----------------|
> | Removed `kyn-button` `kind="content"` value | src/components/reusable/button/defs.ts:19 | Consumers using `kind="content"` break | Restore value, or document removal + bump MAJOR |
> | Renamed event `on-select` → `on-change` | src/components/reusable/dropdown/dropdown.ts:120 | Listeners on `on-select` stop firing | Keep `on-select` as deprecated alias, or bump MAJOR |
>
> Declared commit type: `feat:` (minor). **Required:** `feat!:` / `BREAKING CHANGE:` (major),
> or revise the change to remain backward compatible. The author must confirm this is intentional.
```

Be precise about _what_ broke and _why it matters to a consumer_, and give the author a
concrete choice: make it backward compatible (preferred — alias + deprecate) or declare
it as a major with a migration note.
