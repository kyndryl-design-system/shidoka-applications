import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAll,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import DropdownScss from './dropdown.scss';
import '@kyndryl-design-system/foundation/components/icon';
import downIcon from '@carbon/icons/es/chevron--down/24';
import errorIcon from '@carbon/icons/es/warning--filled/24';
import clearIcon from '@carbon/icons/es/close/24';
import clearIcon16 from '@carbon/icons/es/close/16';

/**
 * Dropdown, single select.
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot unnamed - Slot for dropdown options.
 * @slot label - Slot for input label.
 */
@customElement('kyn-dropdown')
export class Dropdown extends LitElement {
  static override styles = DropdownScss;

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

  /**
   * Selected option value.
   * @ignore
   */
  @state()
  value: any = '';

  /**
   * Selected option text, automatically derived.
   * @ignore
   */
  @state()
  text = '';

  /**
   * Search input value.
   * @ignore
   */
  @state()
  searchText = '';

  /**
   * Evaluates if options are slotted.
   * @ignore
   */
  @state()
  isSlotted = false;

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
   * Queries any native options.
   * @ignore
   */
  @queryAll('option')
  nativeOptions!: Array<any>;

  /**
   * Queries any slotted selected options.
   * @ignore
   */
  @queryAssignedElements({ selector: 'kyn-dropdown-option[selected]' })
  selectedOptions!: Array<any>;

  /**
   * Queries the <select> DOM element.
   * @ignore
   */
  @query('select')
  selectEl!: HTMLSelectElement;

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

  override render() {
    return html`
      <div
        class="dropdown"
        ?disabled=${this.disabled}
        ?open=${this.open}
        ?inline=${this.inline}
        ?searchable=${this.searchable}
      >
        <label for=${this.name} id="label-${this.name}" class="label-text">
          ${this.required ? html`<span class="required">*</span>` : null}
          <slot name="label"></slot>
        </label>

        <div
          class=${classMap({
            wrapper: true,
            open: this.open,
          })}
        >
          <!-- native select -->
          <select
            class="${classMap({
              'size--sm': this.size === 'sm',
              'size--lg': this.size === 'lg',
              inline: this.inline,
            })}"
            name=${this.name}
            id=${this.name}
            ?multiple=${this.multiple}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this.invalidText !== ''}
            @change=${(e: any) => this.handleChange(e)}
          >
            ${this.placeholder
              ? html`<option value="">${this.placeholder}</option>`
              : null}
            ${repeat(
              this.options,
              (option) => option.value, // use value for unique id
              (option) => {
                const optionText = option.shadowRoot
                  ?.querySelector('slot')
                  ?.assignedNodes()[0].textContent;

                return html`
                  <option
                    value=${option.value}
                    ?selected=${option.selected}
                    ?disabled=${option.disabled}
                  >
                    ${optionText}
                  </option>
                `;
              }
            )}
          </select>

          <!-- custom dropdown -->
          <div class="custom">
            <div
              class="${classMap({
                select: true,
                'size--sm': this.size === 'sm',
                'size--lg': this.size === 'lg',
                inline: this.inline,
              })}"
              role="button"
              aria-labelledby="label-${this.name}"
              ?required=${this.required}
              ?disabled=${this.disabled}
              ?invalid=${this.invalidText !== ''}
              tabindex=${this.searchable ? '-1' : '0'}
              @click=${(e: any) => this.handleClick(e)}
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
                      placeholder="Search"
                      value=${this.text}
                      @keydown=${(e: any) => this.handleSearchKeydown(e)}
                      @input=${(e: any) => this.handleSearchInput(e)}
                      @blur=${(e: any) => this.handleSearchBlur(e)}
                      @click=${(e: any) => this.handleSearchClick(e)}
                    />
                  `
                : html`
                    ${this.multiple
                      ? this.placeholder
                      : this.value === ''
                      ? this.placeholder
                      : this.text}
                  `}

              <kd-icon class="arrow-icon" .icon=${downIcon}></kd-icon>
            </div>

            <ul
              class=${classMap({
                options: true,
                open: this.open,
              })}
              role="listbox"
              tabindex="0"
              aria-expanded="${this.open}"
              @keydown=${(e: any) => this.handleListKeydown(e)}
              @blur=${(e: any) => this.handleListBlur(e)}
            >
              <slot></slot>
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
          ${this.invalidText !== ''
            ? html` <kd-icon class="error-icon" .icon=${errorIcon}></kd-icon> `
            : null}
        </div>

        ${this.multiple && this.value.length
          ? html`
              <div class="tags">
                ${this.value.map((value: string) => {
                  const option = this.options.find(
                    (option) => option.value === value
                  );
                  const text = option.shadowRoot
                    ?.querySelector('slot')
                    ?.assignedNodes()[0]
                    .textContent.trim();

                  return html`
                    <button
                      class="tag"
                      aria-label="Deselect ${text}"
                      @click=${(e: any) => this.handleTagClear(e, option.value)}
                    >
                      ${text}
                      <kd-icon .icon=${clearIcon16}></kd-icon>
                    </button>
                  `;
                })}
              </div>
            `
          : null}
        ${this.caption !== ''
          ? html` <div class="caption">${this.caption}</div> `
          : null}
        ${this.invalidText !== ''
          ? html` <div class="error">${this.invalidText}</div> `
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
    this.determineIfSlotted();
    this.initialSelection();

    if (this.placeholder === '') {
      if (this.multiple) {
        this.placeholder = 'Select items';
      } else {
        this.placeholder = 'Select an option';
      }
    }
  }

  private determineIfSlotted() {
    this.isSlotted = this.options.length ? true : false;
  }

  private initialSelection() {
    // get value from selected options
    const values: any = [];
    let value = '';

    this.options.forEach((option: any) => {
      if (option.selected) {
        if (this.multiple) {
          values.push(option.value);
        } else {
          value = option.value;
        }
      }
    });

    if (this.multiple) {
      this.value = values;
    } else {
      this.value = value;
    }
  }

  private handleChange(e: any) {
    if (this.multiple) {
      const values: Array<string> = [];
      const selectedOptions = Array.from(this.nativeOptions).filter(
        (option) => option.selected
      );
      selectedOptions.forEach((option) => {
        if (option.selected) {
          values.push(option.value);
        }
      });
      this.value = values;
    } else {
      this.value = e.target.value;
    }

    this.assistiveText = 'Selected an item.';

    // emit selected value
    this.emitValue();
  }

  private handleClick(e: any) {
    if (!this.disabled) {
      this.open = !this.open;

      if (this.searchable) {
        this.searchEl.focus();
      }
    }
  }

  private handleButtonKeydown(e: any) {
    this.handleKeyboard(e.keyCode, 'button');
  }

  private handleListKeydown(e: any) {
    const TAB_KEY_CODE = 9;
    if (e.keyCode !== TAB_KEY_CODE) {
      e.preventDefault();
    }
    this.handleKeyboard(e.keyCode, 'list');
  }

  private handleListBlur(e: any) {
    this.options.forEach((option) => (option.highlighted = false));

    if (
      !e.relatedTarget ||
      (e.relatedTarget && e.relatedTarget.localName !== 'kyn-dropdown-option')
    ) {
      this.open = false;
    }
    this.assistiveText = 'Dropdown menu options.';
  }

  private handleKeyboard(keyCode: number, target: string) {
    const SPACEBAR_KEY_CODE = [0, 32];
    const ENTER_KEY_CODE = 13;
    const DOWN_ARROW_KEY_CODE = 40;
    const UP_ARROW_KEY_CODE = 38;
    const ESCAPE_KEY_CODE = 27;

    const highlightedEl = this.options.find(
      (option: any) => option.highlighted
    );
    const selectedEl = this.options.find((option: any) => option.selected);
    const highlightedIndex = highlightedEl
      ? this.options.indexOf(highlightedEl)
      : this.options.find((option: any) => option.selected)
      ? this.options.indexOf(selectedEl)
      : 0;

    if (target === 'button') {
      const openDropdown =
        SPACEBAR_KEY_CODE.includes(keyCode) ||
        keyCode === ENTER_KEY_CODE ||
        keyCode == DOWN_ARROW_KEY_CODE ||
        keyCode == UP_ARROW_KEY_CODE;

      if (openDropdown) {
        this.open = true;
        this.options[highlightedIndex].highlighted = true;

        if (!this.multiple && this.value !== '') {
          this.options[highlightedIndex].scrollIntoView({ block: 'nearest' });
        }
      }
    }

    switch (keyCode) {
      case ENTER_KEY_CODE: {
        if (target === 'list') {
          this.updateValue(
            this.options[highlightedIndex].value,
            !this.options[highlightedIndex].selected
          );
          this.assistiveText = 'Selected an item.';
        }
        return;
      }
      case DOWN_ARROW_KEY_CODE: {
        let nextIndex =
          !highlightedEl && !selectedEl
            ? 0
            : highlightedIndex === this.options.length - 1
            ? 0
            : highlightedIndex + 1;

        // skip disabled options
        if (this.options[nextIndex].disabled) {
          nextIndex = nextIndex === this.options.length - 1 ? 0 : nextIndex + 1;
        }

        this.options[highlightedIndex].highlighted = false;
        this.options[nextIndex].highlighted = true;

        this.options[nextIndex].scrollIntoView({ block: 'nearest' });

        this.assistiveText = this.options[nextIndex].shadowRoot
          ?.querySelector('slot')
          ?.assignedNodes()[0].textContent;
        return;
      }
      case UP_ARROW_KEY_CODE: {
        let nextIndex =
          highlightedIndex === 0
            ? this.options.length - 1
            : highlightedIndex - 1;

        // skip disabled options
        if (this.options[nextIndex].disabled) {
          nextIndex = nextIndex === 0 ? this.options.length - 1 : nextIndex - 1;
        }

        this.options[highlightedIndex].highlighted = false;
        this.options[nextIndex].highlighted = true;

        this.options[nextIndex].scrollIntoView({ block: 'nearest' });

        this.assistiveText = this.options[nextIndex].shadowRoot
          ?.querySelector('slot')
          ?.assignedNodes()[0].textContent;
        return;
      }
      case ESCAPE_KEY_CODE: {
        this.open = false;
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
    if (this.multiple) {
      this.value = [];
    } else {
      this.value = '';
    }
  }

  private handleTagClear(e: any, value: string) {
    this.updateValue(value, false);
  }

  private handleClear(e: any) {
    e.stopPropagation();

    this.searchText = '';
    this.searchEl.value = '';

    if (!this.multiple) {
      this.value = '';
    }
  }

  private handleSearchClick(e: any) {
    e.stopPropagation();
    this.open = true;
  }

  private handleButtonBlur(e: any) {
    if (
      !e.relatedTarget?.classList.contains('options') &&
      !e.relatedTarget?.classList.contains('search')
    ) {
      this.open = false;
    }
  }

  private handleSearchBlur(e: any) {
    if (
      !e.relatedTarget?.classList.contains('options') &&
      !e.relatedTarget?.classList.contains('select')
    ) {
      this.open = false;
    }
  }

  private handleSearchKeydown(e: any) {
    e.stopPropagation();

    const ENTER_KEY_CODE = 13;
    const ESCAPE_KEY_CODE = 27;
    const option = this.options.find((option) => option.highlighted);

    if (e.keyCode === ENTER_KEY_CODE && option) {
      this.updateValue(option.value, option.selected);
      this.assistiveText = 'Selected an item.';
    }

    if (e.keyCode === ESCAPE_KEY_CODE) {
      this.open = false;
      this.buttonEl.focus();
    }
  }

  private handleSearchInput(e: any) {
    const value = e.target.value;
    this.searchText = value;
    this.open = true;

    const options = this.options.filter((option: any) => {
      const text = option.shadowRoot
        ?.querySelector('slot')
        ?.assignedNodes()[0]
        .textContent.trim();

      return text.toLowerCase().startsWith(value.toLowerCase());
    });

    this.options.forEach((option) => (option.highlighted = false));
    if (value !== '' && options.length) {
      options[0].highlighted = true;
      options[0].scrollIntoView({ block: 'nearest' });
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    // capture child options click event
    this.addEventListener('on-click', (e: any) => {
      // set selected value
      this.updateValue(e.detail.value, e.detail.selected);
      this.assistiveText = 'Selected an item.';

      // emit selected value
      this.emitValue();
    });
  }

  private updateValue(value: string, selected = false) {
    const values = JSON.parse(JSON.stringify(this.value));

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
  }

  private emitValue() {
    const event = new CustomEvent('on-change', {
      detail: {
        value: this.value,
      },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (changedProps.has('value')) {
      // close listbox
      if (!this.multiple) {
        this.open = false;
      }

      // set native select value
      this.selectEl.value = this.value;
      // set form data value
      if (this.multiple) {
        const entries = new FormData();
        this.value.forEach((value: string) => {
          entries.append(this.name, value);
        });
        this.internals.setFormValue(entries);
      } else {
        this.internals.setFormValue(this.value);
      }
      // update selected option text
      if (!this.multiple) {
        if (this.selectEl.selectedOptions.length) {
          this.text = this.selectEl.selectedOptions[0]?.text;
        }
        // set search input value
        this.searchText = this.text === this.placeholder ? '' : this.text;
        if (this.searchEl) {
          this.searchEl.value = this.searchText;
        }
      }

      // set selected state for each option

      this.options.forEach((option: any) => {
        if (this.multiple) {
          option.selected = this.value.includes(option.value);
        } else {
          option.selected = this.value === option.value;
        }
      });

      // set validity
      if (this.required) {
        if (
          !this.value ||
          (this.multiple && !this.value.length) ||
          (!this.multiple && this.value === '')
        ) {
          this.internals.setValidity(
            { valueMissing: true },
            'This field is required.'
          );
          this.invalidText = this.internals.validationMessage;
        } else {
          this.internals.setValidity({});
          this.invalidText = '';
        }
      }
    }

    if (changedProps.has('open')) {
      if (this.open && !this.searchable) {
        this.listboxEl.focus({ preventScroll: true });
        this.assistiveText =
          'Selecting items. Use up and down arrow keys to navigate.';
      }
    }

    if (changedProps.has('multiple')) {
      // set multiple for each option
      this.options.forEach((option: any) => {
        option.multiple = this.multiple;
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown': Dropdown;
  }
}
