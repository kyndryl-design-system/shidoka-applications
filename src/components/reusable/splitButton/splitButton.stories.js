import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import chevronRightIcon from '@carbon/icons/es/checkmark--outline/20';

import './index';
import { createOptionsArray } from '@kyndryl-design-system/shidoka-foundation';
import {
  SPLIT_BTN_KINDS,
  SPLIT_BTN_SIZES,
  SPLIIT_BTN_ICON_POSITION,
} from './defs';
const createSelectOptions = (defs) => [null, ...createOptionsArray(defs)];

export default {
  title: 'Components/SplitButton',
  component: 'kyn-split-btn',
  subcomponents: {
    SplitButtonOption: 'kyn-splitbutton-option',
  },
  argTypes: {
    kind: {
      options: createSelectOptions(SPLIT_BTN_KINDS),
      control: {
        type: 'select',
        labels: { null: SPLIT_BTN_KINDS.PRIMARY_APP },
      },
      table: {
        defaultValue: { summary: SPLIT_BTN_KINDS.PRIMARY_APP },
      },
    },
    size: {
      options: createSelectOptions(SPLIT_BTN_SIZES),
      control: { type: 'select', labels: { null: SPLIT_BTN_SIZES.MEDIUM } },
      table: {
        defaultValue: { summary: SPLIT_BTN_SIZES.MEDIUM },
      },
    },
    iconPosition: {
      options: createSelectOptions(SPLIIT_BTN_ICON_POSITION),
      control: {
        type: 'select',
        labels: { null: SPLIIT_BTN_ICON_POSITION.LEFT },
      },
      table: {
        defaultValue: { summary: SPLIIT_BTN_ICON_POSITION.LEFT },
      },
    },
  },
};

const args = {
  size: 'medium',
  kind: 'primary-app',
  destructive: false,
  disabled: false,
  description: 'Split button description',
  label: 'Primary Action',
  name: '',
  iconPosition: 'left',
};

export const Default = {
  args,
  render: (args) => {
    return html`
      <kyn-split-btn
        kind=${args.kind}
        ?destructive=${args.destructive}
        ?disabled=${args.disabled}
        size=${args.size}
        description=${args.description}
        name=${args.name}
        label=${args.label}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-splitbutton-option value="1" @on-click=${(e) => action(e.type)(e)}
          >Option 1</kyn-splitbutton-option
        >
        <kyn-splitbutton-option value="2" disabled
          >Option 2</kyn-splitbutton-option
        >
        <kyn-splitbutton-option value="3" @on-click=${(e) => action(e.type)(e)}
          >Option 3</kyn-splitbutton-option
        >
      </kyn-split-btn>
    `;
  },
};

export const WithIcon = {
  args,
  render: (args) => {
    return html`
      <kyn-split-btn
        kind=${args.kind}
        ?destructive=${args.destructive}
        ?disabled=${args.disabled}
        size=${args.size}
        description=${args.description}
        name=${args.name}
        label=${args.label}
        iconPosition=${args.iconPosition}
      >
        <kyn-splitbutton-option value="1" @on-click=${(e) => action(e.type)(e)}
          >Option 1</kyn-splitbutton-option
        >
        <kyn-splitbutton-option value="2" @on-click=${(e) => action(e.type)(e)}
          >Option 2</kyn-splitbutton-option
        >
        <kyn-splitbutton-option value="3" disabled
          >Option 3</kyn-splitbutton-option
        >
        <kd-icon slot="icon" .icon=${chevronRightIcon}></kd-icon>
      </kyn-split-btn>
    `;
  },
};
