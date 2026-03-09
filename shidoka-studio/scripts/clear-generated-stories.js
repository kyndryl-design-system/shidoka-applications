#!/usr/bin/env node
/**
 * Clears Shidoka Studio generated page stories in the shidoka-applications (DS) repo.
 * Generated stories go in src/stories/pages/generated/ and are for testing only.
 * Run before dev and on pre-push. Only this subfolder is cleared; canonical page
 * stories (e.g. in src/stories/pages/) are left intact.
 *
 * When Shidoka Studio is used as a package/extension by external devs, this script
 * must not clear anything in their repo. It only runs in the DS repo (checks
 * package.json name) and only clears src/stories/pages/generated/.
 */
import { readdirSync, rmSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const GENERATED_DIR = join(ROOT, 'src', 'stories', 'pages', 'generated');

const DS_PACKAGE_NAME = '@kyndryl-design-system/shidoka-applications';

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

if (!isShidokaApplicationsRepo()) {
  process.exit(0);
}

try {
  if (!existsSync(GENERATED_DIR)) {
    process.exit(0);
  }
  const entries = readdirSync(GENERATED_DIR, { withFileTypes: true });
  for (const e of entries) {
    const path = join(GENERATED_DIR, e.name);
    rmSync(path, { recursive: true });
  }
  console.log('Cleared src/stories/pages/generated/');
} catch (err) {
  if (err.code === 'ENOENT') {
    process.exit(0);
  }
  console.error('clear-generated-stories:', err.message);
  process.exit(1);
}
