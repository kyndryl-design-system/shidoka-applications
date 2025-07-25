import { html } from 'lit';
import { action } from 'storybook/actions';
import './index';

export default {
  title: 'Components/Tooltip',
  component: 'kyn-tooltip',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4-423746&p=f&m=dev',
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
      <kyn-tooltip
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-tooltip>
    `;
  },
};

export const CustomAnchor = {
  args,
  render: (args) => {
    return html`
      <kyn-tooltip
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
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
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 16px; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 16px; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 16px; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 16px; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; top: 50%; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; left: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; left: 50%;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>

      <kyn-tooltip
        style="position: absolute; bottom: 16px; right: 16px;"
        @on-tooltip-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="anchor">Custom<br />anchor</span>

        ${args.unnamed}
      </kyn-tooltip>
    `;
  },
};
