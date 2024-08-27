import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Slider',
  component: 'kyn-slider-wb',
  argTypes: {
    size: {
      options: ['auto', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
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
    sliderThemeColor: {
      options: ['spruce', 'earth', 'skye'],
      control: { type: 'select' },
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
  size: 'lg',
  sliderLabel: 'Slider 1',
  value: 0,
  defaultSliderValue: 0,
  name: 'Slider1',
  disabled: false,
  min: 0,
  max: 1000,
  sliderValueVisible: true,
  sliderThemeColor: 'spruce',
  minMaxVisible: true,
  step: 1,
};

export const KynSliderWb = {
  args,
  render: (args) => {
    return html`
      <kyn-slider-wb
        size=${args.size}
        sliderLabel=${args.sliderLabel}
        name=${args.name}
        ?disabled=${args.disabled}
        .defaultSliderValue=${args.defaultSliderValue}
        .value=${args.value}
        .min=${args.min}
        .max=${args.max}
        .step=${args.step}
        ?sliderValueVisible=${args.sliderValueVisible}
        sliderThemeColor=${args.sliderThemeColor}
        ?minMaxVisible=${args.minMaxVisible}
        @change=${(e) => action('change')(e.detail)}
      >
      </kyn-slider-wb>
    `;
  },
};
