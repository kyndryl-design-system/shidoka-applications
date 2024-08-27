import { html } from 'lit';
import './index';

export default {
  title: 'Components/ProgressBar',
  component: 'kyn-progress-bar-wb',
  argTypes: {
    size: {
      options: ['auto', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    progressBarThemeColor: {
      options: ['spruce', 'earth', 'skye'],
      control: { type: 'select' },
    },
    animationSpeed: {
      options: ['default', 'slow', 'fast'],
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
  animationSpeed: 'default',
  progressBarThemeColor: 'spruce',
  progress: 64,
  mainHeader: 'Progress Bar 1',
  subheader: 'This is a bar to show progress.',
};

export const KynProgressBarWb = {
  args,
  render: (args) => {
    return html`
      <kyn-progress-bar-wb
        size=${args.size}
        animationSpeed=${args.animationSpeed}
        progressBarThemeColor=${args.progressBarThemeColor}
        progress=${args.progress}
        mainHeader=${args.mainHeader}
        subheader=${args.subheader}
      >
      </kyn-progress-bar-wb>
    `;
  },
};
