/**
 * Shidoka Studio context loading tests.
 * Uses context-loader.js so we don't start the MCP server.
 */
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  loadShidokaContext,
  loadFromFolder,
} from '../server/context-loader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_CONTEXT = join(__dirname, 'fixtures', 'context');

describe('Shidoka Studio context loader', () => {
  const envRestore = {};

  beforeEach(() => {
    envRestore.SHIDOKA_STUDIO_CONTEXT_PATH =
      process.env.SHIDOKA_STUDIO_CONTEXT_PATH;
    envRestore.SHIDOKA_STUDIO_CONTEXT_URL =
      process.env.SHIDOKA_STUDIO_CONTEXT_URL;
  });

  afterEach(() => {
    if (envRestore.SHIDOKA_STUDIO_CONTEXT_PATH !== undefined) {
      process.env.SHIDOKA_STUDIO_CONTEXT_PATH =
        envRestore.SHIDOKA_STUDIO_CONTEXT_PATH;
    } else {
      delete process.env.SHIDOKA_STUDIO_CONTEXT_PATH;
    }
    if (envRestore.SHIDOKA_STUDIO_CONTEXT_URL !== undefined) {
      process.env.SHIDOKA_STUDIO_CONTEXT_URL =
        envRestore.SHIDOKA_STUDIO_CONTEXT_URL;
    } else {
      delete process.env.SHIDOKA_STUDIO_CONTEXT_URL;
    }
  });

  describe('loadFromFolder', () => {
    it('returns concatenated markdown with expected sections', () => {
      const result = loadFromFolder(FIXTURE_CONTEXT);
      expect(result).toContain(
        '# Shidoka Design System — considerations and rules'
      );
      expect(result).toContain('# Component registry / design-system context');
      expect(result).toContain(
        '# Page / template builder (layout and spacing)'
      );
      expect(result).toContain('---');
      expect(result).toContain('Test considerations');
      expect(result).toContain('Shidoka Component Registry (fixture)');
      expect(result).toContain('Shell order: header → main → footer');
    });

    it('returns empty sections for missing files', () => {
      const result = loadFromFolder(join(__dirname, 'fixtures', 'nonexistent'));
      expect(result).toContain(
        '# Shidoka Design System — considerations and rules'
      );
      expect(result).toContain('---');
      expect(result.trim().length).toBeGreaterThan(50);
    });
  });

  describe('loadShidokaContext', () => {
    it('uses SHIDOKA_STUDIO_CONTEXT_PATH when set', async () => {
      process.env.SHIDOKA_STUDIO_CONTEXT_PATH = FIXTURE_CONTEXT;
      const result = await loadShidokaContext('/nonexistent/bundled');
      expect(result).toContain('Test considerations');
      expect(result).toContain('Component Registry (fixture)');
      expect(result).toContain('Page / template builder (fixture)');
    });

    it('returns bundled context when PATH not set and bundled path has content', async () => {
      delete process.env.SHIDOKA_STUDIO_CONTEXT_PATH;
      const result = await loadShidokaContext(FIXTURE_CONTEXT);
      expect(result).toContain('Test considerations');
      expect(result).toContain('Component Registry (fixture)');
    });
  });
});
