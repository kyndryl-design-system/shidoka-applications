import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Checkbox',
  component: 'kyn-checkbox-group',
  subcomponents: {
    Checkbox: 'kyn-checkbox',
  },
};

export const CheckboxGroup = {
  args: {
    labelText: 'Label',
    name: 'name',
    value: ['1'],
    required: false,
    disabled: false,
    invalidText: '',
  },
  render: (args) => {
    return html`
      <kyn-checkbox-group
        name=${args.name}
        labelText=${args.labelText}
        .value=${args.value}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        @on-checkbox-group-change=${(e) => action(e.type)(e)}
      >
        <kyn-checkbox value="1"> Option 1 </kyn-checkbox>
        <kyn-checkbox value="2"> Option 2 </kyn-checkbox>
        <kyn-checkbox value="3"> Option 3 </kyn-checkbox>
      </kyn-checkbox-group>
    `;
  },
};

CheckboxGroup.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=32%3A2346&mode=dev',
  },
};
