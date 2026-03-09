#!/usr/bin/env node
/**
 * Shidoka Studio — MCP server for Cursor.
 * Source of truth for the server; packages/shidoka-studio/bin/server.js is built from this.
 *
 * Context resolution order:
 * 1. SHIDOKA_STUDIO_CONTEXT_PATH — folder with considerations.md, component-registry.md, page-template-builder.md
 * 2. SHIDOKA_STUDIO_CONTEXT_URL — fetch context from URL (JSON or single markdown)
 * 3. Bundled ../context (relative to this folder when run in-repo, or package root when built)
 */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BUNDLED_CONTEXT = join(ROOT, 'context');

function readSafe(path, fallback = '') {
  try {
    return existsSync(path) ? readFileSync(path, 'utf8') : fallback;
  } catch {
    return fallback;
  }
}

function loadFromFolder(folder) {
  const considerations = readSafe(join(folder, 'considerations.md'), '');
  const registry = readSafe(
    join(folder, 'component-registry.md'),
    readSafe(join(folder, 'design-system-context.md'), '')
  );
  const pageTemplate = readSafe(join(folder, 'page-template-builder.md'), '');
  return [
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
  ].join('\n');
}

let urlCache = null;

async function loadFromUrl(url) {
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

async function loadShidokaContext() {
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

  const bundled = loadFromFolder(BUNDLED_CONTEXT);
  if (bundled.trim().length > 50) return bundled;

  return [
    '# Shidoka Design System context',
    '',
    'No context available. Run from repo root: npm run build:shidoka-studio',
    'Or set SHIDOKA_STUDIO_CONTEXT_PATH to a folder with considerations.md, component-registry.md, page-template-builder.md.',
  ].join('\n');
}

const server = new McpServer(
  { name: 'shidoka-studio', version: '1.0.0' },
  { capabilities: {} }
);

server.registerTool(
  'get_shidoka_design_context',
  {
    title: 'Get Shidoka design system context',
    description:
      'Returns the full Shidoka Design System context derived from custom-elements.json (CEM): considerations (intent mapping, layout rules, forbidden patterns), component registry and design-system context (kyn-* tags, attributes, slots, slot descriptions, CSS custom properties, import paths), and page-template-builder (shell order, main padding, table wrapper). Use components as designed—infer sizing, behavior, and composition from this context. Use this when generating pages, templates, or Storybook stories so output uses only Shidoka components and follows layout rules.',
    inputSchema: undefined,
  },
  async () => {
    const markdown = await loadShidokaContext();
    return {
      content: [{ type: 'text', text: markdown }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Shidoka Studio error:', err);
  process.exit(1);
});
