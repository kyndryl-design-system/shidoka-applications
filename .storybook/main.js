module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-designs',
    '@storybook/addon-storysource',
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
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.s(c|a)ss$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'lit-scss-loader',
          options: {
            minify: true, // defaults to false
          },
        },
        'extract-loader',
        'css-loader',
        'sass-loader',
      ],
    });
    return config;
  },
  docs: {
    autodocs: true,
  },
};
