import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Checkbox',
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
    indeterminate: false,
  },
  render: (args) => {
    return html`
      <kyn-checkbox
        value=${args.value}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        ?indeterminate=${args.indeterminate}
        @on-checkbox-change=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-checkbox>
    `;
  },
};
