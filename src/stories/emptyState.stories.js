import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './emptyState/emptyState.skeleton';

import '../components/reusable/button/button';
import '../components/reusable/link/link';

import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import warningIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/warning.svg';
import chartComboIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/chart-combo.svg';
import selectIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/upload.svg';

import noDataIcon from '@kyndryl-design-system/shidoka-foundation/assets/svg/emptyState/empty-state-no-data.svg';
import dataVizIcon from '@kyndryl-design-system/shidoka-foundation/assets/svg/emptyState/empty-state-data-viz.svg';
import noSearchIcon from '@kyndryl-design-system/shidoka-foundation/assets/svg/emptyState/empty-state-no-search.svg';

export default {
  title: 'Patterns/Empty State',
  parameters: {
    docs: {
      page: null,
      description: {
        component: `
The Empty State pattern is used to indicate no available data or first‑time
usage. It helps orient users and suggest next steps.
        `,
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/your-url-here',
    },
  },
};

export const LargeNoData = {
  render: () =>
    html`<kyn-empty-state-skeleton
      size="large"
      emptyTitle="No data found."
      description="There is nothing here yet. You can start by importing the data or create your own items."
      .icon=${html`<span>${unsafeSVG(noDataIcon)}</span>`}
      .actions=${html`
        <kyn-button iconPosition="right" @on-click=${(e) => e.preventDefault()}>
          <span>Primary Button</span>
          <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
        </kyn-button>
        <kyn-link style="margin-left: 24px;" href="#" standalone>Link</kyn-link>
      `}
    ></kyn-empty-state-skeleton>`,
};
LargeNoData.storyName = 'Large (No Data)';

export const LargeNoSearchResults = {
  render: () =>
    html`<kyn-empty-state-skeleton
      size="large"
      emptyTitle="No search results found."
      description="There is nothing here yet. You can start by importing the data or create your own items."
      .icon=${html`<span>${unsafeSVG(noSearchIcon)}</span>`}
      .actions=${html`
        <kyn-button iconPosition="right" @on-click=${(e) => e.preventDefault()}>
          <span>Primary Button</span>
          <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
        </kyn-button>
        <kyn-link style="margin-left: 24px;" href="#" standalone>Link</kyn-link>
      `}
    ></kyn-empty-state-skeleton>`,
};
LargeNoSearchResults.storyName = 'Large (No Search Results)';

export const LargeDataVizOne = {
  render: () =>
    html`<kyn-empty-state-skeleton
      size="large"
      emptyTitle="Data Visualization"
      description="There's no data available to display at this time."
      .icon=${html`<span>${unsafeSVG(dataVizIcon)}</span>`}
      .actions=${html`
        <kyn-button iconPosition="right" @on-click=${(e) => e.preventDefault()}>
          <span>Primary Action</span>
          <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
        </kyn-button>
        <kyn-link style="margin-left: 24px;" href="#" standalone>Link</kyn-link>
      `}
    ></kyn-empty-state-skeleton>`,
};
LargeDataVizOne.storyName = 'Large (Data Visualization)';

export const SmallWidgetNoData = {
  render: () =>
    html`<kyn-empty-state-skeleton
      size="small"
      maxWidth="255px"
      description="This is a small widget empty state."
      .icon=${html`<span style="width: 48px; height: 48px;"
        >${unsafeSVG(warningIcon)}</span
      >`}
    ></kyn-empty-state-skeleton>`,
};
SmallWidgetNoData.storyName = 'Small (No Data)';

export const SmallDataDataViz = {
  render: () =>
    html`<kyn-empty-state-skeleton
      size="small"
      description="There is nothing here yet. You can start by importing the data or create your own items."
      .icon=${html`<span style="width: 48px; height: 48px;"
        >${unsafeSVG(chartComboIcon)}</span
      >`}
      .actions=${html`
        <kyn-button iconPosition="right" @on-click=${(e) => e.preventDefault()}>
          <span>Import Data</span>
          <span slot="icon">${unsafeSVG(selectIcon)}</span>
        </kyn-button>
      `}
    ></kyn-empty-state-skeleton>`,
};
SmallDataDataViz.storyName = 'Small (Data Visualization)';
