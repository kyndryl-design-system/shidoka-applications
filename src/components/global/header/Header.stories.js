import { html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import './';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import switcherIcon from '@kyndryl-design-system/shidoka-foundation/assets/svg/switcher.svg';
import userAvatarIcon from '@carbon/icons/es/user--avatar/24';
import helpIcon from '@carbon/icons/es/help/16';

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
        <kyn-header-link href="javascript:void(0)" isActive>
          Link 2
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${helpIcon}></kd-icon>
          Link 3

          <kyn-header-link slot="links" href="javascript:void(0)" divider>
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

          <div>
            <kyn-header-link href="javascript:void(0)"> Login </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              Sign up
            </kyn-header-link>
          </div>
        </kyn-header-flyout>

        <kyn-header-flyout assistiveText="My Account" hideArrow>
          <kyn-header-avatar initials="KB" slot="button"></kyn-header-avatar>

          <kyn-header-link href="javascript:void(0)"> Logout </kyn-header-link>
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
        <span slot="button">${unsafeHTML(switcherIcon)}</span>

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

export const WithEverything = {
  args,
  render: (args) => html`
    <kyn-header
      rootUrl=${args.rootUrl}
      appTitle=${args.appTitle}
      breakpoint=${args.breakpoint}
      ?divider=${args.divider}
    >
      <kyn-header-panel slot="left" heading="Panel Heading">
        <span slot="button">${unsafeHTML(switcherIcon)}</span>

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

      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)"> Link 1 </kyn-header-link>
        <kyn-header-link href="javascript:void(0)" isActive>
          Link 2
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${helpIcon}></kd-icon>
          Link 3

          <kyn-header-link slot="links" href="javascript:void(0)" divider>
            Sub Link # 1
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            Sub Link 2
          </kyn-header-link>
        </kyn-header-link>
      </kyn-header-nav>

      <kyn-header-flyouts>
        <kyn-header-flyout>
          <span slot="button">Sign in</span>

          <div>
            <kyn-header-link href="javascript:void(0)"> Login </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              Sign up
            </kyn-header-link>
          </div>
        </kyn-header-flyout>

        <kyn-header-flyout>
          <span
            slot="button"
            style="display: flex; align-items: center; gap: 6px;"
          >
            <kd-icon .icon=${helpIcon}></kd-icon>
            Support
          </span>

          <div>
            <kyn-header-link href="javascript:void(0)">
              Example 1
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              Example 2
            </kyn-header-link>
          </div>
        </kyn-header-flyout>

        <kyn-header-flyout assistiveText="My Account" hideArrow>
          <kyn-header-avatar initials="KB" slot="button"></kyn-header-avatar>

          <kyn-header-link href="javascript:void(0)"> Logout </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `,
};
