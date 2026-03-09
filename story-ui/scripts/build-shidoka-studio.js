#!/usr/bin/env node
/**
 * Builds the Shidoka Studio package: copies design system context from story-ui-docs/
 * into packages/shidoka-studio/context/ so the published package has bundled context.
 *
 * Run from repo root after: npm run generate-component-registry
 * Or: npm run build:shidoka-studio (which runs generate-component-registry first)
 */
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const DOCS = join(ROOT, 'story-ui-docs');
const CONTEXT = join(ROOT, 'packages', 'shidoka-studio', 'context');

const FILES = [
  'considerations.md',
  'component-registry.md',
  'page-template-builder.md',
  'design-system-context.md',
];

if (!existsSync(DOCS)) {
  console.error(
    'story-ui-docs/ not found. Run: npm run generate-component-registry'
  );
  process.exit(1);
}

mkdirSync(CONTEXT, { recursive: true });
for (const f of FILES) {
  const src = join(DOCS, f);
  if (existsSync(src)) {
    copyFileSync(src, join(CONTEXT, f));
    console.log(`  ✓ ${f} → packages/shidoka-studio/context/`);
  }
}
console.log('Shidoka Studio context copied.');
