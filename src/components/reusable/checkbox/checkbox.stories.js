import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Form Inputs/Checkbox',
  component: 'kyn-checkbox',
};

export const Checkbox = {
  args: {
    unnamed: 'Label',
    value: 'example',
    checked: false,
    disabled: false,
    readonly: false,
    indeterminate: false,
  },
  render: (args) => {
    return html`
      <kyn-checkbox
        value=${args.value}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?indeterminate=${args.indeterminate}
        @on-checkbox-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.unnamed}
      </kyn-checkbox>
    `;
  },
};
