import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';

import WorkspaceSwitcherScss from './workspaceSwitcher.scss?inline';

import './workspaceSwitcherMenuItem';

const _defaultTextStrings = {
  currentTitle: 'CURRENT',
  workspacesTitle: 'WORKSPACES',
  backToWorkspaces: 'Workspaces',
};

/**
 * Workspace Switcher shell component providing two-panel layout with mobile drill-down.
 * Consumers compose content via named slots using sub-components
 * like `kyn-workspace-switcher-menu-item`.
 * @slot left - Non-list content for the left panel (e.g. workspace info header).
 * @slot left-list - List items for the left panel (rendered inside role="list").
 * @slot right - Non-list content for the right panel (e.g. search).
 * @slot right-list - List items for the right panel (rendered inside role="list").
 * @cssprop [--kyn-workspace-switcher-max-height=none] - Maximum height of the switcher panel.
 */
@customElement('kyn-workspace-switcher')
export class WorkspaceSwitcher extends LitElement {
  static override styles = unsafeCSS(WorkspaceSwitcherScss);

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Mobile drill-down view state. 'root' shows left panel, 'detail' shows right panel.
   * @internal
   */
  @property({ type: String, reflect: true })
  accessor view: 'root' | 'detail' = 'root';

  /** Hides the heading above the account meta info. */
  @property({ type: Boolean, reflect: true })
  accessor hideCurrentTitle = false;

  /** Hides the heading above the lower left-hand side list. Example: suppress for accounts-only customers. */
  @property({ type: Boolean, reflect: true })
  accessor hideWorkspacesTitle = false;

  /** Merged text strings.
   * @internal
   */
  private _textStrings = _defaultTextStrings;

  /**
   * @internal
   */
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
      <div class="workspace-switcher">
        <div class="workspace-switcher__left">
          ${!this.hideCurrentTitle
            ? html`<span class="workspace-switcher__title"
                >${this._textStrings.currentTitle}</span
              >`
            : null}
          <slot name="left"></slot>
          ${!this.hideWorkspacesTitle
            ? html`<span class="workspace-switcher__title"
                >${this._textStrings.workspacesTitle}</span
              >`
            : null}
          <div class="workspace-switcher__list" role="list">
            <slot name="left-list"></slot>
          </div>
        </div>
        <div class="workspace-switcher__right">
          <kyn-workspace-switcher-menu-item
            class="workspace-switcher__back"
            variant="back"
            name=${this._textStrings.backToWorkspaces}
            @on-click=${this._handleBackClick}
          ></kyn-workspace-switcher-menu-item>
          <slot name="right"></slot>
          <div class="workspace-switcher__list" role="list">
            <slot name="right-list"></slot>
          </div>
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
    'kyn-workspace-switcher': WorkspaceSwitcher;
  }
}
