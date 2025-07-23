import { html } from 'lit';

import './sampleEmptyStateComponents/emptyState.sample.ts';

export default {
  title: 'Patterns/Empty State',
  component: 'empty-state-sample-component',
  argTypes: {
    size: {
      options: ['small', 'medium', 'large', 'full'],
      control: { type: 'select' },
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
      if: {
        arg: 'size',
        eq: 'full',
      },
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
  size: 'medium',
  rel: '',
  target: '_self',
};

export const Default = {
  args: { ...args },
  render: (args) => {
    return html`
      <empty-state-sample-component
        size="${args.size}"
        rel="${args.rel}"
        target="${args.target}"
      ></empty-state-sample-component>
    `;
  },
};
Default.storyName = 'Default (Medium)';

export const SmallWidget = {
  args: { ...args, size: 'small' },
  render: (args) => {
    return html`
      <empty-state-sample-component
        size="${args.size}"
        rel="${args.rel}"
        target="${args.target}"
      ></empty-state-sample-component>
    `;
  },
};
SmallWidget.storyName = 'Small (Widget)';

export const LargeWidget = {
  args: { ...args, size: 'large' },
  render: (args) => {
    return html`
      <empty-state-sample-component
        size="${args.size}"
        rel="${args.rel}"
        target="${args.target}"
      ></empty-state-sample-component>
    `;
  },
};
LargeWidget.storyName = 'Large (Data Table / Widget)';

export const FullWidthHorizontal = {
  args: { ...args, size: 'full', orientation: 'horizontal' },
  render: (args) => {
    return html`
      <empty-state-sample-component
        size="${args.size}"
        orientation="${args.orientation}"
        rel="${args.rel}"
        target="${args.target}"
      ></empty-state-sample-component>
    `;
  },
};
FullWidthHorizontal.storyName = 'Full Width (Horizontal)';

export const FullWidthVertical = {
  args: { ...args, size: 'full', orientation: 'vertical' },
  render: (args) => {
    return html`
      <empty-state-sample-component
        size="${args.size}"
        orientation="${args.orientation}"
        rel="${args.rel}"
        target="${args.target}"
      ></empty-state-sample-component>
    `;
  },
};
FullWidthVertical.storyName = 'Full Width (Vertical)';
