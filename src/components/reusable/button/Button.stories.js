/**
 * Copyright Kyndryl, Inc. 2023
 */

// External library imports
import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
// Relative component and helper imports
import './button';
import {
  BUTTON_KINDS,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_ICON_POSITION,
} from './defs';
import { createOptionsArray } from '../../../common/helpers/helpers';

const createSelectOptions = (defs) => [null, ...createOptionsArray(defs)];

export default {
  title: 'Components/Button',
  component: 'kyn-button',
  parameters: {},
  argTypes: {
    type: {
      options: createSelectOptions(BUTTON_TYPES),
      control: { type: 'select', labels: { null: BUTTON_TYPES.BUTTON } },
      table: {
        defaultValue: { summary: BUTTON_TYPES.BUTTON },
      },
    },
    kind: {
      options: createSelectOptions(BUTTON_KINDS),
      control: { type: 'select', labels: { null: BUTTON_KINDS.PRIMARY_APP } },
      table: {
        defaultValue: { summary: BUTTON_KINDS.PRIMARY_APP },
      },
    },
    size: {
      options: createSelectOptions(BUTTON_SIZES),
      control: { type: 'select', labels: { null: BUTTON_SIZES.MEDIUM } },
      table: {
        defaultValue: { summary: BUTTON_SIZES.MEDIUM },
      },
    },
    iconPosition: {
      options: createSelectOptions(BUTTON_ICON_POSITION),
      control: {
        type: 'select',
        labels: { null: BUTTON_ICON_POSITION.CENTER },
      },
      table: {
        defaultValue: { summary: BUTTON_ICON_POSITION.CENTER },
      },
    },
  },
};

const args = {
  unnamed: 'Button Text',
  kind: 'primary-app',
  type: 'button',
  size: 'medium',
  destructive: false,
  outlineOnly: false,
  ghost: false,
  disabled: false,
  iconPosition: 'right',
  description: 'Button description',
  href: '',
  name: '',
  value: '',
  isFloating: false,
  showOnScroll: false,
};

export const Button = {
  args,
  render: (args) => {
    return html`
      <kyn-button
        kind=${args.kind}
        type=${args.type}
        ?destructive=${args.destructive}
        ?outlineOnly=${args.outlineOnly}
        ?ghost=${args.ghost}
        ?disabled=${args.disabled}
        ?isFloating=${args.isFloating}
        ?showOnScroll=${args.showOnScroll}
        size=${args.size}
        iconPosition=${args.iconPosition}
        description=${args.description}
        href=${args.href}
        name=${args.name}
        value=${args.value}
        @on-click=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-button>
    `;
  },
};

Button.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/5TqtPa7KWfhJbQv6ELnbqf/Foundation?node-id=72%3A18796&mode=dev',
  },
};

export const ButtonWithIcon = {
  args,
  render: (args) => {
    return html`
      <kyn-button
        kind=${args.kind}
        type=${args.type}
        ?destructive=${args.destructive}
        ?disabled=${args.disabled}
        ?outlineOnly=${args.outlineOnly}
        ?ghost=${args.ghost}
        ?isFloating=${args.isFloating}
        ?showOnScroll=${args.showOnScroll}
        size=${args.size}
        iconPosition=${args.iconPosition}
        description=${args.description}
        href=${args.href}
        name=${args.name}
        value=${args.value}
        @on-click=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
        <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
      </kyn-button>
    `;
  },
};

export const IconOnly = {
  args: {
    ...args,
    description: 'Button Description',
  },
  render: (args) => {
    return html`
      <kyn-button
        kind=${args.kind}
        type=${args.type}
        ?destructive=${args.destructive}
        ?outlineOnly=${args.outlineOnly}
        ?ghost=${args.ghost}
        ?disabled=${args.disabled}
        ?isFloating=${args.isFloating}
        ?showOnScroll=${args.showOnScroll}
        size=${args.size}
        iconPosition="center"
        description=${args.description}
        href=${args.href}
        name=${args.name}
        value=${args.value}
        @on-click=${(e) => action(e.type)(e)}
      >
        <span style="display:flex;" slot="icon"
          >${unsafeSVG(chevronRightIcon)}</span
        >
      </kyn-button>
    `;
  },
};
