import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './';
import '../../reusable/button';

import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/user.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/question.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import circleIcon24 from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/circle-stroke.svg';
import filledNotificationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/notifications-new.svg';
import useSetingIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/settings.svg';

import '../../reusable/notification';
import '../../reusable/overflowMenu';
import '../../reusable/tooltip';

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
      url: 'https://www.figma.com/design/qnqPc99nECP6mrcGKE3CTA/Components-%26-Patterns?node-id=311-195&node-type=canvas&m=dev',
    },
    // controls: {
    //   include: Object.keys(Header.args),
    // },
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

// Example of change prop unRead of <kyn-notification> when we select Mark all as Read
const selectAllNotificationsAsRead = (e) => {
  const notifications = document.querySelectorAll('kyn-notification');
  notifications.forEach((notification) => {
    // unRead is notification prop
    notification.unRead = false;
  });
  action(e.type)(e);
};

const handleOverflowClick = (e) => {
  action(e.type)(e);
  // overflow link click logic here to mark as unread
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
          <span>${unsafeSVG(circleIcon24)}</span>
          Link 1
        </kyn-header-link>

        <kyn-header-category heading="Category">
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon24)}</span>
            Link 2
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon24)}</span>
            Link 3
          </kyn-header-link>
        </kyn-header-category>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon24)}</span>
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
    </kyn-header>
  `,
};

export const WithFlyouts = {
  args,
  render: (args) => html`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-flyouts>
        <kyn-header-flyout label="Menu Label" hideButtonLabel>
          <span slot="button">${unsafeSVG(helpIcon)}</span>
          <span slot="button" title="Full Button Text">Short ... Text</span>
          <!--
          <kyn-tooltip slot="button" direction="bottom">
            <span slot="anchor">Short ... Text</span>
          </kyn-tooltip>
          -->

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

export const WithNotificationPanel = {
  args,
  render: (args) => html` <kyn-header
    rootUrl=${args.rootUrl}
    appTitle=${args.appTitle}
  >
    <kyn-header-flyouts>
      <kyn-header-flyout label="Notification" hideMenuLabel>
        <span slot="button">${unsafeSVG(filledNotificationIcon)}</span>
        <!-- Notification panel inside <kyn-header-flyout></kyn-header-flyout> -->
        <kyn-header-notification-panel
          panelTitle=${notificationPanelArgs.panelTitle}
          panelFooterBtnText=${notificationPanelArgs.panelFooterBtnText}
          ?hidePanelFooter=${notificationPanelArgs.hidePanelFooter}
          @on-footer-btn-click=${(e) => action(e.type)(e)}
        >
          <kyn-button
            slot="menu-slot"
            kind="tertiary"
            @click=${(e) => selectAllNotificationsAsRead(e)}
            >Mark all as Read</kyn-button
          >
          <kyn-button
            slot="menu-slot"
            kind="tertiary"
            @click=${(e) => console.log(e)}
          >
            <span>${unsafeSVG(useSetingIcon)}</span>
          </kyn-button>

          <!-- Notification component inside notification panel -->
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
                @on-notification-click=${(e) => action(e.type)(e)}
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
                    >Mark as Read</kyn-overflow-menu-item
                  >
                  <kyn-overflow-menu-item>View Details</kyn-overflow-menu-item>
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
  </kyn-header>`,
};

export const WithEverything = {
  args,
  render: (args) => html`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon24)}</span>
          Link 1
        </kyn-header-link>

        <kyn-header-category heading="Category">
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon24)}</span>
            Link 2
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon24)}</span>
            Link 3
          </kyn-header-link>
        </kyn-header-category>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon24)}</span>
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
