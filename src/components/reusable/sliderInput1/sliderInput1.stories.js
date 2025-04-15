import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Slider Input1',
  component: 'kyn-slider-input1',
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
      url: '',
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
  step: 1,
  min: 0,
  max: 100,
  editableInput: false,
  enableTicksOnSlider: false,
  enableScaleMarkers: false,
  textStrings: {
    error: 'Error',
  },
};

export const Default = {
  args,
  render: (args) => {
    return html`
      <kyn-slider-input1
        name=${args.name}
        value=${args.value}
        caption=${args.caption}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        ?hideLabel=${args.hideLabel}
        step=${ifDefined(args.step)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        ?editableInput=${args.editableInput}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input1>
    `;
  },
};

export const WithNumberInput = {
  args: { ...args, editableInput: true },
  render: (args) => {
    return html`
      <kyn-slider-input1
        name=${args.name}
        value=${args.value}
        caption=${args.caption}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        ?hideLabel=${args.hideLabel}
        step=${ifDefined(args.step)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        ?editableInput=${args.editableInput}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input1>
    `;
  },
};

export const TicksMarker = {
  render: () => {
    return html`
      <kyn-slider-input1
        name="rangeInput"
        value="0"
        caption=""
        ?disabled=${false}
        invalidText=""
        ?hideLabel=${false}
        step="2"
        min="0"
        max="8"
        ?editableInput=${false}
        ?enableTicksOnSlider=${true}
        label="Label"
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input1>
    `;
  },
};

export const ScaleMarker = {
  render: () => {
    return html`
      <kyn-slider-input1
        name="rangeInput"
        value="0"
        caption=""
        ?disabled=${false}
        invalidText=""
        ?hideLabel=${false}
        step="2"
        min="0"
        max="8"
        ?editableInput=${false}
        ?enableTicksOnSlider=${true}
        ?enableScaleMarkers=${true}
        label="Label"
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input1>
    `;
  },
};
