#!/usr/bin/env node
/**
 * Patch @tpitre/story-ui to default supportsVision to true for unknown models.
 *
 * When using OpenRouter, the model (e.g. qwen/qwen3-coder) isn't in the
 * hardcoded OpenAI model list, so supportsVision() returns false.
 * This patch changes the default from false to true.
 *
 * Run automatically via npm postinstall, or manually: node story-ui/scripts/patch-story-ui.js
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const TARGET = join(
  ROOT,
  'node_modules/@tpitre/story-ui/dist/story-generator/llm-providers/base-provider.js'
);

if (!existsSync(TARGET)) {
  console.log('[patch-story-ui] @tpitre/story-ui not installed, skipping.');
  process.exit(0);
}

const src = readFileSync(TARGET, 'utf8');
const OLD = `return model?.supportsVision ?? false;`;
const NEW = `return model?.supportsVision ?? true;`;

if (src.includes(NEW)) {
  console.log('[patch-story-ui] Already patched.');
  process.exit(0);
}

if (!src.includes(OLD)) {
  console.warn(
    '[patch-story-ui] Could not find target string — story-ui may have been updated.'
  );
  process.exit(0);
}

writeFileSync(TARGET, src.replace(OLD, NEW));
console.log('[patch-story-ui] Patched supportsVision default: false → true');
