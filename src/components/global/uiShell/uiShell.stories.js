import { html } from 'lit';
import './index';
import '../footer';
import '../header';
import '../localNav';
import '../../reusable/table';
import allData from './../../reusable/table/story-helpers/table-data.json';
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
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: () => {
    const data = allData.slice(0, 5);

    return html`
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
          <h1 class="kd-type--headline-03">Example Content</h1>

          <kyn-table-toolbar tableTitle="Basic Table"></kyn-table-toolbar>
          <kyn-table-container>
            <kyn-table>
              <kyn-thead>
                <kyn-tr>
                  <kyn-th>ID</kyn-th>
                  <kyn-th>First Name</kyn-th>
                  <kyn-th>Last Name</kyn-th>
                  <kyn-th>Birthday</kyn-th>
                  <kyn-th .align=${'right'}>Age</kyn-th>
                  <kyn-th>Full Name</kyn-th>
                </kyn-tr>
              </kyn-thead>
              <kyn-tbody>
                ${data.map(
                  ({
                    id,
                    firstName,
                    lastName,
                    birthday,
                    age,
                    gender,
                  }) => html`<kyn-tr>
                    <kyn-td>${id}</kyn-td>
                    <kyn-td>${firstName}</kyn-td>
                    <kyn-td>${lastName}</kyn-td>
                    <kyn-td>${birthday}</kyn-td>
                    <kyn-td .align=${'right'}>${age}</kyn-td>
                    <kyn-td>${firstName} ${lastName}</kyn-td>
                  </kyn-tr>`
                )}
              </kyn-tbody>
            </kyn-table>
          </kyn-table-container>
        </main>

        <kyn-footer>
          <span slot="copyright">
            Copyright &copy; ${new Date().getFullYear()} Kyndryl Inc. All rights
            reserved.
          </span>
        </kyn-footer>
      </kyn-ui-shell>
    `;
  },
};
