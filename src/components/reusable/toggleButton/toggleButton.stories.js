import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Toggle Button',
  component: 'kyn-toggle-button',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=62%3A4312&mode=dev',
    },
  },
};

export const ToggleButton = {
  args: {
    unnamed: 'Label',
    checked: false,
    name: 'toggle',
    value: 'example',
    small: false,
    disabled: false,
    reverse: false,
    checkedText: 'On',
    uncheckedText: 'Off',
  },
  render: (args) => {
    return html`
      <kyn-toggle-button
        ?checked=${args.checked}
        name=${args.name}
        value=${args.value}
        ?small=${args.small}
        ?disabled=${args.disabled}
        ?reverse=${args.reverse}
        checkedText=${args.checkedText}
        uncheckedText=${args.uncheckedText}
        @on-change=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-toggle-button>
    `;
  },
};
