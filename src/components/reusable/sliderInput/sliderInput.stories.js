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
  editableInput: false,
  showlimits: undefined,
  showTicks: undefined,
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
        ?showlimits=${args.showlimits}
        ?editableInput=${args.editableInput}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input>
      <style>
        kyn-slider-input {
          width: 50%;
        }
      </style>
    `;
  },
};

export const VisibleLimits = {
  args: { ...args, max: 100, showlimits: true, step: 10, showTicks: true },
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
        ?showlimits=${args.showlimits}
        min=${args.min}
        max=${args.max}
        step=${args.step}
        label=${args.label}
        ?showTicks=${args.showTicks}
        @on-input=${(e) => action(e.type)(e)}
      >
        <div class="sliderticks" slot="tickmark" ?disabled=${args.disabled}>
          <span>${args.min}</span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span>50</span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span>${args.max}</span>
        </div>
      </kyn-slider-input>
      <style>
        kyn-slider-input {
          width: 50%;
        }
        .sliderticks {
          display: flex;
          justify-content: space-between;
          /* padding: 0px 5px; */
          line-height: 40px;
        }

        .sliderticks span {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          align-self: stretch;
          width: 1px;
          height: 8px;
          background: #d3d3d3;
        }
      </style>
    `;
  },
};

export const DiscreteStep = {
  args: { ...args, step: 50, max: 200, showTicks: true, showlimits: true },
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
        ?showlimits=${args.showlimits}
        ?showTicks=${args.showTicks}
        @on-input=${(e) => action(e.type)(e)}
      >
        <div class="sliderticks" slot="tickmark" ?disabled=${args.disabled}>
          <span>${args.min}</span>
          <span>${args.max}</span>
        </div>
      </kyn-slider-input>
      <style>
        kyn-slider-input {
          width: 50%;
        }
        .sliderticks {
          display: flex;
          justify-content: space-between;
          padding: 5px 5px 0px;
        }

        .sliderticks span {
          display: flex;
          justify-content: center;
          width: 1px;
          height: 0px;
          /* line-height: 40px; */
          /* margin-bottom: 2rem; */
        }
      </style>
    `;
  },
};
