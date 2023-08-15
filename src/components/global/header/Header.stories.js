import { html } from 'lit';
import './header';
import './headerNav';
import './headerLink';
import './headerFlyouts';
import './headerFlyout';
import './headerAvatar';
import '@kyndryl-design-system/foundation/components/icon';

import caratDownIcon from '@carbon/icons/es/caret--down/16';

export default {
  title: 'Global/Header',
  component: 'kyn-header',
  subcomponents: {
    HeaderNav: 'kyn-header-nav',
    HeaderLink: 'kyn-header-link',
    HeaderFlyouts: 'kyn-header-flyouts',
    HeaderFlyout: 'kyn-header-flyout',
    HeaderAvatar: 'kyn-header-avatar',
  },
  decorators: [
    (story) =>
      html`
        <div
          style="height: 100%; min-height: 250px; transform: translate3d(0,0,0); margin: var(--kd-negative-page-gutter);"
        >
          ${story()}
        </div>
      `,
  ],
};

export const Header = {
  args: {
    rootUrl: '/',
    appTitle: 'Application',
    breakpoint: 740,
    divider: true,
  },
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

      <kyn-header-flyouts>
        <kyn-header-flyout>
          <div slot="button">
            Sign in
            <kd-icon
              .icon="${caratDownIcon}"
              style="vertical-align: middle; margin-top: -1px"
            ></kd-icon>
          </div>

          <div>
            <kyn-header-link href="javascript:void(0)"> Login </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              Sign up
            </kyn-header-link>
          </div>
        </kyn-header-flyout>

        <kyn-header-flyout>
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

Header.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zGyRSDM6stIrSjC3TOyGGQ/744667---UX-Top-Nav-%26-Hamburger-Menu-Framework?node-id=330%3A1658',
  },
  // controls: {
  //   include: Object.keys(Header.args),
  // },
};
