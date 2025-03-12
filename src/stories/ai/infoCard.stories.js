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
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=25977-942236&m=dev',
    },
  },
};

const InfoTemplate = () => {
  return html`
    <kyn-card style="width:100%" type="normal" aiConnected>
      <div class="info-card-container">
        <div class="info-card-leftIcon">${unsafeSVG(policeIcon)}</div>
        <div class="info-card-content-wrapper">
          <div class="info-card-title-text kd-type--ui-03">
            This is the title
          </div>
          <div class="kd-type--body-02">This is the description</div>
        </div>
        <div class="info-card-rightIcon">
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
      </div>
    </kyn-card>
  `;
};

export const Default = {
  render: () => {
    return html` ${InfoTemplate()}
      <style>
        .info-card-container {
          display: flex;
          align-items: center;
          gap: var(--kd-spacing-12);
        }
        .info-card-content-wrapper {
          flex: 1 0 0;
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
      </style>`;
  },
};

export const WithRightIconAndDescription = {
  render: () => {
    return html`
      <div class="container">
        <kyn-card style="width:100%" type="normal" aiConnected>
          <div class="info-card-container">
            <div class="info-card-content-wrapper">
              <div class="kd-type--body-02">This is the description...</div>
            </div>
            <div style="display:flex">
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
          </div>
        </kyn-card>
      </div>
      <style>
        .container {
          display: flex;
          flex-direction: column;
          gap: var(--kd-spacing-8);
        }
        .info-card-container {
          display: flex;
          align-items: center;
          gap: var(--kd-spacing-12);
        }
        .info-card-content-wrapper {
          flex: 1 0 0;
        }
      </style>
    `;
  },
};
