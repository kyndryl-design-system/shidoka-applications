import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import remarkGfm from 'remark-gfm';
import { compileString } from 'sass';

export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-designs',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    // {
    //   name: '@storybook/addon-styling-webpack',
    //   options: {
    //     rules: [
    //       {
    //         test: /\.s[ac]ss$/i,
    //         exclude: [/node_modules/],
    //         oneOf: [
    //           {
    //             resourceQuery: /global/,
    //             use: [
    //               'style-loader',
    //               'css-loader',
    //               'resolve-url-loader',
    //               {
    //                 loader: 'sass-loader?sourceMap',
    //                 options: {
    //                   sourceMap: true,
    //                 },
    //               },
    //             ],
    //           },
    //           {
    //             use: [
    //               {
    //                 loader: 'lit-css-loader',
    //                 options: {
    //                   transform: (data, { filePath }) =>
    //                     Sass.renderSync({
    //                       data,
    //                       file: filePath,
    //                     }).css.toString(),
    //                 },
    //               },
    //               'sass-loader',
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         test: /\.css$/,
    //         use: ['style-loader', 'css-loader'],
    //       },
    //     ],
    //   },
    // },
    // {
    //   name: 'storybook-preset-inline-svg',
    //   options: {
    //     svgInlineLoaderOptions: {
    //       removeSVGTagAttrs: false,
    //     },
    //   },
    // },
    // '@storybook/addon-webpack5-compiler-babel',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],

  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  core: {
    disableTelemetry: true,
  },

  staticDirs: ['./static'],

  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add storybook-specific dependencies to pre-optimization
      assetsInclude: ['**/*.svg'],
      plugins: [vitePluginSplitViewUnifiedScss(), vitePluginRawSvg()],
    });
  },

  docs: {},
};

// One splitView.scss with @split-view-section markers; compile each chunk at build time.
// (?inline compiled CSS drops comments in production, so we cannot split that output in the client.)
function vitePluginSplitViewUnifiedScss() {
  const virtualId = '\0virtual:split-view-css';
  const SECTION =
    /\/\*\s*@split-view-section:\s*(\w+)\s*\*\/([\s\S]*?)(?=\/\*\s*@split-view-section:|$)/g;
  const splitViewScssAbs = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../src/stories/splitView/splitView.scss'
  );

  return {
    name: 'vite-plugin-split-view-unified-scss',
    resolveId(id) {
      if (id === 'virtual:split-view-css') {
        return virtualId;
      }
    },
    load(id) {
      if (id !== virtualId) {
        return null;
      }
      this.addWatchFile(splitViewScssAbs);
      const raw = fs.readFileSync(splitViewScssAbs, 'utf8');
      const out = {};
      for (const m of raw.matchAll(SECTION)) {
        out[m[1]] = m[2].trim();
      }
      const required = ['pattern', 'railHost', 'blockFlush', 'storyLight'];
      for (const key of required) {
        if (!out[key]) {
          throw new Error(
            `splitView.scss: missing @split-view-section: ${key} block`
          );
        }
      }
      const loadPaths = [path.dirname(splitViewScssAbs)];
      const compileChunk = (src) =>
        compileString(src, { loadPaths, style: 'compressed' }).css;

      return (
        `export const SPLIT_VIEW_PATTERN_SHADOW_CSS = ${JSON.stringify(
          compileChunk(out.pattern)
        )};\n` +
        `export const SPLIT_VIEW_CODE_RAIL_SHADOW_CSS = ${JSON.stringify(
          compileChunk(out.railHost)
        )};\n` +
        `export const SPLIT_VIEW_BLOCK_CODE_FLUSH_CSS = ${JSON.stringify(
          compileChunk(out.blockFlush)
        )};\n` +
        `export const SPLIT_VIEW_STORY_LIGHT_DOM_CSS = ${JSON.stringify(
          compileChunk(out.storyLight)
        )};\n`
      );
    },
  };
}

// load raw SVGs without requiring the ?raw suffix on imports
function vitePluginRawSvg() {
  return {
    name: 'vite-plugin-raw-svg',
    enforce: 'pre', // to override `vite:asset`'s behavior
    async load(id) {
      if (id.includes('.svg') && !id.includes('.svg.js')) {
        const svg = await fs.promises.readFile(id, 'utf8');
        // Escape backticks and backslashes for template literal
        const safe = svg.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
        return {
          code: `export default \`${safe}\`;`,
          map: null,
        };
      }
    },
  };
}
