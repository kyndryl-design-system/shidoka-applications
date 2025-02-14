import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import './index';
import { TAB_KINDS, TAB_SIZES } from './defs';
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
    kind: {
      options: createSelectOptions(TAB_KINDS),
      control: { type: 'select', labels: { null: TAB_KINDS.PRIMARY } },
      table: {
        defaultValue: { summary: TAB_KINDS.PRIMARY },
      },
    },
  },
  subcomponents: {
    'kyn-tab': 'kyn-tab',
    'kyn-tab-panel': 'kyn-tab-panel',
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=2912%3A2268&mode=dev',
  },
};

const args = {
  tabSize: 'md',
  tabStyle: 'contained',
  vertical: false,
  kind: 'primary',
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
        .kind=${args.kind}
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
        .kind=${args.kind}
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
        .kind=${args.kind}
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
        .kind=${args.kind}
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

export const Gallery = {
  args,
  render: (args) => {
    return html`
      <div class="heading kd-type--headline-04">Gallery</div>

      <div class="heading kd-type--headline-06">Primary</div>

      <kyn-tabs
        tabSize="md"
        tabStyle=${'contained'}
        ?vertical=${args.vertical}
        kind="primary"
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" kind="primary" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2" kind="primary">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3" kind="primary">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>

      <div class="heading kd-type--headline-06">Secondary</div>

      <kyn-tabs
        tabSize="md"
        tabStyle=${'line'}
        ?vertical=${args.vertical}
        kind="secondary"
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" kind="secondary" selected>Tab 1</kyn-tab>
        <kyn-tab slot="tabs" id="tab2" kind="secondary">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3" kind="secondary">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>

      <div class="heading kd-type--headline-06">Primary AI</div>

      <kyn-tabs
        tabSize="md"
        tabStyle=${'contained'}
        ?vertical=${args.vertical}
        kind="primary-ai"
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" kind="primary-ai" selected
          >Tab 1</kyn-tab
        >
        <kyn-tab slot="tabs" id="tab2" kind="primary-ai">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3" kind="primary-ai">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>

      <div class="heading kd-type--headline-06">Secondary AI</div>

      <kyn-tabs
        tabSize="md"
        tabStyle=${'line'}
        ?vertical=${args.vertical}
        kind="secondary-ai"
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" kind="secondary-ai" selected
          >Tab 1</kyn-tab
        >
        <kyn-tab slot="tabs" id="tab2" kind="secondary-ai">Tab 2</kyn-tab>
        <kyn-tab slot="tabs" id="tab3" kind="secondary-ai">Tab 3</kyn-tab>

        <kyn-tab-panel tabId="tab1" visible>Tab 1 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab2">Tab 2 Content</kyn-tab-panel>
        <kyn-tab-panel tabId="tab3">Tab 3 Content</kyn-tab-panel>
      </kyn-tabs>
    `;
  },
};
