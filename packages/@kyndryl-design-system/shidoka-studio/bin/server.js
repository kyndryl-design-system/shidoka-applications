#!/usr/bin/env node
/**
 * Shidoka Studio — MCP server for Cursor.
 * Source of truth for the server; packages/@kyndryl-design-system/shidoka-studio/bin/server.js is built from this.
 *
 * Context resolution order:
 * 1. SHIDOKA_STUDIO_CONTEXT_PATH — folder with considerations.md, component-registry.md, page-template-builder.md
 * 2. SHIDOKA_STUDIO_CONTEXT_URL — fetch context from URL (JSON or single markdown)
 * 3. Bundled ../context (relative to this folder when run in-repo, or package root when built)
 */
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadShidokaContext } from './context-loader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BUNDLED_CONTEXT = join(ROOT, 'context');

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
    const markdown = await loadShidokaContext(BUNDLED_CONTEXT);
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
