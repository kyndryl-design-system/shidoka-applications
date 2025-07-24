import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import DropdownScss from './dropdown.scss?inline';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';

import './dropdownOption';
import './enhancedDropdownOption';
import './dropdownAnchor';
import '../tag';
import '../button';

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
 * Dropdown, single-/multi-select.
 * @fires on-change - Captures the input event and emits the selected value and original event details. `detail:{ value: array }`
 * @fires on-search - Capture the search input event and emits the search text.`detail:{ searchText: string }`
 * @fires on-clear-all - Captures the the multi-select clear all button click event and emits the value. `detail:{ value: string }`
 * @fires on-add-option - Captures the add button click and emits the newly added option. `detail:{ value: string }`
 * @slot unnamed - Slot for dropdown options.
 * @slot tooltip - Slot for tooltip.
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
  @property({ type: Boolean })
  accessor open = false;

  /** Makes the dropdown searchable. */
  @property({ type: Boolean })
  accessor searchable = false;

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

  /** Enables enhanced mode with rich content support. */
  @property({ type: Boolean })
  accessor enhanced = false;

  /** Dropdown anchor type. */
  @property({ type: String })
  accessor dropdownAnchor: 'input' | 'button' = 'input';

  /** Button text when dropdownAnchor is 'button'. */
  @property({ type: String })
  accessor buttonText = '';

  /** Controls whether checkboxes are visible in multi-select mode for Enhanced Dropdown only. */
  @property({ type: Boolean })
  accessor checkboxVisible = false;

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
   * Queries any slotted options.
   * @ignore
   */
  @queryAssignedElements({
    selector: 'kyn-dropdown-option, kyn-enhanced-dropdown-option',
  })
  accessor options!: Array<any>;

  /**
   * Queries any slotted selected options.
   * @ignore
   */
  @queryAssignedElements({
    selector:
      'kyn-dropdown-option[selected], kyn-enhanced-dropdown-option[selected]',
  })
  accessor selectedOptions!: Array<any>;

  /**
   * Queries the dropdown anchor component.
   * @ignore
   */
  @query('kyn-dropdown-anchor')
  accessor dropdownAnchorEl!: any;

  /**
   * Queries the .options DOM element.
   * @ignore
   */
  @query('.options')
  accessor listboxEl!: HTMLElement;

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
    return html`
      <div
        class="dropdown"
        ?disabled=${this.disabled}
        ?open=${this.open}
        ?inline=${this.inline}
        ?searchable=${this.searchable}
      >
        <label
          id="label-${this.name}"
          class="label-text ${this.hideLabel || this.inline ? 'sr-only' : ''}"
          for=${this.name}
          aria-disabled=${this.disabled}
          @click=${() => this._handleLabelClick()}
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
          <div class="custom">
            <kyn-dropdown-anchor
              class="dropdown-anchor"
              .anchorType=${this.dropdownAnchor}
              .size=${this.size}
              .inline=${this.inline}
              .placeholder=${this.placeholder}
              .open=${this.open}
              .searchable=${this.searchable}
              .multiple=${this.multiple}
              .disabled=${this.disabled}
              .name=${this.name}
              .searchText=${this.searchText}
              .text=${this.text}
              .value=${this.value}
              .required=${this.required}
              .invalid=${this._isInvalid}
              .title=${this._textStrings.title}
              .clearText=${this._textStrings.clear}
              .buttonText=${this.buttonText}
              @anchor-click=${() => this.handleClick()}
              @anchor-keydown=${(e: any) => this.handleButtonKeydown(e)}
              @search-input=${(e: any) => this.handleSearchInput(e)}
              @search-keydown=${(e: any) => this.handleSearchKeydown(e)}
              @search-click=${(e: any) => this.handleSearchClick(e)}
              @clear-multiple=${(e: any) => this.handleClearMultiple(e)}
            ></kyn-dropdown-anchor>

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
        this.dropdownAnchorEl?._handleFocus();
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
    // Get all slotted dropdown option elements
    const slot = this.shadowRoot?.querySelector('#children') as HTMLSlotElement;
    const options = slot.assignedElements({ flatten: true }) as HTMLElement[];

    // Pass allowAddOption to each dropdown option
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

      // focus the dropdown anchor
      if (this.dropdownAnchorEl) {
        this.dropdownAnchorEl.onFocus();
      }
    }
  }

  private _handleLabelClick() {
    if (!this.disabled) {
      this.open = !this.open;

      // focus the dropdown anchor
      if (this.dropdownAnchorEl) {
        this.dropdownAnchorEl.onFocus();
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
    this.options.forEach((o) => (o.highlighted = false));
    const target = e.relatedTarget as HTMLElement | null;

    if (
      target &&
      (target.closest('kyn-dropdown-option') ||
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
    const visibleOptions = [
      ...Array.from(this.shadowRoot?.querySelectorAll('.select-all') || []),
      ...this.options.filter((option: any) => option.style.display !== 'none'),
    ];
    // visibleOptions.forEach((e) => (e.tabIndex = 0));

    const highlightedEl = visibleOptions.find(
      (option: any) => option.highlighted
    );
    const selectedEl = visibleOptions.find((option: any) => option.selected);
    const highlightedIndex = highlightedEl
      ? visibleOptions.indexOf(highlightedEl)
      : visibleOptions.find((option: any) => option.selected)
      ? visibleOptions.indexOf(selectedEl)
      : 0;

    // prevent page scroll on spacebar press
    if (SPACEBAR_KEY_CODE.includes(keyCode)) {
      e.preventDefault();
    }

    const isListboxElOpened = this.open;
    // open the listbox
    if (target === 'button' || target === 'addOption') {
      const openDropdown =
        SPACEBAR_KEY_CODE.includes(keyCode) ||
        keyCode === ENTER_KEY_CODE ||
        keyCode == DOWN_ARROW_KEY_CODE ||
        keyCode == UP_ARROW_KEY_CODE;

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

        // restore focus to dropdown anchor
        this.dropdownAnchorEl?._handleFocus();

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
      this.dropdownAnchorEl?._handleFocus();
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
        const text = option.text;
        if (text.toLowerCase().includes(value.toLowerCase())) {
          option.style.display = 'block';
        } else {
          option.style.display = 'none';
        }
      });
    } else {
      // find matches
      const options = this.options.filter((option: any) => {
        const text = option.text;
        return text.toLowerCase().startsWith(value.toLowerCase());
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

      if (!this.multiple && e.detail.selected) {
        this.open = false;
      }
    }

    this._updateSelectedOptions();

    if (!this.multiple) {
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
      if (selected) {
        this.open = false;
      }
    }

    this._validate(true, false);

    // reset focus
    if (!this.multiple) {
      this.dropdownAnchorEl?._handleFocus();
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

    const validationAnchor = this.dropdownAnchorEl?.getValidationAnchor();

    if (validationAnchor instanceof HTMLElement) {
      this._internals.setValidity(
        Validity,
        ValidationMessage,
        validationAnchor
      );
    } else {
      this._internals.setValidity(Validity, ValidationMessage);
    }

    // set internal validation message if value was changed by user input
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

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    this._onUpdated(changedProps);

    if (changedProps.has('value')) {
      this._updateOptions();

      const Slot: any = this.shadowRoot?.querySelector('slot#children');
      const Options: Array<any> = Slot.assignedElements().filter(
        (option: any) => !option.disabled
      );
      const SelectedOptions: Array<any> = Options.filter(
        (option: any) => option.selected
      );

      // sync "Select All" checkbox state
      this.selectAllChecked = SelectedOptions.length === Options.length;

      // sync "Select All" indeterminate state
      this.selectAllIndeterminate =
        SelectedOptions.length < Options.length && SelectedOptions.length > 0;

      this._updateTags();
      this._updateSelectedText();
    }

    if (changedProps.has('open') || changedProps.has('openDirection')) {
      if (this.open && !this.searchable) {
        // focus listbox if not searchable
        this.listboxEl.focus({ preventScroll: true });
        this.assistiveText =
          'Selecting items. Use up and down arrow keys to navigate.';
      }

      if (this.openDirection === 'up') {
        this._openUpwards = true;
      } else if (this.openDirection === 'down') {
        this._openUpwards = false;
      } else if (this.open) {
        const openThreshold = 0.6;
        const anchorElement = this.dropdownAnchorEl?.getValidationAnchor();
        if (anchorElement) {
          this._openUpwards =
            anchorElement.getBoundingClientRect().top >
            window.innerHeight * openThreshold;
        }
      }

      if (this.open && !this.multiple) {
        this.options
          .find((option) => option.selected)
          ?.scrollIntoView({ block: 'nearest' });
      }
    }

    if (changedProps.has('multiple')) {
      // set multiple for each option
      this.options.forEach((option: any) => {
        option.multiple = this.multiple;
      });
    }

    if (changedProps.has('allowAddOption')) {
      this.updateChildOptions();
    }

    if (changedProps.has('checkboxVisible')) {
      const enhancedOptions = Array.from(
        this.querySelectorAll('kyn-enhanced-dropdown-option')
      );
      enhancedOptions.forEach((option: any) => {
        option.checkboxVisible = this.checkboxVisible;

        option.requestUpdate();
      });
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
            let tagText = '';

            if (option.tagName === 'KYN-ENHANCED-DROPDOWN-OPTION') {
              tagText = option.text || '';

              if (!tagText) {
                const titleSlot = option.querySelector('[slot="title"]');
                if (titleSlot) {
                  tagText = titleSlot.textContent?.trim() || '';
                } else {
                  const textNodes = Array.from(option.childNodes).filter(
                    (node: any) =>
                      node.nodeType === Node.TEXT_NODE ||
                      (node.nodeType === Node.ELEMENT_NODE &&
                        !node.hasAttribute('slot'))
                  );
                  tagText = textNodes
                    .map((node: any) => node.textContent?.trim() || '')
                    .join('')
                    .trim();
                }
              }
            } else {
              tagText = option.textContent?.trim() || '';
            }

            Tags.push({
              value: option.value,
              text: tagText,
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
      this.dropdownAnchorEl?._handleFocus();
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
          this.text = option.text || option.textContent.trim();
        } else {
          this.text = '';
          console.warn(`No dropdown option found with value: ${this.value}`);
        }
      }

      // Note: search input value is now handled by dropdownAnchor
      if (this.searchable && this.text) {
        this.searchText = this.text === this.placeholder ? '' : this.text;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown': Dropdown;
  }
}
