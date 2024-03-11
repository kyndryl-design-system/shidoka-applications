import { html } from 'lit';
import './';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';

import userAvatarIcon from '@carbon/icons/es/user--avatar/20';
import helpIcon from '@carbon/icons/es/help/20';
import circleIcon from '@carbon/icons/es/circle-stroke';

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
    'kyn-header-avatar': 'kyn-header-avatar',
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

        <kyn-header-divider></kyn-header-divider>

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

export const WithEverything = {
  args,
  render: (args) => html`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${circleIcon}></kd-icon>
          Link 1
        </kyn-header-link>

        <kyn-header-divider></kyn-header-divider>

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
