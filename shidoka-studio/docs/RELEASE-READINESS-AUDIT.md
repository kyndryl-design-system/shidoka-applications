# Shidoka Studio — Release Readiness Audit

**Date:** March 2025  
**Scope:** Shidoka Studio (MCP server, context generation, packaging, docs).  
**Conclusion:** Usable for internal/early release after addressing the items below. Not yet ready for unqualified “production” or public npm without fixes and CI alignment.

---

## 1. Summary

| Area                    | Status     | Notes                                                                                                            |
| ----------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| **Architecture & flow** | ✅ Clear   | ARCHITECTURE.md and scripts match actual behavior.                                                               |
| **Build & scripts**     | ✅ Working | `npm run build:shidoka-studio` runs successfully.                                                                |
| **MCP server**          | ✅ Solid   | Single tool, stdio, context resolution order documented and implemented.                                         |
| **Package layout**      | ✅ Ready   | `packages/@kyndryl-design-system/shidoka-studio` has correct `files`, bin, context.                              |
| **Documentation**       | ⚠️ Gaps    | One broken README reference; minor doc/script sync.                                                              |
| **CI / release**        | ❌ Missing | Shidoka Studio build not in CI; package context can be stale.                                                    |
| **Dependencies**        | ⚠️ Cleanup | Unused `zod` in package; MCP SDK version slight mismatch.                                                        |
| **Testing**             | ✅ Added   | Context loader tests in `shidoka-studio/__tests__/context-load.test.js`; run with `npm run test:shidoka-studio`. |

---

## 2. What’s in good shape

- **Single source of truth:** CEM → `generate-component-registry.js` → context-src → context + package. No duplicate definitions.
- **Context resolution:** `SHIDOKA_STUDIO_CONTEXT_PATH` → `SHIDOKA_STUDIO_CONTEXT_URL` → bundled context, with clear fallback message.
- **Publish guard:** `guard-publish.js` blocks publish to npmjs.org; safe for internal/private registry.
- **Docs:** ARCHITECTURE, CURSOR-MCP-WORKFLOW, PACKAGING-OPTIONS, PACKAGING-FOR-CONSUMERS, STYLING-FOR-CONSUMERS, and cursor-examples exist and are coherent.
- **In-repo usage:** `.cursor/mcp.json` and `.cursor/rules/shidoka-generation.mdc` are present; workflow is documented.

---

## 3. Issues to fix before release

### 3.1 Critical: README references non-existent CLI

**File:** `packages/@kyndryl-design-system/shidoka-studio/README.md`

**Issue:** The README says:

```text
npx shidoka-studio-setup
```

The package only exposes one bin: `shidoka-studio` (the MCP server). There is no `shidoka-studio-setup` script or binary.

**Options:**

- **A.** Remove the “Optional — auto-configure Cursor” sentence and the `npx shidoka-studio-setup` line; tell users to add the MCP block manually (as in the rest of the README).
- **B.** Add a real `shidoka-studio-setup` CLI (e.g. `bin/setup.js`) that creates/merges `.cursor/mcp.json` and optionally a rule file, and add it to `package.json` `bin`.

**Recommendation:** Option A for a quick release; Option B if you want one-command setup.

---

### 3.2 Critical: CI does not build Shidoka Studio

**File:** `.github/workflows/build.yml`

**Issue:** The workflow runs `npm run build`, `npm run build-storybook`, and tests. It does **not** run `npm run build:shidoka-studio`. As a result:

- `shidoka-studio/context/` and `packages/@kyndryl-design-system/shidoka-studio/context/` (and `bin/server.js`) are not guaranteed to be up to date in CI or on release branches.
- Anyone publishing from CI or a release script could ship stale context or an old server copy.

**Recommendation:** Add a job (or step) that runs `npm run build:shidoka-studio` after `npm run build` (or in the same job). Optionally, add a check that `packages/@kyndryl-design-system/shidoka-studio/context/` and `shidoka-studio/context-src/` are in sync (e.g. no uncommitted changes after build) if you want to enforce “context is always built before merge.”

---

### 3.3 Minor: Unused dependency and version alignment

**File:** `packages/@kyndryl-design-system/shidoka-studio/package.json`

**Issues:**

- **`zod`** is listed as a dependency but is not imported or used in `bin/server.js` (or anywhere in the package). Remove it unless you plan to use it soon (e.g. for validating tool input).
- **MCP SDK:** Root `package.json` has `@modelcontextprotocol/sdk: ^1.27.1`; `packages/@kyndryl-design-system/shidoka-studio` has `^1.27.0`. Align to the same range (e.g. `^1.27.1`) to avoid subtle version drift.

---

### 3.4 Minor: Documentation and path consistency

- **ARCHITECTURE.md** — Directory layout lists `scripts/generate-component-registry.js` and `scripts/build.js` but does not list `scripts/clear-generated-stories.js`. The “Root command” section correctly says the full build also clears generated stories. Consider adding `clear-generated-stories.js` to the directory tree for accuracy.
- **Generated output path** — `.cursor/rules/shidoka-generation.mdc` says “Write output to `src/stories/generated/`” for Storybook stories. `clear-generated-stories.js` only clears `src/stories/pages/generated/`. Decide the canonical path (e.g. `src/stories/pages/generated/` for page-level stories) and make the rule and script consistent; update the rule’s globs if needed (e.g. `src/stories/pages/generated/**/*.stories.js`).

---

## 4. Optional improvements (post–first release)

- **Tests:** ~~Add a small Node script or Vitest test~~ **Done:** Context loading is tested via `server/context-loader.js` (extracted from server) and `shidoka-studio/__tests__/context-load.test.js`; CI runs `npm run test:shidoka-studio`.
- **Cursor rule example:** The in-repo rule (`.cursor/rules/shidoka-generation.mdc`) is more detailed than `cursor-examples/shidoka-generation.mdc.example`. Consider syncing the example to the repo rule (or vice versa) so new adopters get the same behavior.
- **PACKAGING-FOR-CONSUMERS.md:** It currently says “Status: In development” and “no npm publish is configured yet.” When you enable publishing (e.g. to a private registry), update that status and add a one-line “Publishing” section pointing at the guard and your registry.

---

## 5. Release checklist (concise)

Before tagging or publishing Shidoka Studio as a release:

1. [x] Fix README: remove or implement `shidoka-studio-setup` (Section 3.1). — **Done:** reference removed.
2. [x] Add `npm run build:shidoka-studio` to CI (Section 3.2). — **Done:** `Build_Shidoka_Studio` job added.
3. [x] Remove unused `zod` from `packages/@kyndryl-design-system/shidoka-studio`; align MCP SDK version (Section 3.3). — **Done:** zod removed, SDK set to `^1.27.1`.
4. [x] Align generated-story path and rule globs (Section 3.4). — **Done:** rule and example use `src/stories/pages/generated/`.
5. [x] Add tests for context loading (Section 4). — **Done:** `server/context-loader.js` extracted, `shidoka-studio/__tests__/context-load.test.js` added; `test:shidoka-studio` and CI step added.
6. [ ] Run `npm run build:shidoka-studio` locally and confirm `packages/@kyndryl-design-system/shidoka-studio/context/` and `bin/server.js` are updated.
7. [ ] If publishing to a private registry: confirm `prepublishOnly` guard allows it (e.g. registry not npmjs.org) and document registry in README or PACKAGING-FOR-CONSUMERS.

---

## 6. Verdict

- **Internal / early release:** OK after fixing the README (3.1) and adding the Shidoka Studio build to CI (3.2). The rest can follow shortly.
- **General “release ready”:** After addressing 3.1–3.4 and, if desired, the optional items in Section 4.

The product and architecture are sound; the main risks are **stale or incorrect docs** (setup command) and **stale package context** if CI/release does not run the Shidoka Studio build.
