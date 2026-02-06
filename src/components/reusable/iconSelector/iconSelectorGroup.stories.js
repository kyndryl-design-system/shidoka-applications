import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './index';
import { action } from 'storybook/actions';

import starOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';

export default {
  title: 'Components/Icon Selector',
  component: 'kyn-icon-selector-group',
  subcomponents: {
    'kyn-icon-selector': 'kyn-icon-selector',
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    onlyVisibleOnHover: {
      control: { type: 'boolean' },
    },
    persistWhenChecked: {
      control: { type: 'boolean' },
    },
    animateSelection: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Group = {
  args: {
    direction: 'vertical',
    disabled: false,
    onlyVisibleOnHover: true,
    persistWhenChecked: true,
    animateSelection: true,
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
        .group-hover-container:hover {
          --kyn-icon-selector-hover-opacity: 1;
        }
      </style>
      <kyn-icon-selector-group
        direction=${args.direction}
        ?disabled=${args.disabled}
        ?onlyVisibleOnHover=${args.onlyVisibleOnHover}
        ?persistWhenChecked=${args.persistWhenChecked}
        ?animateSelection=${args.animateSelection}
        @on-change=${(e) => action(e.type)({ value: e.detail.value })}
      >
        <div class="group-hover-container">
          <span>Item One</span>
          <kyn-icon-selector value="item-1">
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
        <div class="group-hover-container">
          <span>Item Two</span>
          <kyn-icon-selector value="item-2">
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
        <div class="group-hover-container">
          <span>Item Three</span>
          <kyn-icon-selector value="item-3">
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
    onlyVisibleOnHover: true,
    persistWhenChecked: true,
    animateSelection: true,
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
        .group-hover-container:hover {
          --kyn-icon-selector-hover-opacity: 1;
        }
      </style>
      <kyn-icon-selector-group
        direction=${args.direction}
        .value=${args.value}
        ?onlyVisibleOnHover=${args.onlyVisibleOnHover}
        ?persistWhenChecked=${args.persistWhenChecked}
        ?animateSelection=${args.animateSelection}
        @on-change=${(e) => action(e.type)({ value: e.detail.value })}
      >
        <div class="group-hover-container">
          <span>Item One</span>
          <kyn-icon-selector value="item-1">
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
        <div class="group-hover-container">
          <span>Item Two</span>
          <kyn-icon-selector value="item-2">
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
        <div class="group-hover-container">
          <span>Item Three</span>
          <kyn-icon-selector value="item-3">
            <span slot="icon-unchecked">${unsafeSVG(starOutlineIcon)}</span>
            <span slot="icon-checked">${unsafeSVG(starFilledIcon)}</span>
          </kyn-icon-selector>
        </div>
      </kyn-icon-selector-group>
    `;
  },
};
