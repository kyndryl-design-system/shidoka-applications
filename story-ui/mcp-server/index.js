#!/usr/bin/env node
/* eslint-env node */
/**
 * Shidoka MCP server — exposes Shidoka design system context to Cursor (or any MCP client).
 *
 * Tool: get_shidoka_design_context
 *   Returns merged markdown: considerations + component registry + page-template-builder.
 *   Used so Cursor's agent can constrain page/template generation to the Shidoka Design System.
 *
 * Run: node story-ui/mcp-server/index.js
 * Configure in Cursor: .cursor/mcp.json with command "node", args ["story-ui/mcp-server/index.js"].
 */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const DOCS_DIR = join(ROOT, 'story-ui-docs');
const FALLBACK_CONSIDERATIONS = join(
  ROOT,
  'story-ui',
  'story-ui-considerations.md'
);
const FALLBACK_PAGE_TEMPLATE = join(
  ROOT,
  'story-ui',
  'docs',
  'patterns',
  'page-template-builder.md'
);
const FALLBACK_REGISTRY = join(
  ROOT,
  'story-ui',
  'docs',
  'guidelines',
  'component-registry.md'
);

function readSafe(path, fallback = '') {
  try {
    return existsSync(path) ? readFileSync(path, 'utf8') : fallback;
  } catch {
    return fallback;
  }
}

function loadShidokaContext() {
  const considerations = readSafe(
    join(DOCS_DIR, 'considerations.md'),
    readSafe(
      FALLBACK_CONSIDERATIONS,
      '# Considerations not found. Run: npm run generate-component-registry\n'
    )
  );
  const registry = readSafe(
    join(DOCS_DIR, 'component-registry.md'),
    readSafe(
      join(DOCS_DIR, 'design-system-context.md'),
      readSafe(FALLBACK_REGISTRY, '')
    )
  );
  const pageTemplate = readSafe(
    join(DOCS_DIR, 'page-template-builder.md'),
    readSafe(FALLBACK_PAGE_TEMPLATE, '')
  );

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

const server = new McpServer(
  { name: 'shidoka-design-system', version: '1.0.0' },
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
    const markdown = loadShidokaContext();
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
  console.error('Shidoka MCP server error:', err);
  process.exit(1);
});
