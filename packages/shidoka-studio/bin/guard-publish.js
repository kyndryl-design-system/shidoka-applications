#!/usr/bin/env node
/**
 * Blocks publishing to the public npm registry (npmjs.com) unless explicitly authorized.
 * Used by prepublishOnly. To publish to a private registry, set registry in .npmrc or --registry.
 */
const registry =
  process.env.npm_config_registry || 'https://registry.npmjs.org/';
const normalized = registry.replace(/\/$/, '');

if (normalized === 'https://registry.npmjs.org') {
  console.error(`
  Shidoka Studio: Publishing to the public npm registry (npmjs.com) is not allowed
  without explicit permission. Use your organization's private registry, or if you
  have permission to publish publicly, remove or adjust this guard and try again.
`);
  process.exit(1);
}
