import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './numberInput.scss?inline';
import { FormMixin } from '../../../common/mixins/form-input';
import '../button';
import { deepmerge } from 'deepmerge-ts';

import chevronLeft from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-left.svg';
import chevronRight from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';

const _defaultTextStrings = {
  requiredText: 'Required',
  subtract: 'Subtract',
  add: 'Add',
  error: 'Error',
};

/**
 * Number input.
 * @fires on-input - Captures the input event and emits the value and original event details.`detail:{ value: number }`
 * @slot tooltip - Slot for tooltip.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 * @attr {string} [invalidText=''] - The custom validation message when the input is invalid.
 */
@customElement('kyn-number-input')
export class NumberInput extends FormMixin(LitElement) {
  static override styles = unsafeCSS(Styles);

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  accessor size = 'md';

  /** Input value. */
  override value = 0;

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

  /** Optional text beneath the input. */
  @property({ type: String })
  accessor caption = '';

  /** Maximum value. */
  @property({ type: Number })
  accessor max!: number;

  /** Minimum value. */
  @property({ type: Number })
  accessor min!: number;

  /** Step value. */
  @property({ type: Number })
  accessor step = 1;

  /** Visually hide the label. */
  @property({ type: Boolean })
  accessor hideLabel = false;

  /** Customizable text strings. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

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

  override render() {
    return html`
      <div class="number-input" ?disabled=${this.disabled}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${this.required
            ? html`<abbr
                class="required"
                title=${this._textStrings.requiredText}
                role="img"
                aria-label=${this._textStrings?.requiredText}
                >*</abbr
              >`
            : null}
          ${this.label}
          <slot name="tooltip"></slot>
        </label>

        <div
          class="${classMap({
            'input-wrapper': true,
          })}"
        >
          <kyn-button
            kind="outline"
            size=${this._sizeMap(this.size)}
            ?disabled=${this.disabled ||
            this.value <= this.min ||
            this.readonly}
            description=${this._textStrings.subtract}
            @on-click=${this._handleSubtract}
          >
            <span slot="icon">${unsafeSVG(chevronLeft)}</span>
          </kyn-button>

          <input
            class="${classMap({
              'size--sm': this.size === 'sm',
              'size--lg': this.size === 'lg',
              'is-readonly': this.readonly,
            })}"
            type="number"
            id=${this.name}
            name=${this.name}
            value=${this.value.toString()}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-describedby=${this._isInvalid ? 'error' : ''}
            step=${ifDefined(this.step)}
            min=${ifDefined(this.min)}
            max=${ifDefined(this.max)}
            @input=${(e: any) => this._handleInput(e)}
          />

          <kyn-button
            kind="outline"
            size=${this._sizeMap(this.size)}
            ?disabled=${this.disabled ||
            this.value >= this.max ||
            this.readonly}
            description=${this._textStrings.add}
            @on-click=${this._handleAdd}
          >
            <span slot="icon">${unsafeSVG(chevronRight)}</span>
          </kyn-button>
        </div>

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
                  aria-label=${this._textStrings.error}
                  >${unsafeSVG(errorIcon)}</span
                >
                ${this.invalidText || this._internalValidationMsg}
              </div>
            `
          : null}
      </div>
    `;
  }

  private _sizeMap(size: string): 'small' | 'medium' | 'large' {
    let btnSize: 'small' | 'medium' | 'large' = 'medium';

    switch (size) {
      case 'lg':
        btnSize = 'large';
        break;
      case 'sm':
        btnSize = 'small';
        break;
    }

    return btnSize;
  }

  private _handleSubtract() {
    if (this.readonly) return;
    this._inputEl.stepDown();
    this.value = Number(this._inputEl.value);

    this._validate(true, false);
    this._emitValue();
  }

  private _handleAdd() {
    if (this.readonly) return;
    this._inputEl.stepUp();
    this.value = Number(this._inputEl.value);

    this._validate(true, false);
    this._emitValue();
  }

  private _handleInput(e: any) {
    if (e.target.value === '') {
      this.value = 0;
      this._inputEl.value = '0';
    } else {
      this.value = Number(e.target.value);
    }

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
      this._inputEl.value = this.value.toString();
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
    'kyn-number-input': NumberInput;
  }
}
