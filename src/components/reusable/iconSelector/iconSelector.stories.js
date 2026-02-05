import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './index';
import { action } from 'storybook/actions';

import starOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';

export default {
  title: 'Components/Icon Selector',
  component: 'kyn-icon-selector',
  subcomponents: {
    'kyn-icon-selector-group': 'kyn-icon-selector-group',
  },
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Checked/selected state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    onlyVisibleOnHover: {
      control: { type: 'boolean' },
      description: 'When true, icon is only visible when parent is hovered',
    },
    persistWhenChecked: {
      control: { type: 'boolean' },
      description:
        'When true, checked items remain visible even with onlyVisibleOnHover',
    },
    value: {
      control: { type: 'text' },
      description: 'Value identifier for this selector',
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const IconSelector = {
  args: {
    value: 'example-item',
    checked: false,
    disabled: false,
    checkedLabel: 'Remove from favorites',
    uncheckedLabel: 'Add to favorites',
  },
  render: (args) => {
    return html`
      <kyn-icon-selector
        value=${args.value}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        checkedLabel=${args.checkedLabel}
        uncheckedLabel=${args.uncheckedLabel}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
        <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
      </kyn-icon-selector>
    `;
  },
};

export const OnlyVisibleOnHover = {
  args: {
    value: 'example-item',
    checked: false,
    onlyVisibleOnHover: true,
  },
  render: (args) => {
    return html`
      <style>
        .hover-container {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 16px;
          border-radius: 4px;
          transition: background-color 150ms;
        }
        .hover-container:hover {
          background-color: var(--kd-color-background-ui-soft);
        }
        .hover-container kyn-icon-selector[onlyVisibleOnHover] {
          opacity: 0;
          transition: opacity 150ms ease-out;
        }
        .hover-container:hover kyn-icon-selector[onlyVisibleOnHover] {
          opacity: 1;
        }
      </style>
      <div class="hover-container">
        <span>Hover over this row to see the icon</span>
        <kyn-icon-selector
          value=${args.value}
          ?checked=${args.checked}
          ?onlyVisibleOnHover=${args.onlyVisibleOnHover}
          @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
          <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
        </kyn-icon-selector>
      </div>
    `;
  },
};
