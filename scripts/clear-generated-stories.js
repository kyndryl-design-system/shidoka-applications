#!/usr/bin/env node
/**
 * Clears generated Storybook page stories in the shidoka-applications repo only.
 *
 * Canonical generated output:
 * - src/stories/generated/
 *
 * Stray cleanup only:
 * - src/stories/generated-pages/
 * - src/stories/pages/generated/
 * - top-level generated stories directly inside src/stories/
 * - direct child .stories.* files inside src/stories/pages/
 *
 * On every run, src/stories/generated/ is cleared and recreated as an empty
 * folder. This is the only valid generated-story location for this repo.
 * Generated page stories are ephemeral outputs and should not be treated as
 * canonical reference material.
 *
 * Run: npm run clear:generated-stories (from repo root).
 */
import { readdirSync, rmSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STORIES_DIR = join(ROOT, 'src', 'stories');
const GENERATED_PAGES_DIR = join(STORIES_DIR, 'generated-pages');
const PAGES_DIR = join(STORIES_DIR, 'pages');
const PAGES_GENERATED_DIR = join(PAGES_DIR, 'generated');
const STORIES_GENERATED_DIR = join(STORIES_DIR, 'generated');

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

function removeEntireDir(dir, label) {
  if (!existsSync(dir)) return false;
  rmSync(dir, { recursive: true });
  console.log('clear-generated-stories: Removed ' + label);
  return true;
}

try {
  // 1. Remove stray legacy src/stories/generated-pages/
  removeEntireDir(GENERATED_PAGES_DIR, 'src/stories/generated-pages/');

  // 2. Clear stray legacy src/stories/pages/generated/ (all contents)
  clearGeneratedDir(PAGES_GENERATED_DIR, 'src/stories/pages/generated/');

  // 3. Remove entire src/stories/generated/ (canonical generated output)
  removeEntireDir(STORIES_GENERATED_DIR, 'src/stories/generated/');

  // 4. Remove story files in src/stories/ (top level) with title 'Generated/...'
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

  // 5. Remove every .stories.* file directly in src/stories/pages/ (ensures PAGES sidebar is clean)
  removeStoryFilesInDir(PAGES_DIR, 'src/stories/pages/');

  // Recreate canonical generated output dir so npm run dev is ready for new pages
  mkdirSync(STORIES_GENERATED_DIR, { recursive: true });
  console.log('clear-generated-stories: Created src/stories/generated/');

  console.log(
    'clear-generated-stories: Done. Generated story outputs cleared.'
  );
  process.exit(0);
} catch (err) {
  if (err.code === 'ENOENT') {
    process.exit(0);
  }
  console.error('clear-generated-stories:', err.message);
  process.exit(1);
}
