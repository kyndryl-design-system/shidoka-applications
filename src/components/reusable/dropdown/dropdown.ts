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
import './dropdownOption';
import '../tag';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import downIcon from '@carbon/icons/es/chevron--down/24';
import errorIcon from '@carbon/icons/es/warning--filled/24';
import clearIcon from '@carbon/icons/es/close/24';
import clearIcon16 from '@carbon/icons/es/close/16';

/**
 * Dropdown, single select.
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @fires on-search - Capture the search input event and emits the search text.
 * @fires on-clear-all - Captures the the multi-select clear all button click event and emits the value.
 * @slot unnamed - Slot for dropdown options.
 * @slot label - Slot for input label.
 */
@customElement('kyn-dropdown')
export class Dropdown extends LitElement {
  static override styles = DropdownScss;

  /** @ignore */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /**
   * Attached internals for form association.
   * @ignore
   */
  @state()
  internals = this.attachInternals();

  /** Update by value instead of deriving value from child selections. */
  @property({ type: Boolean })
  updateByValue = false;

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

  /** Dropdown name. */
  @property({ type: String })
  name = '';

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

  /** Dropdown disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Dropdown invalid text. */
  @property({ type: String })
  invalidText = '';

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

  /**
   * Dropdown value(s).
   */
  @property({ type: String })
  value: any = '';

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
   * Internal validation message.
   * @ignore
   */
  @state()
  internalValidationMsg = '';

  /**
   * isInvalid when internalValidationMsg or invalidText is non-empty.
   * @ignore
   */
  @state()
  isInvalid = false;

  /**
   * Open drawer upwards.
   * @ignore
   */
  @state()
  _openUpwards = false;

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
          for=${this.name}
          id="label-${this.name}"
          class="label-text"
          @click=${this._handleLabelClick}
        >
          ${this.required ? html`<span class="required">*</span>` : null}
          <slot name="label"></slot>
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
              ?required=${this.required}
              ?disabled=${this.disabled}
              ?invalid=${this.isInvalid}
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
                      aria-label="Clear selections"
                      ?disabled=${this.disabled}
                      @click=${(e: Event) => this.handleClearMultiple(e)}
                    >
                      ${this.value.length}
                      <kd-icon .icon=${clearIcon16}></kd-icon>
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
                      @keydown=${(e: any) => this.handleSearchKeydown(e)}
                      @input=${(e: any) => this.handleSearchInput(e)}
                      @blur=${(e: any) => this.handleSearchBlur(e)}
                      @click=${(e: any) => this.handleSearchClick(e)}
                    />
                  `
                : html`
                    <span>
                      ${this.multiple
                        ? this.placeholder
                        : this.value === ''
                        ? this.placeholder
                        : this.text}
                    </span>
                  `}

              <kd-icon class="arrow-icon" .icon=${downIcon}></kd-icon>
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
            </ul>
          </div>

          ${this.searchable && this.searchEl && this.searchText !== ''
            ? html`
                <button
                  class="clear"
                  aria-label="Clear search text"
                  @click=${(e: any) => this.handleClear(e)}
                >
                  <kd-icon .icon=${clearIcon}></kd-icon>
                </button>
              `
            : null}
          <!--
          ${this.isInvalid
            ? html` <kd-icon class="error-icon" .icon=${errorIcon}></kd-icon> `
            : null}
            -->
        </div>

        ${this.multiple && !this.hideTags && this.value.length
          ? html`
              <kyn-tag-group filter>
                ${this.value.map((value: string) => {
                  const Options: any = Array.from(
                    this.querySelectorAll('kyn-dropdown-option')
                  );

                  const option = Options.find(
                    (option: any) => option.value === value
                  );
                  const text = option.textContent;

                  return html`
                    <kyn-tag
                      label=${text}
                      ?disabled=${this.disabled}
                      @on-close=${() => this.handleTagClear(value)}
                    ></kyn-tag>
                  `;
                })}
              </kyn-tag-group>
            `
          : null}
        ${this.caption !== ''
          ? html` <div class="caption">${this.caption}</div> `
          : null}
        ${this.isInvalid
          ? html`
              <div class="error">
                ${this.invalidText || this.internalValidationMsg}
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
    this.resetSelection();
  }

  /**
   * Retrieves the selected values from the list of child options and sets value property.
   * @function
   */
  public resetSelection() {
    if (this.updateByValue) {
      this._updateOptions();
    } else {
      this._updateChildren();
      this.emitValue();
    }
  }

  private handleClick() {
    if (!this.disabled) {
      this.open = !this.open;

      // focus search input if searchable
      if (this.searchable) {
        this.searchEl.focus();
      }
    }
  }

  private _handleLabelClick() {
    if (!this.disabled) {
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
    const highlightedIndex = highlightedEl
      ? visibleOptions.indexOf(highlightedEl)
      : visibleOptions.find((option: any) => option.selected)
      ? visibleOptions.indexOf(selectedEl)
      : 0;

    // prevent page scroll on spacebar press
    if (SPACEBAR_KEY_CODE.includes(keyCode)) {
      e.preventDefault();
    }

    // open the listbox
    if (target === 'button') {
      const openDropdown =
        SPACEBAR_KEY_CODE.includes(keyCode) ||
        keyCode === ENTER_KEY_CODE ||
        keyCode == DOWN_ARROW_KEY_CODE ||
        keyCode == UP_ARROW_KEY_CODE;

      if (openDropdown) {
        this.open = true;
        visibleOptions[highlightedIndex].highlighted = true;

        // scroll to highlighted option
        if (!this.multiple && this.value !== '') {
          visibleOptions[highlightedIndex].scrollIntoView({ block: 'nearest' });
        }
      }
    }

    switch (keyCode) {
      case ENTER_KEY_CODE: {
        // select highlighted option
        this.updateValue(
          visibleOptions[highlightedIndex].value,
          !visibleOptions[highlightedIndex].selected
        );
        this.assistiveText = 'Selected an item.';
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
  }

  private handleSearchKeydown(e: any) {
    e.stopPropagation();

    const ENTER_KEY_CODE = 13;
    const ESCAPE_KEY_CODE = 27;
    const option = this.options.find((option) => option.highlighted);

    // select option
    if (e.keyCode === ENTER_KEY_CODE && option) {
      this.updateValue(option.value, option.selected);
      this.assistiveText = 'Selected an item.';
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

  private _handleFormdata(e: any) {
    if (this.multiple) {
      this.value.forEach((value: string) => {
        e.formData.append(this.name, value);
      });
    } else {
      e.formData.append(this.name, this.value);
    }
  }

  private _handleInvalid() {
    this._validate(true, false);
  }

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this._handleClickOut(e));

    // capture child options click event
    this.addEventListener('on-click', (e: any) => this._handleClick(e));

    // capture child options blur event
    this.addEventListener('on-blur', (e: any) => this._handleBlur(e));

    if (this.internals.form) {
      this.internals.form.addEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );

      this.addEventListener('invalid', () => {
        this._handleInvalid();
      });
    }
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this._handleClickOut(e));
    this.addEventListener('on-click', (e: any) => this._handleClick(e));
    this.addEventListener('on-blur', (e: any) => this._handleBlur(e));

    if (this.internals.form) {
      this.internals.form.removeEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );

      this.removeEventListener('invalid', () => {
        this._handleInvalid();
      });
    }

    super.disconnectedCallback();
  }

  private updateValue(value: string, selected = false) {
    const values = JSON.parse(JSON.stringify(this.value));

    // set value
    if (this.multiple) {
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
    this.internals.setValidity(Validity, ValidationMessage, this.buttonEl);

    // set internal validation message if value was changed by user input
    if (interacted) {
      this.internalValidationMsg = InternalMsg;
    }

    // focus the buttonEl to show validity
    if (report) {
      this.internals.reportValidity();
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

  override updated(changedProps: any) {
    if (
      changedProps.has('invalidText') ||
      changedProps.has('internalValidationMsg')
    ) {
      //check if any (internal / external )error msg. present then isInvalid is true
      this.isInvalid =
        this.invalidText !== '' || this.internalValidationMsg !== ''
          ? true
          : false;
    }

    if (
      changedProps.has('invalidText') &&
      changedProps.get('invalidText') !== undefined
    ) {
      this._validate(false, false);
    }

    if (changedProps.has('value')) {
      this._validate(false, false);

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

      // set form data value
      // if (this.multiple) {
      //   const entries = new FormData();
      //   this.value.forEach((value: string) => {
      //     entries.append(this.name, value);
      //   });
      //   this.internals.setFormValue(entries);
      // } else {
      //   this.internals.setFormValue(this.value);
      // }

      if (this.updateByValue) {
        this._updateOptions();
      }

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

  private _updateOptions() {
    this.options.forEach((option) => {
      if (this.multiple) {
        option.selected = this.value.includes(option.value);
      } else {
        option.selected = this.value === option.value;
      }
    });
  }

  private _updateChildren() {
    const Slot: any = this.shadowRoot?.querySelector('slot#children');
    const Options = Slot?.assignedElements();

    // get value from selected options
    if (Options) {
      const values: any = [];
      let value = '';
      Options.forEach((option: any) => {
        option.multiple = this.multiple;

        if (option.selected) {
          if (this.multiple) {
            values.push(option.value);
          } else {
            value = option.value;
          }
        }
      });

      // set initial values
      if (this.multiple) {
        this.value = values;
      } else {
        this.value = value;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown': Dropdown;
  }
}
