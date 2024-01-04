import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Tabs',
  component: 'kyn-tabs',
  subcomponents: {
    'kyn-tab': 'kyn-tab',
    'kyn-tab-panel': 'kyn-tab-panel',
  },
  design: {
    type: 'figma',
    url: '',
  },
};

export const Tabs = {
  render: () => {
    return html`
      <kyn-tabs @on-change=${(e) => action(e.type)(e)}>
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
