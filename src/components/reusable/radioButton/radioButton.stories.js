import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Form Inputs/Radio Button',
  component: 'kyn-radio-button',
};

export const RadioButton = {
  args: {
    unnamed: 'Label',
    checked: false,
    disabled: false,
    readonly: false,
    value: 'example',
  },
  render: (args) => {
    return html`
      <kyn-radio-button
        value=${args.value}
        .checked=${args.checked}
        name="radio-button-1"
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        @on-radio-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-radio-button>
    `;
  },
};
