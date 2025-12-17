import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import DropdownScss from './dropdown.scss?inline';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';
import { nothing } from 'lit';

import './dropdownOption';
import './enhancedDropdownOption';
import '../tag';
import '../button';

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
};

const KEY = {
  Enter: 'Enter',
  Escape: 'Escape',
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
} as const;

/**
 * Dropdown, single select.
 * @fires on-change - Captures the dropdown change event and emits the selected value and original event details. `detail:{ value: string/array }`
 * @fires on-search - Capture the search input event and emits the search text.`detail:{ searchText: string }`
 * @fires on-clear-all - Captures the the multi-select clear all button click event and emits the value. `detail:{ value: array }`
 * @fires on-add-option - Captures the add button click and emits the newly added option. `detail:{ value: string }`
 * @slot unnamed - Slot for dropdown options.
 * @slot tooltip - Slot for tooltip.
 * @slot anchor - Slot for custom dropdown anchor element. If not provided, defaults to standard input-style anchor.
 * @slot add-option-row - Slot for providing custom “Add new option” UI row (input + button). If not provided, a default row is rendered.
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

  /** Enables duplicate validation for the "Add option" input. */
  @property({ type: Boolean })
  accessor preventDuplicateAddOption = true;

  /** Allows duplicate selections in multi-select dropdowns. */
  @property({ type: Boolean })
  accessor allowDuplicateSelections = true;

  /** Custom invalid text for the "Add option" input when native validity fails (pattern/length/required). */
  @property({ type: String })
  accessor addOptionInvalidText = '';

  /** RegEx pattern to validate "Add option" input. */
  @property({ type: String })
  accessor addOptionPattern = '';

  /** Minimum number of characters for "Add option" input. */
  @property({ type: Number })
  accessor addOptionMinLength: number | undefined = undefined;

  /** Maximum number of characters for "Add option" input. */
  @property({ type: Number })
  accessor addOptionMaxLength: number | undefined = undefined;

  /** Whether "Add option" input is required (usually false; empty should just not add). */
  @property({ type: Boolean })
  accessor addOptionRequired = false;

  /** If true, Add button is disabled whenever the "Add option" input is invalid. */
  @property({ type: Boolean })
  accessor disableAddButtonWhenAddOptionInvalid = true;

  /** Force-disable the Add button regardless of validity (consumer-controlled). */
  @property({ type: Boolean })
  accessor addButtonDisabled = false;

  /** Consumer hook to dynamically disable Add button (e.g. async validation states). */
  @property({ attribute: false })
  accessor isAddButtonDisabled: ((ctx: { value: string }) => boolean) | null =
    null;

  /** @internal */
  @state()
  accessor _addOptionIsInvalid = false;

  /** @internal */
  @state()
  accessor _addOptionValidationMsg = '';

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
   * Queries the .add-option-input DOM element.
   * @ignore
   */
  @query('.add-option-input')
  accessor addOptionInputEl!: HTMLInputElement;

  /**
   * Queries the add-option slot (if provided).
   * @ignore
   */
  @query('slot[name="add-option-row"]')
  accessor addOptionRowSlotEl!: HTMLSlotElement;

  private _getSlottedAddOptionInput(): HTMLElement | null {
    const assigned =
      this.addOptionRowSlotEl?.assignedElements({ flatten: true }) ?? [];

    for (const el of assigned) {
      if ((el as HTMLElement).classList?.contains('add-option-input')) {
        return el as HTMLElement;
      }
    }

    return null;
  }

  private _syncSlottedAddOptionInput() {
    const inputEl = this._getSlottedAddOptionInput();
    if (!inputEl) return;

    // disabled/readonly
    inputEl.toggleAttribute('disabled', this.disabled);
    inputEl.toggleAttribute('readonly', !this.disabled && this.readonly);
    inputEl.setAttribute('aria-disabled', String(this.disabled));

    // value
    try {
      (inputEl as any).value = this.newOptionValue;
    } catch {
      // no-op
    }

    // validation-related attributes
    inputEl.toggleAttribute('required', this.addOptionRequired);

    if (this.addOptionPattern)
      inputEl.setAttribute('pattern', this.addOptionPattern);
    else inputEl.removeAttribute('pattern');

    inputEl.removeAttribute('minlength');
    inputEl.removeAttribute('maxlength');

    inputEl.setAttribute('aria-invalid', String(this._addOptionIsInvalid));

    if (this._addOptionIsInvalid) {
      inputEl.setAttribute('aria-describedby', 'add-option-error');
    } else {
      inputEl.removeAttribute('aria-describedby');
    }
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

  private _onDocumentClick = (e: Event) => this._handleClickOut(e);
  private _onChildClick = (e: Event) => this._handleClick(e as any);
  private _onChildRemove = (_e: Event) => this._handleRemoveOption();
  private _onChildBlur = (e: Event) => this._handleBlur(e as any);

  override render() {
    const mainDropdownClasses = {
      dropdown: true,
      'ai-connected': this.kind === 'ai',
    };

    const selectedCount =
      this.multiple && Array.isArray(this.value) ? this.value.length : 0;

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
                tabindex=${this.disabled ? '' : this.searchable ? '-1' : '0'}
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
                    <div class="add-option">
                      ${this.querySelector('[slot="add-option-row"]')
                        ? html`
                            <div
                              class="add-option-row"
                              @click=${(e: MouseEvent) => e.stopPropagation()}
                              @mousedown=${(e: MouseEvent) =>
                                e.stopPropagation()}
                              @keydown=${(e: KeyboardEvent) =>
                                e.stopPropagation()}
                            >
                              <slot name="add-option-row"></slot>
                            </div>
                          `
                        : null}
                      ${this._addOptionIsInvalid
                        ? html`<div
                            id="add-option-error"
                            class="error"
                            role="status"
                            aria-live="polite"
                          >
                            ${this._addOptionValidationMsg}
                          </div>`
                        : null}
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

  private _onAddOptionInputKeydown(e: KeyboardEvent) {
    if (this.readonly) return;

    e.stopPropagation();
    switch (e.key) {
      case KEY.Enter:
        this._handleAddOption();
        break;
      case KEY.Escape:
        this.newOptionValue = '';
        this.open = false;
        this.buttonEl.focus();
        break;
      case KEY.ArrowDown:
        this.handleKeyboard(e, 40, 'addOption');
        break;
      case KEY.ArrowUp:
        this.handleKeyboard(e, 38, 'addOption');
        break;
    }
  }

  private _onAddOptionInputFocus() {
    this.assistiveText = 'Add new option input';
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

  private _isAddButtonDisabled(): boolean {
    const v = this.newOptionValue.trim();

    const consumerDisabled =
      this.isAddButtonDisabled != null
        ? this.isAddButtonDisabled({ value: v })
        : false;

    const invalidDisabled =
      this.disableAddButtonWhenAddOptionInvalid &&
      v.length > 0 &&
      this._addOptionIsInvalid;

    const emptyDisabled = v.length === 0;

    return (
      this.disabled ||
      this.readonly ||
      this.addButtonDisabled ||
      consumerDisabled ||
      invalidDisabled ||
      emptyDisabled
    );
  }

  private _validateNewOptionValue(valueRaw: string): {
    valid: boolean;
    message: string;
  } {
    const value = valueRaw.trim();

    if (value.length === 0) {
      return this.addOptionRequired
        ? { valid: false, message: 'Please fill out this field.' }
        : { valid: true, message: '' };
    }

    const input = this.addOptionInputEl;
    if (input) {
      input.setCustomValidity('');

      const nativeOk = input.checkValidity();
      if (!nativeOk) {
        return {
          valid: false,
          message: this.addOptionInvalidText || input.validationMessage,
        };
      }
    }

    if (
      this.addOptionMinLength != null &&
      value.length < this.addOptionMinLength
    ) {
      const msg = `Please lengthen this text to ${this.addOptionMinLength} characters or more.`;
      if (input) input.setCustomValidity(msg);
      return { valid: false, message: this.addOptionInvalidText || msg };
    }

    if (
      this.addOptionMaxLength != null &&
      value.length > this.addOptionMaxLength
    ) {
      const msg = `Please shorten this text to ${this.addOptionMaxLength} characters or fewer.`;
      if (input) input.setCustomValidity(msg);
      return { valid: false, message: this.addOptionInvalidText || msg };
    }

    if (this.preventDuplicateAddOption) {
      const needle = value.toLowerCase();
      const exists = this.options.some(
        (opt) => opt.value.trim().toLowerCase() === needle
      );
      if (exists) {
        if (input) input.setCustomValidity('That option already exists.');
        return { valid: false, message: 'That option already exists.' };
      }
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

  private _handleAddOption() {
    if (this.readonly) return;

    const v = this.newOptionValue.trim();
    if (!v) return;

    const { valid, message } = this._validateNewOptionValue(v);

    this._addOptionIsInvalid = !valid;
    this._addOptionValidationMsg = !valid ? message : '';

    if (!valid) return;

    this.dispatchEvent(
      new CustomEvent('on-add-option', { detail: { value: v } })
    );

    this.newOptionValue = '';
    const slottedInput =
      this.addOptionRowSlotEl
        ?.assignedElements({ flatten: true })
        .find(
          (el) =>
            (el as HTMLElement).classList?.contains('add-option-input') ||
            (el as HTMLElement).querySelector?.('.add-option-input')
        ) ?? null;

    const inputEl = (slottedInput as HTMLElement | null)?.classList?.contains(
      'add-option-input'
    )
      ? (slottedInput as any)
      : (slottedInput as HTMLElement | null)?.querySelector?.(
          '.add-option-input'
        );

    if (inputEl) {
      try {
        (inputEl as any).value = '';
      } catch {
        // no-op
      }
    }
    this._addOptionIsInvalid = false;
    this._addOptionValidationMsg = '';

    this._syncSlottedAddOptionInput();
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    if (this.placeholder === '') {
      if (this.searchable) {
        this.placeholder = 'Search';
      } else {
        this.placeholder = this.multiple ? 'Select items' : 'Select an option';
      }
    }

    this.addOptionRowSlotEl?.addEventListener('input', (e: Event) => {
      const path = (e.composedPath?.() || []) as Array<EventTarget>;
      const inAddOptionRow = path.some((t) =>
        (t as HTMLElement)?.classList?.contains?.('add-option-input')
      );

      if (inAddOptionRow) this._handleInputNewOption(e);
    });

    this._syncSlottedAddOptionInput();

    this.addOptionRowSlotEl?.addEventListener('on-input' as any, (e: Event) => {
      this._handleInputNewOption(e);
    });

    super.firstUpdated(_changedProperties);
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

  private handleListKeydown(e: any) {
    if (this.readonly) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.open = false;
        this.buttonEl?.focus();
      }
      return;
    }

    const TAB_KEY_CODE = 9;

    if (e.keyCode !== TAB_KEY_CODE) {
      e.preventDefault();
    }

    this.handleKeyboard(e, e.keyCode, 'list');
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

    if (!('tabIndex' in firstEnabled) || firstEnabled.tabIndex < 0) {
      firstEnabled.tabIndex = 0;
    }
    firstEnabled.focus();
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

    // get highlighted element + index and selected element
    const selectAllOptions = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement>('.select-all') ?? []
    );

    const filteredOptions = this.options.filter(
      (option) => (option as unknown as HTMLElement).style.display !== 'none'
    );
    // visibleOptions.forEach((e) => (e.tabIndex = 0));

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
            this.addOptionInputEl?.focus?.();
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

        (next as HTMLElement)?.focus?.();

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

        (next as HTMLElement)?.focus?.();

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

    if (this.filterSearch) {
      // hide items that don't match
      this.options.map((option: any) => {
        let searchText = option.text;

        if (option.tagName === 'KYN-ENHANCED-DROPDOWN-OPTION') {
          const titleSlot = option.querySelector('[slot="title"]');
          if (titleSlot && titleSlot.textContent.trim()) {
            searchText = titleSlot.textContent.trim();
          } else {
            searchText = option.displayText || option.value;
          }
        }

        if (searchText.toLowerCase().includes(value.toLowerCase())) {
          option.style.display = 'block';
        } else {
          option.style.display = 'none';
        }
      });
    } else {
      // find matches
      const options = this.options.filter((option: any) => {
        let searchText = option.text;

        if (option.tagName === 'KYN-ENHANCED-DROPDOWN-OPTION') {
          const titleSlot = option.querySelector('[slot="title"]');
          if (titleSlot && titleSlot.textContent.trim()) {
            searchText = titleSlot.textContent.trim();
          } else {
            searchText = option.displayText || option.value;
          }
        }

        return searchText.toLowerCase().startsWith(value.toLowerCase());
      });

      // reset options highlighted state
      this.options.forEach((option) => (option.highlighted = false));

      // option highlight and scroll
      if (value !== '' && options.length) {
        options[0].highlighted = true;
        options[0].scrollIntoView({ block: 'nearest' });
        if (this.searchTextEntered) this.assistiveText = 'Option Matched';
      }
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

    if (
      !relatedTarget ||
      (!relatedTarget.closest('kyn-dropdown-option') &&
        !relatedTarget.closest('kyn-enhanced-dropdown-option') &&
        relatedTarget.localName !== 'kyn-dropdown')
    ) {
      this.open = false;
    }
  }
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

    if (
      changedProps.has('allowAddOption') ||
      changedProps.has('disabled') ||
      changedProps.has('readonly') ||
      changedProps.has('newOptionValue') ||
      changedProps.has('_addOptionIsInvalid') ||
      changedProps.has('addOptionPattern') ||
      changedProps.has('addOptionMinLength') ||
      changedProps.has('addOptionMaxLength') ||
      changedProps.has('addOptionRequired')
    ) {
      this._syncSlottedAddOptionInput();
    }

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

  private get hasSearch(): boolean {
    return (this.searchText ?? '').trim().length > 0;
  }

  // add selected options to Tags array
  private _updateTags() {
    if (!this.multiple) return;

    const counts = new Map<string, number>();
    for (const v of this.valueArray) counts.set(v, (counts.get(v) ?? 0) + 1);

    const options = Array.from(
      this.querySelectorAll<DropdownOption | EnhancedDropdownOption>(
        'kyn-dropdown-option, kyn-enhanced-dropdown-option'
      )
    );

    const tags: Array<{
      value: string;
      text: string;
      disabled: boolean;
      count: number;
    }> = [];

    for (const [value, count] of counts.entries()) {
      const opt = options.find((o) => o.value === value);
      if (!opt) continue;

      let text = opt.textContent?.trim() ?? value;

      if (opt.tagName === 'KYN-ENHANCED-DROPDOWN-OPTION') {
        const titleSlot = opt.querySelector('[slot="title"]');
        text =
          titleSlot?.textContent?.trim() || (opt as any).displayText || value;
      }

      tags.push({
        value,
        text,
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

  private _handleInputNewOption(e: Event) {
    const target = e.target as HTMLInputElement;
    this.newOptionValue =
      (target as any).value ?? (target as any).detail?.value ?? '';

    const { valid, message } = this._validateNewOptionValue(
      this.newOptionValue
    );

    const hasText = this.newOptionValue.trim().length > 0;

    this._addOptionIsInvalid = hasText && !valid;
    this._addOptionValidationMsg = this._addOptionIsInvalid ? message : '';
  }

  private _handleRemoveOption() {
    this.assistiveText = 'MY option removed ';
    setTimeout(() => {
      this.open = false;
      this.buttonEl.focus();
    }, 100);
  }

  private _updateSelectedText() {
    // update selected option text
    const AllOptions: any = Array.from(
      this.querySelectorAll('kyn-dropdown-option, kyn-enhanced-dropdown-option')
    );

    if (!this.multiple) {
      if (AllOptions.length && this.value !== '') {
        const option = AllOptions.find(
          (option: any) => option.value === this.value
        );
        if (option) {
          if (option.tagName === 'KYN-ENHANCED-DROPDOWN-OPTION') {
            const titleSlot = option.querySelector('[slot="title"]');
            if (titleSlot && titleSlot.textContent.trim()) {
              this.text = titleSlot.textContent.trim();
            } else {
              this.text = option.displayText || this.value;
            }
          } else {
            this.text = option.textContent.trim();
          }
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown': Dropdown;
  }
}
