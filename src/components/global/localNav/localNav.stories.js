import { html } from 'lit';
import './localNav';
import './localNavLink';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import sampleIcon from '@carbon/icons/es/circle-stroke';

export default {
  title: 'Global Components/Local Nav',
  component: 'kyn-local-nav',
  subcomponents: {
    'kyn-local-nav-link': 'kyn-local-nav-link',
  },
  decorators: [
    (story) =>
      html`
        <style>
          kyn-local-nav {
            margin: 0;
          }
        </style>
        <div style="min-height: 300px; margin: var(--kd-negative-page-gutter);">
          ${story()}
        </div>
      `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/aKH1l6UGwobua14CjbWBMC/Local-Nav-1.1?node-id=602%3A18931&mode=dev',
    },
  },
};

export const LocalNav = {
  render: (args) => html`
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

      <kyn-local-nav-link href="javascript:void(0)" expanded>
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
      </kyn-local-nav-link>
    </kyn-local-nav>
  `,
};
