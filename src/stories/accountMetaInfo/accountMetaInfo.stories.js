import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import '../../components/reusable/button';

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
            display: inline-flex;
            flex-direction: column;
            gap: 2px;
            padding: 16px;
          }

          .account-meta-info__name {
            font-size: var(--kd-font-size-ui-02);
            line-height: var(--kd-line-height-ui-02);
            font-weight: 500;
            color: var(--kd-color-text-variant-brand);
          }

          .account-meta-info__row {
            display: flex;
            align-items: center;
            gap: 16px;
            min-height: 24px;
          }

          .account-meta-info__label {
            font-weight: 600;
            min-width: 80px;
          }

          .account-meta-info__value {
            color: var(--kd-color-text-level-primary);
          }

          .account-meta-info__copy-btn {
            margin-left: 8px;
            margin-top: -8px;
            margin-bottom: -8px;
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
  parameters: { a11y: { disable: true } },
  render: () => {
    const accountId = '023497uw02399023509';

    return html`
      <div class="account-meta-info">
        <div class="account-meta-info__name">ACME</div>
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

export const WithoutHeader = {
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
  parameters: { a11y: { disable: true } },
  render: () => {
    return html`
      <div class="account-meta-info">
        <div class="account-meta-info__name">ACME</div>
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
