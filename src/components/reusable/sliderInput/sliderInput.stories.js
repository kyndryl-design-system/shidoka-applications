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
  step: 10,
  editableInput: false,
  multirange: false,
  invalidText: '',
};

export const Default = {
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
        step=${args.step}
        ?editableInput=${args.editableInput}
        label=${args.label}
        ?multirange=${args.multirange}
        @on-input=${(e) => action(e.type)(e)}
      >
        <div class="sliderticks" slot="tickmark" ?disabled=${args.disabled}>
          <span>${args.min}</span>
          <span>${args.max}</span>
        </div>
      </kyn-slider-input>
      <style>
        /* kyn-slider-input {
          width: 60%;
        } */
        .sliderticks {
          display: flex;
          justify-content: space-between;
          padding: 0px 5px;
          margin-top: 5px;
        }

        .sliderticks span {
          display: flex;
          justify-content: center;
          width: 1px;
          height: 0px;
          line-height: 40px;
          margin-bottom: 2rem;
        }
      </style>
    `;
  },
};

export const CustomStep = {
  args: { ...args, step: 50, max: 200, multirange: true },
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
        ?multirange=${args.multirange}
        @on-input=${(e) => action(e.type)(e)}
      >
        <div class="sliderticks" slot="tickmark" ?disabled=${args.disabled}>
          <span>${args.min}</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>${args.max}</span>
        </div>
      </kyn-slider-input>
      <style>
        .sliderticks {
          display: flex;
          justify-content: space-between;
          padding: 0px 5px;
          margin-top: 5px;
        }

        .sliderticks span {
          display: flex;
          justify-content: center;
          width: 1px;
          height: 0px;
          line-height: 40px;
          margin-bottom: 2rem;
        }
      </style>
    `;
  },
};
