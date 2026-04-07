import { addons } from 'storybook/manager-api';
import theme from './theme';
import { defaultConfig } from 'storybook-addon-tag-badges/manager-helpers';

addons.setConfig({
  theme: theme,
  tagBadges: [
    // added custom tag badge
    {
      tags: 'updated',
      badge: {
        text: 'Updated',
        style: {
          backgroundColor: '#0255d0',
          color: '#e9f2ff',
        },
        // tooltip: 'Add tooltip text', will be shown on click of toolbar badge
      },
    },
    ...defaultConfig,
  ],
});
