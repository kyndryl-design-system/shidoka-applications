import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Radio Button',
  component: 'kyn-radio-button-group',
  subcomponents: {
    'kyn-radio-button': 'kyn-radio-button',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=32%3A2346&mode=dev',
    },
  },
};

export const RadioButtonGroup = {
  args: {
    label: 'Label',
    name: 'name',
    value: '1',
    required: false,
    disabled: false,
    horizontal: false,
    invalidText: '',
    description: 'Description',
    textStrings: {
      required: 'Required',
      error: 'Error',
    },
  },
  render: (args) => {
    return html`
      <kyn-radio-button-group
        name=${args.name}
        value=${args.value}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?horizontal=${args.horizontal}
        invalidText=${args.invalidText}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-radio-group-change=${(e) => action(e.type)(e)}
      >
        <div slot="description">${args.description}</div>
        <kyn-radio-button value="1"> Option 1 </kyn-radio-button>
        <kyn-radio-button value="2"> Option 2 </kyn-radio-button>
        <kyn-radio-button value="3"> Option 3 </kyn-radio-button>
      </kyn-radio-button-group>
    `;
  },
};
