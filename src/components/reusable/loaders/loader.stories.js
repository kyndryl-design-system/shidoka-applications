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

export const Loader = {
  args: {
    stopped: false,
    overlay: false,
  },
  render: (args) => {
    return html`
      <kyn-loader
        ?stopped=${args.stopped}
        ?overlay=${args.overlay}
        @on-start=${(e) => action(e.type)(e)}
        @on-stop=${(e) => action(e.type)(e)}
      ></kyn-loader>
    `;
  },
};
