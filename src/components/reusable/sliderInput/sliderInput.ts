import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { FormMixin } from '../../../common/mixins/form-input';
import silderInputScss from './sliderInput.scss';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

const _defaultTextStrings = {
  errorText: 'Error',
};

/**
 * Slider Input.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} min - Minimum allowed range.
 * @prop {string} max - Maximum allowed range.
 * @prop {number} step - Number intervals.
 * @slot tooltip - Slot for tooltip.
 *
 */

@customElement('kyn-slider-input')
export class SliderInput extends FormMixin(LitElement) {
  static override styles = silderInputScss;

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Specifies maximum allowed range. */
  @property({ type: String })
  max!: string;

  /** Specifies minimum allowed range. */
  @property({ type: String })
  min!: string;

  /** Specifies number intervals */
  @property({ type: Number })
  step!: number;

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

  /** vertical orientation. */
  @property({ type: Boolean })
  vertical = false;

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

  override render() {
    return html`
      <div class="text-input" ?disabled=${this.disabled}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          <span>${this.label}</span>
          <slot name="tooltip"></slot>
        </label>
        <div class="range ${this.vertical ? 'range-vertical' : ''}">
          <input
            type="range"
            value="0"
            id=${this.name}
            name=${this.name}
            min=${ifDefined(this.min)}
            max=${ifDefined(this.max)}
            step=${ifDefined(this.step)}
            ?disabled=${this.disabled}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-describedby=${this._isInvalid ? 'error' : ''}
            class="range-input"
            orient=${ifDefined(this.vertical ? 'vertical' : 'horizontal')}
            @input=${(e: any) => this.handleInput(e)}
            @keydown=${(e: KeyboardEvent) => this.handleKeydown(e)}
          />
          <div
            class="display-value ${this.vertical
              ? 'display-value-vertical'
              : ''}"
          >
            ${this.value}
          </div>
        </div>
        <!--  Tick data list to do -->
        <!-- <div class="range">
          <div class="range-slider">
            <label for="range">Select a pleasant temperature:</label><br />
            <input
              type="range"
              min="0"
              max="100"
              value="0"
              class="range-input"
              id="range4"
              step="25"
              @input=${(e: any) => this.handleInput(e)}
            />
            <div class="sliderticks"> 
             This should be slotted
              <option value="0" label="0"></option>
              <option value="25" label="25"></option>
              <option value="50" label="50"></option>
              <option value="75" label="75"></option>
              <option value="100" label="100"></option>
            </div>
          </div>

          <div
            class="display-value ${this.vertical
          ? 'display-value-vertical'
          : ''}"
          >
            ${this.value}
          </div>
        </div> -->
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
    `;
  }

  private handleInput(e: any) {
    if (this._isInvalid) return;
    this.value = e.target.value;
    this._validate(true, false);
    this.emitDispatchEvent(e);
  }

  private emitDispatchEvent(e: Event) {
    const event = new CustomEvent('on-input', {
      detail: {
        value: this.value,
        origEvent: e,
      },
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

  private fillTrackSlider() {
    const inputEl = this.shadowRoot?.querySelector('input');
    if (inputEl) {
      const percentage =
        ((parseFloat(this.value) - parseFloat(this.min)) /
          (parseFloat(this.max) - parseFloat(this.min))) *
        100;
      inputEl.style.background = `linear-gradient(to right, ${getTokenThemeVal(
        '--kd-color-background-button-primary-state-default'
      )} ${percentage}%, ${getTokenThemeVal(
        '--kd-color-background-accent-tertiary'
      )} ${percentage}%)`;
    }
  }

  private handleKeydown(e: KeyboardEvent) {
    if (this.disabled || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      return;
    }
    let newValue = parseFloat(this.value);
    const step = this.step;
    const min = parseFloat(this.min);
    const max = parseFloat(this.max);

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        // Increase value
        newValue = Math.min(newValue + step, max);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        // Decrease value
        newValue = Math.max(newValue - step, min);
        break;
    }
    this.value = newValue.toString();
    this.emitDispatchEvent(e);
  }

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    this._onUpdated(changedProps);
    if (changedProps.has('value')) {
      this._inputEl.value = this.value.toString();
      const inputEl = this.shadowRoot?.querySelector('input');
      if (inputEl) {
        this.value = inputEl?.value;
        this.fillTrackSlider();
      }
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
