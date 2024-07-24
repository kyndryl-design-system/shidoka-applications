import { html } from 'lit';
import './index';
// import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Loaders/Loader Inline',
  component: 'kyn-loader-inline',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Inline = {
  args: {
    stopped: false,
    unnamed: 'Loading...',
  },
  render: (args) => {
    return html`
      <kyn-loader-inline ?stopped=${args.stopped}>
        ${args.unnamed}
      </kyn-loader-inline>
    `;
  },
};
