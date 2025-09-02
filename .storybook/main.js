import remarkGfm from 'remark-gfm';
import fs from 'fs';

export default {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../cms/**/*.mdx',
  ],

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
      plugins: [vitePluginRawSvg()],
    });
  },

  docs: {},
};

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
