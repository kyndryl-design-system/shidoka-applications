#!/usr/bin/env node
/**
 * Patches @tpitre/story-ui:
 * 1. supportsVision default true (for OpenRouter/unknown models)
 * 2. Copy package.json to dist/ for CLI
 * 3. Pass OPENAI_BASE_URL into OpenAI provider so OpenRouter works
 *
 * Run automatically via npm postinstall, or manually: node story-ui/scripts/patch-story-ui.js
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const STORY_UI = join(ROOT, 'node_modules/@tpitre/story-ui');
const DIST_PKG = join(STORY_UI, 'dist/package.json');
const BASE_PROVIDER = join(
  STORY_UI,
  'dist/story-generator/llm-providers/base-provider.js'
);
const LLM_INDEX = join(STORY_UI, 'dist/story-generator/llm-providers/index.js');

if (!existsSync(join(STORY_UI, 'package.json'))) {
  console.log('[patch-story-ui] @tpitre/story-ui not installed, skipping.');
  process.exit(0);
}

// CLI expects dist/package.json
if (!existsSync(DIST_PKG)) {
  copyFileSync(join(STORY_UI, 'package.json'), DIST_PKG);
  console.log(
    '[patch-story-ui] Copied package.json → dist/package.json (CLI workaround).'
  );
}

// 1. supportsVision default true
if (existsSync(BASE_PROVIDER)) {
  const baseSrc = readFileSync(BASE_PROVIDER, 'utf8');
  const oldVision = `return model?.supportsVision ?? false;`;
  const newVision = `return model?.supportsVision ?? true;`;
  if (baseSrc.includes(oldVision) && !baseSrc.includes(newVision)) {
    writeFileSync(BASE_PROVIDER, baseSrc.replace(oldVision, newVision));
    console.log(
      '[patch-story-ui] Patched supportsVision default: false → true'
    );
  }
}

// 2. OpenAI provider: pass OPENAI_BASE_URL so OpenRouter (and custom endpoints) work
if (existsSync(LLM_INDEX)) {
  const indexSrc = readFileSync(LLM_INDEX, 'utf8');
  const oldOpenAIConfig = `registry.configureProvider('openai', {
            apiKey: openaiKey,
            model: process.env.OPENAI_MODEL || 'gpt-4o',
            organizationId: process.env.OPENAI_ORG_ID,
        });`;
  const newOpenAIConfig = `registry.configureProvider('openai', {
            apiKey: openaiKey,
            model: process.env.OPENAI_MODEL || 'gpt-4o',
            organizationId: process.env.OPENAI_ORG_ID,
            ...(process.env.OPENAI_BASE_URL && { baseUrl: process.env.OPENAI_BASE_URL }),
            ...(process.env.OPENAI_TIMEOUT_MS && { timeout: parseInt(process.env.OPENAI_TIMEOUT_MS, 10) }),
        });`;
  if (
    indexSrc.includes(oldOpenAIConfig) &&
    !indexSrc.includes('OPENAI_BASE_URL')
  ) {
    writeFileSync(
      LLM_INDEX,
      indexSrc.replace(oldOpenAIConfig, newOpenAIConfig)
    );
    console.log(
      '[patch-story-ui] Patched OpenAI provider to use OPENAI_BASE_URL (OpenRouter support).'
    );
  } else if (
    indexSrc.includes('OPENAI_BASE_URL') &&
    !indexSrc.includes('OPENAI_TIMEOUT_MS')
  ) {
    const withBaseUrl = `registry.configureProvider('openai', {
            apiKey: openaiKey,
            model: process.env.OPENAI_MODEL || 'gpt-4o',
            organizationId: process.env.OPENAI_ORG_ID,
            ...(process.env.OPENAI_BASE_URL && { baseUrl: process.env.OPENAI_BASE_URL }),
        });`;
    writeFileSync(LLM_INDEX, indexSrc.replace(withBaseUrl, newOpenAIConfig));
    console.log(
      '[patch-story-ui] Patched OpenAI provider to use OPENAI_TIMEOUT_MS.'
    );
  }
}

// 3. OpenAI provider: surface "fetch failed" cause (e.g. SSL/cert) so it's visible in UI and logs
const OPENAI_PROVIDER = join(
  STORY_UI,
  'dist/story-generator/llm-providers/openai-provider.js'
);
if (existsSync(OPENAI_PROVIDER)) {
  let providerSrc = readFileSync(OPENAI_PROVIDER, 'utf8');
  const catchThrowOld = `        catch (error) {
            if (error instanceof Error && error.name === 'TimeoutError') {
                throw new Error(\`OpenAI API request timed out after \${this.config.timeout}ms\`);
            }
            throw error;
        }`;
  const catchThrowNew = `        catch (error) {
            if (error instanceof Error && error.name === 'TimeoutError') {
                throw new Error(\`OpenAI API request timed out after \${this.config.timeout}ms\`);
            }
            const msg = error instanceof Error ? error.message : String(error);
            const cause = error?.cause?.message || error?.cause;
            if (msg === 'fetch failed' && cause) {
                throw new Error(\`fetch failed: \${cause}\`);
            }
            throw error;
        }`;
  if (
    providerSrc.includes(catchThrowOld) &&
    !providerSrc.includes('fetch failed: ')
  ) {
    providerSrc = providerSrc.replace(catchThrowOld, catchThrowNew);
  }
  const streamCatchOld = `        catch (error) {
            yield {
                type: 'error',
                error: error instanceof Error ? error.message : String(error),
            };
        }`;
  const streamCatchNew = `        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            const cause = error?.cause?.message || error?.cause;
            const fullMsg = (msg === 'fetch failed' && cause) ? \`fetch failed: \${cause}\` : msg;
            yield {
                type: 'error',
                error: fullMsg,
            };
        }`;
  if (
    providerSrc.includes(streamCatchOld) &&
    !providerSrc.includes('fullMsg')
  ) {
    providerSrc = providerSrc.replace(streamCatchOld, streamCatchNew);
  }
  if (
    providerSrc.includes('fetch failed: ') ||
    providerSrc.includes('fullMsg')
  ) {
    writeFileSync(OPENAI_PROVIDER, providerSrc);
    console.log(
      '[patch-story-ui] Patched OpenAI provider to surface fetch error cause.'
    );
  }
}
