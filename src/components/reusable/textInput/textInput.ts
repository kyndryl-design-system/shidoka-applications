import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import TextInputScss from './textInput.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import clearIcon from '@carbon/icons/es/close/24';
import errorIcon from '@carbon/icons/es/warning--filled/16';
import { deepmerge } from 'deepmerge-ts';

const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear all',
  errorText: 'Error',
};

/**
 * Text input.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} pattern - RegEx pattern to validate.
 * @prop {number} minLength - Minimum number of characters.
 * @prop {number} maxLength - Maximum number of characters.
 * @slot icon - Slot for contextual icon.
 * @slot tooltip - Slot for tooltip.
 *
 */
@customElement('kyn-text-input')
export class TextInput extends FormMixin(LitElement) {
  static override styles = TextInputScss;

  /** Lable text. */
  @property({ type: String })
  label = '';

  /** Input type, limited to options that are "text like". */
  @property({ type: String })
  type = 'text';

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Input placeholder. */
  @property({ type: String })
  placeholder = '';

  /** Makes the input required. */
  @property({ type: Boolean })
  required = false;

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** RegEx pattern to validate. */
  @property({ type: String })
  pattern!: string;

  /** Maximum number of characters. */
  @property({ type: Number })
  maxLength!: number;

  /** Minimum number of characters. */
  @property({ type: Number })
  minLength!: number;

  /** Place icon on the right. */
  @property({ type: Boolean })
  iconRight = false;

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  _inputEl!: HTMLInputElement;

  /**
   * Evaluates if an icon is slotted.
   * @ignore
   */
  @state()
  iconSlotted = false;

  /**
   * Queries any slotted icons.
   * @ignore
   */
  @queryAssignedElements({ slot: 'icon' })
  iconSlot!: Array<HTMLElement>;

  override render() {
    return html`
      <div class="text-input" ?disabled=${this.disabled}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${this.required
            ? html`<abbr
                class="required"
                title=${this._textStrings.requiredText}
                aria-label=${this._textStrings.requiredText}
                >*</abbr
              >`
            : null}
          ${this.label}
          <slot name="tooltip"></slot>
        </label>

        <div
          class="${classMap({
            'input-wrapper': true,
            'icon--left': this.iconSlotted && !this.iconRight,
            'icon--right': this.iconSlotted && this.iconRight,
          })}"
        >
          <span class="context-icon">
            <slot name="icon"></slot>
          </span>

          <input
            class="${classMap({
              'size--sm': this.size === 'sm',
              'size--lg': this.size === 'lg',
            })}"
            type=${this.type}
            id=${this.name}
            name=${this.name}
            value=${this.value}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-describedby=${this._isInvalid ? 'error' : ''}
            pattern=${ifDefined(this.pattern)}
            minlength=${ifDefined(this.minLength)}
            maxlength=${ifDefined(this.maxLength)}
            @input=${(e: any) => this._handleInput(e)}
          />
          ${this.value !== ''
            ? html`
                <button
                  ?disabled=${this.disabled}
                  class="clear"
                  aria-label=${this._textStrings.clearAll}
                  title=${this._textStrings.clearAll}
                  @click=${() => this._handleClear()}
                >
                  <kd-icon .icon=${clearIcon}></kd-icon>
                </button>
              `
            : null}
        </div>

        <div class="caption-error-count">
          <div>
            ${this.caption !== ''
              ? html` <div class="caption">${this.caption}</div> `
              : null}
            ${this._isInvalid
              ? html`
                  <div id="error" class="error">
                    <kd-icon
                      role="img"
                      title=${this._textStrings.errorText}
                      aria-label=${this._textStrings.errorText}
                      .icon=${errorIcon}
                    ></kd-icon>
                    ${this.invalidText || this._internalValidationMsg}
                  </div>
                `
              : null}
          </div>
          ${this.maxLength
            ? html`
                <div class="count">${this.value.length}/${this.maxLength}</div>
              `
            : null}
        </div>
      </div>
    `;
  }

  private _handleInput(e: any) {
    this.value = e.target.value;

    this._validate(true, false);
    this._emitValue(e);
  }

  private _handleClear() {
    this.value = '';
    this._inputEl.value = '';

    this._validate(true, false);
    this._emitValue();
  }

  private _emitValue(e?: any) {
    const Detail: any = {
      value: this.value,
    };
    if (e) {
      Detail.origEvent = e;
    }

    const event = new CustomEvent('on-input', {
      detail: Detail,
    });
    this.dispatchEvent(event);
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // get validity state from inputEl, combine customError flag if invalidText is provided
    const Validity =
      this.invalidText !== ''
        ? { ...this._inputEl.validity, customError: true }
        : this._inputEl.validity;
    // set validationMessage to invalidText if present, otherwise use inputEl validationMessage
    const ValidationMessage =
      this.invalidText !== ''
        ? this.invalidText
        : this._inputEl.validationMessage;

    // set validity on custom element, anchor to inputEl
    this._internals.setValidity(Validity, ValidationMessage, this._inputEl);

    // set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = this._inputEl.validationMessage;
    }

    // focus the form field to show validity
    if (report) {
      this._internals.reportValidity();
    }
  }

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    this._onUpdated(changedProps);

    if (changedProps.has('value')) {
      // set value on input element
      this._inputEl.value = this.value;
    }
  }

  override firstUpdated() {
    this.determineIfSlotted();
  }

  private determineIfSlotted() {
    this.iconSlotted = this.iconSlot.length ? true : false;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-text-input': TextInput;
  }
}
