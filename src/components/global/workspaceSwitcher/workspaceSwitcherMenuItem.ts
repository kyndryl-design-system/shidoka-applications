import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import WorkspaceSwitcherMenuItemScss from './workspaceSwitcherMenuItem.scss?inline';

import arrowLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

import '../../reusable/iconSelector';

/**
 * Workspace Switcher Menu Item component.
 * Used for both workspace items (left panel) and account items (right panel).
 * @fires on-click - Emits when the item is clicked. `detail: { value: string }`
 * @fires on-favorite-change - Emits when favorite status changes. `detail: { value: string, favorited: boolean }`
 */
@customElement('kyn-workspace-switcher-menu-item')
export class WorkspaceSwitcherMenuItem extends LitElement {
  static override styles = unsafeCSS(WorkspaceSwitcherMenuItemScss);

  /** The variant of the menu item. */
  @property({ type: String })
  accessor variant: 'workspace' | 'item' | 'back' = 'item';

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
  accessor showFavorite = false;

  override render() {
    const isWorkspace = this.variant === 'workspace';
    const isBack = this.variant === 'back';

    const classes = {
      'menu-item': true,
      'menu-item--workspace': isWorkspace,
      'menu-item--back': isBack,
      'menu-item--item': !isWorkspace && !isBack,
      'menu-item--selected': this.selected,
    };

    return html`
      <div
        class=${classMap(classes)}
        role=${isBack ? 'none' : 'listitem'}
        aria-current=${this.selected ? 'true' : 'false'}
      >
        <button class="menu-item__select" @click=${this._handleClick}>
          ${isBack
            ? html`<span class="menu-item__back-icon"
                >${unsafeSVG(arrowLeftIcon)}</span
              >`
            : null}
          <span class="menu-item__name" title=${this.name}>${this.name}</span>
          ${isWorkspace ? this._renderWorkspaceContent() : null}
        </button>
        ${!isWorkspace && !isBack ? this._renderItemContent() : null}
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

    return html`
      <kyn-icon-selector
        class="menu-item__favorite"
        ?checked=${this.favorited}
        value=${this.value}
        animateSelection
        onlyVisibleOnHover
        persistWhenChecked
        @on-change=${this._handleFavoriteChange}
      ></kyn-icon-selector>
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

  private _handleFavoriteChange(e: CustomEvent) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('on-favorite-change', {
        detail: { value: this.value, favorited: e.detail.checked },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-workspace-switcher-menu-item': WorkspaceSwitcherMenuItem;
  }
}
