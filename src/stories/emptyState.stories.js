import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { EmptyStateSkeleton } from './emptyState/emptyState.skeleton';

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
    EmptyStateSkeleton({
      size: 'large',
      icon: html`<span>${unsafeSVG(noDataIcon)}</span>`,
      title: 'No data found.',
      description:
        'There is nothing here yet. You can start by importing the data or create your own items.',
      actions: html`
        <kyn-button iconPosition="right" @on-click=${(e) => e.preventDefault()}>
          <span>Primary Button</span>
          <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
        </kyn-button>
        <kyn-link style="margin-left: 24px;" href="#" standalone>Link</kyn-link>
      `,
    }),
};
LargeNoData.storyName = 'Large (No Data)';

export const LargeNoSearchResults = {
  render: () =>
    EmptyStateSkeleton({
      size: 'large',
      icon: html`<span>${unsafeSVG(noSearchIcon)}</span>`,
      title: 'No search results found.',
      description:
        'There is nothing here yet. You can start by importing the data or create your own items.',
      actions: html`
        <kyn-button iconPosition="right" @on-click=${(e) => e.preventDefault()}>
          <span>Primary Button</span>
          <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
        </kyn-button>
        <kyn-link style="margin-left: 24px;" href="#" standalone>Link</kyn-link>
      `,
    }),
};
LargeNoSearchResults.storyName = 'Large (No Search Results)';

export const LargeDataVizOne = {
  render: () =>
    EmptyStateSkeleton({
      size: 'large',
      icon: html`<span>${unsafeSVG(dataVizIcon)}</span>`,
      title: 'Data Visualization',
      description: "There's no data available to display at this time.",
      actions: html`
        <kyn-button iconPosition="right" @on-click=${(e) => e.preventDefault()}>
          <span>Primary Action</span>
          <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
        </kyn-button>
        <kyn-link style="margin-left: 24px;" href="#" standalone>Link</kyn-link>
      `,
    }),
};
LargeDataVizOne.storyName = 'Large (Data Visualization)';

export const SmallWidgetNoData = {
  render: () =>
    EmptyStateSkeleton({
      size: 'small',
      maxWidth: '255px',
      icon: html`<span style="width: 48px; height: 48px;"
        >${unsafeSVG(warningIcon)}</span
      >`,
      description: 'This is a small widget empty state.',
    }),
};
SmallWidgetNoData.storyName = 'Small (No Data)';

export const SmallDataDataViz = {
  render: () =>
    EmptyStateSkeleton({
      size: 'small',
      icon: html`<span style="width: 48px; height: 48px;"
        >${unsafeSVG(chartComboIcon)}</span
      >`,
      description:
        'There is nothing here yet. You can start by importing the data or create your own items.',
      actions: html`
        <kyn-button iconPosition="right" @on-click=${(e) => e.preventDefault()}>
          <span>Import Data</span>
          <span slot="icon">${unsafeSVG(selectIcon)}</span>
        </kyn-button>
      `,
    }),
};
SmallDataDataViz.storyName = 'Small (Data Visualization)';
