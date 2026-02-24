import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './index';
import { action } from 'storybook/actions';

import starOutlineIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';

export default {
  title: 'Components/Buttons & Actions/Icon Selector',
  component: 'kyn-icon-selector',
  argTypes: {
    onlyVisibleOnHover: { table: { disable: true } },
    persistWhenChecked: { table: { disable: true } },
    animateSelection: { table: { disable: true } },
    value: { table: { disable: true } },
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
