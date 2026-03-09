import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';

import '../../components/global/uiShell';
import '../../components/global/header';
import '../../components/global/localNav';
import '../../components/global/footer';
import '../../components/global/workspaceSwitcher';
import '../../components/reusable/pagetitle';
import '../../components/reusable/table';
import '../../components/reusable/link';

import bridgeLogo from '@kyndryl-design-system/shidoka-foundation/assets/svg/bridge-logo-large.svg';
import starFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';

const settingsTableRows = [
  { setting: 'Theme', value: 'System default', scope: 'Account' },
  { setting: 'Language', value: 'English', scope: 'Account' },
  { setting: 'Timezone', value: 'UTC-05:00 Eastern', scope: 'Account' },
  { setting: 'Email notifications', value: 'Enabled', scope: 'User' },
  { setting: 'Two-factor auth', value: 'Enabled', scope: 'User' },
  { setting: 'Session timeout', value: '30 minutes', scope: 'User' },
  { setting: 'Data retention', value: '90 days', scope: 'Account' },
  { setting: 'API access', value: 'Enabled', scope: 'Account' },
  { setting: 'Audit logging', value: 'Enabled', scope: 'Account' },
];

export default {
  title: 'Pages/Shidoka Settings',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => html`
      <div style="min-height: 100vh; width: 100%;">
        ${typeof story === 'function' ? story() : story}
      </div>
    `,
  ],
};

export const SettingsPage = {
  render: () => html`
    <kyn-ui-shell>
      <kyn-header rootUrl="/" appTitle="Shidoka Studio">
        <span slot="logo" style="--kyn-header-logo-width: 120px;"
          >${unsafeSVG(bridgeLogo)}</span
        >
        <kyn-header-nav truncate-links>
          <kyn-header-link
            id="global-switcher"
            href="javascript:void(0)"
            hideSearch
          >
            <span>${unsafeSVG(starFilledIcon)}</span>
            Global Switcher
            <kyn-header-category slot="links">
              <kyn-header-link href="#">
                <span>Connections Management</span>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Discovered Data</span>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Visualization & Analytics</span>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Topology</span>
              </kyn-header-link>
              <kyn-header-link href="#">
                <span>Settings</span>
              </kyn-header-link>
            </kyn-header-category>
          </kyn-header-link>
        </kyn-header-nav>

        <kyn-header-flyouts>
          <kyn-header-flyout label="Workspace" hideMenuLabel>
            <span
              slot="button"
              style="display: flex; align-items: center; gap: 8px; font-size: 14px;"
            >
              <span>Acme Corporation</span>
              <span>${unsafeSVG(circleIcon)}</span>
            </span>
            <kyn-workspace-switcher
              style="min-width: 520px; width: max-content; max-width: 90vw; --kyn-workspace-switcher-max-height: min(480px, 70vh); min-height: 280px;"
            >
              <kyn-workspace-switcher-menu-item
                slot="left-list"
                variant="workspace"
                value="global"
                name="Global Zone (All)"
                ?selected=${true}
              ></kyn-workspace-switcher-menu-item>
              <kyn-workspace-switcher-menu-item
                slot="left-list"
                variant="workspace"
                value="tenants"
                name="Account Tenants"
              ></kyn-workspace-switcher-menu-item>
              <kyn-workspace-switcher-menu-item
                slot="left-list"
                variant="workspace"
                value="compute"
                name="Compute Zones"
              ></kyn-workspace-switcher-menu-item>
              <kyn-workspace-switcher-menu-item
                slot="right-list"
                variant="item"
                value="t-1"
                name="Acme Corporation"
                ?selected=${true}
              ></kyn-workspace-switcher-menu-item>
              <kyn-workspace-switcher-menu-item
                slot="right-list"
                variant="item"
                value="t-2"
                name="Beta Industries"
              ></kyn-workspace-switcher-menu-item>
              <kyn-workspace-switcher-menu-item
                slot="right-list"
                variant="item"
                value="t-3"
                name="Cascade Systems"
              ></kyn-workspace-switcher-menu-item>
            </kyn-workspace-switcher>
          </kyn-header-flyout>

          <kyn-header-flyout label="User" hideMenuLabel>
            <span slot="button">${unsafeSVG(userAvatarIcon)}</span>
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Profile
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              <span>${unsafeSVG(circleIcon)}</span>
              Sign out
            </kyn-header-link>
          </kyn-header-flyout>
        </kyn-header-flyouts>
      </kyn-header>

      <kyn-local-nav>
        <kyn-local-nav-link href="javascript:void(0)" active>
          <span>General</span>
        </kyn-local-nav-link>
        <kyn-local-nav-link href="javascript:void(0)">
          <span>Security</span>
        </kyn-local-nav-link>
        <kyn-local-nav-link href="javascript:void(0)">
          <span>Notifications</span>
        </kyn-local-nav-link>
        <kyn-local-nav-link href="javascript:void(0)">
          <span>Integrations</span>
        </kyn-local-nav-link>
      </kyn-local-nav>

      <main style="padding: var(--kd-page-gutter, 1rem);">
        <kyn-page-title
          headLine="Settings"
          pageTitle="General"
        ></kyn-page-title>
        <div
          style="overflow: auto; max-height: 360px; border: 1px solid var(--kd-color-border, #e0e0e0); border-radius: 4px; margin-top: 1rem;"
        >
          <kyn-table-container>
            <kyn-table>
              <kyn-thead>
                <kyn-header-tr>
                  <kyn-th>Setting</kyn-th>
                  <kyn-th>Value</kyn-th>
                  <kyn-th>Scope</kyn-th>
                </kyn-header-tr>
              </kyn-thead>
              <kyn-tbody>
                ${settingsTableRows.map(
                  (row) => html`
                    <kyn-tr>
                      <kyn-td>${row.setting}</kyn-td>
                      <kyn-td>${row.value}</kyn-td>
                      <kyn-td>${row.scope}</kyn-td>
                    </kyn-tr>
                  `
                )}
              </kyn-tbody>
            </kyn-table>
          </kyn-table-container>
        </div>
      </main>

      <kyn-footer rootUrl="/" logoAriaLabel="Home">
        <span slot="copyright"
          >© ${new Date().getFullYear()} Kyndryl. All rights reserved.</span
        >
      </kyn-footer>
    </kyn-ui-shell>
  `,
};
