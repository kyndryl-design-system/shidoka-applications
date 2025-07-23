import { html } from 'lit';

import './sampleEmptyStateComponents/emptyState.sample.ts';

export default {
  title: 'Patterns/Empty State',
  component: 'empty-state-sample-component',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Default = {
  render: () => {
    return html`
      <empty-state-sample-component
        size="medium"
        rel=""
        target="_self"
      ></empty-state-sample-component>
    `;
  },
};
Default.storyName = 'Default (Medium)';

export const SmallWidget = {
  render: () => {
    return html`
      <empty-state-sample-component
        size="small"
        rel=""
        target="_self"
      ></empty-state-sample-component>
    `;
  },
};
SmallWidget.storyName = 'Small (Widget)';

export const LargeWidget = {
  render: () => {
    return html`
      <empty-state-sample-component
        size="large"
        rel=""
        target="_self"
      ></empty-state-sample-component>
    `;
  },
};
LargeWidget.storyName = 'Large (Data Table / Widget)';

export const FullWidthHorizontal = {
  render: () => {
    return html`
      <empty-state-sample-component
        size="full"
        orientation="horizontal"
        rel=""
        target="_self"
      ></empty-state-sample-component>
    `;
  },
};
FullWidthHorizontal.storyName = 'Full Width (Horizontal)';

export const FullWidthVertical = {
  render: () => {
    return html`
      <empty-state-sample-component
        size="full"
        orientation="vertical"
        rel=""
        target="_self"
      ></empty-state-sample-component>
    `;
  },
};
FullWidthVertical.storyName = 'Full Width (Vertical)';
