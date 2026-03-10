# Audit: Code modifications outside `shidoka-studio/` and `packages/shidoka-studio/`

**Scope:** All changes vs `main` that are not under `shidoka-studio/` or `packages/shidoka-studio/`.  
**Principle:** Everything works on main; only changes required for Shidoka Studio (or this PR’s stated scope) are justified.

---

## Justified (required for Shidoka Studio or this PR)

| Path                                                        | Change                                                                                                                                                                   | Justification                                                                                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **.cursor/mcp.json**                                        | New file: registers Shidoka Studio MCP server (node + shidoka-studio/server/index.js).                                                                                   | Needed so Cursor can run the Shidoka Studio MCP server in this repo.                                                                             |
| **.cursor/rules/shidoka-generation.mdc**                    | New file: rule to call `get_shidoka_design_context` when generating pages/templates.                                                                                     | Part of Shidoka Studio workflow; tells the agent when to use design context.                                                                     |
| **.eslintrc.json**                                          | Overrides for `shidoka-studio/scripts/**`, `server/**`, `__tests__/**`, `packages/shidoka-studio/bin/**` (node env).                                                     | So Shidoka Studio JS (scripts, server, tests) lint with Node globals; no component change.                                                       |
| **.github/workflows/build.yml**                             | New job `Build_Shidoka_Studio` (runs `npm run build:shidoka-studio`); new step “Run Shidoka Studio tests”; `VITE_STORY_UI_EDGE_URL` in Build_Storybook.                  | First two: ensure context and package are built and tests run in CI. Third: env for Storybook build (see “Unjustified” if not needed).           |
| **.gitignore**                                              | Add: `.env`, `shidoka-studio/context-src/`, `story-ui-docs/`, Shidoka Studio context files, `src/stories/pages/` (except README).                                        | Shidoka Studio: context is generated; generated page stories are ephemeral. Other entries may be local/convention.                               |
| **.husky/pre-push**                                         | New hook: `npm run clear:generated-stories`.                                                                                                                             | Prevents committing generated page stories when using Shidoka Studio.                                                                            |
| **package.json**                                            | Scripts: `shidoka-studio`, `clear:generated-stories`, `generate-component-registry`, `build:shidoka-studio`, `test:shidoka-studio`. DevDep: `@modelcontextprotocol/sdk`. | Required to build, run, and test Shidoka Studio from the repo.                                                                                   |
| **vitest.config.ts**                                        | New project `shidoka-studio` (include `shidoka-studio/**/*.test.js`, node env).                                                                                          | Runs Shidoka Studio context-loader tests.                                                                                                        |
| **src/stories/boilerplate/workspaceSwitcherBoilerplate.js** | New file: default workspace data + `setupWorkspaceSwitcher()`.                                                                                                           | Referenced by Shidoka Studio docs and generated page stories; canonical data/setup for workspace switcher.                                       |
| **.storybook/main.js**                                      | Stories globs limited to `src/components/**` and `src/stories/**` (no top-level `src/**`); minor vite comment/order.                                                     | Ensures Storybook includes `src/stories` (e.g. generated pages) without pulling unintended patterns; aligns with Shidoka Studio output location. |
| **.storybook/manager.js**                                   | `sidebar.collapsedRoots: ['components', 'ai', 'global-components']`.                                                                                                     | UX: expand “Generated” (or similar) by default for Shidoka Studio–generated stories.                                                             |

---

## Unjustified (revert to main)

These changes are **not** required for Shidoka Studio; main works without them.

| Path                                                         | Change                                                                 | Status                                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **src/common/scss/utility/gridstack-shidoka.scss**           | Import changed from `gridstack.scss` to `gridstack.css` + comment.     | **Reverted** to main.                                                    |
| **src/components/global/footer/footer.ts**                   | Default copyright slot content and JSDoc.                              | **Reverted** to main.                                                    |
| **src/components/global/header/headerLink.scss**             | `::slotted(span:first-child:not([slot]))` and `.arrow` flex/alignment. | **Reverted** to main.                                                    |
| **src/components/reusable/progressBar/** (ts, scss, stories) | New `hidePercentageValue`; status container and styling tweaks.        | **Reverted** to main.                                                    |
| **.storybook/preview-head.html**                             | `--kd-page-gutter` and `--kd-negative-page-gutter` values.             | **Reverted** to main.                                                    |
| **.npmrc**                                                   | New file: registry, strict-ssl, prefer-offline.                        | **Not on main.** Remove from repo if you want to match main exactly.     |
| **story-ui.config.js**                                       | New symlink to `story-ui/story-ui.config.js`.                          | **Remove** if present (Story UI; not Shidoka Studio).                    |
| **tsconfig.json**                                            | `jsx`, `jsxImportSource`, `skipLibCheck`, `types`, `include` tsx.      | **Reverted** to main.                                                    |
| **declarations.d.ts**                                        | React module and JSX declarations.                                     | **Reverted** to main.                                                    |
| **package.json** (deps only)                                 | Add: `react`, `react-dom`, `@types/react`, `@types/react-dom`, `zod`.  | **Reverted** (removed those deps).                                       |
| **.github/workflows/chromatic.yml**                          | `VITE_STORY_UI_EDGE_URL` env.                                          | **Reverted** (env block removed).                                        |
| **.github/workflows/deploy-storybook.yml**                   | `VITE_STORY_UI_EDGE_URL` env.                                          | **Reverted** (env block removed).                                        |
| **.github/workflows/build.yml**                              | `VITE_STORY_UI_EDGE_URL` in Build_Storybook.                           | **Reverted** (env removed); Build_Shidoka_Studio job and test step kept. |

---

## Leave as-is or treat separately

| Path                     | Note                                                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **custom-elements.json** | Generated by `npm run analyze`; can differ due to build/deps. Usually keep or regenerate from main branch components. |
| **package-lock.json**    | Lockfile; will change with any package.json or install. Keep consistent with package.json after reverts.              |
| **.story-ui-history/**   | Story UI state; often gitignored. Remove from commit or add to .gitignore if not already.                             |

---

## Summary

- **Keep:** All Shidoka Studio–specific config (Cursor, ESLint, CI build/test, gitignore, husky, package scripts + MCP SDK, vitest project), workspace switcher boilerplate, and Storybook story globs/sidebar that support generated stories.
- **Revert:** Footer, headerLink, gridstack, progressBar, Storybook preview-head tokens, .npmrc, story-ui.config.js, tsconfig React/jsx, declarations React, extra package.json deps (react, zod, etc.), VITE_STORY_UI_EDGE_URL in workflows.

After reverting the unjustified items, the only non–Shidoka-Studio changes remaining are those that are explicitly required to run and use Shidoka Studio in this repo.
