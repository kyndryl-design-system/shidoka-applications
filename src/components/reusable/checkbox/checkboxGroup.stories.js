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
    label: 'Label',
    name: 'name',
    value: ['1'],
    required: false,
    disabled: false,
    horizontal: false,
    selectAll: false,
    hideLegend: false,
    filterable: false,
    limitCheckboxes: false,
    invalidText: '',
    textStrings: {
      selectAll: 'Select all',
      showMore: 'Show more',
      showLess: 'Show less',
    },
  },
  render: (args) => {
    return html`
      <kyn-checkbox-group
        name=${args.name}
        .value=${args.value}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?horizontal=${args.horizontal}
        ?selectAll=${args.selectAll}
        ?hideLegend=${args.hideLegend}
        ?filterable=${args.filterable}
        ?limitCheckboxes=${args.limitCheckboxes}
        invalidText=${args.invalidText}
        .textStrings=${args.textStrings}
        @on-checkbox-group-change=${(e) => action(e.type)(e)}
      >
        <span slot="label">${args.label}</span>
        <kyn-checkbox value="1"> Option 1 </kyn-checkbox>
        <kyn-checkbox value="2"> Option 2 </kyn-checkbox>
        <kyn-checkbox value="3"> Option 3 </kyn-checkbox>
        <kyn-checkbox value="4"> Option 4 </kyn-checkbox>
        <kyn-checkbox value="5"> Option 5 </kyn-checkbox>
        <kyn-checkbox value="6"> Option 6 </kyn-checkbox>
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
