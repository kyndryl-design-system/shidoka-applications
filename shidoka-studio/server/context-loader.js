/**
 * Context loading for Shidoka Studio MCP server.
 * Loads considerations, component registry, and page-template-builder from a folder or URL.
 * Exported for testing without starting the MCP server.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

function readSafe(path, fallback = '') {
  try {
    return existsSync(path) ? readFileSync(path, 'utf8') : fallback;
  } catch {
    return fallback;
  }
}

const BUNDLED_DOCS = [
  'architecture.md',
  'sideload-shidoka-studio.md',
  'packaging-for-consumers.md',
  'styling-for-consumers.md',
  'consuming-app-setup-and-alignment.md',
];

export function loadFromFolder(folder) {
  const considerations = readSafe(join(folder, 'considerations.md'), '');
  const registry = readSafe(
    join(folder, 'component-registry.md'),
    readSafe(join(folder, 'design-system-context.md'), '')
  );
  const pageTemplate = readSafe(join(folder, 'page-template-builder.md'), '');
  const canonicalFullPage = readSafe(
    join(folder, 'canonical-full-page.md'),
    ''
  );
  const docParts = BUNDLED_DOCS.map((f) =>
    readSafe(join(folder, f), '')
  ).filter((s) => s.length > 0);
  const sections = [
    '# Shidoka Design System — considerations and rules',
    considerations,
    '',
    '---',
    '',
    '# Component registry / design-system context',
    registry,
    '',
    '---',
    '',
    '# Page / template builder (layout and spacing)',
    pageTemplate,
  ];
  if (canonicalFullPage.length > 0) {
    sections.push(
      '',
      '---',
      '',
      '# Canonical full-page structure (single reference — use this exact pattern)',
      '',
      canonicalFullPage
    );
  }
  if (docParts.length > 0) {
    sections.push(
      '',
      '---',
      '',
      '# Shidoka Studio docs (architecture, sideload, packaging, styling)',
      '',
      docParts.join('\n\n---\n\n')
    );
  }
  return sections.join('\n');
}

let urlCache = null;

export async function loadFromUrl(url) {
  if (urlCache != null) return urlCache;
  const res = await fetch(url, {
    headers: { Accept: 'application/json, text/markdown' },
  });
  if (!res.ok)
    throw new Error(
      `Shidoka Studio: failed to fetch context: ${res.status} ${res.statusText}`
    );
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  if (contentType.includes('application/json')) {
    const json = JSON.parse(text);
    urlCache =
      typeof json.content === 'string'
        ? json.content
        : [json.considerations, json.registry, json.pageTemplate]
            .filter(Boolean)
            .join('\n\n---\n\n');
  } else {
    urlCache = text;
  }
  return urlCache;
}

/**
 * Load full Shidoka design context. Resolution order:
 * 1. SHIDOKA_STUDIO_CONTEXT_PATH (folder)
 * 2. SHIDOKA_STUDIO_CONTEXT_URL (fetch)
 * 3. Bundled context (folder relative to server)
 * @param {string} bundledContextPath - Absolute path to bundled context folder (e.g. ../context)
 * @returns {Promise<string>} Concatenated markdown context
 */
export async function loadShidokaContext(bundledContextPath) {
  const pathOverride = process.env.SHIDOKA_STUDIO_CONTEXT_PATH;
  if (pathOverride) {
    const out = loadFromFolder(pathOverride);
    if (out.includes('---') || out.trim().length > 100) return out;
  }

  const urlOverride = process.env.SHIDOKA_STUDIO_CONTEXT_URL;
  if (urlOverride) {
    try {
      return await loadFromUrl(urlOverride);
    } catch (e) {
      return `# Shidoka Studio — context URL failed\n\nCould not fetch context from SHIDOKA_STUDIO_CONTEXT_URL: ${e.message}\n\nFalling back to bundled context if available.`;
    }
  }

  const bundled = loadFromFolder(bundledContextPath);
  if (bundled.trim().length > 50) return bundled;

  return [
    '# Shidoka Design System context',
    '',
    'No context available. Run from repo root: npm run build:shidoka-studio',
    'Or set SHIDOKA_STUDIO_CONTEXT_PATH to a folder with considerations.md, component-registry.md, page-template-builder.md.',
  ].join('\n');
}
