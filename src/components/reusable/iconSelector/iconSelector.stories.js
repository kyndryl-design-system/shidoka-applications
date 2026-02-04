import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './index';
import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';

import starOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';

export default {
  title: 'Components/Icon Selector',
  component: 'kyn-icon-selector',
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
      control: { type: 'object' },
      description: 'Selected values array (for group)',
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

export const Group = {
  args: {
    direction: 'vertical',
    disabled: false,
  },
  render: (args) => {
    return html`
      <style>
        .group-hover-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 8px 16px;
          border-radius: 4px;
          transition: background-color 150ms;
        }
        .group-hover-container:hover {
          background-color: var(--kd-color-background-ui-soft);
        }
        .group-hover-container
          kyn-icon-selector[onlyVisibleOnHover]:not([checked]) {
          opacity: 0;
          transition: opacity 150ms ease-out;
        }
        .group-hover-container:hover kyn-icon-selector[onlyVisibleOnHover] {
          opacity: 1;
        }
        .group-hover-container kyn-icon-selector[checked] {
          opacity: 1;
        }
      </style>
      <kyn-icon-selector-group
        direction=${args.direction}
        ?disabled=${args.disabled}
        @on-change=${(e) => action(e.type)({ value: e.detail.value })}
      >
        <div class="group-hover-container">
          <span>Item One</span>
          <kyn-icon-selector
            value="item-1"
            onlyVisibleOnHover
            persistWhenChecked
          >
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
        <div class="group-hover-container">
          <span>Item Two</span>
          <kyn-icon-selector
            value="item-2"
            onlyVisibleOnHover
            persistWhenChecked
          >
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
        <div class="group-hover-container">
          <span>Item Three</span>
          <kyn-icon-selector
            value="item-3"
            onlyVisibleOnHover
            persistWhenChecked
          >
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
      </kyn-icon-selector-group>
    `;
  },
};

export const GroupHorizontal = {
  args: {
    direction: 'horizontal',
    disabled: false,
  },
  render: (args) => {
    return html`
      <kyn-icon-selector-group
        direction=${args.direction}
        ?disabled=${args.disabled}
        @on-change=${(e) => action(e.type)({ value: e.detail.value })}
      >
        <kyn-icon-selector value="item-1">
          <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
          <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
        </kyn-icon-selector>
        <kyn-icon-selector value="item-2">
          <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
          <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
        </kyn-icon-selector>
        <kyn-icon-selector value="item-3">
          <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
          <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
        </kyn-icon-selector>
      </kyn-icon-selector-group>
    `;
  },
};

export const GroupWithPreselected = {
  args: {
    direction: 'vertical',
    value: ['item-2'],
  },
  render: (args) => {
    const [, updateArgs] = useArgs();

    const handleChange = (e) => {
      updateArgs({ value: e.detail.value });
      action(e.type)({ value: e.detail.value });
    };

    return html`
      <style>
        .group-hover-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 8px 16px;
          border-radius: 4px;
          transition: background-color 150ms;
        }
        .group-hover-container:hover {
          background-color: var(--kd-color-background-ui-soft);
        }
        .group-hover-container
          kyn-icon-selector[onlyVisibleOnHover]:not([checked]) {
          opacity: 0;
          transition: opacity 150ms ease-out;
        }
        .group-hover-container:hover kyn-icon-selector[onlyVisibleOnHover] {
          opacity: 1;
        }
        .group-hover-container kyn-icon-selector[checked] {
          opacity: 1;
        }
      </style>
      <kyn-icon-selector-group
        direction=${args.direction}
        .value=${args.value}
        @on-change=${handleChange}
      >
        <div class="group-hover-container">
          <span>Item One</span>
          <kyn-icon-selector
            value="item-1"
            onlyVisibleOnHover
            persistWhenChecked
          >
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
        <div class="group-hover-container">
          <span>Item Two</span>
          <kyn-icon-selector
            value="item-2"
            onlyVisibleOnHover
            persistWhenChecked
          >
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
        <div class="group-hover-container">
          <span>Item Three</span>
          <kyn-icon-selector
            value="item-3"
            onlyVisibleOnHover
            persistWhenChecked
          >
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
      </kyn-icon-selector-group>
    `;
  },
};
