import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import userAvatarIcon from '@carbon/icons/es/user--avatar/16';
import helpIcon from '@carbon/icons/es/help/16';
import settingsIcon from '@carbon/icons/es/settings/16';

export default {
  title: 'Components/Tabs',
  component: 'kyn-tabs',
  argTypes: {
    tabSize: {
      options: ['sm', 'md'],
      control: { type: 'select' },
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
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=2912%3A2268&mode=dev',
  },
};

const args = {
  tabSize: 'md',
  tabStyle: 'contained',
  vertical: false,
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
      <kyn-tabs
        tabSize=${args.tabSize}
        tabStyle=${args.tabStyle}
        ?vertical=${args.vertical}
        ?disableAutoFocusUpdate=${args.disableAutoFocusUpdate}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tab slot="tabs" id="tab1" selected>
          <kd-icon .icon=${userAvatarIcon}></kd-icon>
          Tab 1
        </kyn-tab>
        <kyn-tab slot="tabs" id="tab2">
          <kd-icon .icon=${helpIcon}></kd-icon>
          Tab 2
        </kyn-tab>
        <kyn-tab slot="tabs" id="tab3">
          <kd-icon .icon=${settingsIcon}></kd-icon>
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
