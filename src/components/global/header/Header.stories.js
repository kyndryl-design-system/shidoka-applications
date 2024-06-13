import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';

import userAvatarIcon from '@carbon/icons/es/user--avatar/20';
import helpIcon from '@carbon/icons/es/help/20';
import circleIcon from '@carbon/icons/es/circle-stroke';
import filledNotificationIcon from '@carbon/icons/es/notification--new/20';
import useSetingIcon from '@carbon/icons/es/settings/20';

import '../../reusable/notification';
import '../../reusable/overflowMenu';

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
      url: 'https://www.figma.com/file/A13iBXmOmvxaJaBRWwqezd/Top-Nav-1.2?node-id=518%3A17470&mode=dev',
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
          <kd-icon .icon=${circleIcon}></kd-icon>
          Link 1
        </kyn-header-link>

        <kyn-header-category heading="Category">
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Link 2
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Link 3

            <button slot="button" aria-label="Action" title="Action">
              <kd-icon .icon=${circleIcon}></kd-icon>
            </button>
          </kyn-header-link>
        </kyn-header-category>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${circleIcon}></kd-icon>
          Link 4

          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 1

            <button slot="button" aria-label="Action" title="Action">
              <kd-icon .icon=${circleIcon}></kd-icon>
            </button>
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 2
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 3
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 4
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 5
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
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
        <kyn-header-flyout label="Menu Label">
          <kd-icon .icon=${helpIcon} slot="button"></kd-icon>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Example 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Example 2
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label" hideMenuLabel>
          <kd-icon slot="button" .icon=${userAvatarIcon}></kd-icon>

          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
            <img src="https://picsum.photos/id/237/112/112" />
          </kyn-header-user-profile>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Example Link 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
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
        <kd-icon slot="button" .icon=${filledNotificationIcon}></kd-icon>
        <!-- Notification panel inside <kyn-header-flyout></kyn-header-flyout> -->
        <kyn-header-notification-panel
          panelTitle=${notificationPanelArgs.panelTitle}
          panelFooterBtnText=${notificationPanelArgs.panelFooterBtnText}
          ?hidePanelFooter=${notificationPanelArgs.hidePanelFooter}
          @on-footer-btn-click=${(e) => action(e.type)(e)}
        >
          <kd-button
            slot="menu-slot"
            kind="tertiary"
            @click=${(e) => selectAllNotificationsAsRead(e)}
            >Mark all as Read</kd-button
          >
          <kd-button
            slot="menu-slot"
            kind="tertiary"
            @click=${(e) => console.log(e)}
          >
            <kd-icon .icon=${useSetingIcon}></kd-icon>
          </kd-button>

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
        <kd-icon .icon=${helpIcon} slot="button"></kd-icon>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${circleIcon}></kd-icon>
          Example 1
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${circleIcon}></kd-icon>
          Example 2
        </kyn-header-link>
      </kyn-header-flyout>

      <kyn-header-flyout label="Menu Label" hideMenuLabel>
        <kd-icon slot="button" .icon=${userAvatarIcon}></kd-icon>

        <kyn-header-user-profile
          name="User Name"
          subtitle="Job Title"
          email="user@kyndryl.com"
          profileLink="#"
        >
          <img src="https://picsum.photos/id/237/112/112" />
        </kyn-header-user-profile>

        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${circleIcon}></kd-icon>
          Example Link 1
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${circleIcon}></kd-icon>
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
          <kd-icon .icon=${circleIcon}></kd-icon>
          Link 1
        </kyn-header-link>

        <kyn-header-category heading="Category">
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Link 2
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Link 3
          </kyn-header-link>
        </kyn-header-category>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${circleIcon}></kd-icon>
          Link 4

          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 1
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 2
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 3
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 4
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 5
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link 6
          </kyn-header-link>
        </kyn-header-link>
      </kyn-header-nav>

      <kd-button size="small">Button</kd-button>

      <kyn-header-flyouts>
        <kyn-header-flyout label="Menu Label">
          <kd-icon .icon=${helpIcon} slot="button"></kd-icon>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Example 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Example 2
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label" hideMenuLabel>
          <kd-icon slot="button" .icon=${userAvatarIcon}></kd-icon>

          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
            <img src="https://picsum.photos/id/237/112/112" />
          </kyn-header-user-profile>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Example Link 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Example Link 2
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `,
};
