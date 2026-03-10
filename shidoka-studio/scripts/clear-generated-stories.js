#!/usr/bin/env node
/**
 * Clears generated Storybook page stories in the shidoka-applications repo only.
 *
 * Scope (shidoka-applications only):
 * - Clears src/stories/pages/generated/ (dev-only Storybook stories for testing).
 * - Clears src/stories/generated/ (alternate output location for generated page stories).
 * - Also removes any story files in src/stories/pages/ that have title: 'Generated/...'
 *   (misplaced generated stories; canonical hand-authored page stories use other titles).
 * - Run before dev and on pre-push in this repo only.
 *
 * Production plugin behavior:
 * - This script lives only in the design-system repo; it is not part of the published
 *   Shidoka Studio package.
 * - When developers use Shidoka Studio in their own apps, the plugin never clears or
 *   touches their generated files (.ts, .js, .vue, .tsx, etc.). Those developers are
 *   responsible for managing their own files.
 * - The script explicitly checks package.json name; if not @kyndryl-design-system/
 *   shidoka-applications, it exits without clearing anything.
 */
import { readdirSync, rmSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const PAGES_DIR = join(ROOT, 'src', 'stories', 'pages');
const PAGES_GENERATED_DIR = join(PAGES_DIR, 'generated');
const STORIES_GENERATED_DIR = join(ROOT, 'src', 'stories', 'generated');

const DS_PACKAGE_NAME = '@kyndryl-design-system/shidoka-applications';

/** Match meta.title that starts with Generated/ (identifies Shidoka Studio–generated stories). */
const GENERATED_TITLE_RE = /title:\s*['"]Generated\//;

function isShidokaApplicationsRepo() {
  const pkgPath = join(ROOT, 'package.json');
  if (!existsSync(pkgPath)) return false;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    return pkg.name === DS_PACKAGE_NAME;
  } catch {
    return false;
  }
}

function isGeneratedStoryFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    return GENERATED_TITLE_RE.test(content);
  } catch {
    return false;
  }
}

if (!isShidokaApplicationsRepo()) {
  console.warn(
    'clear-generated-stories: Skipping (not in @kyndryl-design-system/shidoka-applications repo).'
  );
  process.exit(0);
}

let cleared = false;

function clearGeneratedDir(dir, label) {
  if (!existsSync(dir)) return false;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    rmSync(join(dir, e.name), { recursive: true });
  }
  console.log('Cleared ' + label);
  return true;
}

try {
  // 1. Clear src/stories/pages/generated/
  if (clearGeneratedDir(PAGES_GENERATED_DIR, 'src/stories/pages/generated/')) {
    cleared = true;
  }

  // 2. Clear src/stories/generated/ (alternate location for generated page stories)
  if (clearGeneratedDir(STORIES_GENERATED_DIR, 'src/stories/generated/')) {
    cleared = true;
  }

  // 3. Remove any story files in src/stories/ (top level) that have title: 'Generated/...' (misplaced)
  const STORIES_DIR = join(ROOT, 'src', 'stories');
  if (existsSync(STORIES_DIR)) {
    const entries = readdirSync(STORIES_DIR, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (!/\.stories\.(js|ts|jsx|tsx)$/.test(e.name)) continue;
      const filePath = join(STORIES_DIR, e.name);
      if (isGeneratedStoryFile(filePath)) {
        rmSync(filePath);
        console.log('Removed generated story: src/stories/' + e.name);
        cleared = true;
      }
    }
  }

  // 4. Remove any story files in pages/ that have title: 'Generated/...' (misplaced generated)
  if (existsSync(PAGES_DIR)) {
    const entries = readdirSync(PAGES_DIR, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (!/\.stories\.(js|ts|jsx|tsx)$/.test(e.name)) continue;
      const filePath = join(PAGES_DIR, e.name);
      if (isGeneratedStoryFile(filePath)) {
        rmSync(filePath);
        console.log('Removed generated story: src/stories/pages/' + e.name);
        cleared = true;
      }
    }
  }

  if (!cleared) {
    console.log('clear-generated-stories: No generated stories to clear.');
  }
} catch (err) {
  if (err.code === 'ENOENT') {
    process.exit(0);
  }
  console.error('clear-generated-stories:', err.message);
  process.exit(1);
}
