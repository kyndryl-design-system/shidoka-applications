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
          >Control Label
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

export const IconPosition = {
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
        <span slot="icon">${unsafeSVG(circleIcon)}</span>
        Dark
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="light" iconPosition="right">
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
        <span slot="icon">${unsafeSVG(circleIcon)}</span>
      </kyn-segmented-control-item>
      <kyn-segmented-control-item value="light">
        <span slot="icon">${unsafeSVG(lightbulbIcon)}</span>
      </kyn-segmented-control-item>
    </kyn-segmented-control>
  `,
};
