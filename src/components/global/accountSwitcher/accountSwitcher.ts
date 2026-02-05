import { LitElement, html, unsafeCSS, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import AccountSwitcherScss from './accountSwitcher.scss?inline';

import checkmarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark.svg';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';

import '../../reusable/link';
import '../../reusable/search';
import './accountSwitcherMenuItem';

export interface Workspace {
  id: string;
  name: string;
  count?: number | null;
  selected?: boolean;
}

export interface AccountItem {
  id: string;
  name: string;
  selected?: boolean;
  favorited?: boolean;
}

export interface CurrentAccount {
  name: string;
  accountId?: string;
  country?: string;
}

/**
 * Account Switcher component for selecting accounts and workspaces.
 * @fires on-workspace-select - Emits when a workspace is selected. `detail: { workspace: Workspace }`
 * @fires on-item-select - Emits when an item is selected. `detail: { item: AccountItem }`
 * @fires on-favorite-change - Emits when an item's favorite status changes. `detail: { item: AccountItem, favorited: boolean }`
 * @fires on-search - Emits when search input changes. `detail: { value: string }`
 */
@customElement('kyn-account-switcher')
export class AccountSwitcher extends LitElement {
  static override styles = unsafeCSS(AccountSwitcherScss);

  /** Current account information displayed at the top of the left panel. */
  @property({ type: Object })
  accessor currentAccount: CurrentAccount = { name: '' };

  /** List of workspaces to display in the left panel. */
  @property({ type: Array })
  accessor workspaces: Workspace[] = [];

  /** List of items (accounts, zones, etc.) to display in the right panel. */
  @property({ type: Array })
  accessor items: AccountItem[] = [];

  /** Whether to show the search input in the right panel. */
  @property({ type: Boolean })
  accessor showSearch = false;

  /** Label for the search input. */
  @property({ type: String })
  accessor searchLabel = 'Search';

  /** Label for the "Current" section header. */
  @property({ type: String })
  accessor currentSectionLabel = 'Current';

  /** Label for the "Workspaces" section header. */
  @property({ type: String })
  accessor workspacesSectionLabel = 'Workspaces';

  /** Internal state for copy feedback. */
  @state()
  private accessor _copied = false;

  /** Internal state for selected workspace (immediate visual feedback). */
  @state()
  private accessor _selectedWorkspaceId: string | null = null;

  /** Internal state for selected item (immediate visual feedback). */
  @state()
  private accessor _selectedItemId: string | null = null;

  override willUpdate(changedProperties: PropertyValues) {
    // Initialize selected workspace from props on first load or when workspaces change
    if (
      changedProperties.has('workspaces') &&
      this._selectedWorkspaceId === null
    ) {
      const selectedWorkspace = this.workspaces.find((w) => w.selected);
      if (selectedWorkspace) {
        this._selectedWorkspaceId = selectedWorkspace.id;
      } else if (this.workspaces.length > 0) {
        // Default to first workspace if none selected
        this._selectedWorkspaceId = this.workspaces[0].id;
      }
    }

    // Initialize selected item from props on first load or when items change
    if (changedProperties.has('items')) {
      const selectedItem = this.items.find((i) => i.selected);
      this._selectedItemId = selectedItem?.id ?? null;
    }
  }

  override render() {
    const hasFullAccountInfo =
      this.currentAccount.accountId || this.currentAccount.country;

    return html`
      <div class="account-switcher">
        <div class="account-switcher__left">
          ${!hasFullAccountInfo
            ? html`<div class="section-header">
                ${this.currentSectionLabel}
              </div>`
            : null}
          ${this._renderCurrentAccount()}
          <div class="section-header">${this.workspacesSectionLabel}</div>
          ${this._renderWorkspaceList()}
        </div>
        <div class="account-switcher__right">
          ${this.showSearch ? this._renderSearch() : null}
          ${this._renderItemsList()}
        </div>
      </div>
    `;
  }

  private _renderCurrentAccount() {
    const hasDetails =
      this.currentAccount.accountId || this.currentAccount.country;

    return html`
      <div class="account-meta-info">
        <div class="account-meta-info__header">
          <span class="account-meta-info__checkmark">
            ${unsafeSVG(checkmarkFilledIcon)}
          </span>
          <span class="account-meta-info__name">
            ${this.currentAccount.name}
          </span>
        </div>
        ${hasDetails
          ? html`
              <div class="account-meta-info__details">
                ${this.currentAccount.accountId
                  ? html`
                      <kyn-link
                        standalone
                        animationInactive
                        href="javascript:void(0)"
                        @on-click=${this._handleCopyAccountId}
                      >
                        ${this.currentAccount.accountId}
                        <span slot="icon"
                          >${unsafeSVG(
                            this._copied ? checkmarkIcon : copyIcon
                          )}</span
                        >
                      </kyn-link>
                    `
                  : null}
                ${this.currentAccount.country
                  ? html`
                      <div class="account-meta-info__country">
                        ${this.currentAccount.country}
                      </div>
                    `
                  : null}
              </div>
            `
          : null}
      </div>
    `;
  }

  private _renderWorkspaceList() {
    return html`
      <div class="workspace-list" role="list" aria-label="Workspaces">
        ${this.workspaces.map(
          (workspace) => html`
            <kyn-account-switcher-menu-item
              variant="workspace"
              value=${workspace.id}
              name=${workspace.name}
              .count=${workspace.count ?? null}
              ?selected=${this._selectedWorkspaceId === workspace.id}
              @on-click=${() => this._handleWorkspaceSelect(workspace)}
            ></kyn-account-switcher-menu-item>
          `
        )}
      </div>
    `;
  }

  private _renderSearch() {
    return html`
      <div class="account-switcher__search">
        <kyn-search
          size="sm"
          label=${this.searchLabel}
          @on-input=${this._handleSearch}
        ></kyn-search>
      </div>
    `;
  }

  private _renderItemsList() {
    return html`
      <div class="items-list" role="list" aria-label="Items">
        ${this.items.map(
          (item) => html`
            <kyn-account-switcher-menu-item
              variant="item"
              value=${item.id}
              name=${item.name}
              ?selected=${this._selectedItemId === item.id}
              ?favorited=${item.favorited}
              @on-click=${() => this._handleItemSelect(item)}
              @on-favorite-change=${(e: CustomEvent) =>
                this._handleFavoriteChange(item, e)}
            ></kyn-account-switcher-menu-item>
          `
        )}
      </div>
    `;
  }

  private _handleCopyAccountId(e: CustomEvent) {
    e.detail.origEvent.preventDefault();
    if (this._copied || !this.currentAccount.accountId) return;

    navigator.clipboard.writeText(this.currentAccount.accountId);
    this._copied = true;

    setTimeout(() => {
      this._copied = false;
    }, 3000);
  }

  private _handleWorkspaceSelect(workspace: Workspace) {
    this._selectedWorkspaceId = workspace.id;

    this.dispatchEvent(
      new CustomEvent('on-workspace-select', {
        detail: { workspace },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleItemSelect(item: AccountItem) {
    this._selectedItemId = item.id;

    this.dispatchEvent(
      new CustomEvent('on-item-select', {
        detail: { item },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFavoriteChange(item: AccountItem, e: CustomEvent) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('on-favorite-change', {
        detail: { item, favorited: e.detail.favorited },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleSearch(e: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('on-search', {
        detail: { value: e.detail.value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-account-switcher': AccountSwitcher;
  }
}
