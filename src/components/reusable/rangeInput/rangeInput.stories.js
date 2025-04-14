import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Range Input',
  component: 'kyn-range-input',
  argTypes: {
    value: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?node-id=14893-233109&m=dev',
    },
  },
};

const args = {
  label: 'Label',
  name: 'rangeInput',
  value: 0,
  caption: '',
  disabled: false,
  invalidText: '',
  hideLabel: false,
  step: 10,
  min: 0,
  max: 100,
  textStrings: {
    error: 'Error',
  },
};

export const RangeInput = {
  args,
  render: (args) => {
    return html`
      <kyn-range-input
        size=${args.size}
        name=${args.name}
        value=${args.value}
        caption=${args.caption}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        ?hideLabel=${args.hideLabel}
        step=${ifDefined(args.step)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-range-input>
    `;
  },
};
