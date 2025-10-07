import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { action } from 'storybook/actions';

import '../../components/reusable/card';
import '../../components/reusable/button';
import '../../components/reusable/inlineConfirm/inlineConfirm';
import '../../components/reusable/card/infoCard.scss';

import policeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/police.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';

export default {
  title: 'AI/Patterns/Info',
  parameters: {
    docs: {
      description: {
        component:
          'Uses **unnamed slot** for title + description. `slot="leftIcon"` and `slot="inlineConfirm"` for side elements.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300054&p=f&m=dev',
    },
  },
};

export const Default = {
  render: () => {
    return html`
      <kyn-card
        class="info-card kyn-card-hover"
        ?aiConnected=${true}
        type="normal"
        variant="notification"
        @on-confirm=${(e) => action('on-confirm')(e)}
      >
        <span slot="leftIcon">${unsafeSVG(policeIcon)}</span>

        <div>
          <div class="info-card-title-text kd-type--ui-03">
            This is the title
          </div>
          This is the description
        </div>
      </kyn-card>
    `;
  },
};

export const WithRightIcon = {
  render: () => {
    return html`
      <kyn-card
        class="info-card kyn-card-hover"
        ?aiConnected=${true}
        type="normal"
        variant="notification"
        @on-confirm=${(e) => action('on-confirm')(e)}
      >
        <span slot="leftIcon">${unsafeSVG(policeIcon)}</span>

        <div>
          <div class="info-card-title-text kd-type--ui-03">
            This is the title
          </div>
          This is the description
        </div>

        <kyn-inline-confirm
          slot="inlineConfirm"
          class="info-card-rightIcon"
          ?destructive=${true}
          .anchorText=${'Delete'}
          .confirmText=${'Confirm'}
          .cancelText=${'Cancel'}
        >
          ${unsafeSVG(deleteIcon)}
          <span slot="confirmIcon">${unsafeSVG(deleteIcon)}</span>
        </kyn-inline-confirm>
      </kyn-card>
    `;
  },
};
