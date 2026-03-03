import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/chevron-down.svg';
import checkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/check.svg';
import PageTitleScss from './pageTitle.scss?inline';

export interface ContextualItem {
  value: string;
  text: string;
}

/**
 * Page Title
 * @slot icon - Slot for icon. Use size 56 * 56 as per UX guidelines.
 * @fires on-change - Fired when a contextual dropdown item is selected. Detail: `{ value: string, text: string }`.
 */

@customElement('kyn-page-title')
export class PageTitle extends LitElement {
  static override styles = unsafeCSS(PageTitleScss);

  /** Headline text. */
  @property({ type: String })
  accessor headLine = '';

  /** Page title text (required). Used as fallback when no contextual item is selected. */
  @property({ type: String })
  accessor pageTitle = '';

  /** Page subtitle text. */
  @property({ type: String })
  accessor subTitle = '';

  /** Type of page title `'primary'` , `'secondary'` & `'tertiary'`. */
  @property({ type: String })
  accessor type = 'primary';

  /** Set this to `true` for AI theme. */
  @property({ type: Boolean })
  accessor aiConnected = false;

  /** Enables the contextual dropdown variant with a chevron toggle. */
  @property({ type: Boolean, reflect: true })
  accessor contextual = false;

  /** Whether the contextual dropdown is open. */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  /** Items for the contextual dropdown. Each item has `value` and `text`. */
  @property({ type: Array })
  accessor contextualItems: ContextualItem[] = [];

  /** The value of the currently selected contextual item. Auto-selects first item if not set. */
  @property({ type: String, reflect: true })
  accessor selectedValue = '';

  private _onDocumentClick = (e: Event) => {
    if (!e.composedPath().includes(this)) {
      this._closeDropdown();
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onDocumentClick);
  }

  override disconnectedCallback() {
    document.removeEventListener('click', this._onDocumentClick);
    super.disconnectedCallback();
  }

  private _getSelectedItem(): ContextualItem | undefined {
    if (!this.contextualItems.length) return undefined;
    const found = this.contextualItems.find(
      (item) => item.value === this.selectedValue
    );
    return found || this.contextualItems[0];
  }

  private _getDisplayTitle(): string {
    if (this.contextual && this.contextualItems.length) {
      const selected = this._getSelectedItem();
      return selected ? selected.text : this.pageTitle;
    }
    return this.pageTitle;
  }

  private _emitChange(item: ContextualItem) {
    this.dispatchEvent(
      new CustomEvent('on-change', {
        detail: { value: item.value, text: item.text },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _toggleDropdown() {
    this.open = !this.open;
  }

  private _closeDropdown() {
    this.open = false;
  }

  private _selectItem(item: ContextualItem) {
    const changed = this.selectedValue !== item.value;
    this.selectedValue = item.value;
    if (changed) {
      this._emitChange(item);
    }
    this._closeDropdown();
  }

  private _handleItemKeydown(item: ContextualItem, e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._selectItem(item);
    } else if (e.key === 'Escape') {
      this._closeDropdown();
    }
  }

  private _handleTriggerKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        this._closeDropdown();
        break;
      case 'ArrowDown':
        if (!this.open) {
          e.preventDefault();
          this.open = true;
        }
        break;
    }
  }

  override render() {
    const classes = {
      'page-title': true,
      [`page-title-${this.type}`]: true,
      'ai-connected': this.aiConnected,
    };

    const subTitleClasses = {
      'page-subtitle': true,
      [`page-subtitle-${this.type}`]: true,
    };

    const displayTitle = this._getDisplayTitle();

    return html`
      <div class="page-title-wrapper">
        <div class="icon-wrapper">
          <slot name="icon"></slot>
        </div>

        <div class="page-title-text-wrapper">
          <!-- Headline -->
          ${this.headLine !== ''
            ? html`<div class="page-headline">${this.headLine}</div>`
            : null}
          <!-- Title -->
          ${this.contextual
            ? this._renderContextualTitle(classes, displayTitle)
            : html`<h1 class="${classMap(classes)}">${displayTitle}</h1>`}
          <!-- Subtitle -->
          ${this.subTitle !== ''
            ? html`<div class="${classMap(subTitleClasses)}">
                ${this.subTitle}
              </div>`
            : null}
        </div>
      </div>
    `;
  }

  private _renderContextualTitle(
    classes: Record<string, boolean>,
    displayTitle: string
  ) {
    const selectedItem = this._getSelectedItem();

    return html`
      <div class="contextual-wrapper">
        <h1 class="${classMap(classes)}">
          <button
            class="contextual-trigger"
            aria-expanded="${this.open}"
            aria-haspopup="listbox"
            @click="${this._toggleDropdown}"
            @keydown="${this._handleTriggerKeydown}"
          >
            ${displayTitle}
            <span class="chevron-icon ${this.open ? 'chevron-icon--open' : ''}">
              ${unsafeSVG(downIcon)}
            </span>
          </button>
        </h1>
        <div
          class="contextual-dropdown ${this.open
            ? 'contextual-dropdown--open'
            : ''}"
          role="listbox"
        >
          ${this.contextualItems.map((item) => {
            const isSelected = selectedItem?.value === item.value;
            return html`
              <div
                class="contextual-option ${isSelected
                  ? 'contextual-option--selected'
                  : ''}"
                role="option"
                aria-selected="${isSelected}"
                tabindex="0"
                @click="${() => this._selectItem(item)}"
                @keydown="${(e: KeyboardEvent) =>
                  this._handleItemKeydown(item, e)}"
              >
                <span class="contextual-option-text">${item.text}</span>
                ${isSelected
                  ? html`<span class="check-icon"
                      >${unsafeSVG(checkIcon)}</span
                    >`
                  : null}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-page-title': PageTitle;
  }
}
