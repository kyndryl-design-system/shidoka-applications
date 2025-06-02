import { html } from 'lit-html';
import { action } from '@storybook/addon-actions';
import './index';

export default {
  title: 'Components/Color Picker',
  component: 'kyn-color-picker',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  label: 'Color Picker',
  value: '#d1dbc5',
};

export const Default = {
  args,
  render: (args) => {
    return html`
      <kyn-color-picker
        label=${args.label}
        value=${args.value}
        @on-change=${(e) => action(e.type)(e)}
      >
      </kyn-color-picker>
    `;
  },
};

export const Opacity = {
  args: {
    ...args,
    label: 'Color Picker with Opacity',
    value: '#226570b0',
  },
  render: (args) => {
    return html`
      <kyn-color-picker
        label=${args.label}
        value=${args.value}
        opacity
        @on-change=${(e) => action(e.type)(e)}
      >
      </kyn-color-picker>
    `;
  },
};
