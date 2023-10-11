import { html } from 'lit';
import './index';
import '../footer';
import '../header';
import '../localNav';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import sampleIcon from '@carbon/icons/es/user--avatar/20';

export default {
  title: 'Global Components/UI Shell',
  component: 'kyn-ui-shell',
  decorators: [
    (story) =>
      html`
        <div
          style="transform: translate3d(0,0,0); margin: var(--kd-negative-page-gutter);"
        >
          ${story()}
        </div>
      `,
  ],
};

export const UIShell = {
  render: (args) => html`
    <kyn-ui-shell>
      <kyn-header divider appTitle="UI Shell Example"></kyn-header>

      <main>Main content here.</main>

      <kyn-footer rootUrl=${args.rootUrl}></kyn-footer>
    </kyn-ui-shell>
  `,
};

export const WithLocalNav = {
  render: (args) => html`
    <kyn-ui-shell>
      <kyn-header divider appTitle="UI Shell Example"></kyn-header>

      <kyn-local-nav>
        <kyn-local-nav-link href="javascript:void(0)" active>
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 1
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)">
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 2

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            L2 Link 1
          </kyn-local-nav-link>
          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            L2 Link 2
          </kyn-local-nav-link>
        </kyn-local-nav-link>

        <kyn-local-nav-link href="javascript:void(0)" expanded>
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 3

          <kyn-local-nav-link slot="links" href="javascript:void(0)">
            L2 Link 1

            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              L3 Link 1
            </kyn-local-nav-link>
            <kyn-local-nav-link slot="links" href="javascript:void(0)">
              L3 Link 2
            </kyn-local-nav-link>
          </kyn-local-nav-link>
        </kyn-local-nav-link>
      </kyn-local-nav>

      <main>Main content here.</main>

      <kyn-footer rootUrl=${args.rootUrl}></kyn-footer>
    </kyn-ui-shell>
  `,
};

// UIShell.parameters = {
//   design: {
//     type: 'figma',
//     url: '',
//   },
// };
