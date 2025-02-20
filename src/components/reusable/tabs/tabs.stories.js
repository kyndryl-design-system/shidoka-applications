import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import './index';
import { TAB_SIZES } from './defs';
import { action } from '@storybook/addon-actions';
import { createOptionsArray } from '../../../common/helpers/helpers';

import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/question.svg';
import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';

const createSelectOptions = (defs) => [null, ...createOptionsArray(defs)];

export default {
  title: 'Components/Tabs',
  component: 'kyn-tabs',
  argTypes: {
    tabSize: {
      options: createSelectOptions(TAB_SIZES),
      control: { type: 'select', labels: { null: TAB_SIZES.MEDIUM } },
      table: {
        defaultValue: { summary: TAB_SIZES.MEDIUM },
      },
    },
    tabStyle: {
      options: ['contained', 'line'],
      control: { type: 'select' },
    },
  },
  subcomponents: {
    'kyn-tab': 'kyn-tab',
    'kyn-tab-panel': 'kyn-tab-panel',
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=7695-2985&m=dev',
  },
};

const args = {
  tabSize: 'md',
  tabStyle: 'contained',
  vertical: false,
  aiConnected: false,
  disableAutoFocusUpdate: false,
};

export const Tabs = {
  args,
  render: (args) => {
    return html`
      <kyn-tabs
        tabSize=${args.tabSize}
        tabStyle=${args.tabStyle}
        ?vertical=${args.vertical}
        ?aiConnected=${args.aiConnected}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};

export const WithIcons = {
  args,
  render: (args) => {
    return html`
      <style>
        kyn-tab > span.icon {
          display: flex;
        }
      </style>
      <kyn-tabs
        tabSize=${args.tabSize}
        tabStyle=${args.tabStyle}
        ?vertical=${args.vertical}
        ?aiConnected=${args.aiConnected}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>
          <span class="icon">${unsafeSVG(userAvatarIcon)}</span>
          Tab 1
        </kyn-tab>
        <kyn-tab slot="tabs" id="tab2">
          <span class="icon">${unsafeSVG(helpIcon)}</span>
          Tab 2
        </kyn-tab>
        <kyn-tab slot="tabs" id="tab3">
          <span class="icon">${unsafeSVG(settingsIcon)}</span>
          Tab 3
        </kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};

export const Nested = {
  args,
  render: (args) => {
    return html`
      <kyn-tabs
        tabSize=${args.tabSize}
        ?vertical=${args.vertical}
        ?aiConnected=${args.aiConnected}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible noPadding>
          <p style="padding: 0 12px 24px;">Tab 1 Content</p>

          <kyn-tabs
            tabStyle="line"
            tabSize=${args.tabSize}
            ?aiConnected=${args.aiConnected}
            ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
            @on-change=${(e) => action(e.type)(e)}
          >
            <kyn-tab slot="tabs" id="tab1-subtab1" selected>Subtab 1</kyn-tab>
            <kyn-tab slot="tabs" id="tab1-subtab2">Subtab 2</kyn-tab>
            <kyn-tab slot="tabs" id="tab1-subtab3">Subtab 3</kyn-tab>

            <kyn-tab-panel tabId="tab1-subtab1" visible>
              Subtab 1 Content
            </kyn-tab-panel>
            <kyn-tab-panel tabId="tab1-subtab2">Subtab 2 Content</kyn-tab-panel>
            <kyn-tab-panel tabId="tab1-subtab3">Subtab 3 Content</kyn-tab-panel>
          </kyn-tabs>
        </kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};

export const DisabledTab = {
  args,
  render: (args) => {
    return html`
      <kyn-tabs
        tabSize=${args.tabSize}
        tabStyle=${args.tabStyle}
        ?vertical=${args.vertical}
        ?aiConnected=${args.aiConnected}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3" disabled>Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};

export const Scrollable = {
  args,
  render: (args) => {
    return html`
      <kyn-tabs
        style="height: 200px;"
        scrollablePanels
        tabSize=${args.tabSize}
        tabStyle=${args.tabStyle}
        ?vertical=${args.vertical}
        ?aiConnected=${args.aiConnected}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>
          Tab 1 Content<br />Tab 1 Content<br />Tab 1 Content<br />Tab 1
          Content<br />Tab 1 Content<br />Tab 1 Content<br />Tab 1 Content<br />Tab
          1 Content<br />Tab 1 Content<br />
        </kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">
          Tab 2 Content<br />Tab 2 Content<br />Tab 2 Content<br />Tab 2
          Content<br />Tab 2 Content<br />Tab 2 Content<br />Tab 2 Content<br />Tab
          2 Content<br />Tab 2 Content<br />Tab 2 Content<br />Tab 2 Content<br />Tab
          2 Content<br />Tab 2 Content<br />
        </kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};

export const AISpecific = {
  args: {
    ...args,
    aiConnected: true,
  },
  render: (args) => {
    return html`
      <kyn-tabs
        tabSize=${args.tabSize}
        tabStyle=${args.tabStyle}
        ?vertical=${args.vertical}
        ?aiConnected=${args.aiConnected}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};

export const Gallery = {
  ...args,
  tabStyle: '',
  render: (args) => {
    return html`
      <div class="heading kd-type--headline-04">Gallery</div>

      <div class="heading kd-type--headline-07">Contained</div>

      <kyn-tabs
        tabSize="md"
        tabStyle=${'contained'}
        ?vertical=${args.vertical}
        ?aiConnected=${false}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>

      <div class="heading kd-type--headline-07">Line</div>

      <kyn-tabs
        tabSize="md"
        tabStyle=${'line'}
        ?vertical=${args.vertical}
        ?aiConnected=${false}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>

      <div class="heading kd-type--headline-07">Contained AI</div>

      <kyn-tabs
        tabSize="md"
        tabStyle=${'contained'}
        ?vertical=${args.vertical}
        ?aiConnected=${true}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>

      <div class="heading kd-type--headline-07">Line AI</div>

      <kyn-tabs
        tabSize="md"
        tabStyle=${'line'}
        ?vertical=${args.vertical}
        ?aiConnected=${true}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>

      <div class="heading kd-type--headline-07">Vertical</div>

      <kyn-tabs
        tabSize="md"
        tabStyle=${'line'}
        ?vertical=${true}
        ?aiConnected=${true}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>

      <div class="heading kd-type--headline-07">Disabled</div>

      <kyn-tabs
        tabSize=${'md'}
        tabStyle=${'contained'}
        ?vertical=${args.vertical}
        ?aiConnected=${false}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1">Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3" disabled>Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};
