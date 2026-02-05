import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './index';
import { action } from 'storybook/actions';

import starOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';

export default {
  title: 'Components/Icon Selector',
  component: 'kyn-icon-selector',
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
        .hover-container:hover {
          --kyn-icon-selector-hover-opacity: 1;
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
