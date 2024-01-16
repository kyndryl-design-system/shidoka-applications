import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import userAvatarIcon from '@carbon/icons/es/user--avatar/24';
import helpIcon from '@carbon/icons/es/help/24';
import settingsIcon from '@carbon/icons/es/settings/24';

export default {
  title: 'Components/Tabs',
  component: 'kyn-tabs',
  argTypes: {
    tabSize: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  subcomponents: {
    'kyn-tab': 'kyn-tab',
    'kyn-tab-panel': 'kyn-tab-panel',
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/C047ePkji8MDD88nKId9e9/Applications---Component-Library-Unreleased?node-id=4078%3A176545&mode=dev',
  },
};

const args = {
  tabSize: 'md',
  vertical: false,
  contained: false,
};

export const Tabs = {
  args,
  render: (args) => {
    return html`
      <kyn-tabs
        tabSize=${args.tabSize}
        ?vertical=${args.vertical}
        ?contained=${args.contained}
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
        ?vertical=${args.vertical}
        ?contained=${args.contained}
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
