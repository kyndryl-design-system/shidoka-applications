import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@kyndryl-design-system/foundation/components/icon';

export default {
  title: 'Components/Timepicker',
  component: 'kyn-time-picker',
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    minTime: {
      control: { type: 'text' },
    },
    maxTime: {
      control: { type: 'text' },
    },
    step: {
      control: { type: 'text' },
    },
  },
};

const args = {
  unnamed: 'Time',
  size: 'md',
  type: 'time',
  name: 'timepicker',
  value: '',
  placeholder: '-- : -- --',
  caption: '',
  required: false,
  disabled: false,
  invalidText: '',
  minTime: null,
  maxTime: null,
  step: null,
};

export const TimePicker = {
  args,
  render: (args) => {
    return html`
      <kyn-time-picker
        size=${args.size}
        name=${args.name}
        type=${args.type}
        value=${args.value}
        placeholder=${args.placeholder}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        minTime=${ifDefined(args.minTime)}
        maxTime=${ifDefined(args.maxTime)}
        step=${ifDefined(args.step)}
        @on-input=${(e) => action(e.type)(e)}
      >
        ${args.unnamed}
      </kyn-time-picker>
    `;
  },
};

TimePicker.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=508%3A142377&mode=dev',
  },
};
