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

const onChange = (event) => action(event.type)(event);

export const Default = {
  args: {
    size: 'medium',
    multiple: true,
    description: 'Segmented control',
  },
  render: (args) => html`
    <kyn-segmented-control
      size=${args.size}
      description=${args.label}
      ?multiple=${args.multiple}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <kyn-segmented-control-item value="one" selected>
        <span slot="icon">${unsafeSVG(circleIcon)}</span>
        <span style="display: block; overflow: hidden; text-overflow: ellipsis;"
          >Control Label</span
        >
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="two">
        <span style="display: block; overflow: hidden; text-overflow: ellipsis;"
          >Control Label</span
        ></kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="three">
        <span style="display: block; overflow: hidden; text-overflow: ellipsis;"
          >Control Label</span
        ></kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="four">
        <span style="display: block; overflow: hidden; text-overflow: ellipsis;"
          >Control Label jsdhgjsh
        </span></kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="five">
        <span style="display: block; overflow: hidden; text-overflow: ellipsis;"
          >Control Label</span
        ></kyn-segmented-control-item
      >
    </kyn-segmented-control>
  `,
};

export const UnevenLabels = {
  args: {
    size: 'medium',
    multiple: false,
    description: 'Views',
  },
  render: (args) => html`
    <kyn-segmented-control
      size=${args.size}
      description=${args.label}
      ?multiple=${args.multiple}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <kyn-segmented-control-item value="day" selected
        >Day</kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="week">Week</kyn-segmented-control-item>
      <kyn-segmented-control-item value="month">
        <span
          style="display: block; overflow: hidden; text-overflow: ellipsis;"
        >
          Longer month label
        </span>
      </kyn-segmented-control-item>
    </kyn-segmented-control>
  `,
};

export const Multiple = {
  args: {
    size: 'medium',
    multiple: true,
    description: 'Filters',
  },
  render: (args) => html`
    <kyn-segmented-control
      size=${args.size}
      description=${args.label}
      ?multiple=${args.multiple}
      .value=${['alerts', 'reports']}
      @on-change=${onChange}
    >
      <kyn-segmented-control-item value="alerts"
        >Alerts</kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="reports"
        >Reports</kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="tasks"
        >Tasks</kyn-segmented-control-item
      >
      <kyn-segmented-control-item value="notes"
        >Notes</kyn-segmented-control-item
      >
    </kyn-segmented-control>
  `,
};

export const Disabled = {
  render: () => html`
    <kyn-segmented-control description="Disabled segment">
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

export const Narrow = {
  render: () => html`
    <div style="width: 240px;">
      <kyn-segmented-control description="Views">
        <kyn-segmented-control-item value="day" selected
          >Day</kyn-segmented-control-item
        >
        <kyn-segmented-control-item value="week"
          >Week</kyn-segmented-control-item
        >
        <kyn-segmented-control-item value="month">
          <span
            style="display: block; overflow: hidden; text-overflow: ellipsis;"
          >
            Longer month label
          </span>
        </kyn-segmented-control-item>
      </kyn-segmented-control>
    </div>
  `,
};

export const IconPosition = {
  render: () => html`
    <kyn-segmented-control description="Theme" size="small">
      <kyn-segmented-control-item value="dark" selected>
        <span slot="icon">${unsafeSVG(circleIcon)}</span>
        Dark
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="light" icon-position="right">
        <span slot="icon">${unsafeSVG(lightbulbIcon)}</span>
        Light
      </kyn-segmented-control-item>
    </kyn-segmented-control>
  `,
};

export const IconOnly = {
  args: {
    size: 'medium',
    multiple: false,
    description: 'Filters',
  },
  render: (args) => html`
    <kyn-segmented-control
      description=${args.label}
      size=${args.size}
      ?multiple=${args.multiple}
      @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
    >
      <kyn-segmented-control-item value="dark" selected>
        <span slot="icon">${unsafeSVG(circleIcon)}</span>
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="light">
        <span slot="icon">${unsafeSVG(lightbulbIcon)}</span>
      </kyn-segmented-control-item>
    </kyn-segmented-control>
  `,
};
