import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { deepmerge } from 'deepmerge-ts';

import AccountSwitcherScss from './accountSwitcher.scss?inline';

import arrowLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';

import './accountSwitcherMenuItem';

const _defaultTextStrings = {
  backToWorkspaces: 'Workspaces',
};

/**
 * Account Switcher shell component providing two-panel layout with mobile drill-down.
 * Consumers compose content via `left` and `right` named slots using sub-components
 * like `kyn-account-switcher-menu-item`.
 * @slot left - Content for the left panel (e.g. account info, workspace list).
 * @slot right - Content for the right panel (e.g. search, item list).
 */
@customElement('kyn-account-switcher')
export class AccountSwitcher extends LitElement {
  static override styles = unsafeCSS(AccountSwitcherScss);

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Mobile drill-down view state. 'root' shows left panel, 'detail' shows right panel. */
  @property({ type: String, reflect: true })
  accessor view: 'root' | 'detail' = 'root';

  /** Merged text strings.
   * @internal
   */
  private _textStrings = _defaultTextStrings;

  private _handleFlyoutToggle = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (!detail?.open) {
      this.view = 'root';
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener(
      'on-flyout-toggle',
      this._handleFlyoutToggle as EventListener
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(
      'on-flyout-toggle',
      this._handleFlyoutToggle as EventListener
    );
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override render() {
    return html`
      <div class="account-switcher">
        <div class="account-switcher__left">
          <slot name="left"></slot>
        </div>
        <div class="account-switcher__right">
          <button
            class="account-switcher__back"
            @click=${this._handleBackClick}
          >
            <span>${unsafeSVG(arrowLeftIcon)}</span>
            ${this._textStrings.backToWorkspaces}
          </button>
          <slot name="right"></slot>
        </div>
      </div>
    `;
  }

  private _handleBackClick() {
    this.view = 'root';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-account-switcher': AccountSwitcher;
  }
}
