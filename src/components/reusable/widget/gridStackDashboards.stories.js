import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { useArgs } from '@storybook/preview-api';
import { action } from '@storybook/addon-actions';
import recommendFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import recommendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/delete.svg';
import editIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/edit.svg';
import splitIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/split.svg';

import '../button';
import '../pagetitle';
import '../card';
import '../inlineConfirm';

export default {
  title: 'Components/Widget/Gridstack',
};

const mockItems = [
  {
    id: 1,
    name: 'My Dashboard',
    favourite: true,
  },
];

export const Dashboards = {
  args: {
    items: mockItems,
  },
  render: () => {
    const [{ items }, updateArgs] = useArgs();
    const handleRecommendClick = (e, index) => {
      const updatedItems = [...items].map((item, i) => ({
        ...item,
        favourite: i === index,
      }));
      updateArgs({
        items: updatedItems,
      });
      action(e.type)(e);
    };
    return html`
      <div class="dashboard-wrapper">
        <kyn-page-title
          type="tertiary"
          pageTitle="Dashboards"
          subTitle="Add, edit, reorder, and select a default dashboard"
        >
        </kyn-page-title>
        <div class="content-wrapper">
          ${items.map((item, i) => {
            return html`
              <kyn-card
                type="normal"
                role="article"
                aria-label="card content"
                style="width:100%"
              >
                <div class="content-container">
                  <div class="content-items">
                    <div class="content-item">
                      <kyn-button
                        kind="ghost"
                        size="small"
                        description="reorder"
                        @on-click=${(e) => action('on-click')(e)}
                      >
                        <span style="display:flex;" slot="icon"
                          >${unsafeSVG(splitIcon)}</span
                        >
                      </kyn-button>
                      <kyn-button
                        kind="ghost"
                        size="small"
                        description="recommended"
                        @on-click=${(e) => handleRecommendClick(e, i)}
                      >
                        <span
                          class=${item.favourite ? 'star-filled' : ''}
                          style="display:flex;"
                          slot="icon"
                        >
                          ${unsafeSVG(
                            item.favourite ? recommendFilledIcon : recommendIcon
                          )}
                        </span>
                      </kyn-button>
                    </div>
                    <div class="content-items">${item.name}</div>
                  </div>
                  <div class="content-item">
                    <kyn-inline-confirm
                      destructive
                      anchorText="Delete"
                      confirmText="Confirm"
                      cancelText="Cancel"
                      @on-confirm=${(e) => action('on-confirm')(e)}
                    >
                      ${unsafeSVG(deleteIcon)}
                      <span slot="confirmIcon">${unsafeSVG(deleteIcon)}</span>
                    </kyn-inline-confirm>

                    <kyn-button
                      kind="ghost"
                      size="small"
                      description="edit"
                      @on-click=${(e) => action(e.type)(e)}
                    >
                      <span style="display:flex;" slot="icon"
                        >${unsafeSVG(editIcon)}</span
                      >
                    </kyn-button>
                  </div>
                </div>
              </kyn-card>
            `;
          })}
        </div>
      </div>
      <style>
        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 32px;
          align-self: stretch;
        }
        .content-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          align-self: stretch;
        }
        .content-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          align-self: stretch;
          margin-bottom: 32px;
        }
        .content-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          align-self: stretch;
        }
        .content-items {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .content-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .star-filled > svg {
          color: var(--kd-color-icon-brand);
        }
      </style>
    `;
  },
};
