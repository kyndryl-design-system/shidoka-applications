import { html } from 'lit';
import '../components/reusable/card';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import policeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/police.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/delete.svg';
import '../components/reusable/button';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/css/typography.css';

export default {
  title: 'AI/Patterns/Info',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=25977-942236&m=dev',
    },
  },
  decorators: [
    (story) => html`
      <style>
        .info-card-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-card-content-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          flex: 1 0 0;
        }

        .info-card-title-text {
          color: var(--kd-color-text-title-ai-tertiary);
        }

        .info-card-sub-text {
          color: var(--kd-color-text-level-primary);
        }
        .info-card-rightIcon,
        .info-card-leftIcon {
          display: flex;
        }
      </style>
      ${story()}
    `,
  ],
};

const InfoTemplate = () => {
  return html`
    <kyn-card style="width:100%" type="normal" aiConnected>
      <div class="info-card-container">
        <div class="info-card-leftIcon">${unsafeSVG(policeIcon)}</div>
        <div class="info-card-content-wrapper">
          <div class="info-card-title-text kd-type--ui-04">
            Kai may occasionally generate incorrect or misleading information.
          </div>
          <div class="info-card-sub-text kd-type--ui-02">
            Kai may occasionally generate incorrect or misleading information.
          </div>
        </div>
        <div class="info-card-rightIcon">
          <kyn-button
            iconposition="center"
            kind="ghost"
            type="button"
            size="small"
            description="Button Description"
            @on-click=${(e) => action(e.type)(e)}
          >
            <span style="display:flex;" slot="icon"
              >${unsafeSVG(deleteIcon)}</span
            >
          </kyn-button>
        </div>
      </div>
    </kyn-card>
  `;
};

export const Default = {
  render: () => {
    return html` ${InfoTemplate()} `;
  },
};
