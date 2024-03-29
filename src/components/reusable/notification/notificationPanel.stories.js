import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import userAvatarIcon from '@carbon/icons/es/user--avatar/20';
import useSetingIcon from '@carbon/icons/es/settings/20';
import helpIcon from '@carbon/icons/es/help/20';
import circleIcon from '@carbon/icons/es/circle-stroke';
import filledNotificationIcon from '@carbon/icons/es/notification--new/20';

import '../../global/header';
import '../overflowMenu';
import '../tag';

export default {
  title: 'Components/Notification Panel',
  component: 'kyn-notification-panel',
  subcomponents: { 'kyn-notification': 'kyn-notification' },
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
      url: 'https://www.figma.com/file/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?type=design&node-id=9370-44581&mode=design&t=LXc9LDk5mGkf8vnl-0',
    },
  },
};

const notificationArr = [
  {
    notificationTitle: 'Notification Title 1',
    notificationSubtitle: 'Application or Service',
    timeStamp: '2 mins ago',
    description:
      'Message, this is an additional line Ipsum iMessage, Lorem Ipsum is simply dummy and typesetting industry.',
    tagLabel: 'Success',
    tagStatus: 'success',
  },
  {
    notificationTitle: 'Notification Title 2',
    notificationSubtitle: 'AIOps',
    timeStamp: '5 mins ago',
    description:
      'Message, this is an additional line Ipsum iMessage, Lorem Ipsum is simply dummy and typesetting industry. Lorem Ipsum is Message ghjyui fghrt',
    tagLabel: 'Info',
    tagStatus: 'info',
  },
  {
    notificationTitle: 'Notification Title 3',
    notificationSubtitle: 'Bridge',
    timeStamp: '7 mins ago',
    description:
      'Message, this is an additional line Ipsum iMessage, Lorem Ipsum is Message ghjyui fghrt',
    tagLabel: 'Warning',
    tagStatus: 'warning',
  },
  {
    notificationTitle: 'Notification Title 4',
    notificationSubtitle: 'ModernOps',
    timeStamp: '9 mins ago',
    description:
      'Message, this is an additional line Ipsum iMessage, Lorem Ipsum is simply dummy and typesetting industry.',
    tagLabel: 'Error',
    tagStatus: 'error',
  },
  {
    notificationTitle: 'Notification Title 5',
    notificationSubtitle: 'Bridge',
    timeStamp: '7 mins ago',
    description:
      'Message, this is an additional line Ipsum iMessage, Lorem Ipsum is Message ghjyui fghrt',
    tagLabel: 'Warning',
    tagStatus: 'warning',
  },
];

export const NotificationPanel = {
  args: {
    panelTitle: 'Notifications (65)',
    panelFooterBtnText: 'See All Notifications',
    hidePanelFooter: false,
  },
  render: (args) => {
    return html`
      <kyn-header rootUrl="/" appTitle="Application">
        <kyn-header-flyouts>
          <kyn-header-flyout label="Notification" hideMenuLabel>
            <kd-icon slot="button" .icon=${filledNotificationIcon}></kd-icon>
            <!-- Notification panel inside <kyn-header-flyout></kyn-header-flyout> -->
            <kyn-notification-panel
              panelTitle=${args.panelTitle}
              panelFooterBtnText=${args.panelFooterBtnText}
              ?hidePanelFooter=${args.hidePanelFooter}
              @on-footer-btn-click=${(e) => action(e.type)(e)}
            >
              <kd-button
                slot="menu-slot"
                kind="tertiary"
                @click=${(e) => console.log(e)}
              >
                <kd-icon .icon=${useSetingIcon}></kd-icon>
              </kd-button>
              <!-- Notification component inside notification panel -->
              ${notificationArr.map(
                (notification) =>
                  html`<kyn-notification
                    notificationTitle=${notification.notificationTitle}
                    notificationSubtitle=${notification.notificationSubtitle}
                    timeStamp=${notification.timeStamp}
                    type="clickable"
                    tagStatus=${notification.tagStatus}
                    tagLabel=${notification.tagLabel}
                    href="#"
                    @on-notification-click=${(e) => action(e.type)(e)}
                  >
                    <kyn-overflow-menu
                      slot="action-slot"
                      anchorRight
                      @click=${(e) => e.preventDefault()}
                    >
                      <kyn-overflow-menu-item
                        >Mark as Read</kyn-overflow-menu-item
                      >
                      <kyn-overflow-menu-item
                        >View Details</kyn-overflow-menu-item
                      >
                    </kyn-overflow-menu>

                    <div slot="notification-body-slot">
                      ${notification.description}
                    </div>
                  </kyn-notification>`
              )}
            </kyn-notification-panel>

            <kyn-button slot="menu-slot" kind="tertiary">
              <kyn-icon .icon=${useSetingIcon}></kyn-icon>
            </kyn-button>
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
      </kyn-header>
    `;
  },
};
