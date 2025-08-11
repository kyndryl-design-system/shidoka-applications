import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import DropdownScss from './dropdown.scss?inline';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';

import './dropdownOption';
import './enhancedDropdownOption';
import '../tag';
import '../button';

import { DropdownOption } from './dropdownOption';
import { EnhancedDropdownOption } from './enhancedDropdownOption';

import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-simple.svg';

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
  @property({ type: String })
  set kind(value: 'ai' | 'default') {
    const old = this._kind;
    this._kind = value;
    this.requestUpdate('kind', old);
  }
  get kind() {
    return this._kind;
  }
  private _kind: 'ai' | 'default' = 'default';

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
  accessor menuMinWidth = 'initial';

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
    return this.options.filter(
      (opt): opt is DropdownOption | EnhancedDropdownOption =>
        opt.hasAttribute('selected')
    );
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

  override render() {
    const mainDropdownClasses = {
      dropdown: true,
      [`ai-connected-${this.kind === 'ai'}`]: true,
    };

    return html`
      <div
        class=${classMap(mainDropdownClasses)}
        ?disabled=${this.disabled}
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
            ? html`<abbr
                class="required"
                title=${this._textStrings.requiredText}
                role="img"
                aria-label=${this._textStrings?.requiredText || 'Required'}
                >*</abbr
              >`
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
            @click=${() => this.handleAnchorClick()}
            @keydown=${(e: any) => this.handleAnchorKeydown(e)}
          >
            <slot name="anchor">
              <div
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
                title=${this._textStrings.title}
                ?required=${this.required}
                ?disabled=${this.disabled}
                ?invalid=${this._isInvalid}
                tabindex=${this.disabled ? '' : '0'}
                @mousedown=${(e: any) => {
                  if (!this.searchable) {
                    e.preventDefault();
                  }
                }}
                @blur=${(e: any) => e.stopPropagation()}
              >
                ${this.multiple && this.value.length
                  ? html`
                      <button
                        class="clear-multiple"
                        aria-label="${this.value
                          .length} items selected. Clear selections"
                        ?disabled=${this.disabled}
                        title=${this._textStrings.clear}
                        @click=${(e: Event) => this.handleClearMultiple(e)}
                      >
                        ${this.value.length}
                        <span
                          style="display:flex;"
                          slot="icon"
                          class="clear-multiple-icon"
                          >${unsafeSVG(clearIcon)}</span
                        >
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
              aria-hidden=${!this.open}
              @keydown=${this.handleListKeydown}
              @blur=${this.handleListBlur}
            >
              ${this.allowAddOption
                ? html`
                    <div class="add-option">
                      <input
                        class="add-option-input"
                        type="text"
                        placeholder=${this._textStrings.addItem}
                        .value=${this.newOptionValue}
                        aria-label="Add new option"
                        @input=${this._handleInputNewOption}
                        @keydown=${this._onAddOptionInputKeydown}
                        @focus=${this._onAddOptionInputFocus}
                      />
                      <kyn-button
                        type="button"
                        size="small"
                        kind="secondary"
                        @on-click=${this._handleAddOption}
                      >
                        ${this._textStrings.add}
                      </kyn-button>
                    </div>
                  `
                : null}

              <div role="listbox" aria-labelledby="label-${this.name}">
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
          ${this.searchText !== ''
            ? html`
                <kyn-button
                  ?disabled=${this.disabled}
                  class="clear-button dropdown-clear"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${(e: Event) => this.handleClear(e)}
                >
                  <span style="display:flex;" slot="icon"
                    >${unsafeSVG(clearIcon)}</span
                  >
                </kyn-button>
              `
            : null}
        </div>
        ${this.renderHelperContent()}
      </div>
    `;
  }

  private _onAddOptionInputKeydown(e: KeyboardEvent) {
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

  private handleAnchorClick() {
    this.handleClick();
  }

  private handleAnchorKeydown(e: any) {
    this.handleButtonKeydown(e);
  }

  private _handleAddOption() {
    const v = this.newOptionValue.trim();
    if (!v) return;
    this.dispatchEvent(
      new CustomEvent('on-add-option', { detail: { value: v } })
    );
    this.newOptionValue = '';
  }

  private renderHelperContent() {
    return html`
        ${
          this.multiple && !this.hideTags && this._tags.length
            ? html`
                <kyn-tag-group
                  filter
                  role="list"
                  aria-label=${this._textStrings.selectedOptions}
                >
                  ${this._tags.map((tag: any) => {
                    return html`
                      <kyn-tag
                        role="listitem"
                        label=${tag.text}
                        ?disabled=${this.disabled || tag.disabled}
                        @on-close=${() => this.handleTagClear(tag)}
                      ></kyn-tag>
                    `;
                  })}
                </kyn-tag-group>
              `
            : null
        }
        ${
          this.caption !== ''
            ? html`
                <div class="caption" aria-disabled=${this.disabled}>
                  ${this.caption}
                </div>
              `
            : null
        }
        ${
          this._isInvalid
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
            : null
        }

        <div
          class="assistive-text"
          role="status"
          aria-live="assertive"
          aria-relevant="additions text"
        >
          ${this.assistiveText}
        </div>
      </div>
    `;
  }

  override firstUpdated() {
    // set a default placeholder if none provided
    if (this.placeholder === '') {
      if (this.searchable) {
        this.placeholder = 'Search';
      } else {
        if (this.multiple) {
          this.placeholder = 'Select items';
        } else {
          this.placeholder = 'Select an option';
        }
      }
    }
  }

  private handleSlotChange() {
    this.updateChildOptions();
    this._updateOptions();
    this._updateSelectedText();
  }

  private updateChildOptions() {
    // Get all slotted kyn-dropdown-option elements
    const slot = this.shadowRoot?.querySelector('#children') as HTMLSlotElement;
    const options = slot.assignedElements({ flatten: true }) as HTMLElement[];

    // Pass allowAddOption to each kyn-dropdown-option
    options.forEach((option) => {
      if (
        option.tagName === 'KYN-DROPDOWN-OPTION' ||
        option.tagName === 'KYN-ENHANCED-DROPDOWN-OPTION'
      ) {
        (option as any).allowAddOption = this.allowAddOption;
      }
    });
  }

  private handleClick() {
    if (!this.disabled) {
      this.open = !this.open;

      // focus search input if searchable
      if (this.searchable) {
        this.searchEl.focus();
      } else {
        this.buttonEl.focus();
      }
    }
  }

  private handleButtonKeydown(e: any) {
    this.handleKeyboard(e, e.keyCode, 'button');
  }

  private handleListKeydown(e: any) {
    const TAB_KEY_CODE = 9;

    if (e.keyCode !== TAB_KEY_CODE) {
      e.preventDefault();
    }

    this.handleKeyboard(e, e.keyCode, 'list');
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

  private handleKeyboard(e: any, keyCode: number, target: string) {
    const SPACEBAR_KEY_CODE = [0, 32];
    const ENTER_KEY_CODE = 13;
    const DOWN_ARROW_KEY_CODE = 40;
    const UP_ARROW_KEY_CODE = 38;
    const ESCAPE_KEY_CODE = 27;

    // get highlighted element + index and selected element
    const selectAllOptions = Array.from(
      this.shadowRoot?.querySelectorAll('.select-all') || []
    ) as any[];
    const filteredOptions = this.options.filter(
      (option: any) => option.style.display !== 'none'
    );
    const visibleOptions = [...selectAllOptions, ...filteredOptions] as any[];
    // visibleOptions.forEach((e) => (e.tabIndex = 0));

    const highlightedEl = visibleOptions.find(
      (option: any) => option.highlighted
    );
    const selectedEl = visibleOptions.find((option: any) => option.selected);
    let highlightedIndex = highlightedEl
      ? visibleOptions.indexOf(highlightedEl)
      : selectedEl
      ? visibleOptions.indexOf(selectedEl)
      : 0;

    // prevent page scroll on spacebar press
    if (SPACEBAR_KEY_CODE.includes(keyCode)) {
      e.preventDefault();
    }

    const isListboxElOpened = this.open;
    // open the listbox
    if (target === 'button' || target === 'addOption') {
      let openDropdown =
        SPACEBAR_KEY_CODE.includes(keyCode) ||
        keyCode === ENTER_KEY_CODE ||
        keyCode == DOWN_ARROW_KEY_CODE ||
        keyCode == UP_ARROW_KEY_CODE;

      if (e.target === this.clearMultipleEl && keyCode === ENTER_KEY_CODE) {
        openDropdown = false;
        visibleOptions[highlightedIndex].highlighted = false;
        visibleOptions[highlightedIndex].selected =
          !visibleOptions[highlightedIndex].selected;
        highlightedIndex = 0;
        if (keyCode !== ENTER_KEY_CODE) return;
      }

      if (openDropdown) {
        this.open = true;

        if (
          this.allowAddOption &&
          target === 'button' &&
          keyCode === ENTER_KEY_CODE
        ) {
          setTimeout(() => {
            this.addOptionInputEl?.focus();
          }, 100);
        } else {
          // scroll to highlighted option
          if (!this.multiple && this.value !== '') {
            visibleOptions[highlightedIndex].scrollIntoView({
              block: 'nearest',
            });
          }
        }
      }
    }
    switch (keyCode) {
      case 0:
      case 32:
      case ENTER_KEY_CODE: {
        // select highlighted option
        visibleOptions[highlightedIndex].highlighted = true;
        if (isListboxElOpened) {
          if (this.multiple) {
            visibleOptions[highlightedIndex].selected =
              !visibleOptions[highlightedIndex].selected;
            this._handleClick({
              detail: {
                value: visibleOptions[highlightedIndex].value,
                selected: visibleOptions[highlightedIndex].selected,
              },
            });
          } else {
            visibleOptions.forEach((e) => (e.selected = false));
            visibleOptions[highlightedIndex].selected = true;
            this.updateValue(visibleOptions[highlightedIndex].value, true);
            this.emitValue();

            this.open = false;
            this.assistiveText = `Selected ${visibleOptions[highlightedIndex].value}`;
          }
        }
        return;
      }
      case DOWN_ARROW_KEY_CODE: {
        // go to next option
        let nextIndex =
          !highlightedEl && !selectedEl
            ? 0
            : highlightedIndex === visibleOptions.length - 1
            ? 0
            : highlightedIndex + 1;

        // skip disabled options
        if (visibleOptions[nextIndex].disabled) {
          nextIndex =
            nextIndex === visibleOptions.length - 1 ? 0 : nextIndex + 1;
        }

        visibleOptions[nextIndex].focus();
        visibleOptions[highlightedIndex].highlighted = false;
        visibleOptions[nextIndex].highlighted = true;

        // scroll to option
        visibleOptions[nextIndex].scrollIntoView({ block: 'nearest' });

        this.assistiveText = visibleOptions[nextIndex].text;
        return;
      }
      case UP_ARROW_KEY_CODE: {
        // go to previous option
        let nextIndex =
          highlightedIndex === 0
            ? visibleOptions.length - 1
            : highlightedIndex - 1;

        // skip disabled options
        if (visibleOptions[nextIndex].disabled) {
          nextIndex =
            nextIndex === 0 ? visibleOptions.length - 1 : nextIndex - 1;
        }

        visibleOptions[nextIndex].focus();
        visibleOptions[highlightedIndex].highlighted = false;
        visibleOptions[nextIndex].highlighted = true;

        // scroll to option
        visibleOptions[nextIndex].scrollIntoView({ block: 'nearest' });

        this.assistiveText = visibleOptions[nextIndex].text;
        return;
      }
      case ESCAPE_KEY_CODE: {
        // close listbox
        this.open = false;

        // restore focus
        if (this.searchable) {
          this.searchEl.focus();
        } else {
          this.buttonEl.focus();
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
    e.stopPropagation();

    // clear values
    if (this.multiple) {
      const Slot: any = this.shadowRoot?.querySelector('slot#children');
      const Options: Array<any> = Slot.assignedElements();
      const DisabledSelectedOptions: Array<any> = Options.filter(
        (option: any) => option.selected && option.disabled
      ).map((option: any) => option.value);

      this.value = DisabledSelectedOptions.length
        ? DisabledSelectedOptions
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
    // remove value
    this.updateValue(tag.value, false);
    this._updateSelectedOptions();
    this.emitValue();
  }

  private handleClear(e: any) {
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

  private handleSearchClick(e: any) {
    e.stopPropagation();
    this.open = true;
  }

  private handleSearchKeydown(e: any) {
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
    this.options.forEach((option: any) => {
      if (this.multiple) {
        option.selected = this.value.includes(option.value);
      } else {
        option.selected = this.value === option.value;
      }
    });
  }

  private _handleClick(e: any) {
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
          .map((option) => {
            return option.value;
          });
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

    if (this.multiple) {
      this.open = false;
    }

    // emit selected value
    this.emitValue();
  }

  private _handleBlur(e: any) {
    const relatedTarget = e.detail.origEvent.relatedTarget;

    if (
      !relatedTarget ||
      (relatedTarget?.localName !== 'kyn-dropdown-option' &&
        relatedTarget?.localName !== 'kyn-enhanced-dropdown-option' &&
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

    // preserve FormMixin connectedCallback function
    this._onConnected();

    document.addEventListener('click', (e) => this._handleClickOut(e));

    // capture child options click event
    this.addEventListener('on-click', (e: any) => this._handleClick(e));
    this.addEventListener('on-remove-option', () => this._handleRemoveOption());

    // capture child options blur event
    this.addEventListener('on-blur', (e: any) => this._handleBlur(e));
  }

  override disconnectedCallback() {
    // preserve FormMixin disconnectedCallback function
    this._onDisconnected();

    document.removeEventListener('click', (e) => this._handleClickOut(e));
    this.removeEventListener('on-click', (e: any) => this._handleClick(e));
    this.removeEventListener('on-remove-option', () =>
      this._handleRemoveOption()
    );
    this.removeEventListener('on-blur', (e: any) => this._handleBlur(e));

    super.disconnectedCallback();
  }

  private updateValue(value: string, selected = false) {
    // set value
    if (this.multiple) {
      const values =
        this.value === '' ? [] : JSON.parse(JSON.stringify(this.value));

      // update array
      if (selected) {
        values.push(value);
      } else {
        const index = values.indexOf(value);
        values.splice(index, 1);
      }

      this.value = values;
    } else {
      this.value = value;
    }

    this._validate(true, false);

    // reset focus
    if (!this.multiple) {
      if (this.searchable) {
        this.searchEl.focus();
      } else {
        this.buttonEl.focus();
      }
    }
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // set validity flags
    const Validity = {
      customError: this.invalidText !== '',
      valueMissing:
        this.required &&
        (!this.value ||
          (this.multiple && !this.value.length) ||
          (!this.multiple && this.value === '')),
    };

    // set validationMessage
    const InternalMsg =
      this.required && !this.value.length ? 'Please fill out this field.' : '';
    const ValidationMessage =
      this.invalidText !== '' ? this.invalidText : InternalMsg;

    const validationAnchor = this.buttonEl || this.listboxEl;

    if (validationAnchor) {
      this._internals.setValidity(
        Validity,
        ValidationMessage,
        validationAnchor
      );
    } else {
      this._internals.setValidity(Validity, ValidationMessage);
    }

    if (interacted) {
      this._internalValidationMsg = InternalMsg;
    }

    if (report) {
      this._internals.reportValidity();
    }
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

    if (changedProps.has('kind')) {
      this.dispatchEvent(
        new CustomEvent('kind-changed', {
          detail: this.kind,
          bubbles: true,
          composed: true,
        })
      );

      this.classList.toggle('ai-connected-true', this.kind === 'ai');
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

      const childrenSlot = root.querySelector<HTMLSlotElement>('slot#children');
      const options = childrenSlot
        ? childrenSlot
            .assignedElements()
            .filter((o): o is HTMLElement => !o.hasAttribute('disabled'))
        : [];
      const selected = options.filter((o) => o.hasAttribute('selected'));

      this.selectAllChecked = selected.length === options.length;
      this.selectAllIndeterminate =
        selected.length > 0 && selected.length < options.length;

      this._updateTags();
      this._updateSelectedText();
    }

    if (changedProps.has('open') || changedProps.has('openDirection')) {
      if (this.open && !this.searchable && this.listboxEl) {
        this.listboxEl.focus({ preventScroll: true });
        this.assistiveText =
          'Selecting items. Use up and down arrow keys to navigate.';
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

    if (changedProps.has('allowAddOption')) {
      this.updateChildOptions();
    }
  }

  // add selected options to Tags array
  private _updateTags() {
    if (this.multiple) {
      const Options: any = Array.from(
        this.querySelectorAll(
          'kyn-dropdown-option, kyn-enhanced-dropdown-option'
        )
      );
      const Tags: Array<object> = [];

      if (Options) {
        Options.forEach((option: any) => {
          if (option.selected) {
            let text = option.textContent;

            if (option.tagName === 'KYN-ENHANCED-DROPDOWN-OPTION') {
              const titleSlot = option.querySelector('[slot="title"]');
              if (titleSlot && titleSlot.textContent.trim()) {
                text = titleSlot.textContent.trim();
              } else {
                text = option.displayText || option.value;
              }
            } else {
              text = option.textContent.trim();
            }

            Tags.push({
              value: option.value,
              text: text,
              disabled: option.disabled,
            });
          }
        });

        this._tags = Tags;
      }
    }
  }

  private _updateOptions() {
    const Options: any = Array.from(
      this.querySelectorAll('kyn-dropdown-option, kyn-enhanced-dropdown-option')
    );

    Options.forEach((option: any) => {
      // set option multiple state
      option.multiple = this.multiple;

      if (this.multiple) {
        const Selected = this.value.includes(option.value);
        // set option selected state
        option.selected = Selected;
      } else {
        option.selected = this.value === option.value;
      }
    });
  }

  private _handleInputNewOption(e: Event) {
    const target = e.target as HTMLInputElement;
    this.newOptionValue = target.value;
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
