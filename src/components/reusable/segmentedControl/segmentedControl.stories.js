import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from 'storybook/actions';
import './index';
import { SEGMENTED_CONTROL_SIZES } from './defs';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import lightbulbIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/lightbulb.svg';

export default {
  title: 'Components/Buttons & Actions/Segmented Control',
  component: 'kyn-segmented-control',
  subcomponents: {
    'kyn-segmented-control-item': 'kyn-segmented-control-item',
  },
  argTypes: {
    size: {
      options: Object.values(SEGMENTED_CONTROL_SIZES),
      control: { type: 'select' },
      table: { defaultValue: { summary: SEGMENTED_CONTROL_SIZES.MEDIUM } },
    },
    multiple: { control: 'boolean' },
    description: { control: 'text' },
  },
};

export const Default = {
  args: {
    size: 'medium',
    multiple: false,
    description: 'Segmented control',
  },
  render: (args) => html`
    <kyn-segmented-control
      size=${args.size}
      description=${args.description}
      ?multiple=${args.multiple}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <kyn-segmented-control-item value="one" selected>
        <span slot="icon" style="display: flex;">${unsafeSVG(circleIcon)}</span>
        Control Label
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="two">
        Control Label</kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="three"
        >Control Label</kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="four"
        >Control Label</kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="five"
        >Control Label</kyn-segmented-control-item
      >
    </kyn-segmented-control>
  `,
};

export const UnevenLabels = {
  args: {
    size: 'medium',
    multiple: false,
    description: 'Segmented control',
  },
  render: (args) => html`
    <kyn-segmented-control
      size=${args.size}
      description=${args.description}
      ?multiple=${args.multiple}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <kyn-segmented-control-item value="day" selected
        >Day</kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="week">Week</kyn-segmented-control-item>
      <kyn-segmented-control-item value="month"
        >Longer month label</kyn-segmented-control-item
      >
    </kyn-segmented-control>
  `,
};

const renderResponsiveLabelItems = (compact) => html`
  <kyn-segmented-control-item
    value="devices"
    selected
    style="flex: 1 1 0; width: 25%; max-width: none;"
  >
    <span
      style="display: block; min-width: 0; max-width: ${compact
        ? '96px'
        : '100%'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
    >
      Devices
    </span>
  </kyn-segmented-control-item>
  <kyn-segmented-control-item
    value="os-devices"
    style="flex: 1 1 0; width: 25%; max-width: none;"
  >
    <span
      style="display: block; min-width: 0; max-width: ${compact
        ? '96px'
        : '100%'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
    >
      OS Devices
    </span>
  </kyn-segmented-control-item>
  <kyn-segmented-control-item
    value="more-devices"
    style="flex: 1 1 0; width: 25%; max-width: none;"
  >
    <span
      style="display: block; min-width: 0; max-width: ${compact
        ? '96px'
        : '100%'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
    >
      More Devices
    </span>
  </kyn-segmented-control-item>
  <kyn-segmented-control-item
    value="long-label-devices"
    style="flex: 1 1 0; width: 25%; max-width: none;"
  >
    <span
      style="display: block; min-width: 0; max-width: ${compact
        ? '96px'
        : '100%'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
    >
      Long Label Devices
    </span>
  </kyn-segmented-control-item>
`;

export const ResponsiveLabels = {
  args: {
    size: 'medium',
    multiple: false,
    description:
      'Full labels at wide widths and consumer-managed truncation at compact widths',
  },
  render: (args) => html`
    <i style="color:red"
      >**User managed truncation and responsive labels for testing
      purposes,Remove it before final commit</i
    >
    <br />
    <br />

    <i>Responsive Labels, resize the browser to see the effect</i>
    <div style="display: flex; flex-direction: column; gap: 32px;">
      <kyn-segmented-control
        size=${args.size}
        description=${args.description}
        ?multiple=${args.multiple}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${renderResponsiveLabelItems(false)}
      </kyn-segmented-control>

      <i>Fixed Track Width, with truncated labels</i>
      <kyn-segmented-control
        style="width: 750px;"
        size=${args.size}
        description=${args.description}
        ?multiple=${args.multiple}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${renderResponsiveLabelItems(true)}
      </kyn-segmented-control>
    </div>
  `,
};

export const Disabled = {
  args: {
    size: 'medium',
    multiple: false,
    description: 'Disabled segment',
  },
  render: (args) => html`
    <kyn-segmented-control
      description=${args.description}
      size=${args.size}
      ?multiple=${args.multiple}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <kyn-segmented-control-item value="one" selected>
        Control Label
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="two" disabled>
        Control Label
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="three">
        Control Label
      </kyn-segmented-control-item>
    </kyn-segmented-control>
  `,
};

export const WithIcons = {
  args: {
    size: 'medium',
    multiple: false,
    description: 'Segmented control',
  },
  render: (args) => html`
    <kyn-segmented-control
      description=${args.description}
      size=${args.size}
      ?multiple=${args.multiple}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <kyn-segmented-control-item value="dark" selected>
        <span slot="icon" style="display: flex;">${unsafeSVG(circleIcon)}</span>
        Dark
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="light" iconPosition="right">
        <span slot="icon" style="display: flex;"
          >${unsafeSVG(lightbulbIcon)}</span
        >
        Light
      </kyn-segmented-control-item>
    </kyn-segmented-control>
  `,
};

export const IconOnly = {
  args: {
    size: 'medium',
    multiple: false,
    description: 'Segmented control',
  },
  render: (args) => html`
    <kyn-segmented-control
      description=${args.description}
      size=${args.size}
      ?multiple=${args.multiple}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <kyn-segmented-control-item value="dark" selected>
        <span slot="icon" style="display: flex;">${unsafeSVG(circleIcon)}</span>
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="light">
        <span slot="icon" style="display: flex;"
          >${unsafeSVG(lightbulbIcon)}</span
        >
      </kyn-segmented-control-item>
    </kyn-segmented-control>
  `,
};
