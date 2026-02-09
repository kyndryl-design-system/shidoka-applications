import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';
import '../components/reusable/link';

export default {
  title: 'Patterns/Account Meta Info',
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
          .account-meta-info {
            display: flex;
            flex-direction: column;
          }

          .account-meta-info__header {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .account-meta-info__checkmark {
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }

          .account-meta-info__checkmark svg {
            fill: var(--kd-color-badge-heavy-background-success);
          }

          .account-meta-info__name {
            font-weight: var(--kd-font-weight-medium);
            font-size: 14px;
            line-height: 20px;
            color: var(--kd-color-text-level-primary);
          }

          .account-meta-info__details {
            display: flex;
            flex-direction: column;
            margin-left: 24px; /* align with text after checkmark icon */
          }

          .account-meta-info__details kyn-link {
            font-size: 14px;
          }

          .account-meta-info__country {
            font-size: 14px;
            line-height: 20px;
            color: var(--kd-color-text-level-primary);
          }
        </style>
        ${story()}
      `,
  ],
};

const handleCopy = (value, e) => {
  e.detail.origEvent.preventDefault();
  navigator.clipboard.writeText(value);
};

export const NonAccountSelected = {
  render: () => {
    return html`
      <div class="account-meta-info">
        <div class="account-meta-info__header">
          <span class="account-meta-info__checkmark">
            ${unsafeSVG(checkmarkIcon)}
          </span>
          <span class="account-meta-info__name">
            CurrentSelected1784...AccountName
          </span>
        </div>
      </div>
    `;
  },
};

export const AccountSelected = {
  render: () => {
    const accountId = '023497uw02399023509';

    return html`
      <div class="account-meta-info">
        <div class="account-meta-info__header">
          <span class="account-meta-info__checkmark">
            ${unsafeSVG(checkmarkIcon)}
          </span>
          <span class="account-meta-info__name">
            CurrentSelect...AccountName
          </span>
        </div>
        <div class="account-meta-info__details">
          <kyn-link
            standalone
            animationInactive
            href="javascript:void(0)"
            @on-click=${(e) => handleCopy(accountId, e)}
          >
            ${accountId}
            <span slot="icon">${unsafeSVG(copyIcon)}</span>
          </kyn-link>
          <div class="account-meta-info__country">United States</div>
        </div>
      </div>
    `;
  },
};
