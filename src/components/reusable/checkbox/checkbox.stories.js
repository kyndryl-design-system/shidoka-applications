import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Form Inputs/Checkbox',
  component: 'kyn-checkbox',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-370429&p=f&m=dev',
    },
  },
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
