import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import DropdownScss from './dropdown.scss';
import './dropdownOption';
import '@kyndryl-design-system/foundation/components/icon';
import downIcon from '@carbon/icons/es/chevron--down/24';
import errorIcon from '@carbon/icons/es/warning--filled/24';

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
  placeholder = 'Select an option';

  /** Dropdown name. */
  @property({ type: String })
  name = '';

  /** Listbox/drawer open state. */
  @property({ type: Boolean })
  open = false;

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
  value = '';

  /**
   * Selected option text, automatically derived.
   * @ignore
   */
  @state()
  text = '';

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
   * Queries the <select> DOM element.
   * @ignore
   */
  @query('select')
  selectEl!: HTMLSelectElement;

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
                  <option value=${option.value}>${optionText}</option>
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
              tabindex="0"
              @click=${(e: any) => this.handleClick(e)}
              @keydown=${(e: any) => this.handleButtonKeydown(e)}
              @mousedown=${(e: any) => {
                e.preventDefault();
              }}
            >
              ${this.value === '' ? this.placeholder : this.text}
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

          ${this.invalidText !== ''
            ? html` <kd-icon class="error-icon" .icon=${errorIcon}></kd-icon> `
            : null}
        </div>

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
  }

  private determineIfSlotted() {
    this.isSlotted = this.options.length ? true : false;
  }

  private initialSelection() {
    // set selected state for each option
    this.options.forEach((option: any) => {
      if (option.selected) {
        this.value = option.value;
      }
    });
  }

  private handleChange(e: any) {
    this.value = e.target.value;
    this.text = e.target.selectedOptions[0].text;
    this.assistiveText = 'Selected an item.';

    // emit selected value
    this.emitValue();
  }

  private handleClick(e: any) {
    if (!this.disabled) {
      this.open = !this.open;
    }
  }

  private handleButtonKeydown(e: any) {
    this.handleKeyboard(e.keyCode, 'button');
  }

  private handleListKeydown(e: any) {
    e.preventDefault();
    this.handleKeyboard(e.keyCode, 'list');
  }

  private handleListBlur(e: any) {
    this.options.forEach((option) => (option.highlighted = false));
    this.open = false;
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
      }
    }

    switch (keyCode) {
      case ENTER_KEY_CODE: {
        if (target === 'list') {
          this.value = this.options[highlightedIndex].value;
          this.open = false;
          this.buttonEl.focus();
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

        this.options[nextIndex].scrollIntoView();

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

        this.options[nextIndex].scrollIntoView();

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

  override connectedCallback() {
    super.connectedCallback();

    // capture child options click event
    this.addEventListener('on-click', (e: any) => {
      // set selected value
      this.value = e.detail.value;
      this.text = e.detail.text;
      this.open = false;
      this.buttonEl.focus();
      this.assistiveText = 'Selected an item.';

      // emit selected value
      this.emitValue();
    });
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
      this.open = false;
      // set native select value
      this.selectEl.value = this.value;
      // set form data value
      this.internals.setFormValue(this.value);
      // update selected option text
      this.text = this.selectEl.selectedOptions[0]?.text;

      // set selected state for each option
      this.options.forEach((option: any) => {
        option.selected = this.value === option.value;
      });

      // set validity
      if (this.required) {
        if (!this.value || this.value === '') {
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

    if (changedProps.has('open') && this.open) {
      // focus the listbox
      const listboxEl = this.listboxEl;
      setTimeout(function () {
        listboxEl.focus();
      }, 0);
      this.assistiveText =
        'Selecting items. Use up and down arrow keys to navigate.';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown': Dropdown;
  }
}
