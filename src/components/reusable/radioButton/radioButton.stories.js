import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Radio Button',
  component: 'kyn-radio-button',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=32%3A2346&mode=dev',
    },
  },
};

export const RadioButton = {
  args: {
    unnamed: 'Label',
    checked: false,
    disabled: false,
    value: 'example',
  },
  render: (args) => {
    return html`
      <kyn-radio-button
        value=${args.value}
        .checked=${args.checked}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        @on-radio-change=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-radio-button>
    `;
  },
};
