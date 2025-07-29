// emptyState.stories.js
import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import '../../components/reusable/button/button';
import '../../components/reusable/link/link';

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
The Empty State pattern is used to indicate no available data or first-time usage.
It helps orient users and suggest next steps.
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
    <style>
      .empty-state--wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 400px;
      }
      .empty-state--wrapper h1 {
        font-size: var(--kd-font-size-type-ui-01, 20px);
        font-weight: var(--kd-font-weight-medium, 500);
        line-height: var(--kd-font-line-height-type-ui-01, 28px);
        color: var(--kd-color-text-level-primary);
        margin: 0;
        padding: 0;
        text-align: left;
      }
      .empty-state--icon-wrapper {
        color: var(--kd-color-icon-disabled);
        display: flex;
      }
      .empty-state--icon-wrapper *,
      .empty-state--icon-wrapper svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      .empty-state--content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        text-align: left;
      }
      .empty-state--title-div {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
        gap: 8px;
        width: 100%;
        text-align: left;
      }
      .empty-state--description-text,
      .empty-state--description-text p {
        margin: 0;
        padding: 0;
        width: 100%;
        text-align: left;
        font-size: var(--kd-font-size-type-body-02, 16px);
        font-weight: var(--kd-font-weight-regular, 400);
        line-height: var(--kd-font-line-height-type-body-02, 24px);
        color: var(--kd-color-text-level-secondary);
      }
      .empty-state--action-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 24px;
        gap: 24px;
        width: 100%;
      }
      .empty-state--action-button .empty-state--action-button-icon {
        padding-left: 8px;
      }
      .empty-state--large {
        gap: 24px;
      }
      .empty-state--large .empty-state--icon-wrapper {
        width: 138px;
        height: 126px;
      }
      .empty-state--large .empty-state--link-wrapper {
        margin-top: 24px;
      }
      .empty-state--small {
        max-width: 255px;
        gap: 12px;
        align-items: flex-start;
      }
      .empty-state--small .empty-state--icon-wrapper {
        width: 48px;
        height: 48px;
        align-self: center;
        margin: 0 auto;
      }
    </style>
    <div class="empty-state--wrapper empty-state--large">
      <div class="empty-state--icon-wrapper">${unsafeSVG(noDataIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state--title-div"><h1>No data found.</h1></div>
        <div class="empty-state--description-text">
          <p>
            There is nothing here yet. You can start by importing the data or
            create your own items.
          </p>
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

export const LargeNoSearchResults = {
  render: () => html`
    <style>
      .empty-state--wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 400px;
      }
      .empty-state--wrapper h1 {
        font-size: var(--kd-font-size-type-ui-01, 20px);
        font-weight: var(--kd-font-weight-medium, 500);
        line-height: var(--kd-font-line-height-type-ui-01, 28px);
        color: var(--kd-color-text-level-primary);
        margin: 0;
        padding: 0;
        text-align: left;
      }
      .empty-state--icon-wrapper {
        color: var(--kd-color-icon-disabled);
        display: flex;
      }
      .empty-state--icon-wrapper *,
      .empty-state--icon-wrapper svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      .empty-state--content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        text-align: left;
      }
      .empty-state--title-div {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
        gap: 8px;
        width: 100%;
        text-align: left;
      }
      .empty-state--description-text,
      .empty-state--description-text p {
        margin: 0;
        padding: 0;
        width: 100%;
        text-align: left;
        font-size: var(--kd-font-size-type-body-02, 16px);
        font-weight: var(--kd-font-weight-regular, 400);
        line-height: var(--kd-font-line-height-type-body-02, 24px);
        color: var(--kd-color-text-level-secondary);
      }
      .empty-state--action-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 24px;
        gap: 24px;
        width: 100%;
      }
      .empty-state--action-button .empty-state--action-button-icon {
        padding-left: 8px;
      }
      .empty-state--large {
        gap: 24px;
      }
      .empty-state--large .empty-state--icon-wrapper {
        width: 138px;
        height: 126px;
      }
      .empty-state--large .empty-state--link-wrapper {
        margin-top: 24px;
      }
      .empty-state--small {
        max-width: 255px;
        gap: 12px;
        align-items: flex-start;
      }
      .empty-state--small .empty-state--icon-wrapper {
        width: 48px;
        height: 48px;
        align-self: center;
        margin: 0 auto;
      }
    </style>
    <div class="empty-state--wrapper empty-state--large">
      <div class="empty-state--icon-wrapper">${unsafeSVG(noSearchIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state--title-div">
          <h1>No search results found.</h1>
        </div>
        <div class="empty-state--description-text">
          <p>
            There is nothing here yet. You can start by importing the data or
            create your own items.
          </p>
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

export const LargeDataVizOne = {
  render: () => html`
    <style>
      .empty-state--wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 400px;
      }
      .empty-state--wrapper h1 {
        font-size: var(--kd-font-size-type-ui-01, 20px);
        font-weight: var(--kd-font-weight-medium, 500);
        line-height: var(--kd-font-line-height-type-ui-01, 28px);
        color: var(--kd-color-text-level-primary);
        margin: 0;
        padding: 0;
        text-align: left;
      }
      .empty-state--icon-wrapper {
        color: var(--kd-color-icon-disabled);
        display: flex;
      }
      .empty-state--icon-wrapper *,
      .empty-state--icon-wrapper svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      .empty-state--content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        text-align: left;
      }
      .empty-state--title-div {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
        gap: 8px;
        width: 100%;
        text-align: left;
      }
      .empty-state--description-text,
      .empty-state--description-text p {
        margin: 0;
        padding: 0;
        width: 100%;
        text-align: left;
        font-size: var(--kd-font-size-type-body-02, 16px);
        font-weight: var(--kd-font-weight-regular, 400);
        line-height: var(--kd-font-line-height-type-body-02, 24px);
        color: var(--kd-color-text-level-secondary);
      }
      .empty-state--action-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 24px;
        gap: 24px;
        width: 100%;
      }
      .empty-state--action-button .empty-state--action-button-icon {
        padding-left: 8px;
      }
      .empty-state--large {
        gap: 24px;
      }
      .empty-state--large .empty-state--icon-wrapper {
        width: 138px;
        height: 126px;
      }
      .empty-state--large .empty-state--link-wrapper {
        margin-top: 24px;
      }
      .empty-state--small {
        max-width: 255px;
        gap: 12px;
        align-items: flex-start;
      }
      .empty-state--small .empty-state--icon-wrapper {
        width: 48px;
        height: 48px;
        align-self: center;
        margin: 0 auto;
      }
    </style>
    <div class="empty-state--wrapper empty-state--large">
      <div class="empty-state--icon-wrapper">${unsafeSVG(dataVizIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state--title-div"><h1>Data Visualization</h1></div>
        <div class="empty-state--description-text">
          <p>There's no data available to display at this time.</p>
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

export const SmallWidgetNoData = {
  render: () => html`
    <style>
      .empty-state--wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 400px;
      }
      .empty-state--wrapper h1 {
        font-size: var(--kd-font-size-type-ui-01, 20px);
        font-weight: var(--kd-font-weight-medium, 500);
        line-height: var(--kd-font-line-height-type-ui-01, 28px);
        color: var(--kd-color-text-level-primary);
        margin: 0;
        padding: 0;
        text-align: left;
      }
      .empty-state--icon-wrapper {
        color: var(--kd-color-icon-disabled);
        display: flex;
      }
      .empty-state--icon-wrapper *,
      .empty-state--icon-wrapper svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      .empty-state--content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        text-align: left;
      }
      .empty-state--title-div {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
        gap: 8px;
        width: 100%;
        text-align: left;
      }
      .empty-state--description-text,
      .empty-state--description-text p {
        margin: 0;
        padding: 0;
        width: 100%;
        text-align: left;
        font-size: var(--kd-font-size-type-body-02, 16px);
        font-weight: var(--kd-font-weight-regular, 400);
        line-height: var(--kd-font-line-height-type-body-02, 24px);
        color: var(--kd-color-text-level-secondary);
      }
      .empty-state--action-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 24px;
        gap: 24px;
        width: 100%;
      }
      .empty-state--action-button .empty-state--action-button-icon {
        padding-left: 8px;
      }
      .empty-state--large {
        gap: 24px;
      }
      .empty-state--large .empty-state--icon-wrapper {
        width: 138px;
        height: 126px;
      }
      .empty-state--large .empty-state--link-wrapper {
        margin-top: 24px;
      }
      .empty-state--small {
        max-width: 255px;
        gap: 12px;
        align-items: flex-start;
      }
      .empty-state--small .empty-state--icon-wrapper {
        width: 48px;
        height: 48px;
        align-self: center;
        margin: 0 auto;
      }
    </style>
    <div class="empty-state--wrapper empty-state--small">
      <div class="empty-state--icon-wrapper">${unsafeSVG(warningIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state--description-text">
          <p>This is a small widget empty state.</p>
        </div>
      </div>
    </div>
  `,
};

export const SmallDataDataViz = {
  render: () => html`
    <style>
      .empty-state--wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .empty-state--wrapper h1 {
        font-size: var(--kd-font-size-type-ui-01, 20px);
        font-weight: var(--kd-font-weight-medium, 500);
        line-height: var(--kd-font-line-height-type-ui-01, 28px);
        color: var(--kd-color-text-level-primary);
        margin: 0;
        padding: 0;
        text-align: left;
      }
      .empty-state--icon-wrapper {
        color: var(--kd-color-icon-disabled);
        display: flex;
      }
      .empty-state--icon-wrapper *,
      .empty-state--icon-wrapper svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      .empty-state--content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        text-align: left;
      }
      .empty-state--title-div {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
        gap: 8px;
        width: 100%;
        text-align: left;
      }
      .empty-state--description-text,
      .empty-state--description-text p {
        margin: 0;
        padding: 0;
        width: 100%;
        text-align: left;
        font-size: var(--kd-font-size-type-body-02, 16px);
        font-weight: var(--kd-font-weight-regular, 400);
        line-height: var(--kd-font-line-height-type-body-02, 24px);
        color: var(--kd-color-text-level-secondary);
      }
      .empty-state--action-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 24px;
        gap: 24px;
        width: 100%;
      }
      .empty-state--action-button .empty-state--action-button-icon {
        padding-left: 8px;
      }
      .empty-state--large {
        gap: 24px;
      }
      .empty-state--large .empty-state--icon-wrapper {
        width: 138px;
        height: 126px;
      }
      .empty-state--large .empty-state--link-wrapper {
        margin-top: 24px;
      }
      .empty-state--small {
        max-width: 400px;
        gap: 12px;
        align-items: flex-start;
      }
      .empty-state--small .empty-state--icon-wrapper {
        width: 48px;
        height: 48px;
        align-self: center;
        margin: 0 auto;
      }
    </style>
    <div class="empty-state--wrapper empty-state--small">
      <div class="empty-state--icon-wrapper">${unsafeSVG(chartComboIcon)}</div>
      <div class="empty-state--content">
        <div class="empty-state--description-text">
          <p>
            There is nothing here yet. You can start by importing the data or
            create your own items.
          </p>
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
