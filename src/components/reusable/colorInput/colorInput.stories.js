import { html } from 'lit';
import { action } from 'storybook/actions';
import { ValidationArgs } from '../../../common/helpers/helpers';
import './index';

export default {
  title: 'Components/Color Input',
  component: 'kyn-color-input',
  argTypes: {
    ...ValidationArgs,
  },
};

const args = {
  name: 'colorInput',
  value: '#FF0000',
  caption: '',
  label: 'Label',
  disabled: false,
  required: false,
  readonly: false,
  hideLabel: false,
  invalidText: '',
  autoComplete: 'off',
  textStrings: {
    requiredText: 'Required',
    errorText: 'Error',
    pleaseSelectColor: 'Please select a color',
    invalidFormat: 'Enter a valid hex color (e.g. #FF0000)',
  },
};

export const Default = {
  args,
  render: (args) => {
    return html`
      <kyn-color-input
        name=${args.name}
        value=${args.value}
        caption=${args.caption}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?readonly=${args.readonly}
        ?hideLabel=${args.hideLabel}
        invalidText=${args.invalidText}
        .textStrings=${args.textStrings}
        autoComplete=${args.autoComplete}
        label=${args.label}
        @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
      </kyn-color-input>
    `;
  },
};
