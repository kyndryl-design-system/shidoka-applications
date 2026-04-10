import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/chevron-down.svg';
import PageTitleScss from './pageTitle.scss?inline';
import './pageTitleOption';
import type { PageTitleOption } from './pageTitleOption';

/**
 * Page Title
 *
 * If the contextual variant is used to trigger navigation, consider using anchor elements instead, as buttons do not convey destination information to assistive technology users.
 * @slot icon - Slot for icon. Use size 56 * 56 as per UX guidelines.
 * @slot unnamed - Slot for `kyn-pagetitle-option` elements when using the contextual variant.
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

  /** The value of the currently selected contextual item. Auto-selects first item if not set.
   * @internal
   */
  @property({ type: String, reflect: true })
  accessor selectedValue = '';

  /**
   * Slotted `kyn-pagetitle-option` elements.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-pagetitle-option' })
  accessor _options!: Array<PageTitleOption>;

  /**
   * @ignore
   */
  private _onDocumentClick = (e: Event) => {
    if (!e.composedPath().includes(this)) {
      this._closeDropdown();
    }
  };

  /**
   * @ignore
   */
  private _handleOptionClick = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    e.stopPropagation();
    const changed = this.selectedValue !== detail.value;
    this.selectedValue = detail.value;
    this._syncOptions();
    if (changed) {
      this._emitChange(detail);
    }
    this._closeDropdown();
    this.shadowRoot
      ?.querySelector<HTMLButtonElement>('.contextual-trigger')
      ?.focus();
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onDocumentClick);
    this.addEventListener('on-option-click', this._handleOptionClick);
  }

  override disconnectedCallback() {
    document.removeEventListener('click', this._onDocumentClick);
    this.removeEventListener('on-option-click', this._handleOptionClick);
    super.disconnectedCallback();
  }

  override updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('selectedValue')) {
      this._syncOptions();
    }
  }

  private _syncOptions() {
    if (!this._options?.length) return;

    // Auto-select first if selectedValue doesn't match any option
    const match = this._options.find((o) => o.value === this.selectedValue);
    if (!match && this._options.length) {
      this.selectedValue = this._options[0].value;
      return; // will re-trigger via updated()
    }

    this._options.forEach((option) => {
      option.selected = option.value === this.selectedValue;
    });
  }

  private _handleSlotChange() {
    this._syncOptions();
    this.requestUpdate();
  }

  private _getDisplayTitle(): string {
    if (this.contextual) {
      const selected = this._options?.find((o) => o.selected);
      return selected?.text || this.pageTitle;
    }
    return this.pageTitle;
  }

  private _emitChange(item: { value: string; text: string }) {
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

  private _handleTriggerKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        this._closeDropdown();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!this.open) {
          this.open = true;
        }
        this.updateComplete.then(() => {
          this._options?.[0]?.shadowRoot
            ?.querySelector<HTMLElement>('[role="option"]')
            ?.focus();
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!this.open) {
          this.open = true;
        }
        this.updateComplete.then(() => {
          const last = this._options?.[this._options.length - 1];
          last?.shadowRoot
            ?.querySelector<HTMLElement>('[role="option"]')
            ?.focus();
        });
        break;
    }
  }

  private _handleListboxKeydown(e: KeyboardEvent) {
    if (!this._options?.length) return;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Escape')
      return;

    if (e.key === 'Escape') {
      this._closeDropdown();
      this.shadowRoot
        ?.querySelector<HTMLButtonElement>('.contextual-trigger')
        ?.focus();
      return;
    }

    e.preventDefault();

    // Find currently focused option
    const activeEl = document.activeElement;
    const idx = this._options.findIndex(
      (o) => o === activeEl || o.shadowRoot?.contains(activeEl as Node)
    );
    const currentIdx = idx >= 0 ? idx : 0;

    let nextIdx: number;
    if (e.key === 'ArrowDown') {
      nextIdx = currentIdx === this._options.length - 1 ? 0 : currentIdx + 1;
    } else {
      nextIdx = currentIdx === 0 ? this._options.length - 1 : currentIdx - 1;
    }

    this._options[nextIdx]?.shadowRoot
      ?.querySelector<HTMLElement>('[role="option"]')
      ?.focus();
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
    return html`
      <div class="contextual-wrapper">
        <h1 class="${classMap(classes)}">
          <button
            class="contextual-trigger"
            aria-expanded="${this.open}"
            aria-haspopup="listbox"
            aria-controls="contextual-listbox"
            @click="${this._toggleDropdown}"
            @keydown="${this._handleTriggerKeydown}"
          >
            <span class="contextual-label">${displayTitle}</span>
            <span class="chevron-icon ${this.open ? 'chevron-icon--open' : ''}">
              ${unsafeSVG(downIcon)}
            </span>
          </button>
        </h1>
        <div
          id="contextual-listbox"
          class="contextual-dropdown ${this.open
            ? 'contextual-dropdown--open'
            : ''}"
          role="listbox"
          @keydown="${this._handleListboxKeydown}"
        >
          <slot @slotchange="${this._handleSlotChange}"></slot>
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
