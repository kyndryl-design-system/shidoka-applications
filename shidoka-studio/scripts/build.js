#!/usr/bin/env node
/**
 * Builds Shidoka Studio (context + publishable package):
 * 1. Copies shidoka-studio/context-src/ → shidoka-studio/context/ (in-repo server context).
 * 2. Copies context-src/ → packages/@kyndryl-design-system/shidoka-studio/context/ and
 *    shidoka-studio/server/index.js → packages/@kyndryl-design-system/shidoka-studio/bin/server.js (publishable package).
 *
 * Run from repo root: npm run build:shidoka-studio (runs generate-component-registry first).
 */
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const CONTEXT_SRC = join(ROOT, 'shidoka-studio', 'context-src');
const SHIDOKA_STUDIO_CONTEXT = join(ROOT, 'shidoka-studio', 'context');
const PKG_CONTEXT = join(
  ROOT,
  'packages',
  '@kyndryl-design-system',
  'shidoka-studio',
  'context'
);
const SERVER_SOURCE = join(ROOT, 'shidoka-studio', 'server', 'index.js');
const CONTEXT_LOADER_SOURCE = join(
  ROOT,
  'shidoka-studio',
  'server',
  'context-loader.js'
);
const PKG_BIN = join(
  ROOT,
  'packages',
  '@kyndryl-design-system',
  'shidoka-studio',
  'bin',
  'server.js'
);
const PKG_BIN_DIR = dirname(PKG_BIN);

const FILES = [
  'considerations.md',
  'component-registry.md',
  'page-template-builder.md',
  'design-system-context.md',
  'component-api.json',
];

if (!existsSync(CONTEXT_SRC)) {
  console.error(
    'shidoka-studio/context-src/ not found. Run: npm run generate-component-registry'
  );
  process.exit(1);
}

function copyContext(destDir, label) {
  mkdirSync(destDir, { recursive: true });
  for (const f of FILES) {
    const src = join(CONTEXT_SRC, f);
    if (existsSync(src)) {
      copyFileSync(src, join(destDir, f));
      console.log(`  ✓ ${f} → ${label}`);
    }
  }
}

copyContext(SHIDOKA_STUDIO_CONTEXT, 'shidoka-studio/context/');
copyContext(
  PKG_CONTEXT,
  'packages/@kyndryl-design-system/shidoka-studio/context/'
);

if (existsSync(SERVER_SOURCE)) {
  mkdirSync(PKG_BIN_DIR, { recursive: true });
  copyFileSync(SERVER_SOURCE, PKG_BIN);
  console.log(
    '  ✓ shidoka-studio/server/index.js → packages/@kyndryl-design-system/shidoka-studio/bin/server.js'
  );
}
if (existsSync(CONTEXT_LOADER_SOURCE)) {
  copyFileSync(CONTEXT_LOADER_SOURCE, join(PKG_BIN_DIR, 'context-loader.js'));
  console.log(
    '  ✓ shidoka-studio/server/context-loader.js → packages/@kyndryl-design-system/shidoka-studio/bin/context-loader.js'
  );
}

console.log('Shidoka Studio build done.');
