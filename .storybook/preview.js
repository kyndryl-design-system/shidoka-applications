import DocumentationTemplate from './DocumentationTemplate.mdx';
import { setCustomElementsManifest } from '@storybook/web-components-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import customElements from '../custom-elements.json';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { BREAKPOINT_VIEWPORTS } from '@kyndryl-design-system/shidoka-foundation/common/helpers/breakpoints';

import '@kyndryl-design-system/shidoka-foundation/css/root.css';
import '@kyndryl-design-system/shidoka-foundation/css/index.css';
import '../src/common/scss/utility/gridstack-shidoka.scss';
import '../src/common/scss/utility/swiper-shidoka.scss';

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
        order: ['Welcome', 'Components', 'Global Components', 'Patterns', 'AI'],
      },
    },

    docs: {
      page: DocumentationTemplate,
      codePanel: true,
      source: {
        // excludeDecorators: true,
        type: 'code',
      },

      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2, h3 ,h4',
        title: 'On this page',
        disable: false,
        unsafeTocbotOptions: {
          orderedList: false,
        },
      },
    },

    backgrounds: { disable: true },

    viewport: {
      viewports: {
        ...BREAKPOINT_VIEWPORTS,
        ...INITIAL_VIEWPORTS,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
    },
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
