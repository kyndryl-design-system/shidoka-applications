import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Tooltip',
  component: 'kyn-tooltip',
  argTypes: {
    anchorPosition: {
      options: ['start', 'center', 'end'],
      control: { type: 'select' },
    },
    direction: {
      options: ['top', 'bottom', 'left', 'right'],
      control: { type: 'select' },
    },
  },
  decorators: [
    (story) => html` <div style="padding: 60px 280px;">${story()}</div> `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  open: true,
  anchorPosition: 'center',
  direction: 'top',
  assistiveText: 'Toggle Tooltip',
};

export const Tooltip = {
  args,
  render: (args) => {
    return html`
      <kyn-tooltip
        ?open=${args.open}
        anchorPosition=${args.anchorPosition}
        direction=${args.direction}
      >
        Tooltip content here.
      </kyn-tooltip>
    `;
  },
};

export const CustomAnchor = {
  args,
  render: (args) => {
    return html`
      <kyn-tooltip
        ?open=${args.open}
        anchorPosition=${args.anchorPosition}
        direction=${args.direction}
      >
        <span slot="anchor">
          Custom
          <br />
          Anchor
        </span>

        Tooltip content here.
      </kyn-tooltip>
    `;
  },
};
