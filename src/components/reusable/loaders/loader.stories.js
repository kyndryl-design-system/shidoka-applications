import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Loaders/Loader',
  component: 'kyn-loader',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Block = {
  args: {
    stopped: false,
  },
  render: (args) => {
    return html`
      <kyn-loader
        ?stopped=${args.stopped}
        @on-start=${(e) => action(e.type)(e)}
        @on-stop=${(e) => action(e.type)(e)}
      ></kyn-loader>
    `;
  },
};

export const Overlay = {
  args: {
    stopped: false,
  },
  render: (args) => {
    return html`
      <kyn-loader
        overlay
        ?stopped=${args.stopped}
        @on-start=${(e) => action(e.type)(e)}
        @on-stop=${(e) => action(e.type)(e)}
      ></kyn-loader>
    `;
  },
};
