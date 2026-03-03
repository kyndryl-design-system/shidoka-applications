#!/usr/bin/env node
/**
 * generate-component-registry.js
 *
 * Parses custom-elements.json (Custom Elements Manifest) and generates:
 *   story-ui/docs/guidelines/component-registry.md  (compact tag + import list)
 *
 * Kept intentionally small (~50 lines) so it fits in small LLM context windows.
 * Detailed attributes are available via importExamples and the CEM file itself.
 *
 * Usage:  node story-ui/scripts/generate-component-registry.js
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const cem = JSON.parse(
  readFileSync(join(ROOT, 'custom-elements.json'), 'utf8')
);

// Build a map: directory → index module path (if one exists)
const indexByDir = new Map();
for (const mod of cem.modules) {
  if (mod.path.endsWith('/index.ts') && mod.exports?.length > 0) {
    indexByDir.set(mod.path.replace('/index.ts', ''), mod.path);
  }
}

function toImportPath(cemPath) {
  return cemPath.replace(/^src\//, '../../').replace(/\.ts$/, '');
}

function bestImportPath(cemPath) {
  const dir = cemPath.replace(/\/[^/]+$/, '');
  return indexByDir.has(dir)
    ? toImportPath(indexByDir.get(dir))
    : toImportPath(cemPath);
}

// Group tags by import path
const tagsByImportPath = new Map();
const tagSet = new Set();

for (const mod of cem.modules) {
  for (const decl of mod.declarations || []) {
    if (!decl.customElement || !decl.tagName) continue;
    const importPath = bestImportPath(mod.path);
    const tagName = decl.tagName;
    tagSet.add(tagName);
    if (!tagsByImportPath.has(importPath)) tagsByImportPath.set(importPath, []);
    tagsByImportPath.get(importPath).push(tagName);
  }
}

// Build compact markdown — one line per import path
const lines = [
  '# Shidoka Component Registry',
  '',
  `${tagSet.size} components available. ONLY these kyn-* tags exist.`,
  'NEVER use <my-button>, <my-card>, <my-table>, <button>, <input>, or any invented tag.',
  '',
  '## Tag → Import mapping',
  '',
  '| Tags | Import |',
  '|---|---|',
];

const sortedPaths = [...tagsByImportPath.entries()].sort((a, b) =>
  a[0].localeCompare(b[0])
);
for (const [path, tags] of sortedPaths) {
  lines.push(
    `| ${tags.map((t) => `\`<${t}>\``).join(', ')} | \`import '${path}';\` |`
  );
}

lines.push('');
lines.push('## Key attributes (most-used components)');
lines.push('');
lines.push(
  '- `<kyn-button>`: kind (primary, secondary, tertiary, ghost, primary-destructive, secondary-destructive, tertiary-destructive, ghost-destructive, primary-ai, ghost-ai), disabled, size, href, type'
);
lines.push(
  '- `<kyn-text-input>`: type, value, placeholder, label, disabled, required, readonly'
);
lines.push(
  '- `<kyn-dropdown>`: label, placeholder, disabled, required, multiple, searchable, inline'
);
lines.push(
  '- `<kyn-modal>`: titleText, size (sm, md, lg, xl), open, destructive, hideCancelButton'
);
lines.push('- `<kyn-card>`: type (normal, clickable), href, target');
lines.push(
  '- `<kyn-table>`: checkboxSelection, striped, stickyHeader, dense, fixedLayout'
);
lines.push(
  '- `<kyn-ui-shell>`: (no required attrs — contains kyn-header, main, kyn-footer)'
);
lines.push('- `<kyn-header>`: rootUrl, appTitle');
lines.push('- `<kyn-footer>`: rootUrl, logoAriaLabel');
lines.push(
  '- `<kyn-side-drawer>`: size (sm, md, lg), titleText, labelText, open'
);
lines.push('- `<kyn-accordion>`: showNumbers, compact');
lines.push('- `<kyn-tabs>`: (contains kyn-tab and kyn-tab-panel)');
lines.push('');

// Write
const outDir = join(ROOT, 'story-ui', 'docs', 'guidelines');
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, 'component-registry.md');
writeFileSync(outPath, lines.join('\n'));

console.log(`✓ Generated ${outPath}`);
console.log(`  ${tagSet.size} components, ${sortedPaths.length} import paths`);
console.log(`  ${lines.length} lines (compact for small LLM context windows)`);
