import { html } from 'lit';
import './index';
// import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Loaders/Skeleton Inline',
  component: 'kyn-skeleton-inline',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Inline = {
  render: () => {
    return html`
      <kyn-skeleton-inline
        style="width: 108px; height: 16px;"
      ></kyn-skeleton-inline>
    `;
  },
};
