import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './index';
import { action } from '@storybook/addon-actions';
import '../tooltip';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';

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
    width: { control: 'text' },
  },
};

const args = {
  name: 'sliderInput',
  value: '',
  caption: '',
  label: 'Label',
  hideLabel: false,
  disabled: false,
  min: '0',
  max: '100',
  step: 1,
  hideNumberInput: false,
  width: '200px',
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
        step=${args.step}
        ?hideNumberInput=${args.hideNumberInput}
        label=${args.label}
        width=${args.width}
        @on-input=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
      </kyn-slider-input>
    `;
  },
};

export const SliderInputWithHiddenInputs = {
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
        ?hideNumberInput=${true}
        label=${args.label}
        width=${args.width}
        @on-input=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
      </kyn-slider-input>
    `;
  },
};
