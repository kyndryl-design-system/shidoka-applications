#!/usr/bin/env node
/**
 * Clears generated Storybook page stories in the shidoka-applications repo only.
 *
 * Scope (shidoka-applications only):
 * - Clears src/stories/pages/generated/ (dev-only Storybook stories for testing).
 * - Clears src/stories/generated/ (alternate output location for generated page stories).
 * - Removes any .stories.* files that are direct children of src/stories/pages/ (so that
 *   generated pages placed in pages/ instead of pages/generated/ are cleared; PAGES sidebar stays clean).
 *
 * Run: npm run clear:generated-stories (from repo root).
 *
 * Note: Shidoka Studio is now a separate repo. When developers use Shidoka Studio in their
 * own apps, the plugin never clears or touches their generated files. This script is only
 * for the design-system repo's Storybook layout.
 */
import { readdirSync, rmSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PAGES_DIR = join(ROOT, 'src', 'stories', 'pages');
const PAGES_GENERATED_DIR = join(PAGES_DIR, 'generated');
const STORIES_GENERATED_DIR = join(ROOT, 'src', 'stories', 'generated');

const DS_PACKAGE_NAME = '@kyndryl-design-system/shidoka-applications';
const STORY_EXT_RE = /\.stories\.(js|ts|jsx|tsx)$/;

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

console.log(
  'clear-generated-stories: Clearing all generated Storybook pages...'
);

function clearGeneratedDir(dir, label) {
  if (!existsSync(dir)) return false;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    rmSync(join(dir, e.name), { recursive: true });
  }
  console.log('clear-generated-stories: Cleared ' + label);
  return true;
}

function removeStoryFilesInDir(dir, label) {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile() || !STORY_EXT_RE.test(e.name)) continue;
    const filePath = join(dir, e.name);
    rmSync(filePath);
    console.log('clear-generated-stories: Removed ' + label + e.name);
  }
}

try {
  // 1. Clear src/stories/pages/generated/ (all contents)
  clearGeneratedDir(PAGES_GENERATED_DIR, 'src/stories/pages/generated/');

  // 2. Clear src/stories/generated/ (alternate location)
  clearGeneratedDir(STORIES_GENERATED_DIR, 'src/stories/generated/');

  // 3. Remove story files in src/stories/ (top level) with title 'Generated/...'
  const STORIES_DIR = join(ROOT, 'src', 'stories');
  if (existsSync(STORIES_DIR)) {
    const entries = readdirSync(STORIES_DIR, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile() || !STORY_EXT_RE.test(e.name)) continue;
      const filePath = join(STORIES_DIR, e.name);
      if (isGeneratedStoryFile(filePath)) {
        rmSync(filePath);
        console.log('clear-generated-stories: Removed src/stories/' + e.name);
      }
    }
  }

  // 4. Remove every .stories.* file directly in src/stories/pages/ (ensures PAGES sidebar is clean)
  removeStoryFilesInDir(PAGES_DIR, 'src/stories/pages/');

  // Ensure pages/generated exists for next generation (empty dir is fine)
  if (!existsSync(PAGES_GENERATED_DIR)) {
    mkdirSync(PAGES_GENERATED_DIR, { recursive: true });
    console.log(
      'clear-generated-stories: Created src/stories/pages/generated/'
    );
  }

  console.log(
    'clear-generated-stories: Done. All generated pages cleared; PAGES sidebar will be empty until you generate again.'
  );
  process.exit(0);
} catch (err) {
  if (err.code === 'ENOENT') {
    process.exit(0);
  }
  console.error('clear-generated-stories:', err.message);
  process.exit(1);
}
