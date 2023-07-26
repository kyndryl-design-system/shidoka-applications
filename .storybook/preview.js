import DocumentationTemplate from './DocumentationTemplate.mdx';
import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '../custom-elements.json';

import './global.scss?global';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export default {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      page: DocumentationTemplate,
    },
  },
};

setCustomElementsManifest(customElements);
