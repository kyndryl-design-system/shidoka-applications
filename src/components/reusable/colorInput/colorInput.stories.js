import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

export default {
  title: 'Components/Color Input',
  component: 'kyn-color-input',
};

const args = {
  name: 'colorInput',
  value: '#FF0000',
  caption: '',
  label: 'Label',
  disabled: false,
  readonly: false,
  hideLabel: false,
  textStrings: {
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
        ?readonly=${args.readonly}
        ?hideLabel=${args.hideLabel}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-color-input>
    `;
  },
};
