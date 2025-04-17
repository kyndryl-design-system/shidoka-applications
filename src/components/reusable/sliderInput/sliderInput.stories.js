import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Slider Input',
  component: 'kyn-slider-input',
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
  min: undefined,
  max: undefined,
  editableInput: false,
  enableTickMarker: false,
  enableScaleMarker: false,
  textStrings: {
    error: 'Error',
  },
};

export const Continuous = {
  args,
  render: (args) => {
    return html`
      <kyn-slider-input
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
        ?enableScaleMarker=${args.enableScaleMarker}
        ?enableTickMarker=${args.enableTickMarker}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input>
    `;
  },
};

export const Discrete = {
  args: { ...args, step: 10, min: 0, max: 100 },
  render: (args) => {
    return html`
      <kyn-slider-input
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
        ?enableScaleMarker=${args.enableScaleMarker}
        ?enableTickMarker=${args.enableTickMarker}
        .textStrings=${args.textStrings}
        label=${args.label}
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input>
    `;
  },
};

export const WithNumberInput = {
  args: { ...args, editableInput: true },
  render: (args) => {
    return html`
      <kyn-slider-input
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
      </kyn-slider-input>
    `;
  },
};

export const TickMarker = {
  render: () => {
    return html`
      <kyn-slider-input
        name="rangeInput"
        value="4"
        caption=""
        invalidText=""
        ?hideLabel=${false}
        value="0"
        min="0"
        max="10"
        ?editableInput=${false}
        ?enableTickMarker=${true}
        label="Label"
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input>
    `;
  },
};

export const ScaleMarker = {
  render: () => {
    return html`
      <kyn-slider-input
        name="rangeInput"
        value="0"
        min="0"
        max="10"
        caption=""
        ?editableInput=${false}
        ?enableScaleMarker=${true}
        label="Label"
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input>
    `;
  },
};

export const ScaleAndTickMarker = {
  render: () => {
    return html`
      <kyn-slider-input
        name="rangeInput"
        min="0"
        max="10"
        ?editableInput=${false}
        ?enableTickMarker=${true}
        ?enableScaleMarker=${true}
        label="Label"
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input>
    `;
  },
};

export const Disabled = {
  render: () => {
    return html`
      <kyn-slider-input
        name="rangeInput"
        value="5"
        min="0"
        max="10"
        ?disabled=${true}
        ?editableInput=${true}
        ?enableTickMarker=${true}
        ?enableScaleMarker=${true}
        label="Label"
        @on-input=${(e) => action(e.type)(e)}
      >
      </kyn-slider-input>
    `;
  },
};
