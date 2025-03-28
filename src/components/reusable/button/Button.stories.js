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
      control: { type: 'select', labels: { null: BUTTON_KINDS.PRIMARY } },
      table: {
        defaultValue: { summary: BUTTON_KINDS.PRIMARY },
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
  kind: 'primary',
  type: 'button',
  size: 'medium',
  disabled: false,
  iconPosition: 'right',
  description: 'Button description',
  href: '',
  target: '_self',
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
        ?disabled=${args.disabled}
        ?isFloating=${args.isFloating}
        ?showOnScroll=${args.showOnScroll}
        size=${args.size}
        iconPosition=${args.iconPosition}
        description=${args.description}
        href=${args.href}
        target=${args.target}
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
        ?disabled=${args.disabled}
        ?isFloating=${args.isFloating}
        ?showOnScroll=${args.showOnScroll}
        size=${args.size}
        iconPosition=${args.iconPosition}
        description=${args.description}
        href=${args.href}
        target=${args.target}
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
        ?disabled=${args.disabled}
        ?isFloating=${args.isFloating}
        ?showOnScroll=${args.showOnScroll}
        size=${args.size}
        iconPosition="center"
        description=${args.description}
        href=${args.href}
        target=${args.target}
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

export const Gallery = {
  render: () => {
    return html`
      <div class="heading kd-type--headline-04">Gallery</div>

      <div class="heading kd-type--headline-06">Primary</div>

      <kyn-button>Primary</kyn-button>
      <kyn-button kind="secondary">Secondary</kyn-button>
      <kyn-button kind="tertiary">Tertiary</kyn-button>
      <kyn-button kind="outline">Outline</kyn-button>

      <div class="heading kd-type--headline-06">AI</div>

      <kyn-button kind="primary-ai">Primary AI</kyn-button>
      <kyn-button kind="secondary-ai">Secondary AI</kyn-button>
      <kyn-button kind="outline-ai">Outline AI</kyn-button>

      <div class="heading kd-type--headline-06">Destructive</div>

      <kyn-button kind="primary-destructive">Primary Destructive</kyn-button>
      <kyn-button kind="secondary-destructive">
        Secondary Destructive
      </kyn-button>
      <kyn-button kind="outline-destructive">Outline Destructive</kyn-button>

      <div class="heading kd-type--headline-06">Miscellaneous</div>

      <kyn-button kind="ghost">Ghost</kyn-button>
      <kyn-button kind="content">Content</kyn-button>

      <div class="heading kd-type--headline-06">Disabled</div>

      <kyn-button disabled>Solid Disabled</kyn-button>
      <kyn-button kind="outline" disabled>Outline Disabled</kyn-button>
      <kyn-button kind="ghost" disabled>Ghost Disabled</kyn-button>
    `;
  },
};
