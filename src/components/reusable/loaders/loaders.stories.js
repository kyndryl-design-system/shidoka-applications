import { html } from 'lit';
import './index';
// import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Loaders',
  component: 'kyn-loader-overlay',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Overlay = {
  args: {
    stopped: false,
  },
  render: (args) => {
    return html`
      <kyn-loader-overlay ?stopped=${args.stopped}></kyn-loader-overlay>
    `;
  },
};
