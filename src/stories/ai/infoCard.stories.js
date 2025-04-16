import { html } from 'lit';
import '../../components/reusable/card';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import policeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/police.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import '../../components/reusable/button';
import '../../components/reusable/inlineConfirm/inlineConfirm';
import { action } from '@storybook/addon-actions';

export default {
  title: 'AI/Patterns/Info',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300054&p=f&m=dev',
    },
  },
};

const Styles = html`
  <style>
    .info-card-container {
      display: flex;
      align-items: center;
      gap: var(--kd-spacing-12);
    }

    .info-card-content-wrapper {
      flex: 1 0 0;
      word-wrap: anywhere;
    }

    .info-card-title-text {
      color: var(--kd-color-text-title-ai-tertiary);
    }

    .info-card-rightIcon,
    .info-card-leftIcon {
      display: flex;
    }

    .info-card-leftIcon {
      svg {
        fill: var(--kd-color-icon-ai);
      }
    }
  </style>
`;

export const Default = {
  render: () => {
    return html`
      <kyn-card style="width:100%" type="normal" aiConnected>
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

      ${Styles}
    `;
  },
};

export const WithRightIconAndDescription = {
  render: () => {
    return html`
      <kyn-card style="width:100%" type="normal" aiConnected>
        <div class="info-card-container">
          <div class="info-card-content-wrapper">This is the description</div>

          <kyn-inline-confirm
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

      ${Styles}
    `;
  },
};
