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
  defaultSliderValue: 0,
  lowerValue: 0,
  upperValue: 1000,
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
        defaultSliderValue=${args.defaultSliderValue}
        lowerValue=${args.lowerValue}
        upperValue=${args.upperValue}
        step=${args.step}
        ?sliderValueVisible=${args.sliderValueVisible}
        sliderThemeColor=${args.sliderThemeColor}
        ?minMaxVisible=${args.minMaxVisible}
        @on-slider-change=${(e) => action(e.type)(e)}
      >
      </kyn-slider-wb>
    `;
  },
};
