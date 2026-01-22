import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import '../../reusable/button';

import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import lockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/no-overview.svg';
import unlockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/overview.svg';

import { FormMixin } from '../../../common/mixins/form-input';
import TextInputScss from './textInput.scss?inline';

const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear all',
  errorText: 'Error',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
};

/**
 * Text input.
 * @fires on-input - Captures the input event and emits the selected value and original event details.`detail:{ origEvent: InputEvent, value: string }`
 * @prop {string} pattern - RegEx pattern to validate.
 * @prop {number} minLength - Minimum number of characters.
 * @prop {number} maxLength - Maximum number of characters.
 * @slot icon - Slot for contextual icon.
 * @slot tooltip - Slot for tooltip.
 * @attr {string} [value=''] - The value of the input.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 * @attr {string} [invalidText=''] - The custom validation message when the input is invalid.
 *
 */
@customElement('kyn-text-input')
export class TextInput extends FormMixin(LitElement) {
  static override styles = unsafeCSS(TextInputScss);

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Input type, limited to options that are "text like". */
  @property({ type: String })
  accessor type: 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' =
    'text';

  /** Input size. "xs", "sm", "md", or "lg". */
  @property({ type: String })
  accessor size = 'md';

  /** Optional text beneath the input. */
  @property({ type: String })
  accessor caption = '';

  /** Input placeholder. */
  @property({ type: String })
  accessor placeholder = '';

  /** Makes the input required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Input disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Input readonly state. */
  @property({ type: Boolean })
  accessor readonly = false;

  /** RegEx pattern to validate. */
  @property({ type: String })
  accessor pattern!: string;

  /** Maximum number of characters. */
  @property({ type: Number })
  accessor maxLength!: number;

  /** Minimum number of characters. */
  @property({ type: Number })
  accessor minLength!: number;

  /** Place icon on the right. */
  @property({ type: Boolean })
  accessor iconRight = false;

  /** Visually hide the label. */
  @property({ type: Boolean })
  accessor hideLabel = false;

  /** Customizable text strings. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Control for native browser autocomplete. Use `on`, `off`, or a space-separated `token-list` describing autocomplete behavior.*/
  @property({ type: String })
  accessor autoComplete: string = 'off';

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  accessor _inputEl!: HTMLInputElement;

  /**
   * Evaluates if an icon is slotted.
   * @ignore
   */
  @state()
  accessor iconSlotted = false;

  /** Internal state for password visibility
   * @internal
   */
  @state()
  private accessor passwordVisible = false;

  /**
   * Queries any slotted icons.
   * @ignore
   */
  @queryAssignedElements({ slot: 'icon' })
  accessor iconSlot!: Array<HTMLElement>;

  override render() {
    return html`
      <div
        class="text-input"
        ?disabled=${this.disabled}
        ?readonly=${!this.disabled && this.readonly}
      >
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
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
              'size--xs': this.size === 'xs',
              'size--sm': this.size === 'sm',
              'size--lg': this.size === 'lg',
              'is-readonly': this.readonly,
            })}"
            type=${this.type === 'password' && this.passwordVisible
              ? 'text'
              : this.type}
            id=${this.name}
            name=${this.name}
            value=${this.value}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?readonly=${!this.disabled && this.readonly}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-describedby=${this._isInvalid ? 'error' : ''}
            pattern=${ifDefined(this.pattern)}
            minlength=${ifDefined(this.minLength)}
            maxlength=${ifDefined(this.maxLength)}
            @input=${(e: any) => this._handleInput(e)}
            .autocomplete=${this.autoComplete}
          />
          ${this.type === 'password' && !this.readonly
            ? html`
                <kyn-button
                  ?disabled=${this.disabled}
                  class="visibility-toggle"
                  kind="ghost"
                  size="small"
                  description=${this.passwordVisible
                    ? this._textStrings.hidePassword
                    : this._textStrings.showPassword}
                  @click=${this.disabled
                    ? null
                    : this._togglePasswordVisibility}
                >
                  <span style="display:flex;" slot="icon">
                    ${this.passwordVisible
                      ? html`${unsafeSVG(unlockIcon)}`
                      : html`${unsafeSVG(lockIcon)}`}
                  </span>
                </kyn-button>
              `
            : null}
          ${this.type === 'search' && this.value !== '' && !this.readonly
            ? html`
                <kyn-button
                  ?disabled=${this.disabled}
                  class="clear-button"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${() => this._handleClear()}
                >
                  <span style="display:flex;" slot="icon">
                    ${unsafeSVG(clearIcon)}
                  </span>
                </kyn-button>
              `
            : null}
        </div>

        <div class="caption-error-count">
          <div>
            ${this.caption !== ''
              ? html`
                  <div class="caption" aria-disabled=${this.disabled}>
                    ${this.caption}
                  </div>
                `
              : null}
            ${this._isInvalid
              ? html`
                  <div id="error" class="error">
                    <span
                      role="img"
                      class="error-icon"
                      aria-label=${this._textStrings.errorText}
                      >${unsafeSVG(errorIcon)}</span
                    >
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
    if (this.readonly) return;
    this.value = e.target.value;

    this._validate(true, false);
    this._emitValue(e);
  }

  private _handleClear() {
    if (this.readonly) return;
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

  private _togglePasswordVisibility(e: MouseEvent) {
    e.stopPropagation();
    this.passwordVisible = !this.passwordVisible;
  }

  // Added for search input to set value from suggestion panel on select and notify
  setValueAndNotify(val: string) {
    const oldValue = this.value;
    this.value = val;
    this._inputEl.value = val;
    this.requestUpdate('value', oldValue);

    this._validate(true, false);
    this._emitValue();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-text-input': TextInput;
  }
}
