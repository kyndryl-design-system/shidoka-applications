import { html } from 'lit';
import './index';

export default {
  title: 'Reusable/Radio Button',
  component: 'kyn-radio-button-group',
  subcomponents: {
    RadioButton: 'kyn-radio-button',
  },
};

export const RadioButtons = {
  args: {
    labelText: 'Label',
    name: 'name',
    value: '',
  },
  render: (args) => {
    return html`
      <kyn-radio-button-group
        name=${args.name}
        labelText=${args.labelText}
        value=${args.value}
      >
        <kyn-radio-button value="1"> Option 1 </kyn-radio-button>
        <kyn-radio-button value="2"> Option 2 </kyn-radio-button>
        <kyn-radio-button value="3"> Option 3 </kyn-radio-button>
      </kyn-radio-button-group>
    `;
  },
};

RadioButtons.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=32%3A2346&mode=dev',
  },
};
