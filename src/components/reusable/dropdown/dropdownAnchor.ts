import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS, PropertyValues } from 'lit';
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

  /** Text strings for internationalization. */
  @property({ type: Object })
  accessor textStrings: any = {};

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
        ? html`<div class="button-anchor-wrapper">
            <slot name="button" @slotchange=${this._handleButtonSlotChange}>
              <!-- Fallback button in case the anchorType is set to button, but no button is provided. -->
              <kyn-button
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
              </kyn-button>
            </slot>
          </div>`
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
            ${this.searchable &&
            (this.searchText || (!this.multiple && this.text))
              ? html`
                  <kyn-button
                    ?disabled=${this.disabled}
                    class="clear-button dropdown-clear"
                    kind="ghost"
                    size="small"
                    description=${this.textStrings.clearAll}
                    @click=${this._handleClearButtonClick}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(clearIcon)}</span
                    >
                  </kyn-button>
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
          .value=${!this.multiple && this.text ? this.text : this.searchText}
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

  clearSearch() {
    if (this.searchEl) {
      this.searchEl.value = '';
      this.searchText = '';
    }
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

  private _handleClearButtonClick(e: Event) {
    e.stopPropagation();

    if (!this.multiple && this.text) {
      this._emitEvent('clear-selection', { originalEvent: e });
    } else if (this.searchText) {
      this.clearSearch();
      this._emitEvent('search-input', {
        value: '',
        originalEvent: e,
      });
    }
  }

  private _handleButtonSlotChange() {
    const buttonSlot = this.shadowRoot?.querySelector(
      'slot[name="button"]'
    ) as HTMLSlotElement;
    if (buttonSlot) {
      const slottedElements = buttonSlot.assignedElements();
      slottedElements.forEach((element) => {
        if (element.tagName === 'kyn-button') {
          element.setAttribute('aria-expanded', this.open.toString());
          element.setAttribute('aria-controls', 'options');
          element.setAttribute('role', 'combobox');
          element.setAttribute('name', this.name);
          element.setAttribute('title', this.title);

          if (this.disabled) {
            element.setAttribute('disabled', '');
          } else {
            element.removeAttribute('disabled');
          }

          if (!element.hasAttribute('data-events-added')) {
            element.addEventListener('on-click', ((e: Event) => {
              this._handleButtonClick(e as CustomEvent);
            }) as EventListener);
            element.addEventListener('keydown', ((e: Event) => {
              this._handleKeydown(e as KeyboardEvent);
            }) as EventListener);
            element.addEventListener('blur', ((e: Event) => {
              this._handleBlur(e as FocusEvent);
            }) as EventListener);
            element.setAttribute('data-events-added', 'true');
          }
        }
      });
    }
  }

  private _emitEvent(eventName: string, detail: any) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: PropertyValues) {
    super.updated(changedProps);

    if (
      this.anchorType === 'button' &&
      (changedProps.has('open') ||
        changedProps.has('disabled') ||
        changedProps.has('name') ||
        changedProps.has('title'))
    ) {
      this._handleButtonSlotChange();
    }
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
