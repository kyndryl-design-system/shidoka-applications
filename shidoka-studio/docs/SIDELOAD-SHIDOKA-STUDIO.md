# Packaging Shidoka Studio for Sideloading into Another Local Cursor Project

This doc describes how to **package** and **sideload** Shidoka Studio so another local Cursor project (e.g. a Vue app) can use the `get_shidoka_design_context` MCP tool without publishing to npm.

---

## 1. Build the package (do this first)

From the **shidoka-applications** repo root:

```bash
npm run build:shidoka-studio
```

This:

- Runs `generate-component-registry` (if needed) and fills `shidoka-studio/context-src/`
- Copies context into `shidoka-studio/context/` and `packages/@kyndryl-design-system/shidoka-studio/context/`
- Copies `shidoka-studio/server/index.js` and `context-loader.js` into `packages/@kyndryl-design-system/shidoka-studio/bin/`

The **sideloadable artifact** is **`packages/@kyndryl-design-system/shidoka-studio/`**: it contains `bin/server.js`, `bin/context-loader.js`, and `context/` (markdown files). The server resolves `../context` relative to itself, so that folder layout must stay intact.

---

## 2. Sideload options

Pick one of the following. The **other project** is the Cursor project where you want to use Shidoka Studio (e.g. a Vue app).

### Option A: Path reference (no copy, no install)

**Other project** points Cursor at the built server via a path. No packaging step beyond the build above.

**In the other project’s `.cursor/mcp.json`:**

```json
{
  "mcpServers": {
    "shidoka-studio": {
      "command": "node",
      "args": [
        "/absolute/path/to/shidoka-applications/packages/@kyndryl-design-system/shidoka-studio/bin/server.js"
      ],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

Or, if the other project is a **sibling** of shidoka-applications:

```json
"args": ["../shidoka-applications/packages/@kyndryl-design-system/shidoka-studio/bin/server.js"]
```

**Pros:** No copy, always uses latest after `npm run build:shidoka-studio`.  
**Cons:** Other project must have access to the shidoka-applications repo (same machine or mounted path).

---

### Option B: Local `file:` dependency (npm install from path)

**Other project** installs the built package from the local path. Good if you want `node_modules` and optional scripts in the other project.

1. **Build** (as in section 1).

2. **In the other project:**

   ```bash
   npm install file:/path/to/shidoka-applications/packages/@kyndryl-design-system/shidoka-studio
   ```

   Example (sibling repo):

   ```bash
   npm install file:../shidoka-applications/packages/@kyndryl-design-system/shidoka-studio
   ```

3. **In the other project’s `.cursor/mcp.json`:**

   ```json
   {
     "mcpServers": {
       "shidoka-studio": {
         "command": "node",
         "args": [
           "./node_modules/@kyndryl-design-system/shidoka-studio/bin/server.js"
         ],
         "cwd": "${workspaceFolder}"
       }
     }
   }
   ```

   Or use the bin:

   ```json
   "command": "npx",
   "args": ["-y", "@kyndryl-design-system/shidoka-studio"],
   "cwd": "${workspaceFolder}"
   ```

**Pros:** Other project is self-contained (has its own copy of the package); works offline once installed.  
**Cons:** To get context updates you must run `npm run build:shidoka-studio` in shidoka-applications and then re-run the `npm install file:...` in the other project (or use a monorepo link).

---

### Option C: Pack a tarball and install

Useful for sharing a snapshot (e.g. one-off handoff or CI artifact).

1. **Build** (as in section 1).

2. **Create a tarball** (from shidoka-applications repo root):

   ```bash
   cd packages/@kyndryl-design-system/shidoka-studio
   npm pack
   ```

   This creates something like `kyndryl-design-system-shidoka-studio-1.0.0.tgz`.

3. **In the other project**, install that file:

   ```bash
   npm install /path/to/kyndryl-design-system-shidoka-studio-1.0.0.tgz
   ```

   Or copy the `.tgz` into the other project and:

   ```bash
   npm install ./kyndryl-design-system-shidoka-studio-1.0.0.tgz
   ```

4. **In the other project’s `.cursor/mcp.json`**, same as Option B (use `node_modules` path or `npx -y @kyndryl-design-system/shidoka-studio`).

**Pros:** Single file to move or archive; versioned snapshot.  
**Cons:** Updating context requires repacking and reinstalling.

---

### Option D: Copy the built folder into the other project

You don’t use npm in the other project; you just copy the built package in.

1. **Build** (as in section 1).

2. **Copy** the entire `packages/@kyndryl-design-system/shidoka-studio` folder into the other project, e.g.:

   ```bash
   cp -R /path/to/shidoka-applications/packages/@kyndryl-design-system/shidoka-studio /path/to/other-project/shidoka-studio-sideload
   ```

3. **In the other project’s `.cursor/mcp.json`:**

   ```json
   {
     "mcpServers": {
       "shidoka-studio": {
         "command": "node",
         "args": ["./shidoka-studio-sideload/bin/server.js"],
         "cwd": "${workspaceFolder}"
       }
     }
   }
   ```

**Pros:** Other project has no dependency on the shidoka-applications repo path.  
**Cons:** You must re-copy after rebuilding; the other project’s `package.json` doesn’t track this dependency.

---

## 3. Checklist

| Step | Action                                                                                        |
| ---- | --------------------------------------------------------------------------------------------- |
| 1    | In **shidoka-applications**: `npm run build:shidoka-studio`                                   |
| 2    | Choose A, B, C, or D above and configure the **other project** (path, `npm install`, or copy) |
| 3    | In the other project: add or edit `.cursor/mcp.json` with the correct `command` and `args`    |
| 4    | Reload Cursor in the other project so the MCP server is picked up                             |

---

## 4. Optional: Override context source

If you want the server to read context from a different folder (e.g. latest from `context-src` without rebuilding the package), set **SHIDOKA_STUDIO_CONTEXT_PATH** in the environment Cursor uses for MCP. The folder must contain at least:

- `considerations.md`
- `component-registry.md` (or `design-system-context.md`)
- `page-template-builder.md`

Example (path to in-repo context):

```bash
export SHIDOKA_STUDIO_CONTEXT_PATH="/path/to/shidoka-applications/shidoka-studio/context"
```

Then start Cursor (or run the MCP server) with that env set. The server will use this folder instead of its bundled `../context`.
