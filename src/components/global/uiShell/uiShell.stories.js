import { html } from 'lit';
import './index';
import '../footer';
import '../header';
import '../localNav';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import userAvatarIcon from '@carbon/icons/es/user--avatar/20';
import helpIcon from '@carbon/icons/es/help/20';
import sampleIcon from '@carbon/icons/es/circle-stroke';

export default {
  title: 'Global Components/UI Shell',
  component: 'kyn-ui-shell',
  decorators: [
    (story) =>
      html`
        <div style="margin: var(--kd-negative-page-gutter);">${story()}</div>
      `,
  ],
};

export const UIShell = {
  render: () => html`
    <kyn-ui-shell>
      <kyn-header appTitle="UI Shell Example"></kyn-header>

      <main>Main content here.</main>

      <kyn-footer>
        <span slot="copyright">
          Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights
          reserved.
        </span>
      </kyn-footer>
    </kyn-ui-shell>
  `,
};

export const WithLocalNav = {
  render: () => html`
    <kyn-ui-shell>
      <kyn-header appTitle="UI Shell Example"></kyn-header>

      <kyn-local-nav>
        <kyn-local-nav-link href="javascript:void(0)" active>
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 1
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)">
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 2

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 1
          </kyn-local-nav-link>
          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 2
          </kyn-local-nav-link>
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)">
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 3

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 1

            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
              L3 Link 1
            </kyn-local-nav-link>
            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
              L3 Link 2
            </kyn-local-nav-link>
          </kyn-local-nav-link>
          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 2
          </kyn-local-nav-link>
        </kyn-local-nav-link>
      </kyn-local-nav>

      <main>Main content here.</main>

      <kyn-footer>
        <span slot="copyright">
          Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights
          reserved.
        </span>
      </kyn-footer>
    </kyn-ui-shell>
  `,
};

export const WithEverything = {
  render: () => html`
    <kyn-ui-shell>
      <kyn-header appTitle="UI Shell Example">
        <kyn-header-nav>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${sampleIcon}></kd-icon>
            Link 1
          </kyn-header-link>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-category heading="Category">
            <kyn-header-link href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Link 2
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Link 3
            </kyn-header-link>
          </kyn-header-category>

          <kyn-header-divider></kyn-header-divider>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${sampleIcon}></kd-icon>
            Link 4

            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Sub Link 1
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Sub Link 2
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Sub Link 3
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Sub Link 4
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Sub Link 5
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Sub Link 6
            </kyn-header-link>
          </kyn-header-link>
        </kyn-header-nav>

        <kyn-header-flyouts>
          <kyn-header-flyout label="Menu Label">
            <kd-icon .icon=${helpIcon} slot="button"></kd-icon>

            <kyn-header-link href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Example 1
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Example 2
            </kyn-header-link>
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
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Example Link 1
            </kyn-header-link>
            <kyn-header-link href="javascript:void(0)">
              <kd-icon .icon=${sampleIcon}></kd-icon>
              Example Link 2
            </kyn-header-link>
          </kyn-header-flyout>
        </kyn-header-flyouts>
      </kyn-header>

      <kyn-local-nav>
        <kyn-local-nav-link href="javascript:void(0)" active>
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 1
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)">
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 2

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 1
          </kyn-local-nav-link>
          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 2
          </kyn-local-nav-link>
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)">
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 3

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 1

            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
              L3 Link 1
            </kyn-local-nav-link>
            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
              L3 Link 2
            </kyn-local-nav-link>
          </kyn-local-nav-link>
          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
            L2 Link 2
          </kyn-local-nav-link>
        </kyn-local-nav-link>
      </kyn-local-nav>

      <main>
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
        <br />
        <br />
        Main content here.
      </main>

      <kyn-footer>
        <span slot="copyright">
          Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights
          reserved.
        </span>
      </kyn-footer>
    </kyn-ui-shell>
  `,
};
