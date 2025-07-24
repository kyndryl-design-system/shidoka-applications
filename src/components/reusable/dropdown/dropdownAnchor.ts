import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import DropdownAnchorScss from './dropdownAnchor.scss?inline';
import '../button/button';

import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chevron-down.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-simple.svg';

/**
 * Dropdown Anchor component for handling input and button anchor types.
 * @fires anchor-click - Emitted when the anchor is clicked.
 * @fires anchor-keydown - Emitted when a key is pressed on the anchor.
 * @fires anchor-blur - Emitted when the anchor loses focus.
 * @fires search-input - Emitted when search input value changes.
 * @fires search-keydown - Emitted when a key is pressed in search input.
 * @fires search-click - Emitted when search input is clicked.
 * @fires clear-multiple - Emitted when clear multiple button is clicked.
 */
@customElement('kyn-dropdown-anchor')
export class DropdownAnchor extends LitElement {
  static override styles = unsafeCSS(DropdownAnchorScss);

  /** Anchor type - 'input' or 'button' */
  @property({ type: String })
  accessor anchorType: 'input' | 'button' = 'input';

  /** Dropdown size/height. "sm", "md", or "lg". */
  @property({ type: String })
  accessor size = 'md';

  /** Dropdown inline style type. */
  @property({ type: Boolean })
  accessor inline = false;

  /** Dropdown placeholder. */
  @property({ type: String })
  accessor placeholder = '';

  /** Dropdown open state. */
  @property({ type: Boolean })
  accessor open = false;

  /** Makes the dropdown searchable. */
  @property({ type: Boolean })
  accessor searchable = false;

  /** Enabled multi-select functionality. */
  @property({ type: Boolean })
  accessor multiple = false;

  /** Dropdown disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Component name for accessibility. */
  @property({ type: String })
  accessor name = '';

  /** Search input value. */
  @property({ type: String })
  accessor searchText = '';

  /** Selected option text. */
  @property({ type: String })
  accessor text = '';

  /** Dropdown value. */
  @property({ type: Array })
  accessor value: any = [];

  /** Required state. */
  @property({ type: Boolean })
  accessor required = false;

  /** Invalid state. */
  @property({ type: Boolean })
  accessor invalid = false;

  /** Title for the dropdown. */
  @property({ type: String })
  override accessor title = 'Dropdown';

  /** Clear button text. */
  @property({ type: String })
  accessor clearText = 'Clear';

  /** Button text when anchorType is 'button'. */
  @property({ type: String })
  accessor buttonText = '';

  /**
   * Queries the .search DOM element.
   * @ignore
   */
  @query('.search')
  accessor searchEl!: HTMLInputElement;

  /**
   * Queries the .select DOM element.
   * @ignore
   */
  @query('.select')
  accessor buttonEl!: HTMLElement;

  /**
   * Queries the kyn-button DOM element.
   * @ignore
   */
  @query('kyn-button')
  accessor kynButtonEl!: HTMLElement;

  /**
   * Queries the .clear-multiple DOM element.
   * @ignore
   */
  @query('.clear-multiple')
  accessor clearMultipleEl!: HTMLElement;

  override render() {
    return html`
      ${this.anchorType === 'button'
        ? html`<kyn-button
            class="dropdown-anchor-button"
            kind="secondary-ai"
            size="small"
            ?disabled=${this.disabled}
            aria-expanded=${this.open}
            aria-controls="options"
            role="combobox"
            iconPosition="right"
            name=${this.name}
            title=${this.title}
            @on-click=${this._handleButtonClick}
            @keydown=${this._handleKeydown}
            @blur=${this._handleBlur}
          >
            ${this.buttonText ||
            this.text ||
            this.placeholder ||
            'Select option'}
            <span
              slot="icon"
              style="transform: ${this.open
                ? 'rotate(180deg)'
                : 'rotate(0deg)'}; transition: transform 0.2s ease-in-out;"
              >${unsafeSVG(downIcon)}</span
            >
          </kyn-button>`
        : html`<div
            class="${classMap({
              select: true,
              'input-custom': true,
              'size--sm': this.size === 'sm',
              'size--lg': this.size === 'lg',
              inline: this.inline,
            })}"
            aria-labelledby="label-${this.name}"
            aria-expanded=${this.open}
            aria-controls="options"
            role="combobox"
            id=${this.name}
            name=${this.name}
            title=${this.title}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this.invalid}
            tabindex=${this.disabled ? '' : '0'}
            @click=${this._handleClick}
            @keydown=${this._handleKeydown}
            @mousedown=${this._handleMousedown}
            @blur=${this._handleBlur}
          >
            ${this.multiple && this.value.length
              ? html`
                  <button
                    class="clear-multiple"
                    aria-label="${this.value
                      .length} items selected. Clear selections"
                    ?disabled=${this.disabled}
                    title=${this.clearText}
                    @click=${this._handleClearMultiple}
                  >
                    ${this.value.length}
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(clearIcon)}</span
                    >
                  </button>
                `
              : null}
            ${this._renderAnchorContent()}

            <span
              class="${classMap({
                'arrow-icon': true,
                open: this.open,
                disabled: this.disabled,
              })}"
              >${unsafeSVG(downIcon)}</span
            >
          </div>`}
    `;
  }

  private _renderAnchorContent() {
    if (this.anchorType === 'button') {
      return html`
        <span class="button-text">
          ${this.buttonText || this.placeholder}
        </span>
      `;
    }

    if (this.searchable) {
      return html`
        <input
          class="search"
          type="text"
          placeholder=${this.placeholder}
          value=${this.searchText}
          ?disabled=${this.disabled}
          aria-disabled=${this.disabled}
          @keydown=${this._handleSearchKeydown}
          @input=${this._handleSearchInput}
          @blur=${this._handleSearchBlur}
          @click=${this._handleSearchClick}
        />
      `;
    }

    return html`
      <input
        class="select-placeholder"
        type="text"
        placeholder=${this.placeholder}
        value=${this.text || ''}
        readonly
        tabindex="-1"
        aria-readonly="true"
      />
    `;
  }

  private _handleClick(e: Event) {
    e.stopPropagation();
    this._emitEvent('anchor-click', { originalEvent: e });
  }

  private _handleKeydown(e: KeyboardEvent) {
    this._emitEvent('anchor-keydown', { originalEvent: e });
  }

  private _handleMousedown(e: MouseEvent) {
    if (!this.searchable) {
      e.preventDefault();
    }
  }

  private _handleBlur(e: FocusEvent) {
    e.stopPropagation();
    this._emitEvent('anchor-blur', { originalEvent: e });
  }

  private _handleSearchKeydown(e: KeyboardEvent) {
    e.stopPropagation();
    this._emitEvent('search-keydown', { originalEvent: e });
  }

  private _handleSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.searchText = target.value;
    this._emitEvent('search-input', {
      value: target.value,
      originalEvent: e,
    });
  }

  private _handleSearchBlur(e: FocusEvent) {
    e.stopPropagation();
    this._emitEvent('search-blur', { originalEvent: e });
  }

  private _handleSearchClick(e: Event) {
    e.stopPropagation();
    this._emitEvent('search-click', { originalEvent: e });
  }

  private _handleButtonClick(e: CustomEvent) {
    e.stopPropagation();
    this._emitEvent('anchor-click', { originalEvent: e.detail.origEvent });
  }

  private _handleClearMultiple(e: Event) {
    e.stopPropagation();
    this._emitEvent('clear-multiple', { originalEvent: e });
  }

  private _emitEvent(eventName: string, detail: any) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _handleFocus() {
    if (this.anchorType === 'button' && this.kynButtonEl) {
      this.kynButtonEl.focus();
    } else if (this.searchable && this.searchEl) {
      this.searchEl.focus();
    } else if (this.buttonEl) {
      this.buttonEl.focus();
    }
  }

  getValidationAnchor() {
    if (this.anchorType === 'button' && this.kynButtonEl) {
      return this.kynButtonEl;
    }
    return this.buttonEl;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown-anchor': DropdownAnchor;
  }
}
