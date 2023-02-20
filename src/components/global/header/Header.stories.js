import { withDesign } from 'storybook-addon-designs';
import { html } from 'lit';
import './header';
import './headerNav';
import './headerNavLink';
import './headerFlyouts';
import './headerFlyout';
import '../../reusable/icon/icon';

import userIcon from '@carbon/icons/es/user--avatar/24';

export default {
  title: 'Global/Header',
  component: 'kyn-header',
  subcomponents: {
    HeaderNav: 'kyn-header-nav',
    HeaderNavLink: 'kyn-header-nav-link',
    HeaderFlyouts: 'kyn-header-flyouts',
    HeaderFlyout: 'kyn-header-flyout',
  },
  decorators: [
    withDesign,
    (story) =>
      html`
        <div
          style="height: 100%; min-height: 250px; transform: translate3d(0,0,0); margin: -16px;"
        >
          ${story()}
        </div>
      `,
  ],
};

export const Header = {
  args: {
    rootUrl: '/',
    appTitle: 'Delivery',
    appSubtitle: 'Insights',
    smallLogo: false,
    breakpoint: 672,
  },
  render: (args) => html`
    <kyn-header
      rootUrl=${args.rootUrl}
      appTitle=${args.appTitle}
      appSubtitle=${args.appSubtitle}
      ?smallLogo=${args.smallLogo}
      breakpoint=${args.breakpoint}
    >
      <kyn-header-nav>
        <kyn-header-nav-link href="javascript:void(0)" text="Link 1">
        </kyn-header-nav-link>
        <kyn-header-nav-link href="javascript:void(0)" text="Link 2">
        </kyn-header-nav-link>
        <kyn-header-nav-link href="javascript:void(0)" text="Link 3">
          <kyn-header-nav-link
            href="javascript:void(0)"
            text="Sub Link 1"
            level="2"
          >
          </kyn-header-nav-link>
          <kyn-header-nav-link
            href="javascript:void(0)"
            text="Sub Link 2"
            level="2"
          >
          </kyn-header-nav-link>
        </kyn-header-nav-link>
      </kyn-header-nav>

      <kyn-header-flyouts>
        <kyn-header-flyout>
          <kyn-icon .icon=${userIcon} slot="button"></kyn-icon>
          <div>
            <strong>User Name</strong>
            <br />
            user.name@kyndryl.com
            <br /><br />
            <kyn-button>Log Out</kyn-button>
          </div>
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
