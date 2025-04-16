import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Radio Button',
  component: 'kyn-radio-button',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-553013&p=f&m=dev',
    },
  },
};

export const RadioButton = {
  args: {
    unnamed: 'Label',
    checked: false,
    disabled: false,
    value: 'example',
  },
  render: (args) => {
    return html`
      <kyn-radio-button
        value=${args.value}
        .checked=${args.checked}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        @on-radio-change=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-radio-button>
    `;
  },
};
