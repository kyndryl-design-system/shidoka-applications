import { html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import './';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import switcherIcon from '@kyndryl-design-system/shidoka-foundation/assets/svg/switcher.svg';
import userAvatarIcon from '@carbon/icons/es/user--avatar/20';
import helpIcon from '@carbon/icons/es/help/20';
import circleIcon from '@carbon/icons/es/circle-stroke';

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

export const WithNav = {
  args,
  render: (args) => html`
    <kyn-header
      rootUrl=${args.rootUrl}
      appTitle=${args.appTitle}
      breakpoint=${args.breakpoint}
      ?divider=${args.divider}
    >
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${circleIcon}></kd-icon>
          Link 1
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)" isActive>
          <kd-icon .icon=${circleIcon}></kd-icon>
          Link 2
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${circleIcon}></kd-icon>
          Link 3

          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Sub Link # 1
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
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
        <kyn-header-flyout label="Menu Label">
          <kd-icon .icon=${helpIcon} slot="button"></kd-icon>

          <div>
            <kyn-header-link href="javascript:void(0)">
              <kd-icon .icon=${circleIcon}></kd-icon>
              Example 1
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              <kd-icon .icon=${circleIcon}></kd-icon>
              Example 2
            </kyn-header-link>
          </div>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label">
          <kd-icon slot="button" .icon=${userAvatarIcon}></kd-icon>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${circleIcon}></kd-icon>
            Example Link
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
          <kd-icon .icon=${helpIcon} slot="button"></kd-icon>

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
          <kd-icon slot="button" .icon=${userAvatarIcon}></kd-icon>

          <kyn-header-link href="javascript:void(0)">
            Example Link
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `,
};
