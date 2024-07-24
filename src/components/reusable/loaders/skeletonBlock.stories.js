import { html } from 'lit';
import './index';
// import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Loaders/Skeleton',
  component: 'kyn-skeleton-block',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Block = {
  render: () => {
    return html`
      <kyn-skeleton-block style="height: 128px;"></kyn-skeleton-block>
    `;
  },
};
