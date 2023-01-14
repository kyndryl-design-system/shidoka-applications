import { html } from 'lit';
import '../components/global/header/header';
import '../components/global/header/headerNav';
import '../components/global/header/headerNavLink';

export default {
  title: 'Global/Header',
  component: 'kyn-header',
  subcomponents: {
    HeaderNav: 'kyn-header-nav',
    HeaderNavLink: 'kyn-header-nav-link',
  },
  decorators: [
    (story) =>
      html`
        <div style="height: 150px;">
          <div style="position: absolute; top: 0; right: 0; left: 0;">
            ${story()}
          </div>
        </div>
      `,
  ],
};

export const Header = {
  args: {
    rootUrl: '/',
    appTitle: 'Delivery',
    appSubtitle: 'Insights',
  },
  render: (args) => html`
    <kyn-header
      rootUrl=${args.rootUrl}
      appTitle=${args.appTitle}
      appSubtitle=${args.appSubtitle}
    >
      <kyn-header-nav slot="nav">
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
    </kyn-header>
  `,
};

// Header.parameters = {
//   controls: {
//     include: Object.keys(Header.args),
//   },
// };
