import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Text Area',
  component: 'kyn-text-area',
  argTypes: {
    minLength: {
      control: { type: 'number' },
    },
    maxLength: {
      control: { type: 'number' },
    },
  },
};

const args = {
  label: 'Label',
  name: 'text-area-1',
  value: '',
  placeholder: '',
  caption: '',
  required: false,
  disabled: false,
  invalidText: '',
  minLength: undefined,
  maxLength: undefined,
  rows: undefined,
  textStrings: {
    requiredText: 'Required',
    errorText: 'Error',
  },
};

const Template = (args) => {
  return html`
    <kyn-text-area
      name=${args.name}
      value=${args.value}
      placeholder=${args.placeholder}
      caption=${args.caption}
      ?required=${args.required}
      ?disabled=${args.disabled}
      invalidText=${args.invalidText}
      .textStrings=${args.textStrings}
      minLength=${ifDefined(args.minLength)}
      maxLength=${ifDefined(args.maxLength)}
      rows=${args.rows}
      ?aiConnected=${args.aiConnected}
      maxRowsVisible=${args.maxRowsVisible}
      @on-input=${(e) => action(e.type)(e)}
      @keydown=${(e) => e.stopPropagation()}
      label=${args.label}
    >
    </kyn-text-area>
  `;
};

export const TextArea = Template.bind({});
TextArea.args = {
  ...args,
};

export const AIConnected = Template.bind({});
AIConnected.args = {
  ...args,
  aiConnected: true,
  rows: 1,
  maxRowsVisible: 4,
};

TextArea.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=215%3A2099&mode=dev',
  },
};
