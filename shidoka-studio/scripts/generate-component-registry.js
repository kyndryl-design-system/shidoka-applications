#!/usr/bin/env node
/**
 * generate-component-registry.js
 *
 * Single source of truth: custom-elements.json (CEM). All component data is derived from it.
 *
 * Generates into shidoka-studio/context-src/:
 *   - design-system-context.md, component-registry.md, component-api.json (from CEM)
 *   - considerations.md, page-template-builder.md (copied from shidoka-studio/content/)
 *
 * Usage: node shidoka-studio/scripts/generate-component-registry.js
 * From repo root: npm run generate-component-registry
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  copyFileSync,
} from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const SHIDOKA_STUDIO = join(ROOT, 'shidoka-studio');
const CONTEXT_SRC = join(SHIDOKA_STUDIO, 'context-src');
const CONTENT = join(SHIDOKA_STUDIO, 'content');

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

// Group tags by import path and collect full CEM metadata per component
const tagsByImportPath = new Map();
const tagSet = new Set();
/** @type {Map<string, { importPath: string, attributes: string[], slots: string[], events: string[], description?: string }>} */
const componentMeta = new Map();

for (const mod of cem.modules) {
  for (const decl of mod.declarations || []) {
    if (!decl.customElement || !decl.tagName) continue;
    const importPath = bestImportPath(mod.path);
    const tagName = decl.tagName;
    tagSet.add(tagName);
    if (!tagsByImportPath.has(importPath)) tagsByImportPath.set(importPath, []);
    tagsByImportPath.get(importPath).push(tagName);

    const attrs = (decl.attributes || []).map((a) => a.name);
    const slots = (decl.slots || []).map((s) =>
      s.name === '' ? 'default' : s.name
    );
    const events = (decl.events || []).map((e) => e.name);
    componentMeta.set(tagName, {
      importPath,
      attributes: attrs,
      slots,
      events,
      description: decl.description,
    });
  }
}

// Build compact markdown — one line per import path (all from CEM)
const lines = [
  '# Shidoka Component Registry',
  '',
  '**Source of truth: custom-elements.json.** This registry is generated from it.',
  '',
  `${tagSet.size} components. ONLY these kyn-* tags exist. Never use <my-button>, <button>, or invented tags.`,
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

// Key attributes section: 100% from CEM (high-signal components only)
const keyTags = [
  'kyn-button',
  'kyn-text-input',
  'kyn-dropdown',
  'kyn-modal',
  'kyn-card',
  'kyn-table',
  'kyn-ui-shell',
  'kyn-header',
  'kyn-footer',
  'kyn-side-drawer',
  'kyn-accordion',
  'kyn-tabs',
  'kyn-tab',
  'kyn-tab-panel',
];
lines.push('');
lines.push('## Key attributes (from CEM — most-used components)');
lines.push('');
for (const tag of keyTags) {
  const meta = componentMeta.get(tag);
  if (!meta) continue;
  const attrList = meta.attributes.length
    ? meta.attributes.join(', ')
    : '(none)';
  lines.push(`- \`<${tag}>\`: ${attrList}`);
}
lines.push('');

// Output directory: shidoka-studio/context-src
mkdirSync(CONTEXT_SRC, { recursive: true });
writeFileSync(join(CONTEXT_SRC, 'component-registry.md'), lines.join('\n'));

// Build rich design-system-context.md from CEM for MCP/LLM
const contextLines = [
  '# Shidoka Design System — Context for LLM',
  '',
  '**Source of truth: custom-elements.json.** This file is generated from it. Do not edit; run `npm run generate-component-registry` to regenerate.',
  '',
  'Only use kyn-* tags and attributes/slots/events listed below. Invented tags or attributes will break the build.',
  '',
  '## Component reference (from CEM)',
  '',
];

const sortedTags = [...componentMeta.entries()].sort((a, b) =>
  a[0].localeCompare(b[0])
);
for (const [tag, meta] of sortedTags) {
  contextLines.push(`### \`<${tag}>\``);
  contextLines.push(`- **Import:** \`import '${meta.importPath}';\``);
  if (meta.attributes.length)
    contextLines.push(`- **Attributes:** ${meta.attributes.join(', ')}`);
  if (meta.slots.length)
    contextLines.push(
      `- **Slots:** ${meta.slots
        .map((s) => (s === 'default' ? '(default)' : s))
        .join(', ')}`
    );
  if (meta.events.length)
    contextLines.push(`- **Events:** ${meta.events.join(', ')}`);
  if (meta.description)
    contextLines.push(`- **Description:** ${meta.description}`);
  contextLines.push('');
}

writeFileSync(
  join(CONTEXT_SRC, 'design-system-context.md'),
  contextLines.join('\n')
);

// Emit CEM-derived JSON for tooling / MCP
const componentApi = {};
for (const [tag, meta] of componentMeta) {
  componentApi[tag] = {
    importPath: meta.importPath,
    attributes: meta.attributes,
    slots: meta.slots,
    events: meta.events,
    ...(meta.description && { description: meta.description }),
  };
}
writeFileSync(
  join(CONTEXT_SRC, 'component-api.json'),
  JSON.stringify(
    { source: 'custom-elements.json', components: componentApi },
    null,
    2
  )
);

// Copy considerations and page-template-builder from shidoka-studio/content/
const considerationsSrc = join(CONTENT, 'considerations.md');
const considerationsDst = join(CONTEXT_SRC, 'considerations.md');
if (existsSync(considerationsSrc)) {
  copyFileSync(considerationsSrc, considerationsDst);
}
const pageTemplateSrc = join(CONTENT, 'page-template-builder.md');
const pageTemplateDst = join(CONTEXT_SRC, 'page-template-builder.md');
if (existsSync(pageTemplateSrc)) {
  copyFileSync(pageTemplateSrc, pageTemplateDst);
}

console.log('✓ Written shidoka-studio/context-src/component-registry.md');
console.log(
  '✓ Written shidoka-studio/context-src/design-system-context.md (from CEM)'
);
console.log(
  '✓ Written shidoka-studio/context-src/component-api.json (from CEM)'
);
if (existsSync(considerationsSrc))
  console.log(
    '✓ Copied considerations → shidoka-studio/context-src/considerations.md'
  );
if (existsSync(pageTemplateSrc))
  console.log(
    '✓ Copied page-template-builder → shidoka-studio/context-src/page-template-builder.md'
  );
console.log('  Source of truth: custom-elements.json');
console.log(`  ${tagSet.size} components, ${sortedPaths.length} import paths`);
