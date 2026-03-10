# Shidoka Studio removal checklist (shidoka-applications)

Shidoka Studio now lives in a **standalone repo** (`shidoka-studio`). Use this checklist to remove studio-related code from shidoka-applications so the apps repo only contains the design system (components, Storybook, CEM).

## 1. Delete folders

- [ ] **`shidoka-studio/`** (entire directory at repo root — server, scripts, content, docs, cursor-examples, etc.)
- [ ] **`packages/@kyndryl-design-system/shidoka-studio/`** (built package; publishing will happen from the standalone repo)

## 2. Root `package.json` — scripts and deps

**Done:** These script entries were removed: `shidoka-studio`, `generate-component-registry`, `test:shidoka-studio`, `build:shidoka-studio`, `bundle:sideload`. The devDependency `@modelcontextprotocol/sdk` was removed (only used by the studio server).

**Kept:** `"clear:generated-stories"` — it’s specific to this repo’s Storybook layout (clears generated page stories under `src/stories/`). The script was **migrated** from `shidoka-studio/scripts/clear-generated-stories.js` to **`scripts/clear-generated-stories.js`** at repo root, and the package.json script is now `"node scripts/clear-generated-stories.js"`. No need to migrate this to the shidoka-studio repo; it belongs here.

**Keep** `"analyze"` — it generates `custom-elements.json` for the design system; the standalone studio reads that file when the two repos are siblings.

## 3. Vitest — remove shidoka-studio project

In **`vitest.config.ts`**, remove the entire project block:

```ts
{
  extends: true,
  test: {
    name: 'shidoka-studio',
    include: ['shidoka-studio/**/*.test.js'],
    environment: 'node',
  },
},
```

## 4. ESLint — remove shidoka-studio paths

In **`.eslintrc.json`**, remove or adjust any `files` / overrides that reference:

- `shidoka-studio/scripts/**/*.js`
- `shidoka-studio/server/**/*.js`
- `shidoka-studio/__tests__/**/*.js`
- `packages/@kyndryl-design-system/shidoka-studio/bin/**/*.js`

## 5. GitHub Actions — remove Build_Shidoka_Studio and studio test step

In **`.github/workflows/build.yml`**:

- [ ] Remove the entire **`Build_Shidoka_Studio`** job (lines ~52–68).
- [ ] In the **Test** job, remove the step: **"Run Shidoka Studio tests"** (`npm run test:shidoka-studio`).

## 6. Cursor MCP config (optional)

**`.cursor/mcp.json`** currently points at `shidoka-studio/server/index.js` inside the apps repo. After removal:

- **Option A:** Remove the `shidoka-studio` MCP block from this repo (use the standalone repo or an installed package when you need the server).
- **Option B:** Point at the standalone repo when both are siblings (e.g. `~/Developer/Shidoka/{shidoka-applications, shidoka-studio}`):
  ```json
  "shidoka-studio": {
    "command": "node",
    "args": ["../shidoka-studio/bin/server.js"],
    "cwd": "${workspaceFolder}"
  }
  ```
  Run `npm run build` in the standalone repo first so `bin/server.js` exists.

## 7. Docs / audit files (optional)

- Update or remove **`AUDIT-NON-SHIDOKA-STUDIO-CHANGES.md`** if it references the in-repo studio.
- Remove or update any other docs that say “run `npm run build:shidoka-studio` in shidoka-applications”.

---

After this, **shidoka-applications** only owns: components, Storybook, CEM (`npm run analyze`), and design-system tooling. **shidoka-studio** is developed and published from its own repo.
