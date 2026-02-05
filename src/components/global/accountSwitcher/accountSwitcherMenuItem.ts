import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import AccountSwitcherMenuItemScss from './accountSwitcherMenuItem.scss?inline';

import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import recommendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import recommendFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';

/**
 * Account Switcher Menu Item component.
 * Used for both workspace items (left panel) and account items (right panel).
 * @fires on-click - Emits when the item is clicked. `detail: { value: string }`
 * @fires on-favorite-change - Emits when favorite status changes. `detail: { value: string, favorited: boolean }`
 */
@customElement('kyn-account-switcher-menu-item')
export class AccountSwitcherMenuItem extends LitElement {
  static override styles = unsafeCSS(AccountSwitcherMenuItemScss);

  /** The variant of the menu item. */
  @property({ type: String })
  accessor variant: 'workspace' | 'item' = 'item';

  /** The unique value/id of the item. */
  @property({ type: String })
  accessor value = '';

  /** The display name of the item. */
  @property({ type: String })
  accessor name = '';

  /** The count to display (workspace variant only). */
  @property({ type: Number })
  accessor count: number | null = null;

  /** Whether the item is selected. */
  @property({ type: Boolean })
  accessor selected = false;

  /** Whether the item is favorited (item variant only). */
  @property({ type: Boolean })
  accessor favorited = false;

  /** Whether to show the favorite icon selector (item variant only). */
  @property({ type: Boolean })
  accessor showFavorite = true;

  override render() {
    const isWorkspace = this.variant === 'workspace';

    const classes = {
      'menu-item': true,
      'menu-item--workspace': isWorkspace,
      'menu-item--item': !isWorkspace,
      'menu-item--selected': this.selected,
    };

    return html`
      <div
        class=${classMap(classes)}
        role="listitem"
        tabindex="0"
        aria-current=${this.selected ? 'true' : 'false'}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <span class="menu-item__name">${this.name}</span>
        ${isWorkspace
          ? this._renderWorkspaceContent()
          : this._renderItemContent()}
      </div>
    `;
  }

  private _renderWorkspaceContent() {
    if (this.count == null) return null;

    return html`
      <span class="menu-item__count">${this.count}</span>
      <span class="menu-item__chevron">${unsafeSVG(chevronRightIcon)}</span>
    `;
  }

  private _renderItemContent() {
    if (!this.showFavorite) return null;

    const favoriteClasses = {
      'menu-item__favorite': true,
      'menu-item__favorite--active': this.favorited,
    };

    return html`
      <span
        class=${classMap(favoriteClasses)}
        @click=${this._handleFavoriteClick}
      >
        ${unsafeSVG(this.favorited ? recommendFilledIcon : recommendIcon)}
      </span>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(
      new CustomEvent('on-click', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  private _handleFavoriteClick(e: Event) {
    e.stopPropagation();
    const newFavorited = !this.favorited;
    this.dispatchEvent(
      new CustomEvent('on-favorite-change', {
        detail: { value: this.value, favorited: newFavorited },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-account-switcher-menu-item': AccountSwitcherMenuItem;
  }
}
