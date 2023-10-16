import { html } from 'lit';
import './';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import caratDownIcon from '@carbon/icons/es/caret--down/16';
import appsIcon from '@carbon/icons/es/apps/24';
import userAvatarIcon from '@carbon/icons/es/user--avatar/20';

export default {
  title: 'Global Components/Header',
  component: 'kyn-header',
  subcomponents: {
    'kyn-header-nav': 'kyn-header-nav',
    'kyn-header-link': 'kyn-header-link',
    'kyn-header-flyouts': 'kyn-header-flyouts',
    'kyn-header-flyout': 'kyn-header-flyout',
    'kyn-header-avatar': 'kyn-header-avatar',
    'kyn-header-panel': 'kyn-header-panel',
    'kyn-header-panel-link': 'kyn-header-panel-link',
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
};

const args = {
  rootUrl: '/',
  appTitle: 'Application',
  breakpoint: 672,
  divider: true,
};

export const Header = {
  args,
  render: (args) => html`
    <kyn-header
      rootUrl=${args.rootUrl}
      appTitle=${args.appTitle}
      breakpoint=${args.breakpoint}
      ?divider=${args.divider}
    >
    </kyn-header>
  `,
};

export const WithNavLinks = {
  args,
  render: (args) => html`
    <kyn-header
      rootUrl=${args.rootUrl}
      appTitle=${args.appTitle}
      breakpoint=${args.breakpoint}
      ?divider=${args.divider}
    >
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)"> Link 1 </kyn-header-link>
        <kyn-header-link href="javascript:void(0)" isActive divider>
          Link 2
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          Link 3

          <kyn-header-link slot="links" href="javascript:void(0)">
            Sub Link # 1
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            Sub Link 2
          </kyn-header-link>
        </kyn-header-link>
      </kyn-header-nav>
    </kyn-header>
  `,
};

export const WithFlyouts = {
  args,
  render: (args) => html`
    <kyn-header
      rootUrl=${args.rootUrl}
      appTitle=${args.appTitle}
      breakpoint=${args.breakpoint}
      ?divider=${args.divider}
    >
      <kyn-header-flyouts>
        <kyn-header-flyout>
          <span slot="button">Sign in</span>
          <kd-icon slot="button" .icon="${caratDownIcon}"></kd-icon>

          <div>
            <kyn-header-link href="javascript:void(0)"> Login </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              Sign up
            </kyn-header-link>
          </div>
        </kyn-header-flyout>

        <kyn-header-flyout assistiveText="My Account">
          <kyn-header-avatar initials="KB" slot="button"></kyn-header-avatar>

          <kyn-header-link href="javascript:void(0)">
            Logout
            <svg
              style="margin-left: 8px;"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.1703 3H10.5635V3.94118H6.62286L5.94118 4.79393V17.2061L6.62286 18.0588H10.5635V19H6.1703L5 17.536V4.46398L6.1703 3Z"
                fill="#3D3C3C"
              />
              <path
                d="M19.4238 10.6914L14.6639 15.3827L13.9829 14.7115L17.5909 11.1605H8V10.2222H17.5909L13.9829 6.65241L14.6639 6L19.4238 10.6914Z"
                fill="#FF290E"
              />
            </svg>
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `,
};

export const WithPanel = {
  args,
  render: (args) => html`
    <kyn-header
      rootUrl=${args.rootUrl}
      appTitle=${args.appTitle}
      breakpoint=${args.breakpoint}
      ?divider=${args.divider}
    >
      <kyn-header-panel slot="left" heading="Panel Heading">
        <kd-icon slot="button" .icon=${appsIcon}></kd-icon>

        <kyn-header-panel-link href="javascript:void(0)">
          <kd-icon .icon=${userAvatarIcon}></kd-icon>
          Link 1
        </kyn-header-panel-link>
        <kyn-header-panel-link href="javascript:void(0)">
          <kd-icon .icon=${userAvatarIcon}></kd-icon>
          Link 2
        </kyn-header-panel-link>
        <kyn-header-panel-link href="javascript:void(0)">
          <kd-icon .icon=${userAvatarIcon}></kd-icon>
          Link 3
        </kyn-header-panel-link>
      </kyn-header-panel>
    </kyn-header>
  `,
};

Header.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zGyRSDM6stIrSjC3TOyGGQ/744667---UX-Top-Nav-%26-Hamburger-Menu-Framework?node-id=330%3A1658',
  },
  // controls: {
  //   include: Object.keys(Header.args),
  // },
};
