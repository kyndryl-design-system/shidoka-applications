import { html } from 'lit';
import './index';
import '../footer';
import '../header';
import '../sideNav';
import '@kyndryl-design-system/foundation/components/icon';
import sampleIcon from '@carbon/icons/es/user--avatar/16';

export default {
  title: 'Global/UI Shell (POC)',
  component: 'kyn-ui-shell',
  decorators: [
    (story) =>
      html`
        <div style="height: 100%; margin: var(--kd-negative-page-gutter);">
          ${story()}
        </div>
      `,
  ],
};

export const UIShell = {
  render: (args) => html`
    <kyn-ui-shell>
      <kyn-header divider appTitle="UI Shell Example"></kyn-header>

      <!--
      <kyn-side-nav>
        <kyn-side-nav-link href="javascript:void(0)">
          <kd-icon slot="icon" .icon=${sampleIcon}></kd-icon>
          Link 1
        </kyn-side-nav-link>
      </kyn-side-nav>
      -->

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
