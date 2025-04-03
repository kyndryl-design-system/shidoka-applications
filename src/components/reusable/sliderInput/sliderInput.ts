import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import { FormMixin } from '../../../common/mixins/form-input';
import sliderInputScss from './sliderInput.scss';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

const _defaultTextStrings = {
  requiredText: 'Required',
  errorText: 'Error',
};

/**
 * Slider input.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {number} min - Minimum allowed number.
 * @prop {number} max - Maximum allowed number.
 * @prop {number} step - Number intervals.
 * @slot tooltip - Slot for tooltip.
 *
 */

@customElement('kyn-slider-input')
export class SliderInput extends FormMixin(LitElement) {
  static override styles = sliderInputScss;

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Specifies maximum allowed number. */
  @property({ type: String })
  max!: string;

  /** Specifies minimum allowed number. */
  @property({ type: String })
  min!: string;

  /** Specifies number intervals */
  @property({ type: Number })
  step!: number;

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

  /**
   * Optional: Custom width (overrides size if provided).
   */
  @property({ type: String })
  width?: string;

  /** vertical orientation. */
  // @property({ type: Boolean })
  // vertical = false;

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

  debounceTimeout: number | undefined = undefined;

  override render() {
    const styles = {
      ...(this.width && { width: this.width }),
    };

    const sliderClasses = {
      'slider-container': true,
      // vertical: this.vertical,
    };

    return html`
      <div class="text-input" ?disabled=${this.disabled}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          <span>${this.label}</span>
          <slot name="tooltip"></slot>
        </label>
        <div class=${classMap(sliderClasses)} style="position: relative;">
          <span>${this.min}</span>
          <input
            type="range"
            id=${this.name}
            name=${this.name}
            .value=${this.value}
            min=${ifDefined(this.min)}
            max=${ifDefined(this.max)}
            step=${ifDefined(this.step)}
            ?disabled=${this.disabled}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-describedby=${this._isInvalid ? 'error' : ''}
            style=${Object.entries(styles)
              .map(([key, value]) => `${key}: ${value}`)
              .join(';')}
            @input=${(e: any) => this.handleInput(e)}
          />
          <span>${this.max}</span>

          <input
            type="number"
            .value=${this.value}
            min=${ifDefined(this.min)}
            max=${ifDefined(this.max)}
            step=${ifDefined(this.step)}
            ?invalid=${this._isInvalid}
            @input=${this.handleTextInput}
            ?disabled=${this.disabled}
            aria-label="editable range input"
          />
        </div>
        <div>
          ${this.caption !== ''
            ? html` <div class="caption">${this.caption}</div> `
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
      </div>
    `;
  }

  private fillTrackBackground() {
    const inputEl = this.shadowRoot?.querySelector('input');
    if (inputEl) {
      const percentage =
        ((parseFloat(this.value) - parseFloat(this.min)) /
          (parseFloat(this.max) - parseFloat(this.min))) *
        100;
      //
      inputEl.style.background = `linear-gradient(to right, ${getTokenThemeVal(
        '--kd-color-background-button-primary-state-default'
      )} ${percentage}%, #dee1e2 ${percentage}%, #dee1e2 100%)`;
    }
  }

  private handleInput(e: any) {
    if (this._isInvalid) return;
    this.value = this.shadowRoot?.querySelector('input')?.value;
    this.fillTrackBackground();
    this._validate(true, false); // validate on range input value
    // emit selected value
    const event = new CustomEvent('on-input', {
      detail: {
        value: this.value,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  private handleTextInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const newValue = input.value;

    // Ensure the value is within bounds (min and max)
    if (newValue !== '') {
      const numValue = parseFloat(newValue);
      if (
        !isNaN(numValue) &&
        numValue >= parseFloat(this.min) &&
        numValue <= parseFloat(this.max)
      ) {
        this.value = numValue;
        this._validate(true, false); // validate on number input value
        const event = new CustomEvent('on-input', {
          detail: {
            value: this.value,
            origEvent: e,
          },
        });
        this.dispatchEvent(event);
      } else {
        this._internalValidationMsg = `Value must be between ${this.min} and ${this.max}`;
        input.setCustomValidity(
          `Value must be between ${this.min} and ${this.max}`
        );
        this._isInvalid = true;
      }
    }
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // Check if value is outside the range
    const value = parseFloat(this.value);
    const min = parseFloat(this.min);
    const max = parseFloat(this.max);

    let validity = this._inputEl.validity;

    if (value < min) {
      validity = { ...validity, rangeUnderflow: true };
      this._isInvalid = true;
      this._internalValidationMsg = `Value must be greater than or equal to ${min}`;
      this._inputEl.setCustomValidity(
        `Value must be greater than or equal to ${min}`
      );
    } else if (value > max) {
      this._isInvalid = true;
      validity = { ...validity, rangeOverflow: true };
      this._internalValidationMsg = `Value must be less than or equal to ${max}`;
      this._inputEl.setCustomValidity(
        `Value must be less than or equal to ${max}`
      );
    } else {
      this._isInvalid = false;
      this._internalValidationMsg = '';
      this._inputEl.setCustomValidity('');
    }
    const Validity =
      this.invalidText !== '' ? { ...validity, customError: true } : validity;
    const ValidationMessage =
      this.invalidText !== ''
        ? this.invalidText
        : this._inputEl.validationMessage;

    // Set validity on custom element, anchor to inputEl
    this._internals.setValidity(Validity, ValidationMessage, this._inputEl);

    // Set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = this._inputEl.validationMessage;
    }

    // Focus the form field to show validity
    if (report) {
      this._internals.reportValidity();
    }
  }

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    this.value = this.shadowRoot?.querySelector('input')?.value;
    if (this.value) {
      this.fillTrackBackground();
    }

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
    'kyn-slider-input': SliderInput;
  }
}
