/**
 * Copyright Kyndryl, Inc. 2023
 */

// External library imports
import { html } from 'lit';
import { action } from 'storybook/actions';
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
  selected: false,
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
        ?selected=${args.selected}
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-button>
    `;
  },
};

Button.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-364159&p=f&m=dev',
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
        ?selected=${args.selected}
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
        <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
      </kyn-button>
    `;
  },
};

export const ButtonWithIconSplitLayout = {
  args: {
    ...args,
    splitLayout: true,
  },
  render: (args) => {
    return html`
      <kyn-button
        style="width: 100%;"
        ?splitLayout=${args.splitLayout}
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
        ?selected=${args.selected}
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
        <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
      </kyn-button>
    `;
  },
};
1;

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
        ?selected=${args.selected}
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
      <div
        class="heading kd-type--headline-04"
        style="margin-bottom:var(--kd-spacing-24)"
      >
        Gallery
      </div>
      <div
        style="display: flex;gap: var(--kd-spacing-16); flex-direction: column; "
      >
        <div>
          <div class="heading kd-type--headline-06 heading-text">Primary</div>

          <kyn-button>Primary</kyn-button>
          <kyn-button kind="secondary">Secondary</kyn-button>
          <kyn-button kind="tertiary">Tertiary</kyn-button>
          <kyn-button kind="outline">Outline</kyn-button>
          <kyn-button kind="ghost">Ghost</kyn-button>
        </div>
        <div>
          <div class="heading kd-type--headline-06 heading-text">AI</div>
          <kyn-button kind="primary-ai">Primary AI</kyn-button>
          <kyn-button kind="ghost-ai">Ghost AI</kyn-button>
        </div>
        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Destructive
          </div>
          <kyn-button kind="primary-destructive"
            >Primary Destructive</kyn-button
          >
          <kyn-button kind="secondary-destructive">
            Secondary Destructive
          </kyn-button>
          <kyn-button kind="outline-destructive"
            >Outline Destructive</kyn-button
          >
          <kyn-button kind="ghost-destructive">Ghost Destructive</kyn-button>
        </div>

        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Miscellaneous
          </div>
          <kyn-button kind="content">Content</kyn-button>
        </div>

        <div>
          <div class="heading kd-type--headline-06 heading-text">Disabled</div>

          <kyn-button disabled>Solid Disabled</kyn-button>
          <kyn-button kind="outline" disabled>Outline Disabled</kyn-button>
          <kyn-button kind="ghost" disabled>Ghost Disabled</kyn-button>
        </div>
      </div>
      <style>
        .heading-text {
          margin-bottom: var(--kd-spacing-12);
        }
      </style>
    `;
  },
};
