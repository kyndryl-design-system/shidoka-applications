import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import userAvatarIcon from '@carbon/icons/es/user--avatar/20';
import useSetingIcon from '@carbon/icons/es/settings/20';
import helpIcon from '@carbon/icons/es/help/20';
import circleIcon from '@carbon/icons/es/circle-stroke';
import filledNotificationIcon from '@carbon/icons/es/notification--filled/20';

import '../../global/header';
import '../overflowMenu';

export default {
  title: 'Components/Notification Panel',
  component: 'kyn-notification-panel',
};

export const NotificationPanel = {
  args: {
    panelTitle: 'Notifications (65)',
    panelFooterBtnText: 'See All Notifications',
    hidePanelFooter: false,
  },
  render: (args) => {
    return html`
      <!-- <kyn-header rootUrl="/" appTitle="Application" style="display:none;">
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

          <kyn-header-flyout label="Notification" hideMenuLabel>
            <kd-icon slot="button" .icon=${filledNotificationIcon}></kd-icon>
            <kyn-notification-panel
              panelTitle=${args.panelTitle}
              footerText=${args.footerText}
              ?hidePanelFooter=${args.hidePanelFooter}
            >
              <kyn-overflow-menu slot="menu-slot" verticalDots anchorRight>
                <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
                <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
              </kyn-overflow-menu>
              <div>Hi I am notification panel</div>
            </kyn-notification-panel>
            <kyn-button slot="menu-slot" kind="tertiary">
              <kyn-icon .icon=${useSetingIcon}></kyn-icon>
            </kyn-button>
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
      </kyn-header> -->

      <kyn-notification-panel
        panelTitle=${args.panelTitle}
        panelFooterBtnText=${args.panelFooterBtnText}
        ?hidePanelFooter=${args.hidePanelFooter}
        @on-footer-btn-click=${(e) => action(e.type)(e)}
        style="float:right;"
      >
        <kd-button
          slot="menu-slot"
          kind="tertiary"
          @click=${(e) => console.log(e)}
        >
          <kd-icon .icon=${useSetingIcon}></kd-icon>
        </kd-button>

        <kyn-notification>
          <kyn-overflow-menu slot="overflow-menu-slot" anchorRight>
            <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
            <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
          </kyn-overflow-menu>
        </kyn-notification>
        <kyn-notification></kyn-notification>
        <kyn-notification></kyn-notification>
        <kyn-notification></kyn-notification>
        <kyn-notification></kyn-notification>
        <kyn-notification></kyn-notification>
      </kyn-notification-panel>
    `;
  },
};
