import { html } from 'lit';
import './sideNav';
import './sideNavLink';
import '../../reusable/icon/icon';

import sampleIcon from '@carbon/icons/es/user--avatar/16';

export default {
  title: 'Components/Global/Side Nav',
  component: 'kyn-side-nav',
  subcomponents: {
    SideNavLink: 'kyn-side-nav-link',
  },
  decorators: [
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

export const SideNav = {
  args: {
    collapsed: false,
  },
  render: (args) => html`
    <kyn-side-nav ?collapsed=${args.collapsed}>
      <kyn-side-nav-link href="javascript:void(0)">
        <kyn-icon slot="icon" .icon=${sampleIcon}></kyn-icon>
        Link 1
      </kyn-side-nav-link>

      <kyn-side-nav-link href="javascript:void(0)">
        <kyn-icon slot="icon" .icon=${sampleIcon}></kyn-icon>
        Link 2

        <kyn-side-nav-link slot="links" href="javascript:void(0)">
          L2 Link 1
        </kyn-side-nav-link>
        <kyn-side-nav-link slot="links" href="javascript:void(0)">
          L2 Link 2
        </kyn-side-nav-link>
      </kyn-side-nav-link>

      <kyn-side-nav-link href="javascript:void(0)" expanded>
        <kyn-icon slot="icon" .icon=${sampleIcon}></kyn-icon>
        Link 3

        <kyn-side-nav-link slot="links" href="javascript:void(0)">
          L2 Link 1

          <kyn-side-nav-link slot="links" href="javascript:void(0)">
            L3 Link 1
          </kyn-side-nav-link>
          <kyn-side-nav-link slot="links" href="javascript:void(0)">
            L3 Link 2
          </kyn-side-nav-link>
        </kyn-side-nav-link>
      </kyn-side-nav-link>
    </kyn-side-nav>
  `,
};
