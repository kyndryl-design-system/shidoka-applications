import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import '../components/reusable/card';

import '../components/reusable/link';
import '../components/reusable/tooltip';

import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

import '@kyndryl-design-system/shidoka-foundation/css/typography.css';

export default {
  title: 'Patterns/Vital Card',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-297686&p=f&m=dev',
    },
  },
};

const args = {
  type: 'normal',
  href: '',
  rel: '',
  target: '_self',
  hideBorder: false,
};

export const Default = {
  render: () => {
    return html`
      <kyn-card type="normal">
        <div>
          <div class="vital-card-title-label kd-type--body-02">Title</div>
          <div class="vital-card-content-wrapper">
            <div class="vital-card-mobile-wrapper-subdiv">
              <div class="vital-card-title-div">
                <h1 class="kd-type--headline-07 vital-card-title">9,999.99k</h1>
              </div>
              <div class="vital-card-cat-subcat-text">
                <h2 class="vital-card-category-text kd-type--ui-02">
                  Category
                </h2>
                <h2 class="vital-card-subcategory-text kd-type--ui-03">
                  Subcategory
                </h2>
              </div>
            </div>
            <kyn-link
              class="vital-card-link"
              standalone
              href="#"
              @on-click=${(e) => e.preventDefault()}
            >
              <span class="vital-card-link-text">CTA Title</span>
              <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
            </kyn-link>
          </div>
        </div>
      </kyn-card>
      <style>
        .vital-card-title-label {
          color: var(--kd-color-text-level-secondary);
          margin-bottom: 8px;
          display: flex;
          gap: 8px;
        }
        .vital-card-title {
          font-weight: var(--kd-font-weight-medium);
          margin-top: 0px;
          margin-bottom: 0px;
          color: var(--kd-color-text-level-primary);

          /* for large device after md size */
          @media (min-width: 42rem) {
            font-weight: var(--kd-font-weight-regular);
            margin-bottom: 4px;
          }
        }

        .vital-card-title-div {
          padding-right: 4px;
        }

        .vital-card-content-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;

          @media (min-width: 42rem) {
            align-items: initial;
            flex-direction: column;
          }
        }

        .vital-card-mobile-wrapper-subdiv {
          display: flex;
          align-items: center;

          @media (min-width: 42rem) {
            display: block;
          }
        }

        .vital-card-category-text {
          color: var(--kd-color-text-level-primary);
          margin-top: 0px;
          margin-bottom: 0px;
        }

        .vital-card-subcategory-text {
          color: var(--kd-color-text-level-secondary);
          margin-top: 0;
          margin-bottom: 4px;
        }

        .vital-card-cat-subcat-text {
          padding: 0px 8px;

          @media (min-width: 42rem) {
            padding: 0;
          }
        }

        .vital-card-link {
          margin-top: 0px;

          @media (min-width: 42rem) {
            margin-top: 10px;
          }

          .vital-card-link-text {
            @media (max-width: calc(42rem - 0.001px)) {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border-width: 0;
            }
          }
        }
      </style>
    `;
  },
};

export const WithTitleTooltip = {
  render: () => {
    return html`
      <kyn-card type="normal">
        <div>
          <div class="vital-card-title-label kd-type--body-02">
            Title
            <kyn-tooltip>Tooltip content</kyn-tooltip>
          </div>
          <div class="vital-card-content-wrapper">
            <div class="vital-card-mobile-wrapper-subdiv">
              <div class="vital-card-title-div">
                <h1 class="kd-type--headline-07 vital-card-title">9,999.99k</h1>
              </div>
              <div class="vital-card-cat-subcat-text">
                <h2 class="vital-card-category-text kd-type--ui-02">
                  Category
                </h2>
                <h2 class="vital-card-subcategory-text kd-type--ui-03">
                  Subcategory
                </h2>
              </div>
            </div>
            <kyn-link
              class="vital-card-link"
              standalone
              href="#"
              @on-click=${(e) => e.preventDefault()}
            >
              <span class="vital-card-link-text">CTA Title</span>
              <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
            </kyn-link>
          </div>
        </div>
      </kyn-card>
      <style>
        .vital-card-title-label {
          color: var(--kd-color-text-level-secondary);
          margin-bottom: 8px;
          display: flex;
          gap: 8px;
        }
        .vital-card-title {
          font-weight: var(--kd-font-weight-medium);
          margin-top: 0px;
          margin-bottom: 0px;
          color: var(--kd-color-text-level-primary);

          /* for large device after md size */
          @media (min-width: 42rem) {
            font-weight: var(--kd-font-weight-regular);
            margin-bottom: 4px;
          }
        }

        .vital-card-title-div {
          padding-right: 4px;
        }

        .vital-card-content-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;

          @media (min-width: 42rem) {
            align-items: initial;
            flex-direction: column;
          }
        }

        .vital-card-mobile-wrapper-subdiv {
          display: flex;
          align-items: center;

          @media (min-width: 42rem) {
            display: block;
          }
        }

        .vital-card-category-text {
          color: var(--kd-color-text-level-primary);
          margin-top: 0px;
          margin-bottom: 0px;
        }

        .vital-card-subcategory-text {
          color: var(--kd-color-text-level-secondary);
          margin-top: 0;
          margin-bottom: 4px;
        }

        .vital-card-cat-subcat-text {
          padding: 0px 8px;

          @media (min-width: 42rem) {
            padding: 0;
          }
        }

        .vital-card-link {
          margin-top: 0px;

          @media (min-width: 42rem) {
            margin-top: 10px;
          }

          .vital-card-link-text {
            @media (max-width: calc(42rem - 0.001px)) {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border-width: 0;
            }
          }
        }
      </style>
    `;
  },
};

export const WithSkeleton = {
  args: { ...args, lines: 1, thumbnailVisible: true },
  render: (args) => {
    return html` <kyn-card
      type=${args.type}
      href=${args.href}
      target=${args.target}
      rel=${args.rel}
      ?hideBorder=${args.hideBorder}
    >
      <kyn-vital-card-skeleton .lines=${args.lines}></kyn-vital-card-skeleton>
    </kyn-card>`;
  },
};
