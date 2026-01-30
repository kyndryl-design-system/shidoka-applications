import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';
import '../components/reusable/button';

export default {
  title: 'Patterns/Account Meta Info',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
    a11y: {
      disable: true,
    },
  },
  decorators: [
    (story) =>
      html`
        <style>
          .account-meta-info {
            display: inline-flex;
            flex-direction: column;
            gap: 0;
            padding: 16px;
            align-self: flex-start;
            background: var(--kd-color-background-container-default);
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
            gap: 8px;
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

export const Default = {
  render: () => {
    const accountId = '023497uw02399023509';

    return html`
      <div class="account-meta-info">
        <div class="account-meta-info__row">
          <span class="account-meta-info__label">Account ID</span>
          <span class="account-meta-info__value">${accountId}</span>
          <kyn-button
            class="account-meta-info__copy-btn"
            kind="ghost"
            size="small"
            iconPosition="left"
            @click=${(e) => handleCopy(accountId, e)}
          >
            <span slot="icon">${unsafeSVG(copyIcon)}</span>
            Copy
          </kyn-button>
        </div>
        <div class="account-meta-info__row">
          <span class="account-meta-info__label">Country</span>
          <span class="account-meta-info__value">United States</span>
        </div>
      </div>
    `;
  },
};

export const WithoutCopyButton = {
  render: () => {
    return html`
      <div class="account-meta-info">
        <div class="account-meta-info__row">
          <span class="account-meta-info__label">Account ID</span>
          <span class="account-meta-info__value">023497uw02399023509</span>
        </div>
        <div class="account-meta-info__row">
          <span class="account-meta-info__label">Country</span>
          <span class="account-meta-info__value">United States</span>
        </div>
      </div>
    `;
  },
};

export const WithHeading = {
  render: () => {
    const accountId = '023497uw02399023509';

    return html`
      <style>
        .account-meta-info--with-heading {
          background: var(--kd-color-background-menu-state-default);
          border-radius: 4px;
        }
      </style>
      <div class="account-meta-info account-meta-info--with-heading">
        <div class="account-meta-info__heading">ACME</div>
        <div class="account-meta-info__row">
          <span class="account-meta-info__label">Account ID:</span>
          <span class="account-meta-info__value">${accountId}</span>
          <kyn-button
            class="account-meta-info__copy-btn"
            kind="ghost"
            size="small"
            iconPosition="left"
            @click=${(e) => handleCopy(accountId, e)}
          >
            <span slot="icon">${unsafeSVG(copyIcon)}</span>
            Copy
          </kyn-button>
        </div>
        <div class="account-meta-info__row">
          <span class="account-meta-info__label">Country:</span>
          <span class="account-meta-info__value">United States</span>
        </div>
      </div>
    `;
  },
};

export const WithCheckmarkAndDivider = {
  render: () => {
    const accountId = '023497uw02399023509';

    return html`
      <style>
        .account-meta-info--with-checkmark {
          flex-direction: row;
          align-items: center;
          gap: 16px;
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
      </style>
      <div class="account-meta-info account-meta-info--with-checkmark">
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
              size="small"
              iconPosition="left"
              @click=${(e) => handleCopy(accountId, e)}
            >
              <span slot="icon">${unsafeSVG(copyIcon)}</span>
              Copy
            </kyn-button>
          </div>
          <div class="account-meta-info__row">
            <span class="account-meta-info__label">Country:</span>
            <span class="account-meta-info__value">United States</span>
          </div>
        </div>
      </div>
    `;
  },
};
