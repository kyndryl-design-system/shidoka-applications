import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import DropdownScss from './dropdown.scss';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';

import './dropdownOption';
import '../tag';
import '../button';

import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-simple.svg';

const _defaultTextStrings = {
  title: 'Dropdown',
  selectedOptions: 'List of selected options',
  requiredText: 'Required',
  errorText: 'Error',
  clearAll: 'Clear all',
};

/**
 * Dropdown, single select.
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @fires on-search - Capture the search input event and emits the search text.
 * @fires on-clear-all - Captures the the multi-select clear all button click event and emits the value.
 * @slot unnamed - Slot for dropdown options.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-dropdown')
export class Dropdown extends FormMixin(LitElement) {
  static override styles = DropdownScss;

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Dropdown size/height. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Dropdown inline style type. */
  @property({ type: Boolean })
  inline = false;

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Dropdown placeholder. */
  @property({ type: String })
  placeholder = '';

  /** Listbox/drawer open state. */
  @property({ type: Boolean })
  open = false;

  /** Makes the dropdown searchable. */
  @property({ type: Boolean })
  searchable = false;

  /** Searchable variant filters results. */
  @property({ type: Boolean })
  filterSearch = false;

  /** Enabled multi-select functionality. */
  @property({ type: Boolean })
  multiple = false;

  /** Makes the dropdown required. */
  @property({ type: Boolean })
  required = false;

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

  /** Dropdown disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Input read only state. */
  @property({ type: Boolean })
  readonly = false;

  /** Hide the tags below multi-select. */
  @property({ type: Boolean })
  hideTags = false;

  /** Adds a "Select all" option to the top of a multi-select dropdown. */
  @property({ type: Boolean })
  selectAll = false;

  /** "Select all" text customization. */
  @property({ type: String })
  selectAllText = 'Select all';

  /** Menu CSS min-width value. */
  @property({ type: String })
  menuMinWidth = 'initial';

  /** Is "Select All" box checked.
   * @internal
   */
  @property({ type: Boolean })
  selectAllChecked = false;

  /** Is "Select All" indeterminate.
   * @internal
   */
  @property({ type: Boolean })
  selectAllIndeterminate = false;

  /** Text string customization. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /**
   * Selected option text, automatically derived.
   * @ignore
   */
  @state()
  text = '';

  /**
   * Search input value.
   */
  @property({ type: String })
  searchText = '';

  /**
   * Assistive text for screen readers.
   * @ignore
   */
  @state()
  assistiveText = 'Dropdown menu options.';

  /**
   * Queries any slotted options.
   * @ignore
   */
  @queryAssignedElements({ selector: 'kyn-dropdown-option' })
  options!: Array<any>;

  /**
   * Queries any slotted selected options.
   * @ignore
   */
  @queryAssignedElements({ selector: 'kyn-dropdown-option[selected]' })
  selectedOptions!: Array<any>;

  /**
   * Queries the .search DOM element.
   * @ignore
   */
  @query('.search')
  searchEl!: HTMLInputElement;

  /**
   * Queries the .select DOM element.
   * @ignore
   */
  @query('.select')
  buttonEl!: HTMLElement;

  /**
   * Queries the .options DOM element.
   * @ignore
   */
  @query('.options')
  listboxEl!: HTMLElement;

  /**
   * Queries the .clear-multiple DOM element.
   * @ignore
   */
  @query('.clear-multiple')
  clearMultipleEl!: HTMLElement;

  /**
   * Open drawer upwards.
   * @ignore
   */
  @state()
  _openUpwards = false;

  /**
   * Tags value/text reference.
   * @ignore
   */
  @state()
  _tags: Array<object> = [];

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
        ?disabled=${this.disabled || this.readonly}
        ?readonly=${this.readonly}
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
              ?disabled=${this.disabled || this.readonly}
              ?readonly=${this.readonly}
              ?invalid=${this._isInvalid}
              tabindex=${this.disabled ? '' : '0'}
              @click=${() => this.handleClick()}
              @keydown=${(e: any) => this.handleButtonKeydown(e)}
              @mousedown=${(e: any) => {
                if (!this.searchable) {
                  e.preventDefault();
                }
              }}
              @blur=${(e: any) => this.handleButtonBlur(e)}
            >
              ${this.multiple && this.value.length
                ? html`
                    <button
                      class="clear-multiple"
                      aria-label="${this.value
                        .length} items selected. Clear selections"
                      ?disabled=${this.disabled || this.readonly}
                      ?readonly=${this.readonly}
                      @click=${(e: Event) => this.handleClearMultiple(e)}
                    >
                      ${this.value.length}
                      <span style="display:flex;" slot="icon"
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
                      ?disabled=${this.disabled || this.readonly}
                      ?readonly=${this.readonly}
                      aria-disabled=${this.disabled}
                      @keydown=${(e: any) => this.handleSearchKeydown(e)}
                      @input=${(e: any) => this.handleSearchInput(e)}
                      @blur=${(e: any) => this.handleSearchBlur(e)}
                      @click=${(e: any) => this.handleSearchClick(e)}
                    />
                  `
                : html`
                    <span aria-disabled=${this.disabled}>
                      ${this.multiple
                        ? this.placeholder
                        : this.value === ''
                        ? this.placeholder
                        : this.text}
                    </span>
                  `}

              <span class="arrow-icon">${unsafeSVG(downIcon)}</span>
            </div>

            <ul
              id="options"
              class=${classMap({
                options: true,
                open: this.open,
                upwards: this._openUpwards,
              })}
              style="min-width: ${this.menuMinWidth};"
              aria-labelledby="label-${this.name}"
              name=${this.name}
              role="listbox"
              tabindex="0"
              aria-expanded=${this.open}
              aria-hidden=${!this.open}
              @keydown=${(e: any) => this.handleListKeydown(e)}
              @blur=${(e: any) => this.handleListBlur(e)}
            >
              ${this.multiple && this.selectAll
                ? html`
                    <kyn-dropdown-option
                      class="select-all"
                      value="selectAll"
                      multiple
                      ?selected=${this.selectAllChecked}
                      ?indeterminate=${this.selectAllIndeterminate}
                      ?disabled=${this.disabled || this.readonly}
                      ?readonly=${this.readonly}
                    >
                      ${this.selectAllText}
                    </kyn-dropdown-option>
                  `
                : null}

              <slot
                id="children"
                @slotchange=${() => this.handleSlotChange()}
              ></slot>
            </ul>
          </div>
          ${this.searchText !== ''
            ? html`
                <kyn-button
                  ?disabled=${this.disabled || this.readonly}
                  ?readonly=${this.readonly}
                  class="clear-button dropdown-clear"
                  ghost
                  kind="tertiary"
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
                        ?disabled=${this.disabled || this.readonly}
                        ?readonly=${this.readonly}
                        clearTagText="Clear Tag ${tag.text}"
                        @on-close=${() => this.handleTagClear(tag.value)}
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
    this._updateOptions();
  }

  private handleClick() {
    if (!this.disabled && !this.readonly) {
      this.open = !this.open;

      // focus search input if searchable
      if (this.searchable) {
        this.searchEl.focus();
      } else {
        this.buttonEl.focus();
      }
    }
  }

  private _handleLabelClick() {
    if (!this.disabled && !this.readonly) {
      this.open = !this.open;

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

  private handleListBlur(e: any) {
    this.options.forEach((option) => (option.highlighted = false));

    // don't blur if clicking an option inside
    if (
      e.relatedTarget &&
      e.relatedTarget.localName !== 'kyn-dropdown-option'
    ) {
      this.open = false;
    }
    this.assistiveText = 'Dropdown menu options.';
  }

  private handleKeyboard(e: any, keyCode: number, target: string) {
    const SPACEBAR_KEY_CODE = [0, 32];
    const ENTER_KEY_CODE = 13;
    const DOWN_ARROW_KEY_CODE = 40;
    const UP_ARROW_KEY_CODE = 38;
    const ESCAPE_KEY_CODE = 27;

    // get highlighted element + index and selected element
    const visibleOptions = this.options.filter(
      (option: any) => option.style.display !== 'none'
    );
    const highlightedEl = visibleOptions.find(
      (option: any) => option.highlighted
    );
    const selectedEl = visibleOptions.find((option: any) => option.selected);
    let highlightedIndex = highlightedEl
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
    if (target === 'button') {
      let openDropdown =
        SPACEBAR_KEY_CODE.includes(keyCode) ||
        keyCode === ENTER_KEY_CODE ||
        keyCode == DOWN_ARROW_KEY_CODE ||
        keyCode == UP_ARROW_KEY_CODE;

      if (e.target === this.clearMultipleEl) {
        openDropdown = false;
        visibleOptions[highlightedIndex].highlighted = false;
        visibleOptions[highlightedIndex].selected =
          !visibleOptions[highlightedIndex].selected;
        highlightedIndex = 0;
        if (keyCode !== ENTER_KEY_CODE) return;
      }

      if (openDropdown) {
        this.open = true;

        // scroll to highlighted option
        if (!this.multiple && this.value !== '') {
          visibleOptions[highlightedIndex].scrollIntoView({ block: 'nearest' });
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
            if (visibleOptions[highlightedIndex].selected) {
              this.assistiveText = `Selected ${visibleOptions[highlightedIndex].innerHTML}`;
            } else {
              this.assistiveText = `Deselected ${visibleOptions[highlightedIndex].innerHTML}`;
            }
          } else {
            visibleOptions.forEach((e) => (e.selected = false));
            visibleOptions[highlightedIndex].selected = true;
            this.open = false;
            this.assistiveText = `Selected ${visibleOptions[highlightedIndex].innerHTML}`;
          }
        }
        if (highlightedEl && isListboxElOpened)
          this.updateValue(
            visibleOptions[highlightedIndex].value,
            visibleOptions[highlightedIndex].selected
          );

        this.emitValue();
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
      this.value = [];
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

  private handleTagClear(value: string) {
    // remove value
    this.updateValue(value, false);
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

  private handleButtonBlur(e: any) {
    // don't blur if entering listbox or search input
    if (
      !e.relatedTarget?.classList.contains('options') &&
      !e.relatedTarget?.classList.contains('search')
    ) {
      this.open = false;
    }
    this._validate(true, false);
  }

  private handleSearchBlur(e: any) {
    // don't blur if entering listbox of button
    if (
      !e.relatedTarget ||
      (e.relatedTarget.localName !== 'kyn-dropdown-option' &&
        !e.relatedTarget?.classList.contains('options') &&
        !e.relatedTarget?.classList.contains('select'))
    ) {
      this.open = false;
    }
    this._validate(true, false);
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
      if (e.detail.selected) {
        this.value = this.options
          .filter((option) => !option.disabled)
          .map((option) => {
            return option.value;
          });
        this.assistiveText = 'Selected all items.';
      } else {
        this.value = [];
        this.assistiveText = 'Deselected all items.';
      }

      this._validate(true, false);
    } else {
      this.updateValue(e.detail.value, e.detail.selected);
      this.assistiveText = 'Selected an item.';
    }

    this._updateSelectedOptions();

    // close listbox
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
      (relatedTarget.localName !== 'kyn-dropdown-option' &&
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

    // capture child options blur event
    this.addEventListener('on-blur', (e: any) => this._handleBlur(e));
  }

  override disconnectedCallback() {
    // preserve FormMixin disconnectedCallback function
    this._onDisconnected();

    document.removeEventListener('click', (e) => this._handleClickOut(e));
    this.removeEventListener('on-click', (e: any) => this._handleClick(e));
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

    // set validity on custom element, anchor to buttonEl
    this._internals.setValidity(Validity, ValidationMessage, this.buttonEl);

    // set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = InternalMsg;
    }

    // focus the buttonEl to show validity
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

      this._updateOptions();
      this._updateTags();

      // update selected option text
      const AllOptions: any = Array.from(
        this.querySelectorAll('kyn-dropdown-option')
      );

      if (!this.multiple) {
        if (AllOptions.length && this.value !== '') {
          const option = AllOptions.find(
            (option: any) => option.value === this.value
          );

          this.text = option.textContent;
        }

        // set search input value
        if (this.searchable && this.text) {
          this.searchText = this.text === this.placeholder ? '' : this.text;
          this.searchEl.value = this.searchText;
        }
      }
    }

    if (changedProps.has('open')) {
      if (this.open && !this.searchable) {
        // focus listbox if not searchable
        this.listboxEl.focus({ preventScroll: true });
        this.assistiveText =
          'Selecting items. Use up and down arrow keys to navigate.';
      }

      if (this.open) {
        if (!this.multiple) {
          // scroll to selected option
          this.options
            .find((option) => option.selected)
            ?.scrollIntoView({ block: 'nearest' });
        }

        // open dropdown upwards if closer to bottom of viewport
        const Threshold = 0.6;

        if (
          this.buttonEl.getBoundingClientRect().top >
          window.innerHeight * Threshold
        ) {
          this._openUpwards = true;
        } else {
          this._openUpwards = false;
        }
      }
    }

    if (changedProps.has('multiple')) {
      // set multiple for each option
      this.options.forEach((option: any) => {
        option.multiple = this.multiple;
      });
    }

    if (changedProps.has('searchText') && this.searchEl) {
      this.searchEl.value = this.searchText;
    }
  }

  // add selected options to Tags array
  private _updateTags() {
    if (this.multiple) {
      const Options: any = Array.from(
        this.querySelectorAll('kyn-dropdown-option')
      );
      const Tags: Array<object> = [];

      if (Options) {
        Options.forEach((option: any) => {
          if (option.selected) {
            Tags.push({
              value: option.value,
              text: option.textContent,
            });
          }
        });

        this._tags = Tags;
      }
    }
  }

  private _updateOptions() {
    const Options: any = Array.from(
      this.querySelectorAll('kyn-dropdown-option')
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown': Dropdown;
  }
}
