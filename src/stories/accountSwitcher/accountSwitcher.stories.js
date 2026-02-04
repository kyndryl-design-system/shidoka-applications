import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';

import '../../components/reusable/button';
import '../../components/reusable/search';
import '../../components/global/header';
import '../../components/global/header/headerCategory';
import '../../components/global/header/headerLink';

export default {
  title: 'Patterns/Account Switcher',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  decorators: [
    (story) =>
      html`
        <style>
          .account-switcher {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 12px 16px 16px;
            width: 900px;
            background: var(--kd-color-background-container-default);
          }

          .account-switcher__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
          }

          .account-switcher__search {
            width: 280px;
            margin-top: -8px;
          }

          /* Account Meta Info Styles (from accountMetaInfo pattern) */
          .account-meta-info {
            display: inline-flex;
            flex-direction: row;
            align-items: center;
            gap: 16px;
            padding: 16px 8px;
            align-self: flex-start;
            background: var(--kd-color-background-menu-state-default);
            border-radius: 4px;
          }

          .account-meta-info__checkmark {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            margin-top: -8px;
          }

          .account-meta-info__checkmark svg {
            fill: var(--kd-color-badge-heavy-background-success);
          }

          .account-meta-info__divider {
            width: 1px;
            align-self: stretch;
            background: var(--kd-color-background-opacity-4);
            flex-shrink: 0;
          }

          .account-meta-info__content {
            display: flex;
            flex-direction: column;
          }

          .account-meta-info__heading {
            color: var(--kd-color-text-variant-brand);
            font-weight: var(--kd-font-weight-bold);
            text-transform: uppercase;
            font-size: 14px;
            line-height: 18px;
          }

          .account-meta-info__row {
            display: flex;
            align-items: center;
            gap: 16px;
            min-height: 20px;
            font-size: 14px;
          }

          .account-meta-info__label {
            font-weight: var(--kd-font-weight-bold);
          }

          .account-meta-info__value {
            color: var(--kd-color-text-level-primary);
          }

          .account-meta-info__copy-btn {
            margin-left: 0px;
            margin-top: -6px;
            margin-bottom: -6px;
            font-size: 14px;
          }

          /* Account Categories Grid - 3 column grid layout */
          .account-categories-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }

          .account-categories-grid kyn-header-category {
            margin: 0;
          }
        </style>
        ${story()}
      `,
  ],
};

const handleCopy = (value, e) => {
  const button = e.target.closest('kyn-button');
  const textNode = button.childNodes[button.childNodes.length - 1];
  const originalText = textNode.textContent;

  navigator.clipboard.writeText(value).then(() => {
    textNode.textContent = 'Copied!';
    setTimeout(() => {
      textNode.textContent = originalText;
    }, 3000);
  });
};

// Sample categories data
const sampleCategories = [
  {
    id: 'item1',
    heading: 'Menu Item 1',
    links: ['Menu Item one', 'Menu item two', 'Menu item three'],
  },
  {
    id: 'item2',
    heading: 'Menu Item 2',
    links: ['Menu Item one', 'Menu item two', 'Menu item three'],
  },
  {
    id: 'item3',
    heading: 'Menu Item 3',
    links: ['Menu Item one', 'Menu item two', 'Menu item six'],
  },
  {
    id: 'item9',
    heading: 'Menu Item 9',
    links: ['Menu Item one', 'Menu item two', 'Menu item three'],
  },
  {
    id: 'item10',
    heading: 'Menu Item 10',
    links: ['Menu Item one', 'Menu item two', 'Menu item three'],
  },
  {
    id: 'item11',
    heading: 'Menu Item 11',
    links: ['Menu Item one', 'Menu item three', 'Menu item four'],
  },
  {
    id: 'item17',
    heading: 'Menu Item 17',
    links: ['Menu Item one', 'Menu item two', 'Menu item three'],
  },
  {
    id: 'item18',
    heading: 'Menu Item 18',
    links: ['Menu Item one', 'Menu item two', 'Menu item three'],
  },
  {
    id: 'item19',
    heading: 'Menu Item 19',
    links: ['Menu Item one', 'Menu item three', 'Menu item four'],
  },
];

// simple helper to determine if item is in last row of grid (divider detection)
const isLastRow = (index, total, columns = 3) => {
  const lastRowStart = Math.floor((total - 1) / columns) * columns;
  return index >= lastRowStart;
};

export const Default = {
  render: () => {
    const accountId = '023497uw02399023509';

    return html`
      <kyn-header rootUrl="/" appTitle="Application">
        <kyn-header-flyouts>
          <kyn-header-flyout label="Account" hideMenuLabel>
            <span slot="button">${unsafeSVG(userIcon)}</span>

            <div class="account-switcher">
              <!-- header row: account meta info + search -->
              <div class="account-switcher__header">
                <!-- account meta info section (using WithCheckmarkAndDivider pattern) -->
                <div class="account-meta-info">
                  <span class="account-meta-info__checkmark"
                    >${unsafeSVG(checkmarkIcon)}</span
                  >
                  <div class="account-meta-info__divider"></div>
                  <div class="account-meta-info__content">
                    <div class="account-meta-info__heading">ACME</div>
                    <div class="account-meta-info__row">
                      <span class="account-meta-info__label">Account ID:</span>
                      <span class="account-meta-info__value">${accountId}</span>
                      <kyn-button
                        class="account-meta-info__copy-btn"
                        kind="ghost"
                        size="extra-small"
                        iconPosition="left"
                        @click=${(e) => handleCopy(accountId, e)}
                      >
                        <span slot="icon">${unsafeSVG(copyIcon)}</span>
                        Copy
                      </kyn-button>
                    </div>
                    <div class="account-meta-info__row">
                      <span class="account-meta-info__label">Country:</span>
                      <span class="account-meta-info__value"
                        >United States</span
                      >
                    </div>
                  </div>
                </div>

                <kyn-search
                  class="account-switcher__search"
                  size="sm"
                  label="Search"
                ></kyn-search>
              </div>

              <!-- account categories grid - dividers auto-calculated based on row position -->
              <div class="account-categories-grid">
                ${sampleCategories.map(
                  (category, index) => html`
                    <kyn-header-category
                      heading=${category.heading}
                      ?showDivider=${!isLastRow(index, sampleCategories.length)}
                      leftPadding
                    >
                      <span slot="icon">${unsafeSVG(circleIcon)}</span>
                      ${category.links.map(
                        (link) => html`
                          <kyn-header-link href="#">${link}</kyn-header-link>
                        `
                      )}
                    </kyn-header-category>
                  `
                )}
              </div>
            </div>
          </kyn-header-flyout>
        </kyn-header-flyouts>
      </kyn-header>
    `;
  },
};
