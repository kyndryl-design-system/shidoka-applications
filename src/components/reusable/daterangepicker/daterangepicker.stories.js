import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Date Range Picker',
  component: 'kyn-date-range-picker',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=508%3A142381&mode=dev',
    },
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    minDate: {
      control: { type: 'text' },
    },
    maxDate: {
      control: { type: 'text' },
    },
    step: {
      control: { type: 'text' },
    },
    startDate: {
      control: { type: 'text' },
    },
    endDate: {
      control: { type: 'text' },
    },
  },
};

const args = {
  unnamed: 'Date',
  size: 'md',
  name: 'dateRangePicker',
  startDate: '',
  endDate: '',
  caption: '',
  required: false,
  disabled: false,
  invalidText: '',
  warnText: '',
  minDate: null,
  maxDate: null,
  step: null,
};

export const DateRangePicker = {
  args,
  render: (args) => {
    return html`
      <kyn-date-range-picker
        size=${args.size}
        name=${args.name}
        caption=${args.caption}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        warnText=${args.warnText}
        startDate=${args.startDate}
        endDate=${args.endDate}
        minDate=${ifDefined(args.minDate)}
        maxDate=${ifDefined(args.maxDate)}
        step=${ifDefined(args.step)}
        @on-input=${(e) => action(e.type)(e)}
        @keydown=${(e) => e.stopPropagation()}
      >
        ${args.unnamed}
      </kyn-date-range-picker>
    `;
  },
};
