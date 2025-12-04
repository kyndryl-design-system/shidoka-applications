import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';
import './';
import '../../reusable/button';
import '../../reusable/tabs';
import '../../reusable/search';

import megaNavConfig from './megaNavCategories.json';

import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/question.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import filledNotificationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/notifications-new.svg';
import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

import '../../reusable/notification';
import '../../reusable/overflowMenu';
import '../../reusable/tooltip';

/** @typedef {import('./headerCategories').HeaderCategoryLinkType} HeaderCategoryLinkType */
/** @typedef {import('./headerCategories').HeaderLinkRendererContext} HeaderLinkRendererContext */
/** @typedef {import('./headerCategories').HeaderMegaLinkRenderer} HeaderMegaLinkRenderer */

export default {
  title: 'Global Components/Header',
  component: 'kyn-header',
  subcomponents: {
    'kyn-header-nav': 'kyn-header-nav',
    'kyn-header-link': 'kyn-header-link',
    'kyn-header-category': 'kyn-header-category',
    'kyn-header-divider': 'kyn-header-divider',
    'kyn-header-flyouts': 'kyn-header-flyouts',
    'kyn-header-flyout': 'kyn-header-flyout',
    'kyn-header-user-profile': 'kyn-header-user-profile',
    'kyn-header-notification-panel': 'kyn-header-notification-panel',
  },
  decorators: [
    (story) =>
      html`
        <div
          style="height: 100vh; min-height: 250px; transform: translate3d(0,0,0); margin: var(--kd-negative-page-gutter);"
        >
          ${story()}
        </div>
      `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-214894&p=f&t=A5tcETiCf23sAgKK-0',
    },
  },
};

const args = {
  rootUrl: '/',
  appTitle: 'Application',
};

const notificationPanelArgs = {
  panelTitle: 'Notifications (65)',
  panelFooterBtnText: 'See All Notifications',
  hidePanelFooter: false,
};

/** @type {Array<{tagStatus: 'success' | 'default' | 'error' | 'info' | 'warning' | 'ai'}>} */
const notificationTagStatusArr = [
  {
    tagStatus: 'info',
  },
  {
    tagStatus: 'warning',
  },
  {
    tagStatus: 'success',
  },
  {
    tagStatus: 'error',
  },
  {
    tagStatus: 'default',
  },
];

const selectAllNotificationsAsRead = (e) => {
  const notifications = document.querySelectorAll('kyn-notification');
  notifications.forEach((notification) => {
    notification.unRead = false;
  });
  action(e.type)({ ...e, detail: e.detail });
};

const handleOverflowClick = (e) => {
  action(e.type)({ ...e, detail: e.detail });
};

export const Header = {
  args,
  render: (args) => html`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}> </kyn-header>
  `,
};

export const WithNav = {
  args,
  render: (args) => html`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Link 1
        </kyn-header-link>

        <kyn-header-category heading="Category">
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 2
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 3
          </kyn-header-link>
        </kyn-header-category>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Link 4

          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 1
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 2
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 3

            <kyn-header-link slot="links" href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Sub Link 1
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Sub Link 2
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Sub Link 3
            </kyn-header-link>
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 4
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 5
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 6
          </kyn-header-link>
        </kyn-header-link>
      </kyn-header-nav>
    </kyn-header>
  `,
};

// -----------------------------------------------------------------------------
// JSON-driven categorized nav with configurable linkRenderer
// -----------------------------------------------------------------------------
export const WithCategorizedNav = {
  args: {
    ...args,
    activeMegaTabId: 'tab1',
    activeMegaCategoryId: null,
  },
  render: (renderArgs) => {
    const [, updateArgs] = useArgs();

    const handleMegaChange = (e) => {
      const { activeMegaTabId, activeMegaCategoryId } = e.detail;
      updateArgs({ activeMegaTabId, activeMegaCategoryId });
    };

    /** @type {HeaderMegaLinkRenderer} */
    const renderMegaLink = (link, _context) =>
      html`<span>${unsafeSVG(circleIcon)}</span>${link.label}`;

    return html`
      <kyn-header rootUrl=${renderArgs.rootUrl} appTitle=${renderArgs.appTitle}>
        <kyn-header-nav expandActiveMegaOnLoad>
          <div style="padding: 8px 0;">
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Application

              <kyn-tabs tabSize="sm" slot="links">
                <kyn-tab
                  slot="tabs"
                  id="tab1"
                  ?selected=${renderArgs.activeMegaTabId === 'tab1'}
                  @click=${() =>
                    updateArgs({
                      activeMegaTabId: 'tab1',
                      activeMegaCategoryId: null,
                    })}
                >
                  Tab 1
                </kyn-tab>

                <kyn-tab
                  slot="tabs"
                  id="tab2"
                  ?selected=${renderArgs.activeMegaTabId === 'tab2'}
                  @click=${() =>
                    updateArgs({
                      activeMegaTabId: 'tab2',
                      activeMegaCategoryId: null,
                    })}
                >
                  Tab 2
                </kyn-tab>

                <kyn-tab-panel
                  tabId="tab1"
                  noPadding
                  ?visible=${renderArgs.activeMegaTabId === 'tab1'}
                >
                  <kyn-search
                    label="Filter items... (Application controlled)"
                    style="display: block; margin-bottom: 16px;"
                  ></kyn-search>

                  <kyn-header-categories
                    .tabsConfig=${megaNavConfig}
                    .activeMegaTabId=${renderArgs.activeMegaTabId}
                    .activeMegaCategoryId=${renderArgs.activeMegaCategoryId}
                    linkRenderer=${renderMegaLink}
                    @on-nav-change=${handleMegaChange}
                  ></kyn-header-categories>
                </kyn-tab-panel>

                <kyn-tab-panel
                  tabId="tab2"
                  noPadding
                  ?visible=${renderArgs.activeMegaTabId === 'tab2'}
                >
                  <kyn-search
                    label="Filter items... (Application controlled)"
                    style="display: block; margin-bottom: 16px;"
                  ></kyn-search>

                  <kyn-header-categories
                    .tabsConfig=${megaNavConfig}
                    .activeMegaTabId=${renderArgs.activeMegaTabId}
                    .activeMegaCategoryId=${renderArgs.activeMegaCategoryId}
                    linkRenderer=${renderMegaLink}
                    @on-nav-change=${handleMegaChange}
                  ></kyn-header-categories>
                </kyn-tab-panel>
              </kyn-tabs>
            </kyn-header-link>
          </div>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 1
          </kyn-header-link>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-category heading="Category">
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Link 2
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Link 3
            </kyn-header-link>
          </kyn-header-category>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 4
          </kyn-header-link>
        </kyn-header-nav>
      </kyn-header>
    `;
  },
};

WithCategorizedNav.storyName = 'With Categorized Nav (JSON-driven)';

// -----------------------------------------------------------------------------
// Fully manual HTML variant (no JSON), mirroring megaNavCategories.json
// -----------------------------------------------------------------------------

export const WithCategorizedNavManualHtml = {
  args: {
    ...args,
    activeMegaTabId: 'tab1',
  },
  render: (renderArgs) => {
    const [, updateArgs] = useArgs();

    return html`
      <kyn-header rootUrl=${renderArgs.rootUrl} appTitle=${renderArgs.appTitle}>
        <kyn-header-nav expandActiveMegaOnLoad>
          <div style="padding: 8px 0;">
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Application

              <kyn-tabs tabSize="sm" slot="links">
                <kyn-tab
                  slot="tabs"
                  id="tab1"
                  ?selected=${renderArgs.activeMegaTabId === 'tab1'}
                  @click=${() => updateArgs({ activeMegaTabId: 'tab1' })}
                >
                  Tab 1
                </kyn-tab>

                <kyn-tab
                  slot="tabs"
                  id="tab2"
                  ?selected=${renderArgs.activeMegaTabId === 'tab2'}
                  @click=${() => updateArgs({ activeMegaTabId: 'tab2' })}
                >
                  Tab 2
                </kyn-tab>

                <kyn-tab-panel
                  tabId="tab1"
                  noPadding
                  ?visible=${renderArgs.activeMegaTabId === 'tab1'}
                >
                  <kyn-search
                    label="Filter items... (Application controlled)"
                    style="display: block; margin-bottom: 16px;"
                  ></kyn-search>

                  <kyn-header-categories>
                    <!-- CATEGORY 1 (6 links, show 4 + More) -->
                    <kyn-header-category heading="Category 1">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 4
                      </kyn-header-link>

                      <kyn-header-link href="javascript:void(0)">
                        <span style="margin-right: 8px;">
                          ${unsafeSVG(chevronRightIcon)}
                        </span>
                        <span>More</span>
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 2 -->
                    <kyn-header-category heading="Category 2">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 3 -->
                    <kyn-header-category heading="Category 3">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 4 -->
                    <kyn-header-category heading="Category 4">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 5 -->
                    <kyn-header-category heading="Category 5">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 4
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 6 -->
                    <kyn-header-category heading="Category 6">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 7 (13 links, show 4 + More) -->
                    <kyn-header-category heading="Category 7">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 4
                      </kyn-header-link>

                      <kyn-header-link href="javascript:void(0)">
                        <span style="margin-right: 8px;">
                          ${unsafeSVG(chevronRightIcon)}
                        </span>
                        <span>More</span>
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 8 -->
                    <kyn-header-category heading="Category 8">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 9 -->
                    <kyn-header-category heading="Category 9">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 4
                      </kyn-header-link>
                    </kyn-header-category>

                    <!-- CATEGORY 10 -->
                    <kyn-header-category heading="Category 10">
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 1
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 2
                      </kyn-header-link>
                      <kyn-header-link href="#">
                        <span>${unsafeSVG(circleIcon)}</span>
                        Sub Link 3
                      </kyn-header-link>
                    </kyn-header-category>
                  </kyn-header-categories>
                </kyn-tab-panel>

                <kyn-tab-panel
                  tabId="tab2"
                  noPadding
                  ?visible=${renderArgs.activeMegaTabId === 'tab2'}
                >
                  <kyn-search
                    label="Filter items... (Application controlled)"
                    style="display: block; margin-bottom: 16px;"
                  ></kyn-search>

                  <!-- mirror Tab 2 categories here if needed -->
                  <kyn-header-categories>
                    <!-- ... -->
                  </kyn-header-categories>
                </kyn-tab-panel>
              </kyn-tabs>
            </kyn-header-link>
          </div>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 1
          </kyn-header-link>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-category heading="Category">
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Link 2
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Link 3
            </kyn-header-link>
          </kyn-header-category>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 4
          </kyn-header-link>
        </kyn-header-nav>
      </kyn-header>
    `;
  },
};
WithCategorizedNavManualHtml.storyName = 'With Categorized Nav (Manual HTML)';

export const WithFlyouts = {
  args,
  render: (args) => html`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-flyouts>
        <kyn-header-flyout label="Menu Label" hideButtonLabel>
          <span slot="button">${unsafeSVG(helpIcon)}</span>
          <span slot="button" title="Full Button Text">Short ... Text</span>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 2
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label">
          <span slot="button">${unsafeSVG(helpIcon)}</span>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 2
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label" hideMenuLabel>
          <span slot="button">${unsafeSVG(userAvatarIcon)}</span>

          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
            <img src="https://picsum.photos/id/237/112/112" alt="User Name" />
          </kyn-header-user-profile>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example Link 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example Link 2
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `,
};
WithCategorizedNavManualHtml.storyName = 'With Categorized Nav (Manual HTML)';

export const WithNotificationPanel = {
  args,
  render: (args) => html`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-flyouts>
        <kyn-header-flyout label="Notification" hideMenuLabel>
          <span slot="button">${unsafeSVG(filledNotificationIcon)}</span>
          <kyn-header-notification-panel
            panelTitle=${notificationPanelArgs.panelTitle}
            panelFooterBtnText=${notificationPanelArgs.panelFooterBtnText}
            ?hidePanelFooter=${notificationPanelArgs.hidePanelFooter}
            @on-footer-btn-click=${(e) =>
              action(e.type)({ ...e, detail: e.detail })}
          >
            <kyn-button
              slot="menu-slot"
              kind="secondary"
              @click=${(e) => selectAllNotificationsAsRead(e)}
            >
              Mark all as Read
            </kyn-button>
            <kyn-button
              slot="menu-slot"
              kind="outline"
              @click=${(e) => console.log(e)}
            >
              <span slot="icon">${unsafeSVG(settingsIcon)}</span>
            </kyn-button>

            ${notificationTagStatusArr.map(
              (ele) => html`
                <kyn-notification
                  notificationTitle="Notification Title"
                  notificationSubtitle="Application or Service"
                  timeStamp="2 mins ago"
                  href="#"
                  type="clickable"
                  tagStatus=${ele.tagStatus}
                  unRead
                  @on-notification-click=${(e) =>
                    action(e.type)({ ...e, detail: e.detail })}
                >
                  <kyn-overflow-menu
                    slot="actions"
                    anchorRight
                    @click=${(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <kyn-overflow-menu-item
                      @on-click=${(e) => handleOverflowClick(e)}
                    >
                      Mark as Read
                    </kyn-overflow-menu-item>
                    <kyn-overflow-menu-item>
                      View Details
                    </kyn-overflow-menu-item>
                  </kyn-overflow-menu>

                  <div>
                    Message, this is an additional line Ipsum iMessage, Lorem
                    Ipsum is simply dummy and typesetting industry.
                  </div>
                </kyn-notification>
              `
            )}
          </kyn-header-notification-panel>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label">
          <span slot="button">${unsafeSVG(helpIcon)}</span>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 2
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label" hideMenuLabel>
          <span slot="button">${unsafeSVG(userAvatarIcon)}</span>

          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
            <img src="https://picsum.photos/id/237/112/112" alt="User Name" />
          </kyn-header-user-profile>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example Link 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example Link 2
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `,
};

export const WithEverything = {
  args,
  render: (args) => html`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Link 1
        </kyn-header-link>

        <kyn-header-category heading="Category">
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 2
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Link 3
          </kyn-header-link>
        </kyn-header-category>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Link 4

          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 1
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 2
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 3
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 4
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 5
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Sub Link 6
          </kyn-header-link>
        </kyn-header-link>
      </kyn-header-nav>

      <kyn-button size="small">Button</kyn-button>

      <kyn-header-flyouts>
        <kyn-header-flyout label="Menu Label">
          <span slot="button">${unsafeSVG(helpIcon)}</span>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example 2
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label" hideMenuLabel>
          <span slot="button">${unsafeSVG(userAvatarIcon)}</span>

          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
            <img src="https://picsum.photos/id/237/112/112" alt="User Name" />
          </kyn-header-user-profile>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example Link 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Example Link 2
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `,
};
