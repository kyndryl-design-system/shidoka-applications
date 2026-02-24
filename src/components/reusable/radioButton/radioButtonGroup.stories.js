import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import { ValidationArgs } from '../../../common/helpers/helpers';

export default {
  title: 'Components/Form Inputs/Radio Button',
  component: 'kyn-radio-button-group',
  subcomponents: {
    'kyn-radio-button': 'kyn-radio-button',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-553013&p=f&m=dev',
    },
  },
  argTypes: {
    ...ValidationArgs,
  },
};

export const RadioButtonGroup = {
  args: {
    label: 'Label',
    name: 'name',
    value: '1',
    required: false,
    disabled: false,
    readonly: false,
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
        ?readonly=${args.readonly}
        ?horizontal=${args.horizontal}
        invalidText=${args.invalidText}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-radio-group-change=${(e) =>
          action(e.type)({ ...e, detail: e.detail })}
      >
        <div slot="description">${args.description}</div>
        <kyn-radio-button value="1" name="radio-button-1">
          Option 1
        </kyn-radio-button>
        <kyn-radio-button value="2" name="radio-button-2">
          Option 2
        </kyn-radio-button>
        <kyn-radio-button value="3" name="radio-button-3">
          Option 3
        </kyn-radio-button>
      </kyn-radio-button-group>
    `;
  },
};
