import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark.svg';
import './index';
import { createOptionsArray } from '../../../common/helpers/helpers';
import {
  SPLIT_BTN_KINDS,
  SPLIT_BTN_SIZES,
  SPLIIT_BTN_ICON_POSITION,
} from './defs';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
const createSelectOptions = (defs) => [null, ...createOptionsArray(defs)];

export default {
  title: 'Components/Split Button',
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
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ssZ3MSPHNv0qhIvdiY3rXi/Dubrovnik-Release?node-id=279-55369&m=dev',
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
  menuMinWidth: 'initial',
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
        menuMinWidth=${args.menuMinWidth}
        @on-click=${(e) => action(e.type)(e)}
      >
        <kyn-splitbutton-option value="1">Option 1</kyn-splitbutton-option>
        <kyn-splitbutton-option value="2" disabled
          >Option 2</kyn-splitbutton-option
        >
        <kyn-splitbutton-option value="3">Option 3</kyn-splitbutton-option>
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
        menuMinWidth=${args.menuMinWidth}
        @on-click=${(e) => action(e.type)(e)}
      >
        <kyn-splitbutton-option value="1">Option 1</kyn-splitbutton-option>
        <kyn-splitbutton-option value="2">Option 2</kyn-splitbutton-option>
        <kyn-splitbutton-option value="3" disabled
          >Option 3</kyn-splitbutton-option
        >
        <span style="display: flex;" slot="icon"
          >${unsafeSVG(chevronRightIcon)}</span
        >
      </kyn-split-btn>
    `;
  },
};
