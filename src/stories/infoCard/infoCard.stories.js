import { html } from 'lit';
import '../../components/reusable/card';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import policeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/police.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import '../../components/reusable/button';
import '../../components/reusable/inlineConfirm/inlineConfirm';
import { action } from 'storybook/actions';
import './infoCard.scss';

export default {
  title: 'AI/Patterns/Info',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300054&p=f&m=dev',
    },
  },
};

export const Default = {
  render: () => {
    return html`
      <kyn-card class="info-card kyn-card-hover" type="normal" aiConnected>
        <div class="info-card-container">
          <div class="info-card-leftIcon">${unsafeSVG(policeIcon)}</div>

          <div class="info-card-content-wrapper">
            <div class="info-card-title-text kd-type--ui-03">
              This is the title
            </div>

            This is the description
          </div>
        </div>
      </kyn-card>
    `;
  },
};

export const WithRightIconAndDescription = {
  render: () => {
    return html`
      <kyn-card class="info-card kyn-card-hover" type="normal" aiConnected>
        <div class="info-card-container">
          <div class="info-card-content-wrapper">This is the description</div>

          <kyn-inline-confirm
            class="info-card-rightIcon"
            ?destructive=${true}
            .anchorText=${'Delete'}
            .confirmText=${'Confirm'}
            .cancelText=${'Cancel'}
            @on-confirm=${() => action('on-confirm')()}
          >
            ${unsafeSVG(deleteIcon)}
            <span slot="confirmIcon">${unsafeSVG(deleteIcon)}</span>
          </kyn-inline-confirm>
        </div>
      </kyn-card>
    `;
  },
};
