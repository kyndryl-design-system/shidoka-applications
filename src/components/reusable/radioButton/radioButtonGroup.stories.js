import { html } from 'lit';
import './index';

export default {
  title: 'Reusable/Radio Button',
  component: 'kyn-radio-button-group',
  subcomponents: {
    RadioButton: 'kyn-radio-button',
  },
  autodocs: false,
};

export const RadioButtonGroup = {
  args: {
    labelText: 'Label',
    name: 'name',
    value: '',
    disabled: false,
    hideLabel: false,
    invalidText: '',
  },
  render: (args) => {
    return html`
      <kyn-radio-button-group
        name=${args.name}
        labelText=${args.labelText}
        value=${args.value}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        invalidText=${args.invalidText}
      >
        <kyn-radio-button value="1"> Option 1 </kyn-radio-button>
        <kyn-radio-button value="2"> Option 2 </kyn-radio-button>
        <kyn-radio-button value="3"> Option 3 </kyn-radio-button>
      </kyn-radio-button-group>
    `;
  },
};

RadioButtonGroup.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=32%3A2346&mode=dev',
  },
};
