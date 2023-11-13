import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Checkbox',
  component: 'kyn-checkbox',
};

export const Checkbox = {
  args: {
    unnamed: 'Label',
    value: 'example',
    checked: false,
    disabled: false,
  },
  render: (args) => {
    return html`
      <kyn-checkbox
        value=${args.value}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        @on-checkbox-change=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-checkbox>
    `;
  },
};

Checkbox.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=62%3A1137&mode=dev',
  },
};
