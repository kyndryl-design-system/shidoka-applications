import DocumentationTemplate from './DocumentationTemplate.mdx';
import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '../custom-elements.json';

import './global.scss?global';

export default {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      page: DocumentationTemplate,
    },
    backgrounds: { disable: true },
    // themes: {
    //   default: 'light',
    //   list: [
    //     { name: 'light', class: '', color: '#fff' },
    //     {
    //       name: 'darkstone-80',
    //       class: 'kd-theme--darkstone-80',
    //       color: '#3d3c3c',
    //     },
    //     { name: 'spruce-80', class: 'kd-theme--spruce-80', color: '#163d43' },
    //     { name: 'spruce-60', class: 'kd-theme--spruce-60', color: ' 	#29707a' },
    //     {
    //       name: 'springgreen-60',
    //       class: 'kd-theme--springgreen-60',
    //       color: '#187e3f',
    //     },
    //     {
    //       name: 'springgreen-20',
    //       class: 'kd-theme--springgreen-20',
    //       color: '#4cdd84',
    //     },
    //     {
    //       name: 'warmred-50',
    //       class: 'kd-theme--warmred-50',
    //       color: '#ff462d',
    //     },
    //   ],
    // },
  },
};

setCustomElementsManifest(customElements);
