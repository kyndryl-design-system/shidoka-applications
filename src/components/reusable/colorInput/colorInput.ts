import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state, query, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { deepmerge } from 'deepmerge-ts';
import { classMap } from 'lit/directives/class-map.js';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import Styles from './colorInput.scss?inline';
import { FormMixin } from '../../../common/mixins/form-input';

const _defaultTextStrings = {
  requiredText: 'Required',
  errorText: 'Error',
  pleaseSelectColor: 'Please select a color',
  invalidFormat: 'Enter a valid hex color (e.g. #FF0000)',
  colorTextInput: 'Color text input',
};

/**
 * Color input.
 * @fires on-input - Captures the input event and emits the selected value and original event details. `detail:{ value: string, origEvent: Event }`
 * @slot tooltip - Slot for tooltip.
 * @attr {string} [value=''] - The value of the input.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 * @attr {string} [invalidText=''] - The custom validation message when the input is invalid.
 */
@customElement('kyn-color-input')
export class ColorInput extends FormMixin(LitElement) {
  static override styles = unsafeCSS(Styles);

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Optional text beneath the input. */
  @property({ type: String })
  accessor caption = '';

  /** Input disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Input required state. */
  @property({ type: Boolean })
  accessor required = false;

  /** Visually hide the label. */
  @property({ type: Boolean })
  accessor hideLabel = false;

  /** Input readonly state. */
  @property({ type: Boolean })
  accessor readonly = false;

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
   * Queries the <input[type="color"]> DOM element.
   * @ignore
   */
  @query('input[type="color"]')
  accessor _inputColorEl!: HTMLInputElement;

  /**
   * Queries the <input[type="text"]> DOM element.
   * @ignore
   */
  @query('input[type="text"]')
  accessor _inputEl!: HTMLInputElement;

  /** Sets whether user has interacted with input text for error handling..
   * @internal
   */
  @state()
  accessor _hasInteracted = false;

  override render() {
    return html`
      <div
        class="text-input"
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
      >
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${
            this.required
              ? html`<abbr
                  class="required"
                  title=${this._textStrings.requiredText}
                  role="img"
                  aria-label=${this._textStrings?.requiredText || 'Required'}
                  >*</abbr
                >`
              : null
          }
          ${this.label}
          <slot name="tooltip"></slot>
        </label>
        <div class="color-input-wrapper">
          <input
          class=${classMap({
            'custom-color': true,
            readonly: this.readonly,
          })}
            type="color"
            name="colorInput"
            id="colorInput"
            .value=${this.value}
            ?disabled=${this.disabled}
            @input=${this.handleColorChange}
          />
          </div>
          <input
            class="${classMap({
              'is-readonly': this.readonly,
            })}"
            type="text"
            name=${this.name}
            .value=${this.value}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?invalid=${this._isInvalid}
            aria-label=${this._textStrings.colorTextInput}
            aria-invalid=${this._isInvalid}
            aria-describedby=${this._isInvalid ? 'error' : ''}
            autocomplete=${this.autoComplete}
            @input=${(e: any) => this.handleTextInput(e)}
          />
          <div class="caption-error-count">
            <div>
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
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private handleColorChange(e: any) {
    this.value = e.target.value;
    this._inputEl.value = e.target.value;
    this._validate(true, false);
    this._emitValue(e);
  }

  private handleTextInput(e: any) {
    this.value = e.target.value;
    this._inputColorEl.value = e.target.value;
    this._validate(true, false);
    this._emitValue(e);
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
    // get validity state from inputEl
    if (interacted) this._hasInteracted = true;
    const hexPattern = /^#([0-9a-fA-F]{6})$/;
    const value = this._inputEl.value;
    const validityFlags = {
      valueMissing: false,
      patternMismatch: false,
      customError: false,
      valid: true,
    };

    let validationMessage = '';

    if (this.required && !value) {
      validityFlags.valueMissing = true;
      validityFlags.valid = false;
      validationMessage = this._textStrings.pleaseSelectColor;
    }

    if (value != '' && !hexPattern.test(value)) {
      validityFlags.patternMismatch = true;
      validityFlags.valid = false;
      validationMessage = this._textStrings.invalidFormat;
    }

    // set validity on custom element, anchor to inputEl
    this._internals.setValidity(
      validityFlags,
      validationMessage,
      this._inputEl
    );

    // set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = validationMessage;
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
      this._inputEl.value = this.value;
    }
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-color-input': ColorInput;
  }
}
