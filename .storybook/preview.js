import DocumentationTemplate from './DocumentationTemplate.mdx';
import { setCustomElementsManifest } from '@storybook/web-components';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import customElements from '../custom-elements.json';

import './global.scss?global';

export default {
  parameters: {
    // actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Welcome'],
      },
    },
    docs: {
      page: DocumentationTemplate,
    },
    backgrounds: { disable: true },
  },

  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
        auto: 'light dark',
      },
      defaultTheme: 'auto',
      parentSelector: 'head meta[name="color-scheme"]',
      attributeName: 'content',
    }),
  ],

  tags: ['autodocs'],
};

setCustomElementsManifest(customElements);
