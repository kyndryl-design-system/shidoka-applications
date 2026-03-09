#!/usr/bin/env node
/* eslint-env node */
/**
 * Shidoka Studio — MCP server for Cursor.
 * Exposes get_shidoka_design_context so Cursor can constrain page/template generation to the Shidoka Design System.
 *
 * Context resolution order:
 * 1. SHIDOKA_STUDIO_CONTEXT_PATH — folder with considerations.md, component-registry.md, page-template-builder.md
 * 2. SHIDOKA_STUDIO_CONTEXT_URL — fetch context from URL (JSON or single markdown)
 * 3. Bundled ./context (relative to package root)
 */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = join(__dirname, '..');
const BUNDLED_CONTEXT = join(PACKAGE_ROOT, 'context');

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
    'No context available. Either:',
    '1. Reinstall/update @kyndryl-design-system/shidoka-studio (bundled context), or',
    '2. Set SHIDOKA_STUDIO_CONTEXT_PATH to a folder with considerations.md, component-registry.md, page-template-builder.md, or',
    '3. Set SHIDOKA_STUDIO_CONTEXT_URL to a URL that returns the context (markdown or JSON with content).',
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
      'Returns the full Shidoka Design System context: considerations (intent mapping, component rules, forbidden patterns), component registry (kyn-* tags and import paths), and page-template-builder (shell order, main padding, toolbar spacing, side drawer, table wrapper). Use this when generating pages, templates, or Storybook stories so output uses only Shidoka components and follows layout/spacing rules.',
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
