import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './index';
import { action } from '@storybook/addon-actions';
import '../tooltip';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';

export default {
  title: 'Components/Slider Input',
  component: 'kyn-text-input',
  argTypes: {},
};

const args = {
  name: 'sliderInput',
  value: '50',
  caption: '',
  label: 'Label',
  hideLabel: false,
  disabled: false,
  min: '0',
  max: '100',
  step: 1,
  width: '',
  invalidText: '',
  // vertical: false,
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
