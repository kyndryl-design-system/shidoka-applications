#!/usr/bin/env node
/**
 * Remove all generated story files from src/stories/generated.
 * Optionally clear .story-mappings.json so the Story UI panel doesn't show stale entries.
 *
 * Usage: node story-ui/scripts/remove-generated-stories.js [--mappings]
 *   --mappings  Also reset src/stories/.story-mappings.json to [].
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const generatedDir = path.join(root, 'src/stories/generated');
const mappingsPath = path.join(root, 'src/stories/.story-mappings.json');

const clearMappings = process.argv.includes('--mappings');

if (!fs.existsSync(generatedDir)) {
  console.log('Generated stories directory not found:', generatedDir);
  process.exit(0);
}

const files = fs.readdirSync(generatedDir);
const stories = files.filter((f) => f.endsWith('.stories.ts'));

if (stories.length === 0) {
  console.log('No generated story files to remove.');
} else {
  for (const f of stories) {
    fs.unlinkSync(path.join(generatedDir, f));
    console.log('Removed:', f);
  }
  console.log(`Removed ${stories.length} generated story file(s).`);
}

if (clearMappings && fs.existsSync(mappingsPath)) {
  fs.writeFileSync(mappingsPath, '[]\n', 'utf8');
  console.log('Cleared .story-mappings.json');
}
