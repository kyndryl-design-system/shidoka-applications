import remarkGfm from 'remark-gfm';

export default {
  stories: [
    '../src/stories/welcome.mdx', //force default page
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-designs',
    '@storybook/addon-storysource',
    'storybook-addon-themes',
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
    {
      name: '@storybook/addon-styling',
      options: {
        scssBuildRule: {
          test: /\.s(c|a)ss$/,
          exclude: [/node_modules/],
          oneOf: [
            {
              resourceQuery: /global/,
              use: [
                'style-loader',
                'css-loader',
                'resolve-url-loader',
                {
                  loader: 'sass-loader?sourceMap',
                  options: {
                    sourceMap: true,
                  },
                },
              ],
            },
            {
              use: [
                {
                  loader: 'lit-scss-loader',
                  options: {
                    minify: true,
                  },
                },
                'extract-loader',
                {
                  loader: 'css-loader',
                  options: {
                    url: false,
                  },
                },
                'sass-loader',
              ],
            },
          ],
        },
      },
    },
    {
      name: 'storybook-preset-inline-svg',
      options: {
        svgInlineLoaderOptions: {
          removeSVGTagAttrs: false,
        },
      },
    },
  ],
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: true,
  },
};
