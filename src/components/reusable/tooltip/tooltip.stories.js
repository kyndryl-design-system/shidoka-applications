import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

export default {
  title: 'Components/Tooltip',
  component: 'kyn-tooltip',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=2897%3A2521&mode=dev',
    },
  },
};

const args = {
  assistiveText: 'Tooltip',
  unnamed: 'Tooltip content here.',
};

export const Tooltip = {
  args,
  render: (args) => {
    return html`
      <kyn-tooltip @on-tooltip-toggle=${(e) => action(e.type)(e)}>
        ${args.unnamed}
      </kyn-tooltip>
    `;
  },
};

export const CustomAnchor = {
  args,
  render: (args) => {
    return html`
      <kyn-tooltip @on-tooltip-toggle=${(e) => action(e.type)(e)}>
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>
    `;
  },
};

export const Positions = {
  args,
  render: (args) => {
    return html`
      <kyn-tooltip
        style="position: absolute; top: 16px; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 16px; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 16px; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-tooltip>
    `;
  },
};

export const PositionsCustom = {
  args,
  render: (args) => {
    return html`
      <kyn-tooltip
        style="position: absolute; top: 16px; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 16px; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 16px; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>
    `;
  },
};
