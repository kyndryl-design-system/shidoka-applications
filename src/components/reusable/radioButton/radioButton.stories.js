import { html } from 'lit';
import './index';

export default {
  title: 'Reusable/Radio Button',
  component: 'kyn-radio-button',
  autodocs: false,
};

export const RadioButton = {
  args: {
    unnamed: 'Label',
    value: 'example',
  },
  render: (args) => {
    return html`
      <kyn-radio-button value=${args.value}> ${args.unnamed} </kyn-radio-button>
    `;
  },
};

RadioButton.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=32%3A2346&mode=dev',
  },
};
