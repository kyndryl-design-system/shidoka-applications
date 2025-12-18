import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import DropdownScss from './dropdown.scss?inline';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';
import { nothing } from 'lit';

import './dropdownOption';
import './enhancedDropdownOption';
import '../tag';
import '../button';
import '../textInput';

import { DropdownOption } from './dropdownOption';
import { EnhancedDropdownOption } from './enhancedDropdownOption';

import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

const _defaultTextStrings = {
  title: 'Dropdown',
  selectedOptions: 'List of selected options',
  requiredText: 'Required',
  errorText: 'Error',
  clearAll: 'Clear all',
  clear: 'Clear',
  addItem: 'Add item...',
  add: 'Add',
  duplicateOption: 'Duplicate option. Please select a unique option.',
  addOptionInvalid: 'Please check this value and try again.',
};

/**
 * Dropdown, single select.
 * @fires on-change - Captures the dropdown change event and emits the selected value and original event details. `detail:{ value: string/array }`
 * @fires on-search - Capture the search input event and emits the search text.`detail:{ searchText: string }`
 * @fires on-clear-all - Captures the the multi-select clear all button click event and emits the value. `detail:{ value: array }`
 * @fires on-add-option - Captures the add button click and emits the newly added option. `detail:{ value: string }`
 * @slot unnamed - Slot for dropdown options.
 * @slot tooltip - Slot for tooltip.
 * @slot anchor - Slot for custom dropdown anchor element. If not provided, defaults to standard input-style anchor.
 * @slot add-option-input - Slot for providing a custom “Add new option” input.
 * @slot add-option-button - Slot for providing a custom “Add new option” button.
 * @attr {string/array} [value=''/[]] - The selected value(s) of the input. For single select, it is a string. For multi-select, it is an array of strings.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 * @attr {string} [invalidText=''] - The custom validation message when the input is invalid.
 */
@customElement('kyn-dropdown')
export class Dropdown extends FormMixin(LitElement) {
  static override styles = unsafeCSS(DropdownScss);

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Dropdown size/height. "sm", "md", or "lg". */
  @property({ type: String })
  accessor size = 'md';

  /** Dropdown kind. */
  @property({ type: String, attribute: 'kind' })
  accessor kind: 'ai' | 'default' = 'default';

  /** Dropdown inline style type. */
  @property({ type: Boolean })
  accessor inline = false;

  /** Optional text beneath the input. */
  @property({ type: String })
  accessor caption = '';

  /** Dropdown placeholder. */
  @property({ type: String })
  accessor placeholder = '';

  /** Listbox/drawer open state. */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  /** Makes the dropdown searchable. */
  @property({ type: Boolean })
  accessor searchable = false;

  /** Makes the dropdown enhanced. */
  @property({ type: Boolean })
  accessor enhanced = false;

  /** Dropdown read-only state (focusable but not interactive). */
  @property({ type: Boolean, reflect: true })
  accessor readonly = false;

  /** Searchable variant filters results. */
  @property({ type: Boolean })
  accessor filterSearch = false;

  /** Enabled multi-select functionality. */
  @property({ type: Boolean })
  accessor multiple = false;

  /** Makes the dropdown required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Visually hide the label. */
  @property({ type: Boolean })
  accessor hideLabel = false;

  /** Dropdown disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Hide the tags below multi-select. */
  @property({ type: Boolean })
  accessor hideTags = false;

  /** Adds a "Select all" option to the top of a multi-select dropdown. */
  @property({ type: Boolean })
  accessor selectAll = false;

  /** "Select all" text customization. */
  @property({ type: String })
  accessor selectAllText = 'Select all';

  /** Menu CSS min-width value. */
  @property({ type: String })
  accessor menuMinWidth = '120px';

  /** Controls direction that dropdown opens. */
  @property({ type: String })
  accessor openDirection: 'auto' | 'up' | 'down' = 'auto';

  /** Is "Select All" box checked.
   * @internal
   */
  @property({ type: Boolean })
  accessor selectAllChecked = false;

  /** Is "Select All" indeterminate.
   * @internal
   */
  @property({ type: Boolean })
  accessor selectAllIndeterminate = false;

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Enables the "Add New Option" feature. */
  @property({ type: Boolean })
  accessor allowAddOption = false;

  /** @internal */
  @state()
  accessor _hasSlottedAddOptionInput = false;

  /** @internal */
  @state()
  accessor _hasSlottedAddOptionButton = false;

  /** @internal */
  @state()
  accessor _lastAddOptionInvalidText = '';

  /** Enables duplicate prevention when adding new options. */
  @property({ type: Boolean })
  accessor preventDuplicateAddOption = true;

  /** Validator function for new option input.
   * @internal
   * Return a string to mark invalid and show that message.
   * Return `null`/`undefined` for valid.
   */
  @property({ attribute: false })
  accessor addOptionValidator:
    | ((value: string, ctx: { dropdown: Dropdown }) => string | null | void)
    | null = null;

  /** Allows duplicate selections in multi-select dropdowns. */
  @property({ type: Boolean })
  accessor allowDuplicateSelections = true;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

  /**
   * New dropdown option value.
   * @ignore
   */
  @state()
  accessor newOptionValue = '';

  /**
   * Selected option text, automatically derived.
   * @ignore
   */
  @state()
  accessor text = '';

  /**
   * Search input value.
   */
  @property({ type: String })
  accessor searchText = '';

  /**
   * Assistive text for screen readers.
   * @ignore
   */
  @state()
  accessor assistiveText = 'Dropdown menu options.';

  /**
   * Queries any slotted options, default or enhanced.
   * @ignore
   */
  protected get options(): Array<DropdownOption | EnhancedDropdownOption> {
    return Array.from(
      this.querySelectorAll<DropdownOption | EnhancedDropdownOption>(
        'kyn-dropdown-option, kyn-enhanced-dropdown-option'
      )
    );
  }

  /**
   * Queries any slotted selected options.
   * @ignore
   */
  protected get selectedOptions(): Array<
    DropdownOption | EnhancedDropdownOption
  > {
    return this.options.filter((opt) => opt.selected);
  }

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
   * Queries the .options DOM element.
   * @ignore
   */
  @query('.options')
  accessor listboxEl!: HTMLElement;

  /**
   * Queries the .clear-multiple DOM element.
   * @ignore
   */
  @query('.clear-multiple')
  accessor clearMultipleEl!: HTMLElement;

  /**
   * Queries the add-option input slot (if provided).
   * @ignore
   */
  @query('slot[name="add-option-input"]')
  accessor addOptionInputSlotEl!: HTMLSlotElement;

  /**
   * Queries the add-option button slot (if provided).
   * @ignore
   */
  @query('slot[name="add-option-button"]')
  accessor addOptionButtonSlotEl!: HTMLSlotElement;

  private _getSlottedAddOptionInput(): HTMLElement | null {
    const assigned =
      this.addOptionInputSlotEl?.assignedElements({ flatten: true }) ?? [];

    return (assigned[0] as HTMLElement | undefined) ?? null;
  }

  private _getAddOptionInputEls(): {
    slottedEl: HTMLElement | null;
    slottedNative: HTMLInputElement | null;
    fallbackNative: HTMLInputElement | null;
  } {
    const slottedEl = this._getSlottedAddOptionInput();

    const slottedNative =
      (slottedEl as any)?.tagName === 'KYN-TEXT-INPUT'
        ? ((slottedEl as any).shadowRoot?.querySelector?.(
            'input'
          ) as HTMLInputElement | null) ?? null
        : (slottedEl as HTMLInputElement | null);

    const fallbackNative =
      this.shadowRoot?.querySelector<HTMLInputElement>(
        'kyn-text-input.add-option-input input, input.add-option-input, .add-option-input input'
      ) ?? null;

    return { slottedEl, slottedNative, fallbackNative };
  }

  private _getOptionDisplayText(
    option: DropdownOption | EnhancedDropdownOption
  ): string {
    if (option.tagName === 'KYN-ENHANCED-DROPDOWN-OPTION') {
      const titleSlot = option.querySelector('[slot="title"]');
      const slotText = titleSlot?.textContent?.trim();
      return (
        slotText ||
        (option as any).displayText ||
        option.value ||
        ''
      ).trim();
    }

    return (option.textContent ?? '').trim();
  }

  /**
   * Open drawer upwards.
   * @ignore
   */
  @state()
  accessor _openUpwards = false;

  /**
   * Tags value/text reference.
   * @ignore
   */
  @state()
  accessor _tags: Array<object> = [];

  /** Toggles on clicking enter key in the search input.
   * @internal
   */
  searchTextEntered: any = false;

  /** Toggles on clicking enter key in the search input.
   * @internal
   */
  prevSearchKeydownIndex = -1;

  /** Event handlers for document click
   * @internal
   */
  private _onDocumentClick = (e: Event) => this._handleClickOut(e);

  /** Event handlers for child option events (click).
   * @internal
   */
  private _onChildClick = (e: Event) => this._handleClick(e as any);

  /** Event handlers for child option events (remove).
   * @internal
   */
  private _onChildRemove = (_e: Event) => this._handleRemoveOption();

  /** Event handlers for child option events (blur).
   * @internal
   */
  private _onChildBlur = (e: Event) => this._handleBlur(e as any);

  private _handleAddOptionSlotChange() {
    const hasInput =
      (this.addOptionInputSlotEl?.assignedElements({ flatten: true }) ?? [])
        .length > 0;
    const hasButton =
      (this.addOptionButtonSlotEl?.assignedElements({ flatten: true }) ?? [])
        .length > 0;

    this._hasSlottedAddOptionInput = hasInput;
    this._hasSlottedAddOptionButton = hasButton;

    // auto-enable when either slot is provided
    if ((hasInput || hasButton) && !this.allowAddOption) {
      this.allowAddOption = true;
    }
  }

  /** @ignore */
  private get _addOptionBlocked(): { blocked: boolean; message: string } {
    const v = this.newOptionValue.trim();

    if (!v) return { blocked: true, message: '' };

    const { valid, message } = this._validateNewOptionValue(v);
    if (!valid) {
      return {
        blocked: true,
        message: message || this._textStrings.addOptionInvalid,
      };
    }

    return { blocked: false, message: '' };
  }

  override render() {
    const mainDropdownClasses = {
      dropdown: true,
      'ai-connected': this.kind === 'ai',
    };

    const selectedCount =
      this.multiple && Array.isArray(this.value) ? this.value.length : 0;

    const addBlocked = this.allowAddOption
      ? this._addOptionBlocked.blocked
      : false;

    return html`
      <div
        class=${classMap(mainDropdownClasses)}
        ?disabled=${this.disabled}
        ?readonly=${!this.disabled && this.readonly}
        ?open=${this.open}
        ?inline=${this.inline}
        ?searchable=${this.searchable}
      >
        <label
          id="label-${this.name}"
          class="label-text ${this.hideLabel || this.inline ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${this.required
            ? html`
                <abbr
                  class="required"
                  title=${this._textStrings.requiredText}
                  role="img"
                  aria-label=${this._textStrings?.requiredText || 'Required'}
                >
                  *
                </abbr>
              `
            : null}
          ${this.label}
          <slot name="tooltip"></slot>
        </label>

        <div
          class=${classMap({
            wrapper: true,
            open: this.open,
          })}
        >
          <div
            class="custom"
            @click=${(e: MouseEvent) => this.handleAnchorClick(e)}
            @keydown=${(e: KeyboardEvent) => this.handleAnchorKeydown(e)}
          >
            <slot name="anchor">
              <div
                class="${classMap({
                  select: true,
                  'is-readonly': !this.disabled && this.readonly,
                  multiple: this.multiple,
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
                title=${this._textStrings.title}
                ?required=${this.required}
                ?disabled=${this.disabled}
                ?invalid=${this._isInvalid}
                tabindex=${ifDefined(
                  this.disabled ? undefined : this.searchable ? -1 : 0
                )}
                @mousedown=${(e: MouseEvent) => {
                  if (!this.searchable && !this.readonly) e.preventDefault();
                }}
                aria-readonly=${this.readonly}
                @blur=${(e: any) => e.stopPropagation()}
              >
                ${this.multiple && selectedCount > 0
                  ? html`
                      <button
                        class=${classMap({
                          'clear-multiple': true,
                        })}
                        aria-label="${selectedCount} items selected. Clear selections"
                        ?disabled=${this.disabled || this.readonly}
                        title=${this._textStrings.clear}
                        @click=${(e: Event) => this.handleClearMultiple(e)}
                      >
                        ${selectedCount}
                        <span style="display:flex;" class="clear-multiple-icon">
                          ${unsafeSVG(clearIcon)}
                        </span>
                      </button>
                    `
                  : null}
                ${this.searchable
                  ? html`
                      <input
                        class="search"
                        type="text"
                        placeholder=${this.placeholder}
                        value=${this.searchText}
                        ?disabled=${this.disabled}
                        ?readonly=${!this.disabled && this.readonly}
                        aria-disabled=${this.disabled}
                        @keydown=${(e: any) => this.handleSearchKeydown(e)}
                        @input=${(e: any) => this.handleSearchInput(e)}
                        @blur=${(e: any) => e.stopPropagation()}
                        @click=${(e: any) => this.handleSearchClick(e)}
                      />
                    `
                  : html`
                      <span
                        class="${classMap({
                          'placeholder-text': this.text === '',
                        })}"
                      >
                        ${this.multiple
                          ? this.placeholder
                          : this.value === ''
                          ? this.placeholder
                          : this.text}
                      </span>
                    `}
                <span class="arrow-icon">${unsafeSVG(downIcon)}</span>
              </div>
            </slot>

            <div
              id="options"
              class=${classMap({
                options: true,
                open: this.open,
                upwards: this._openUpwards,
              })}
              style="min-width: ${this.menuMinWidth};"
              aria-hidden=${!this.open}
              @keydown=${this.handleListKeydown}
              @blur=${this.handleListBlur}
              @focus=${this._handleListFocus}
            >
              ${this.allowAddOption
                ? html`
                    <div class="add-option-container">
                      <div class="add-option">
                        <div
                          class="add-option-row"
                          @click=${this._onAddOptionRowClick}
                          @keydown=${(e: KeyboardEvent) => {
                            this._addOptionRowKeydown(e);
                          }}
                          @mousedown=${(e: MouseEvent) => e.stopPropagation()}
                        >
                          <slot
                            name="add-option-input"
                            @slotchange=${() =>
                              this._handleAddOptionSlotChange()}
                          >
                            <kyn-text-input
                              class="add-option-input"
                              type="text"
                              placeholder=${this._textStrings.addItem}
                              .value=${this.newOptionValue}
                              @on-input=${this._handleInputNewOption as any}
                              @input=${this._handleInputNewOption as any}
                              @focus=${this._onAddOptionInputFocus}
                              aria-label="Add new option"
                              ?disabled=${this.disabled || this.readonly}
                            ></kyn-text-input>
                          </slot>

                          <slot
                            name="add-option-button"
                            @slotchange=${() =>
                              this._handleAddOptionSlotChange()}
                          >
                            <kyn-button
                              class="add-option-button"
                              type="button"
                              size="small"
                              kind="secondary"
                              ?disabled=${this.disabled ||
                              this.readonly ||
                              addBlocked}
                              @on-click=${this._handleAddOption}
                            >
                              ${this._textStrings.add}
                            </kyn-button>
                          </slot>
                        </div>
                      </div>

                      ${null}
                    </div>
                  `
                : null}

              <div
                role="listbox"
                aria-labelledby="label-${this.name}"
                class=${classMap({
                  'dropdown-listbox': true,
                  'ai-connected': this.kind === 'ai',
                })}
              >
                ${this.multiple && this.selectAll
                  ? html`
                      ${this.enhanced
                        ? html`
                            <kyn-enhanced-dropdown-option
                              class="select-all"
                              value="selectAll"
                              multiple
                              ?selected=${this.selectAllChecked}
                              ?indeterminate=${this.selectAllIndeterminate}
                              ?disabled=${this.disabled}
                            >
                              ${this.selectAllText}
                            </kyn-enhanced-dropdown-option>
                          `
                        : html`
                            <kyn-dropdown-option
                              class="select-all"
                              value="selectAll"
                              multiple
                              ?selected=${this.selectAllChecked}
                              ?indeterminate=${this.selectAllIndeterminate}
                              ?disabled=${this.disabled}
                            >
                              ${this.selectAllText}
                            </kyn-dropdown-option>
                          `}
                    `
                  : null}

                <slot
                  id="children"
                  @slotchange=${() => this.handleSlotChange()}
                ></slot>
              </div>
            </div>
          </div>
          ${this.hasSearch
            ? html`
                <kyn-button
                  ?disabled=${this.disabled || this.readonly}
                  class="clear-button dropdown-clear"
                  kind=${this.kind === 'ai' ? 'ghost-ai' : 'ghost'}
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${(e: Event) => this.handleClear(e)}
                >
                  <span style="display:flex;">${unsafeSVG(clearIcon)}</span>
                </kyn-button>
              `
            : null}
        </div>
        ${this.renderHelperContent()}
      </div>
    `;
  }

  /** @ignore */
  private _addOptionRowKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this._handleAddOption();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this._clearAddOptionInput();
      this.open = false;
      this.buttonEl?.focus?.();
      return;
    }

    e.stopPropagation();
  }

  private canOpen(): boolean {
    return !this.disabled && !this.readonly;
  }

  private handleAnchorClick(e: MouseEvent) {
    if (!this.canOpen()) return;

    const path = (e.composedPath?.() || []) as Array<EventTarget>;
    const isInOptions =
      path.some((t) => (t as HTMLElement)?.classList?.contains('options')) ||
      (e.target as HTMLElement)?.closest?.(
        'kyn-dropdown-option, kyn-enhanced-dropdown-option, .add-option'
      );

    if (isInOptions) return;

    this.handleClick();
  }

  /**
   * @ignore
   */
  private _onAddOptionInputFocus = () => {
    this.assistiveText = 'Add new option input';
  };

  private _clearAddOptionInput() {
    this.newOptionValue = '';

    const slottedInput = this._getSlottedAddOptionInput() as any;

    if (slottedInput?.tagName === 'KYN-TEXT-INPUT') {
      slottedInput.value = '';
      const nativeInput = slottedInput.shadowRoot?.querySelector?.(
        'input'
      ) as HTMLInputElement | null;
      if (nativeInput) nativeInput.value = '';
    }

    const fallback =
      this.shadowRoot?.querySelector<HTMLInputElement>('.add-option-input');
    if (fallback) fallback.value = '';
  }

  private _validateNewOptionValue(valueRaw: string): {
    valid: boolean;
    message: string;
  } {
    const value = valueRaw.trim();

    if (value.length === 0) return { valid: true, message: '' };

    const { slottedEl, fallbackNative } = this._getAddOptionInputEls();

    const slottedAsAny = slottedEl as any;

    const pattern =
      typeof slottedAsAny?.pattern === 'string'
        ? slottedAsAny.pattern
        : typeof slottedEl?.getAttribute?.('pattern') === 'string'
        ? (slottedEl!.getAttribute('pattern') as string)
        : typeof fallbackNative?.getAttribute?.('pattern') === 'string'
        ? (fallbackNative!.getAttribute('pattern') as string)
        : '';

    const minLengthRaw = Number.isFinite(slottedAsAny?.minLength)
      ? Number(slottedAsAny.minLength)
      : slottedEl?.getAttribute?.('minlength')
      ? Number(slottedEl.getAttribute('minlength'))
      : fallbackNative?.getAttribute?.('minlength')
      ? Number(fallbackNative.getAttribute('minlength'))
      : undefined;

    const maxLengthRaw = Number.isFinite(slottedAsAny?.maxLength)
      ? Number(slottedAsAny.maxLength)
      : slottedEl?.getAttribute?.('maxlength')
      ? Number(slottedEl.getAttribute('maxlength'))
      : fallbackNative?.getAttribute?.('maxlength')
      ? Number(fallbackNative.getAttribute('maxlength'))
      : undefined;

    const minLength =
      Number.isFinite(minLengthRaw) && (minLengthRaw as number) > 0
        ? (minLengthRaw as number)
        : undefined;

    const maxLength =
      Number.isFinite(maxLengthRaw) && (maxLengthRaw as number) > 0
        ? (maxLengthRaw as number)
        : undefined;

    if (typeof minLength === 'number' && value.length < minLength) {
      return { valid: false, message: '' };
    }

    if (typeof maxLength === 'number' && value.length > maxLength) {
      return { valid: false, message: '' };
    }

    if (pattern) {
      try {
        const re = new RegExp(pattern);
        if (!re.test(value)) {
          return { valid: false, message: '' };
        }
      } catch {
        // Invalid regex pattern provided by consuming dev
      }
    }

    if (this.preventDuplicateAddOption) {
      const needle = value.toLowerCase();
      const exists = this.options.some(
        (opt) => opt.value.trim().toLowerCase() === needle
      );
      if (exists)
        return { valid: false, message: this._textStrings.duplicateOption };
    }

    if (this.addOptionValidator) {
      const result = this.addOptionValidator(value, { dropdown: this });
      const msg = typeof result === 'string' ? result : '';
      if (msg) return { valid: false, message: msg };
    }

    return { valid: true, message: '' };
  }

  private handleAnchorKeydown(e: KeyboardEvent) {
    if (!this.canOpen()) {
      const openKeys = [' ', 'Enter', 'ArrowDown', 'ArrowUp'];
      if (openKeys.includes(e.key)) e.preventDefault();
      return;
    }

    this.handleButtonKeydown(
      e as unknown as KeyboardEvent & { keyCode: number }
    );
  }

  override firstUpdated() {
    if (this.placeholder === '') {
      if (this.searchable) {
        this.placeholder = 'Search';
      } else {
        this.placeholder = this.multiple ? 'Select items' : 'Select an option';
      }
    }
  }

  private renderHelperContent() {
    return html`
      ${this.multiple && !this.hideTags && this._tags.length
        ? html`
            <kyn-tag-group
              ?filter=${this.disabled || this.readonly ? false : true}
              role="list"
              aria-label=${this._textStrings.selectedOptions}
              data-readonly=${this.readonly ? '' : nothing}
            >
              ${this._tags.map(
                (tag: any) => html`
                  <kyn-tag
                    role="listitem"
                    tagColor=${this.kind === 'ai' ? 'ai' : 'default'}
                    label=${tag.text}
                    ?disabled=${this.disabled || tag.disabled || this.readonly}
                    @on-close=${() => this.handleTagClear(tag)}
                  ></kyn-tag>
                `
              )}
            </kyn-tag-group>
          `
        : null}
      ${this.caption !== ''
        ? html`<div class="caption" aria-disabled=${this.disabled}>
            ${this.caption}
          </div>`
        : null}
      ${this._isInvalid
        ? html`
            <div class="error">
              <span
                class="error-icon"
                role="img"
                title=${this._textStrings.errorText}
                aria-label=${this._textStrings.errorText}
                >${unsafeSVG(errorIcon)}</span
              >
              ${this.invalidText || this._internalValidationMsg}
            </div>
          `
        : null}

      <div
        class="assistive-text"
        role="status"
        aria-live="assertive"
        aria-relevant="additions text"
      >
        ${this.assistiveText}
      </div>
    `;
  }

  private handleSlotChange() {
    this.updateChildOptions();
    this._updateOptions();
    this._updateSelectedText();
  }

  private updateChildOptions() {
    const slot = this.shadowRoot?.querySelector('#children') as HTMLSlotElement;
    const options = slot.assignedElements({ flatten: true }) as HTMLElement[];

    options.forEach((option) => {
      const tag = option.tagName;
      if (
        tag === 'KYN-DROPDOWN-OPTION' ||
        tag === 'KYN-ENHANCED-DROPDOWN-OPTION'
      ) {
        (option as any).allowAddOption = this.allowAddOption;
        (option as any).multiple = this.multiple;
        (option as any).readonly = this.readonly;
      }
    });
  }

  private handleClick() {
    if (!this.canOpen()) return;

    this.open = !this.open;
    if (this.searchable) this.searchEl.focus();
    else this.buttonEl.focus();
  }

  private handleButtonKeydown(e: any) {
    if (this.readonly) {
      if (e.key === 'Escape') {
        this.open = false;
        this.buttonEl?.focus();
      }
      return;
    }
    this.handleKeyboard(e, e.keyCode, 'button');
  }

  private handleListKeydown(e: KeyboardEvent & { keyCode: number }) {
    const path = (e.composedPath?.() ?? []) as EventTarget[];

    const isFromAddOption = path.some((t) => {
      const el = t as HTMLElement | null;
      if (!el) return false;

      const tag = (el.tagName ?? '').toUpperCase();

      return (
        el.classList?.contains?.('add-option-row') ||
        el.classList?.contains?.('add-option-input') ||
        tag === 'KYN-TEXT-INPUT' ||
        tag === 'INPUT' ||
        Boolean(el.closest?.('.add-option'))
      );
    });

    if (isFromAddOption) {
      return;
    }

    const isFromOption = path.some((t) => {
      const el = t as HTMLElement | null;
      if (!el) return false;
      const tag = (el.tagName ?? '').toUpperCase();
      return (
        tag === 'KYN-DROPDOWN-OPTION' ||
        tag === 'KYN-ENHANCED-DROPDOWN-OPTION' ||
        Boolean(
          el.closest?.('kyn-dropdown-option, kyn-enhanced-dropdown-option')
        )
      );
    });

    if (isFromOption) {
      return;
    }

    if (this.readonly) {
      if ((e as KeyboardEvent).key === 'Escape') {
        e.preventDefault();
        this.open = false;
        this.buttonEl?.focus?.();
      }
      return;
    }

    const TAB_KEY_CODE = 9;

    if (e.keyCode !== TAB_KEY_CODE) {
      e.preventDefault();
    }

    this.handleKeyboard(e as any, e.keyCode, 'list');
  }

  private _handleListFocus() {
    const selectAllOptions = Array.from(
      this.shadowRoot?.querySelectorAll('.select-all') || []
    ) as any[];
    const filteredOptions = this.options.filter(
      (option: any) => option.style.display !== 'none'
    );
    const visibleOptions = [...selectAllOptions, ...filteredOptions] as any[];

    const firstEnabled = visibleOptions.find((o: any) => !o.disabled) as any;
    if (!firstEnabled) return;

    visibleOptions.forEach((o: any) => (o.highlighted = false));

    firstEnabled.focus?.({ preventScroll: true });
    firstEnabled.highlighted = true;
    firstEnabled.scrollIntoView({ block: 'nearest' });

    this.assistiveText = firstEnabled.text || 'Option';
  }

  private handleListBlur(e: FocusEvent): void {
    if (this.multiple) {
      return;
    }

    this.options.forEach((o) => (o.highlighted = false));
    const target = e.relatedTarget as HTMLElement | null;

    if (
      target &&
      (target.closest('kyn-dropdown-option') ||
        target.closest('kyn-enhanced-dropdown-option') ||
        target.classList.contains('search') ||
        target.closest('.add-option'))
    ) {
      return;
    }

    this.open = false;
    this.assistiveText = 'Dropdown menu options.';
  }

  private handleKeyboard(
    e: KeyboardEvent & { keyCode: number; target: EventTarget | null },
    keyCode: number,
    target: 'button' | 'list' | 'addOption'
  ) {
    const SPACEBAR_KEY_CODE = [0, 32] as const;
    const ENTER_KEY_CODE = 13;
    const DOWN_ARROW_KEY_CODE = 40;
    const UP_ARROW_KEY_CODE = 38;
    const ESCAPE_KEY_CODE = 27;

    const selectAllOptions = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement>('.select-all') ?? []
    );

    const filteredOptions = this.options.filter(
      (option) => (option as unknown as HTMLElement).style.display !== 'none'
    );

    const visibleOptions = [...selectAllOptions, ...filteredOptions] as Array<
      | HTMLElement
      | (DropdownOption | EnhancedDropdownOption)
      | (HTMLElement & {
          value?: string;
          selected?: boolean;
          highlighted?: boolean;
          disabled?: boolean;
          text?: string;
        })
    >;

    const highlightedEl = visibleOptions.find(
      (option) => (option as any).highlighted
    ) as any;

    const selectedEl = visibleOptions.find(
      (option) => (option as any).selected
    ) as any;

    let highlightedIndex = highlightedEl
      ? visibleOptions.indexOf(highlightedEl)
      : selectedEl
      ? visibleOptions.indexOf(selectedEl)
      : 0;

    if (
      SPACEBAR_KEY_CODE.includes(keyCode as (typeof SPACEBAR_KEY_CODE)[number])
    ) {
      e.preventDefault();
    }

    if (this.readonly) {
      if (keyCode === DOWN_ARROW_KEY_CODE || keyCode === UP_ARROW_KEY_CODE) {
        e.preventDefault();

        let nextIndex =
          keyCode === DOWN_ARROW_KEY_CODE
            ? (highlightedIndex + 1) % visibleOptions.length
            : (highlightedIndex - 1 + visibleOptions.length) %
              visibleOptions.length;

        let guard = 0;
        while (
          (visibleOptions[nextIndex] as any)?.disabled &&
          guard++ < visibleOptions.length
        ) {
          nextIndex =
            keyCode === DOWN_ARROW_KEY_CODE
              ? (nextIndex + 1) % visibleOptions.length
              : (nextIndex - 1 + visibleOptions.length) % visibleOptions.length;
        }

        const next = visibleOptions[nextIndex] as any;
        const current = visibleOptions[highlightedIndex] as any;

        if (next) {
          if (current) current.highlighted = false;

          (next as HTMLElement).focus?.();
          next.highlighted = true;
          (next as HTMLElement).scrollIntoView?.({ block: 'nearest' });

          this.assistiveText = next.text || 'Option';
        }

        return;
      }

      if (
        SPACEBAR_KEY_CODE.includes(
          keyCode as (typeof SPACEBAR_KEY_CODE)[number]
        ) ||
        keyCode === ENTER_KEY_CODE
      ) {
        e.preventDefault();
        return;
      }

      if (keyCode === ESCAPE_KEY_CODE) {
        this.open = false;
        (this.searchable ? this.searchEl : this.buttonEl)?.focus?.();
        this.assistiveText = 'Dropdown menu options.';
        return;
      }

      return;
    }

    const isListboxElOpened = this.open;

    // open the listbox
    if (target === 'button' || target === 'addOption') {
      let openDropdown =
        SPACEBAR_KEY_CODE.includes(
          keyCode as (typeof SPACEBAR_KEY_CODE)[number]
        ) ||
        keyCode === ENTER_KEY_CODE ||
        keyCode === DOWN_ARROW_KEY_CODE ||
        keyCode === UP_ARROW_KEY_CODE;

      if (e.target === this.clearMultipleEl && keyCode === ENTER_KEY_CODE) {
        openDropdown = false;

        const current = visibleOptions[highlightedIndex] as any;
        if (current) {
          current.highlighted = false;
          current.selected = !current.selected;
        }

        highlightedIndex = 0;
        return;
      }

      if (openDropdown) {
        this.open = true;

        if (
          this.allowAddOption &&
          target === 'button' &&
          keyCode === ENTER_KEY_CODE
        ) {
          setTimeout(() => {
            (
              this.addOptionInputSlotEl
                ?.assignedElements({ flatten: true })
                ?.find(
                  (el): el is HTMLElement =>
                    typeof (el as any)?.focus === 'function'
                ) as HTMLElement | undefined
            )?.focus();
          }, 100);
        } else {
          // scroll to highlighted option
          if (
            !this.multiple &&
            typeof this.value === 'string' &&
            this.value !== ''
          ) {
            (visibleOptions[highlightedIndex] as HTMLElement)?.scrollIntoView?.(
              {
                block: 'nearest',
              }
            );
          }
        }
      }
    }

    switch (keyCode) {
      case 0:
      case 32:
      case ENTER_KEY_CODE: {
        const current = visibleOptions[highlightedIndex] as any;
        if (!current) return;

        // select highlighted option
        current.highlighted = true;

        if (isListboxElOpened) {
          if (this.multiple) {
            current.selected = !current.selected;

            this._handleClick({
              detail: {
                value: current.value,
                selected: current.selected,
              },
            });
          } else {
            visibleOptions.forEach((opt) => {
              (opt as any).selected = false;
            });

            current.selected = true;

            this.updateValue(current.value, true);
            this.emitValue();

            this.open = false;
            this.assistiveText = `Selected ${current.value}`;
          }
        }

        return;
      }

      case DOWN_ARROW_KEY_CODE: {
        const hasHighlightedOrSelected = Boolean(highlightedEl || selectedEl);

        let nextIndex = !hasHighlightedOrSelected
          ? 0
          : highlightedIndex === visibleOptions.length - 1
          ? 0
          : highlightedIndex + 1;

        // skip disabled options
        if ((visibleOptions[nextIndex] as any)?.disabled) {
          nextIndex =
            nextIndex === visibleOptions.length - 1 ? 0 : nextIndex + 1;
        }

        const next = visibleOptions[nextIndex] as any;
        const current = visibleOptions[highlightedIndex] as any;

        next?.focus?.();

        if (current) current.tabIndex = -1;
        if (next) next.tabIndex = 0;

        if (current) current.highlighted = false;
        if (next) next.highlighted = true;

        (next as HTMLElement)?.scrollIntoView?.({ block: 'nearest' });

        this.assistiveText = next?.text ?? '';

        return;
      }

      case UP_ARROW_KEY_CODE: {
        // go to previous option
        let nextIndex =
          highlightedIndex === 0
            ? visibleOptions.length - 1
            : highlightedIndex - 1;

        // skip disabled options
        if ((visibleOptions[nextIndex] as any)?.disabled) {
          nextIndex =
            nextIndex === 0 ? visibleOptions.length - 1 : nextIndex - 1;
        }

        const next = visibleOptions[nextIndex] as any;
        const current = visibleOptions[highlightedIndex] as any;

        next?.focus?.();

        if (current) current.tabIndex = -1;
        if (next) next.tabIndex = 0;

        if (current) current.highlighted = false;
        if (next) next.highlighted = true;

        (next as HTMLElement)?.scrollIntoView?.({ block: 'nearest' });

        this.assistiveText = next?.text ?? '';

        return;
      }

      case ESCAPE_KEY_CODE: {
        this.open = false;

        if (this.searchable) {
          this.searchEl?.focus?.();
        } else {
          this.buttonEl?.focus?.();
        }

        this.assistiveText = 'Dropdown menu options.';
        return;
      }

      default: {
        return;
      }
    }
  }

  private handleClearMultiple(e: any) {
    if (this.readonly) return;

    e.stopPropagation();

    // clear values
    if (this.multiple) {
      const Slot: any = this.shadowRoot?.querySelector('slot#children');
      const Options: Array<any> = Slot.assignedElements();
      const DisabledSelectedOptions: Array<any> = Options.filter(
        (option: any) => option.selected && option.disabled
      ).map((option: any) => option.value);

      this.value = DisabledSelectedOptions.length
        ? [...DisabledSelectedOptions]
        : [];
    } else {
      this.value = '';
    }

    this._validate(true, false);
    this._updateSelectedOptions();
    this.emitValue();

    const event = new CustomEvent('on-clear-all', {
      detail: {
        value: this.value,
      },
    });
    this.dispatchEvent(event);
  }

  private handleTagClear(tag: any) {
    if (this.readonly) return;
    // remove value
    this.updateValue(tag.value, false);
    this._updateSelectedOptions();
    this.emitValue();
  }

  private handleClear(e: any) {
    if (this.readonly) return;

    e.stopPropagation();

    // reset search input text
    this.text = '';
    this.searchText = '';
    this.searchEl.value = '';

    this._emitSearch();

    if (this.filterSearch) {
      // reveal all options
      this.options.map((option: any) => {
        option.style.display = 'block';
      });
    }

    // clear selection for single select
    if (!this.multiple) {
      this.value = '';
      this._validate(true, false);
      this._updateSelectedOptions();
      this.emitValue();
    }
  }

  private handleSearchClick(e: MouseEvent) {
    if (this.readonly) return;
    e.stopPropagation();
    this.open = true;
    if ((this.searchText ?? '').trim() === '') this.searchText = '';
  }

  private handleSearchKeydown(e: any) {
    if (this.readonly) {
      if (e.key === 'Escape') {
        this.open = false;
        this.buttonEl.focus();
      }
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    e.stopPropagation();

    const ENTER_KEY_CODE = 13;
    const ESCAPE_KEY_CODE = 27;
    const option = this.options.find((option) => option.highlighted);
    const highlightedIndex = this.options.findIndex(
      (option) => option.highlighted
    );
    this.searchTextEntered = false;
    // select option
    if (e.keyCode === ENTER_KEY_CODE) {
      this.searchTextEntered = true;
      if (option) {
        if (this.prevSearchKeydownIndex !== highlightedIndex) {
          if (this.multiple) {
            option.selected = !option.selected;
          } else {
            this.options.forEach((e) => (e.selected = false));
            option.selected = true;
            this.open = false;
          }
          this.updateValue(option.value, option.selected);
        }

        if (option.selected) {
          this.assistiveText = `Selected ${option.innerHTML}`;
          this.prevSearchKeydownIndex = highlightedIndex;
        } else {
          this.assistiveText = `Deselected ${option.innerHTML}`;
        }
      } else {
        this.assistiveText = 'No item matched.';
      }
    }

    // close listbox
    if (e.keyCode === ESCAPE_KEY_CODE) {
      this.open = false;
      this.buttonEl.focus();
    }
  }

  private handleSearchInput(e: any) {
    if (this.readonly) return;

    const value = e.target.value;
    this.searchText = value;
    this.open = true;

    this._emitSearch();

    const needle = value.toLowerCase();

    if (this.filterSearch) {
      // hide items that don't match
      this.options.forEach((option: any) => {
        const searchText = this._getOptionDisplayText(option).toLowerCase();

        option.style.display = searchText.includes(needle) ? 'block' : 'none';
      });

      return;
    }

    const matches = this.options.filter((option: any) =>
      this._getOptionDisplayText(option).toLowerCase().startsWith(needle)
    );

    this.options.forEach((option) => (option.highlighted = false));

    if (value !== '' && matches.length) {
      matches[0].highlighted = true;
      matches[0].scrollIntoView({ block: 'nearest' });
      if (this.searchTextEntered) this.assistiveText = 'Option Matched';
    }
  }

  private _updateSelectedOptions() {
    // set selected state for each option
    this.options.forEach((option) => {
      if (this.multiple) {
        option.selected = this.valueArray.includes(option.value);
      } else {
        option.selected = this.value === option.value;
      }
    });
  }
  private _handleClick(e: any) {
    if (this.readonly) return;

    if (e.detail.value === 'selectAll') {
      this.selectAllChecked = e.detail.selected;

      const Slot: any = this.shadowRoot?.querySelector('slot#children');
      const Options: Array<any> = Slot.assignedElements();
      const DisabledSelectedOptions: Array<any> = Options.filter(
        (option: any) => option.selected && option.disabled
      ).map((option: any) => option.value);

      if (e.detail.selected) {
        this.value = this.options
          .filter(
            (option) => !option.disabled || (option.disabled && option.selected)
          )
          .map((option) => option.value);
        this.assistiveText = 'Selected all items.';
      } else {
        this.value = DisabledSelectedOptions.length
          ? DisabledSelectedOptions
          : [];
        this.assistiveText = 'Deselected all items.';
      }

      this._validate(true, false);
    } else {
      this.updateValue(e.detail.value, e.detail.selected);
      this.assistiveText = e.detail.selected
        ? `Selected ${e.detail.value}`
        : `Deselected ${e.detail.value}`;
    }

    this._updateSelectedOptions();

    if (!this.multiple) {
      this.open = false;
    }

    // emit selected value
    this.emitValue();
  }

  private _handleBlur(e: any) {
    // For multi-select, don't auto-close on option blur
    if (this.multiple) return;

    const relatedTarget = e.detail?.origEvent?.relatedTarget as
      | HTMLElement
      | null
      | undefined;

    if (relatedTarget?.closest?.('.remove-option')) {
      return;
    }

    if (
      !relatedTarget ||
      (!relatedTarget.closest('kyn-dropdown-option') &&
        !relatedTarget.closest('kyn-enhanced-dropdown-option') &&
        relatedTarget.localName !== 'kyn-dropdown')
    ) {
      this.open = false;
    }
  }

  /** @ignore */
  private _onAddOptionRowClick = (e: Event) => {
    if (this.readonly || this.disabled) return;

    const path = (e.composedPath?.() ?? []) as Array<EventTarget>;

    const inAddOptionRow = path.some((t) =>
      (t as HTMLElement)?.classList?.contains?.('add-option-row')
    );
    if (!inAddOptionRow) return;

    const isButton = path.some((t) => {
      const el = t as HTMLElement;
      if (!el) return false;
      if (el.classList?.contains?.('add-option-button')) return true;
      return (el.tagName ?? '').toUpperCase() === 'KYN-BUTTON';
    });

    if (!isButton) return;

    e.preventDefault();
    e.stopPropagation();
    this._handleAddOption();
  };

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this._onConnected();

    document.addEventListener('click', this._onDocumentClick);

    this.addEventListener('on-click', this._onChildClick);
    this.addEventListener('on-remove-option', this._onChildRemove);
    this.addEventListener('on-blur', this._onChildBlur);
  }

  override disconnectedCallback() {
    this._onDisconnected();

    document.removeEventListener('click', this._onDocumentClick);
    this.removeEventListener('on-click', this._onChildClick);
    this.removeEventListener('on-remove-option', this._onChildRemove);
    this.removeEventListener('on-blur', this._onChildBlur);

    super.disconnectedCallback();
  }

  /**
   * @ignore
   */
  private get valueArray(): string[] {
    return Array.isArray(this.value) ? this.value : [];
  }

  private updateValue(value: string, selected = false) {
    if (this.readonly) return;

    // set value
    if (this.multiple) {
      const next = [...this.valueArray];

      // update array
      if (selected) {
        if (this.allowDuplicateSelections) {
          next.push(value);
        } else if (!next.includes(value)) {
          next.push(value);
        }
      } else {
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i] === value) next.splice(i, 1);
        }
      }

      this.value = next;
    } else {
      this.value = value;
    }

    this._validate(true, false);

    // reset focus
    if (!this.multiple)
      (this.searchable ? this.searchEl : this.buttonEl).focus();
  }

  private _validate(interacted: boolean, report: boolean) {
    const isMissing =
      this.required &&
      !this.readonly &&
      (this.multiple
        ? !Array.isArray(this.value) || this.value.length === 0
        : this.value === '');

    const validity = {
      customError: this.invalidText !== '',
      valueMissing: isMissing,
    };

    // set validationMessage
    const InternalMsg = isMissing ? 'Please fill out this field.' : '';
    const validationMessage =
      this.invalidText !== '' ? this.invalidText : InternalMsg;

    const validationAnchor = this.buttonEl || this.listboxEl;

    this._internals.setValidity(
      validity,
      validationMessage,
      validationAnchor ?? undefined
    );

    if (interacted) this._internalValidationMsg = InternalMsg;
    if (report) this._internals.reportValidity();
  }

  private emitValue() {
    const event = new CustomEvent('on-change', {
      detail: {
        value: this.value,
      },
    });
    this.dispatchEvent(event);
  }

  private _emitSearch() {
    const event = new CustomEvent('on-search', {
      detail: {
        searchText: this.searchText,
      },
    });
    this.dispatchEvent(event);
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override updated(changedProps: PropertyValues) {
    super.updated(changedProps);

    if (changedProps.has('readonly')) {
      this.clearMultipleEl?.classList.toggle('is-readonly', this.readonly);
      this.clearMultipleEl?.toggleAttribute('data-readonly', this.readonly);
    }

    if (changedProps.has('kind')) {
      this.dispatchEvent(
        new CustomEvent('kind-changed', {
          detail: this.kind,
          bubbles: true,
          composed: true,
        })
      );

      this.classList.toggle('ai-connected', this.kind === 'ai');
    }

    const root = this.shadowRoot;
    if (!root) return;

    if (changedProps.has('open')) {
      const slot = root.querySelector<HTMLSlotElement>('slot[name="anchor"]');
      const assigned = slot?.assignedElements({ flatten: true }) as
        | HTMLElement[]
        | undefined;
      const btn = assigned?.find(
        (el) => !el.querySelector('.clear-multiple-icon')
      );
      const icon = btn?.querySelector<HTMLElement>('span[slot="icon"]');
      if (icon) {
        icon.style.transition = 'transform 0.2s ease-in-out';
        icon.style.transform = this.open ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }

    this._onUpdated(changedProps);

    if (changedProps.has('value')) {
      this._updateOptions();

      const childrenSlot: any =
        root.querySelector<HTMLSlotElement>('slot#children');
      const options = childrenSlot
        .assignedElements()
        .filter((o: any): o is HTMLElement => !o.disabled);
      const selected = options.filter((o: any) => o.selected);

      this.selectAllChecked = selected.length === options.length;
      this.selectAllIndeterminate =
        selected.length > 0 && selected.length < options.length;

      this._updateTags();
      this._updateSelectedText();
    }

    if (changedProps.has('open') || changedProps.has('openDirection')) {
      if (this.open) {
        this.options.forEach((o) => (o.highlighted = false));

        if (!this.searchable && this.listboxEl) {
          this.listboxEl.focus({ preventScroll: true });
          this.assistiveText =
            'Selecting items. Use up and down arrow keys to navigate.';
        }
      }

      if (this.openDirection === 'up') {
        this._openUpwards = true;
      } else if (this.openDirection === 'down') {
        this._openUpwards = false;
      } else if (this.open) {
        const rect = this.buttonEl.getBoundingClientRect();
        this._openUpwards = rect.top > window.innerHeight * 0.6;
      }

      if (this.open && !this.multiple) {
        const firstSelected = this.options.find((o) => o.selected);
        firstSelected?.scrollIntoView({ block: 'nearest' });
      }
    }

    if (changedProps.has('multiple')) {
      this.options.forEach((opt) => (opt.multiple = this.multiple));
    }

    if (changedProps.has('searchText') && this.searchEl) {
      this.searchEl.value = this.searchText;
    }

    if (
      changedProps.has('multiple') ||
      changedProps.has('allowAddOption') ||
      changedProps.has('readonly')
    ) {
      this.updateChildOptions();
    }

    if (changedProps.has('open') && this.open && !this.searchable) {
      this.listboxEl?.focus({ preventScroll: true });
    }
  }

  /**
   * @ignore
   */
  private get hasSearch(): boolean {
    return (this.searchText ?? '').trim().length > 0;
  }

  // add selected options to Tags array
  private _updateTags() {
    if (!this.multiple) return;

    const counts = new Map<string, number>();
    for (const v of this.valueArray) counts.set(v, (counts.get(v) ?? 0) + 1);

    const options = this.options;

    const tags: Array<{
      value: string;
      text: string;
      disabled: boolean;
      count: number;
    }> = [];

    for (const [value, count] of counts.entries()) {
      const opt = options.find((o) => o.value === value);
      if (!opt) continue;

      tags.push({
        value,
        text: this._getOptionDisplayText(opt) || value,
        disabled: (opt as any).disabled ?? false,
        count,
      });
    }

    this._tags = tags;
  }

  private _updateOptions() {
    const Options = Array.from(
      this.querySelectorAll<DropdownOption | EnhancedDropdownOption>(
        'kyn-dropdown-option, kyn-enhanced-dropdown-option'
      )
    );

    Options.forEach((option) => {
      // set option multiple state
      option.multiple = this.multiple;

      if (this.multiple) {
        // set option selected state
        option.selected = this.valueArray.includes(option.value);
      } else {
        option.selected = this.value === option.value;
      }
    });
  }

  /**
   * @ignore
   */
  private _handleAddOption = () => {
    if (this.readonly || this.disabled) return;

    const { slottedEl, fallbackNative } = this._getAddOptionInputEls();

    // prefer slotted input value, then fallback.
    const currentValue =
      typeof (slottedEl as any)?.value === 'string'
        ? (slottedEl as any).value
        : typeof fallbackNative?.value === 'string'
        ? fallbackNative.value
        : '';

    if (currentValue !== this.newOptionValue) {
      this.newOptionValue = currentValue;
    }

    const v = this.newOptionValue.trim();
    if (!v) return;

    const { valid, message } = this._validateNewOptionValue(v);
    if (!valid) {
      const msg = message || this._textStrings.addOptionInvalid;
      if (slottedEl && 'invalidText' in (slottedEl as any)) {
        (slottedEl as any).invalidText = msg;
        this._lastAddOptionInvalidText = msg;
      }
      return;
    }

    this.dispatchEvent(
      new CustomEvent('on-add-option', { detail: { value: v } })
    );

    this._clearAddOptionInput();

    if (slottedEl && 'invalidText' in (slottedEl as any)) {
      (slottedEl as any).invalidText = '';
      this._lastAddOptionInvalidText = '';
    }
  };

  private _handleInputNewOption = (e: Event) => {
    const path = (e.composedPath?.() || []) as Array<EventTarget>;
    const inAddOptionRow = path.some((t) =>
      (t as HTMLElement)?.classList?.contains?.('add-option-row')
    );
    if (!inAddOptionRow) return;

    const target = e.target as {
      value?: unknown;
      detail?: { value?: unknown };
    };

    this.newOptionValue =
      typeof target?.value === 'string'
        ? target.value
        : typeof target?.detail?.value === 'string'
        ? target.detail.value
        : '';

    // Clear only if we set it (don’t fight consumer-provided invalidText)
    const assigned =
      this.addOptionInputSlotEl?.assignedElements({ flatten: true }) ?? [];
    const slottedInputEl = (assigned[0] as HTMLElement | undefined) ?? null;

    if (
      slottedInputEl &&
      'invalidText' in (slottedInputEl as any) &&
      typeof (slottedInputEl as any).invalidText === 'string' &&
      (slottedInputEl as any).invalidText === this._lastAddOptionInvalidText
    ) {
      (slottedInputEl as any).invalidText = '';
      this._lastAddOptionInvalidText = '';
    }
  };

  private _handleRemoveOption() {
    this.assistiveText = 'Option removed.';

    setTimeout(() => {
      if (this.open) {
        this.listboxEl?.focus?.({ preventScroll: true } as any);
      } else {
        this.buttonEl?.focus?.();
      }
    }, 0);
  }

  private _updateSelectedText() {
    if (this.multiple) return;

    // update selected option text
    if (this.value !== '') {
      const option = this.options.find((o) => o.value === this.value);

      if (option) {
        this.text = this._getOptionDisplayText(option);
      } else {
        this.text = '';
        console.warn(`No dropdown option found with value: ${this.value}`);
      }
    }

    if (this.searchable && this.text) {
      this.searchText = this.text === this.placeholder ? '' : this.text;
      this.searchEl.value = this.searchText;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown': Dropdown;
  }
}
