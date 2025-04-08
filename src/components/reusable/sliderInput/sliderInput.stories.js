import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Slider Input',
  component: 'kyn-slider-input',
  argTypes: {
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
  },
};

const args = {
  name: 'sliderInput',
  value: 0,
  caption: '',
  label: 'Label',
  hideLabel: false,
  disabled: false,
  min: 0,
  max: 100,
  step: 1,
  editableInput: true,
  multirange: false,
  invalidText: '',
};

export const SliderInput = {
  args,
  render: (args) => {
    return html`
      <kyn-slider-input
        name=${args.name}
        value=${args.value}
        caption=${args.caption}
        ?hideLabel=${args.hideLabel}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        min=${args.min}
        max=${args.max}
        ?editableInput=${args.editableInput}
        label=${args.label}
        width=${args.width}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input>
    `;
  },
};

export const MultipleRangeControl = {
  args: { ...args, step: 25, multirange: true },
  render: (args) => {
    return html`
      <kyn-slider-input
        name=${args.name}
        value=${args.value}
        caption=${args.caption}
        ?hideLabel=${args.hideLabel}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        ?editableInput=${args.editableInput}
        min=${args.min}
        max=${args.max}
        step=${args.step}
        label=${args.label}
        multirange
        @on-input=${(e) => action(e.type)(e)}
      >
        <div class="sliderticks" slot="tickmark">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </kyn-slider-input>
      <style>
        .sliderticks {
          display: flex;
          justify-content: space-between;
          padding: 1px 0px 0px 8px;
        }

        .sliderticks span {
          display: flex;
          justify-content: center;
          width: 1px;
          height: 8px;
          background: var(--kd-color-background-accent-tertiary);
          line-height: 45px;
          margin-bottom: 20px;
        }
      </style>
    `;
  },
};
