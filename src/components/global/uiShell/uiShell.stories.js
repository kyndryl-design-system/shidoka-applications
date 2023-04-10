import { withDesign } from 'storybook-addon-designs';
import { html } from 'lit';
import './index';
import '../footer';
import '../header';
import '../sideNav';
import '../../reusable/icon';
import sampleIcon from '@carbon/icons/es/user--avatar/16';

export default {
  title: 'Global/UI Shell (POC)',
  component: 'kyn-ui-shell',
  decorators: [
    withDesign,
    (story) =>
      html` <div style="height: 100%; margin: -16px;">${story()}</div> `,
  ],
};

export const UIShell = {
  render: (args) => html`
    <kyn-ui-shell>
      <kyn-header divider appTitle="UI Shell Example"></kyn-header>

      <!--
      <kyn-side-nav>
        <kyn-side-nav-link href="javascript:void(0)">
          <kyn-icon slot="icon" .icon=${sampleIcon}></kyn-icon>
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
