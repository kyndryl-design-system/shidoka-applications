import { html } from 'lit';
import './index';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import infoIcon16 from '@carbon/icons/es/information/16';

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
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=2897%3A2521&mode=dev',
    },
  },
};

const args = {
  open: false,
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
        <kd-icon slot="anchor" .icon=${infoIcon16}></kd-icon>

        Small info icon anchor.
      </kyn-tooltip>
    `;
  },
};
