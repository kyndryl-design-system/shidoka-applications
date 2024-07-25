import { html } from 'lit';
import './index';
// import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Loaders/Skeleton',
  component: 'kyn-skeleton',
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
      <style>
        kyn-skeleton.block-example {
          height: 128px;
        }
      </style>

      <kyn-skeleton class="block-example"></kyn-skeleton>
    `;
  },
};

export const Inline = {
  render: () => {
    return html`
      <style>
        kyn-skeleton.inline-example {
          width: 108px;
          height: 16px;
        }
      </style>

      <kyn-skeleton inline class="inline-example"></kyn-skeleton>
    `;
  },
};
