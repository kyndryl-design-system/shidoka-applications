import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import '../components/reusable/breadcrumbs';
import '../components/reusable/link';
import '../components/reusable/pagetitle';
import '../components/reusable/button';
import '../components/reusable/tabs';
import cloudDownloadIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/cloud-download.svg';
import uploadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/upload.svg';
import addIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';
import refreshIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/refresh.svg';

export default {
  title: 'Patterns/Page Header',
  tags: ['new'],
};

export const Default = {
  render: () => {
    return html`
      <style>
        .page-header {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-header__title-row {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
        }

        .page-header__content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
        }

        .page-header__content__actions-btn {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          align-self: stretch;
        }

        @media (min-width: 42rem) {
          .page-header__content {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .page-header__content__actions-btn {
            justify-content: flex-end;
          }
        }
      </style>

      <div class="page-header">
        <div class="page-header-row">
          <kyn-breadcrumbs role="navigation" aria-label="Breadcrumb">
            <kyn-link standalone linkFontWeight="lighter" href="#">
              Breadcrumb item
            </kyn-link>
            <strong aria-current="page">Current page</strong>
          </kyn-breadcrumbs>

          <div class="page-header__content">
            <kyn-page-title
              type="secondary"
              pageTitle="Page Title"
              subTitle="Subtitle"
              contextual
            >
              <span slot="icon" class="cloud-icon"
                >${unsafeSVG(cloudDownloadIcon)}</span
              >
              <kyn-pagetitle-option value="app-1"
                >Page Title 1</kyn-pagetitle-option
              >
              <kyn-pagetitle-option value="app-2"
                >Page Title 2</kyn-pagetitle-option
              >
            </kyn-page-title>
            <div class="page-header__content__actions-btn">
              <kyn-button kind="primary" size="medium" iconPosition="left">
                <span slot="icon">${unsafeSVG(addIcon)}</span
                >Primary</kyn-button
              >
              <kyn-button kind="secondary" size="medium" iconPosition="left">
                <span slot="icon">${unsafeSVG(uploadIcon)}</span
                >Secondary</kyn-button
              >
              <kyn-button kind="ghost" size="medium" iconPosition="left">
                <span slot="icon">${unsafeSVG(refreshIcon)}</span
                >Tertiary</kyn-button
              >
            </div>
          </div>
        </div>
        <kyn-tabs tabSize="md">
          <kyn-tab slot="tabs" id="tab-1" selected>Tab label 1</kyn-tab>
          <kyn-tab slot="tabs" id="tab-2">Tab label 2</kyn-tab>
          <kyn-tab slot="tabs" id="tab-3">Tab label 3</kyn-tab>
          <kyn-tab slot="tabs" id="tab-4">Tab label 4</kyn-tab>
          <kyn-tab slot="tabs" id="tab-5">Tab label 5</kyn-tab>

          <kyn-tab-panel tabId="tab-1" visible> Tab content 1 </kyn-tab-panel>
          <kyn-tab-panel tabId="tab-2">Tab content 2</kyn-tab-panel>
          <kyn-tab-panel tabId="tab-3">Tab content 3</kyn-tab-panel>
          <kyn-tab-panel tabId="tab-4">Tab content 4</kyn-tab-panel>
          <kyn-tab-panel tabId="tab-5">Tab content 5</kyn-tab-panel>
        </kyn-tabs>
      </div>
    `;
  },
};
