// stories/patterns/emptyState.stories.js
import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import '../components/reusable/button/button';
import '../components/reusable/link/link';

import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import warningIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/warning.svg';
import chartComboIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/chart-combo.svg';
import selectIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/upload.svg';

import './emptyState/emptyState.scss';

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
The Empty State pattern is used to indicate no available data or first-time
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
  render: () => html`
    <div class="empty-state--wrapper empty-state--large">
      <div class="empty-state--icon-wrapper">${unsafeSVG(noDataIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state-content-wrapper">
          <div class="empty-state--title-div">
            <h1>No data found.</h1>
          </div>
          <div class="empty-state--description-text">
            <p>
              There is nothing here yet. You can start by importing the data or
              create your own items.
            </p>
          </div>
        </div>
        <div class="empty-state--action-wrapper">
          <kyn-button
            class="empty-state--action-button"
            @click=${(e) => e.preventDefault()}
          >
            <span>Primary Button</span>
            <span class="empty-state--action-button-icon"
              >${unsafeSVG(chevronRightIcon)}</span
            >
          </kyn-button>
          <kyn-link
            href="#"
            standalone
            class="empty-state--action-link"
            @click=${(e) => e.preventDefault()}
          >
            Link
          </kyn-link>
        </div>
      </div>
    </div>
  `,
};
LargeNoData.storyName = 'Large (No Data)';

export const LargeNoSearchResults = {
  render: () => html`
    <div class="empty-state--wrapper empty-state--large">
      <div class="empty-state--icon-wrapper">${unsafeSVG(noSearchIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state-content-wrapper">
          <div class="empty-state--title-div">
            <h1>No search results found.</h1>
          </div>
          <div class="empty-state--description-text">
            <p>
              There is nothing here yet. You can start by importing the data or
              create your own items.
            </p>
          </div>
        </div>
        <div class="empty-state--action-wrapper">
          <kyn-button
            class="empty-state--action-button"
            @click=${(e) => e.preventDefault()}
          >
            <span>Primary Button</span>
            <span class="empty-state--action-button-icon"
              >${unsafeSVG(chevronRightIcon)}</span
            >
          </kyn-button>
          <kyn-link
            href="#"
            standalone
            class="empty-state--action-link"
            @click=${(e) => e.preventDefault()}
          >
            Link
          </kyn-link>
        </div>
      </div>
    </div>
  `,
};
LargeNoSearchResults.storyName = 'Large (No Search Results)';

export const LargeDataVizOne = {
  render: () => html`
    <div class="empty-state--wrapper empty-state--large">
      <div class="empty-state--icon-wrapper">${unsafeSVG(dataVizIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state-content-wrapper">
          <div class="empty-state--title-div">
            <h1>Data Visualization</h1>
          </div>
          <div class="empty-state--description-text">
            <p>There's no data available to display at this time.</p>
          </div>
        </div>
        <div class="empty-state--action-wrapper">
          <kyn-button
            class="empty-state--action-button"
            @click=${(e) => e.preventDefault()}
          >
            <span>Primary Action</span>
            <span class="empty-state--action-button-icon"
              >${unsafeSVG(chevronRightIcon)}</span
            >
          </kyn-button>
          <kyn-link
            href="#"
            standalone
            class="empty-state--action-link"
            @click=${(e) => e.preventDefault()}
          >
            Link
          </kyn-link>
        </div>
      </div>
    </div>
  `,
};
LargeDataVizOne.storyName = 'Large (Data Visualization)';

export const SmallWidgetNoData = {
  render: () => html`
    <div
      class="empty-state--wrapper empty-state--small"
      style="--empty-state-max-width:255px;"
    >
      <div class="empty-state--icon-wrapper">${unsafeSVG(warningIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state-content-wrapper">
          <div class="empty-state--description-text">
            <p>This is a small widget empty state.</p>
          </div>
        </div>
      </div>
    </div>
  `,
};
SmallWidgetNoData.storyName = 'Small (No Data)';

export const SmallDataDataViz = {
  render: () => html`
    <div class="empty-state--wrapper empty-state--small">
      <div class="empty-state--icon-wrapper">${unsafeSVG(chartComboIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state-content-wrapper">
          <div class="empty-state--description-text">
            <p>
              There is nothing here yet. You can start by importing the data or
              create your own items.
            </p>
          </div>
        </div>
        <div class="empty-state--action-wrapper">
          <kyn-button
            class="empty-state--action-button"
            @click=${(e) => e.preventDefault()}
          >
            <span>Import Data</span>
            <span class="empty-state--action-button-icon"
              >${unsafeSVG(selectIcon)}</span
            >
          </kyn-button>
        </div>
      </div>
    </div>
  `,
};
SmallDataDataViz.storyName = 'Small (Data Visualization)';
