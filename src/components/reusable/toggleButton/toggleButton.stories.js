import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Reusable/Toggle Button',
  component: 'kyn-toggle-button',
};

export const ToggleButton = {
  args: {
    unnamed: 'Label',
    checked: false,
    small: false,
    disabled: false,
    checkedText: 'On',
    uncheckedText: 'Off',
  },
  render: (args) => {
    return html`
      <kyn-toggle-button
        value=${args.value}
        ?checked=${args.checked}
        ?small=${args.small}
        ?disabled=${args.disabled}
        checkedText=${args.checkedText}
        uncheckedText=${args.uncheckedText}
        @on-change=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-toggle-button>
    `;
  },
};

ToggleButton.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=62%3A4312&mode=dev',
  },
};
