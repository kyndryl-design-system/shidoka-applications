import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import './sampleEmptyStateComponents/emptyState.sample.ts';

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
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const LargeNoData = {
  render: () => {
    return html`
      <empty-state-sample-component size="large" rel="" target="_self">
        <div slot="icon">${unsafeSVG(noDataIcon)}</div>
        <span slot="title">No data found.</span>
        <span slot="description"
          >There is nothing here yet. You can start by importing the data or
          create your own items.</span
        >
        <div slot="actions">
          <kyn-button
            iconPosition="right"
            @on-click=${(e) => e.preventDefault()}
          >
            <span>Primary Button</span>
            <span slot="icon"> ${unsafeSVG(chevronRightIcon)} </span>
          </kyn-button>
          <kyn-link style="margin-left: 24px;" href="#" standalone
            >Link</kyn-link
          >
        </div>
      </empty-state-sample-component>
    `;
  },
};
LargeNoData.storyName = 'Large (No Data)';

export const LargeNoSearchResults = {
  render: () => {
    return html`
      <empty-state-sample-component size="large" rel="" target="_self">
        <span slot="icon">${unsafeSVG(noSearchIcon)}</span>
        <span slot="title">No search results found.</span>
        <span slot="description"
          >There is nothing here yet. You can start by importing the data or
          create your own items.</span
        >
        <div slot="actions">
          <kyn-button
            iconPosition="right"
            @on-click=${(e) => e.preventDefault()}
          >
            <span>Primary Button</span>
            <span slot="icon"> ${unsafeSVG(chevronRightIcon)} </span>
          </kyn-button>
          <kyn-link style="margin-left: 24px;" href="#" standalone
            >Link</kyn-link
          >
        </div>
      </empty-state-sample-component>
    `;
  },
};
LargeNoSearchResults.storyName = 'Large (No Search Results)';

export const LargeDataViz = {
  render: () => {
    return html`
      <empty-state-sample-component size="large" rel="" target="_self">
        <span slot="icon">${unsafeSVG(dataVizIcon)}</span>
        <span slot="title">Data Visualization</span>
        <span slot="description"
          >There's no data available to display at this time.</span
        >
        <div slot="actions">
          <kyn-button
            iconPosition="right"
            @on-click=${(e) => e.preventDefault()}
          >
            <span>Primary Action</span>
            <span slot="icon"> ${unsafeSVG(chevronRightIcon)} </span>
          </kyn-button>
          <kyn-link style="margin-left: 24px;" href="#" standalone
            >Link</kyn-link
          >
        </div>
      </empty-state-sample-component>
    `;
  },
};
LargeDataViz.storyName = 'Large (Data Visualization)';

export const SmallWidgetNoData = {
  render: () => {
    return html`
      <div style="width: 100%; max-width: 255px;">
        <empty-state-sample-component size="small" rel="" target="_self">
          <span slot="icon" style="width: 48px; height: 48px;"
            >${unsafeSVG(warningIcon)}</span
          >
          <span slot="description">This is a small widget empty state.</span>
        </empty-state-sample-component>
      </div>
    `;
  },
};
SmallWidgetNoData.storyName = 'Small (No Data)';

export const SmallDataDataViz = {
  render: () => {
    return html`
      <div style="width: 100%; max-width: 400px;">
        <empty-state-sample-component size="small" rel="" target="_self">
          <span slot="icon" style="width: 48px; height: 48px;"
            >${unsafeSVG(chartComboIcon)}</span
          >
          <span slot="description"
            >There is nothing here yet. You can start by importing the data or
            create your own items.</span
          >
          <div slot="actions">
            <kyn-button
              iconPosition="right"
              @on-click=${(e) => e.preventDefault()}
            >
              <span>Import Data</span>
              <span slot="icon"> ${unsafeSVG(selectIcon)} </span>
            </kyn-button>
          </div>
        </empty-state-sample-component>
      </div>
    `;
  },
};
SmallDataDataViz.storyName = 'Small (Data Visualization)';
