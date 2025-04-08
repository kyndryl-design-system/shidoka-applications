import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { classMap } from 'lit/directives/class-map.js';
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
 * @slot tickmark - Slot for tickmarks.
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

  /** Specifies step intervals */
  @property({ type: Number })
  step = 1;

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

  /** vertical orientation. */
  // @property({ type: Boolean })
  // vertical = false;

  /** Set this to `true` for editable Input. */
  @property({ type: Boolean })
  editableInput = false;

  /** Set this to `true` for multi range control. */
  @property({ type: Boolean })
  multirange = false;

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /** Internal tooltipVisible state.
   * @internal
   */
  @state()
  tooltipVisible = false;

  /** Internal tooltipposition.
   * @internal
   */
  @state()
  tooltipPosition = 0;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  _inputEl!: HTMLInputElement;

  override render() {
    const classes = {
      'display-value': true,
      'multi-range': this.multirange,
    };

    const orientationClasses = {
      range: true,
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
        <div>
          <div class="${classMap(orientationClasses)}">
            <!-- empty div for tick mark alignment -->
            <div class="${classMap(classes)}">${this.min}</div>
            <div class="slider-wrapper">
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
                @input=${(e: any) => this.handleInput(e)}
                @keydown=${(e: KeyboardEvent) => this.handleKeydown(e)}
                @mouseover=${() => this.showTooltip()}
                @mouseout=${() => this.hideTooltip()}
                @keyup=${() => this.hideTooltip()}
              />
              <span
                class="slider-tooltip"
                style="left: ${this.getTooltipPosition()}px; visibility: ${this
                  .tooltipVisible
                  ? 'visible'
                  : 'hidden'}"
              >
                ${this.value}
              </span>
              <!-- slot for tickmark varient  -->
              ${this.multirange ? html`<slot name="tickmark"></slot>` : null}
            </div>
            <div class="${classMap(classes)}">${this.max}</div>
            <div class="${classMap(classes)}">
              ${this.editableInput
                ? html`<input
                    type="number"
                    .value=${this.value}
                    min=${ifDefined(this.min)}
                    max=${ifDefined(this.max)}
                    step=${ifDefined(this.step)}
                    ?invalid=${this._isInvalid}
                    aria-invalid=${this._isInvalid}
                    aria-describedby=${this._isInvalid ? 'error' : ''}
                    @input=${this.handleTextInput}
                    ?disabled=${this.disabled}
                    aria-label="editable range input"
                  />`
                : null}
            </div>
          </div>
        </div>

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

  // Calculate the current position based on the slider's value
  private handleTooltipPosition(inputWidth: number) {
    const value = parseFloat(this.value);
    const min = parseFloat(this.min);
    const max = parseFloat(this.max);

    // Calculate the position of the slider value
    const pos = (value - min) / (max - min);
    // thumb width 20px
    const thumbCorrect = 20 * (pos - 0.5) * -1;
    if (inputWidth) {
      this.tooltipPosition = Math.floor(
        pos * inputWidth - 25 / 4 + thumbCorrect
      );
    }
    console.log('titlepos----', this.tooltipPosition);
    this.requestUpdate();
  }
  // Handle show the tooltip
  private showTooltip() {
    this.tooltipVisible = true;
  }

  // Handle hide the tooltip
  private hideTooltip() {
    this.tooltipVisible = false;
  }

  // Get tooltip position
  private getTooltipPosition() {
    return this.tooltipPosition;
  }

  // Handle text input
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
        this._validate(true, false);
        this.emitDispatchEvent(e);
      } else {
        this._internalValidationMsg = `Value must be between ${this.min} and ${this.max}`;
        input.setCustomValidity(
          `Value must be between ${this.min} and ${this.max}`
        );
        this._isInvalid = true;
      }
    }
    this.emitDispatchEvent(e);
  }

  // Handle input event
  // This is triggered when the user interacts with the slider
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

  // Handle the track slider fill
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

  // Handle keydown event
  // This is triggered when the user presses a key while the slider is focused
  private handleKeydown(e: KeyboardEvent) {
    if (this.disabled || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      return;
    }
    const step = this.step;
    const min = parseFloat(this.min);
    const max = parseFloat(this.max);
    if (this.multirange) {
      this.handleMultiRangeKeydown(e, step, min, max);
    } else {
      this.handleSingleRangeKeydown(e, step, min, max);
    }
    this.emitDispatchEvent(e);
  }

  private handleMultiRangeKeydown(
    e: KeyboardEvent,
    step: number,
    min: number,
    max: number
  ) {
    const currentValue = this.value
      .split(',')
      .map((v: string) => parseFloat(v.trim()));
    const stepIndex = this._getHandleIndex();
    if (stepIndex === -1) return;
    const newValue = this.calculateNewValue(
      currentValue[stepIndex],
      e.key,
      step,
      min,
      max
    );
    currentValue[stepIndex] = newValue;
    this.value = currentValue.join(',');
  }

  private handleSingleRangeKeydown(
    e: KeyboardEvent,
    step: number,
    min: number,
    max: number
  ) {
    const currentValue = parseFloat(this.value);
    if (isNaN(currentValue)) {
      console.warn('Invalid current value:', this.value);
      return;
    }
    const newValue = this.calculateNewValue(
      parseFloat(this.value),
      e.key,
      step,
      min,
      max
    );
    this.value = newValue.toString();
  }

  private calculateNewValue(
    currentValue: number,
    key: string,
    step: number,
    min: number,
    max: number
  ): number {
    switch (key) {
      case 'ArrowUp':
      case 'ArrowRight':
        return Math.min(currentValue + step, max);
      case 'ArrowDown':
      case 'ArrowLeft':
        return Math.max(currentValue - step, min);
      default:
        return currentValue;
    }
  }

  private _getHandleIndex(): number {
    const inputEl = this.shadowRoot?.querySelector('input');
    if (!inputEl) return -1;
    const handles = Array.from(inputEl.querySelectorAll('.handle')); // Assuming each handle has the class `.handle`
    const focusedHandle = handles.findIndex(
      (handle) => handle === document.activeElement
    );
    return focusedHandle;
  }

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    this._onUpdated(changedProps);
    if (changedProps.has('value')) {
      this._inputEl.value = this.value.toString();
      const inputEl = this.shadowRoot?.querySelector('input');
      // Handle changes to `value`
      if (inputEl) {
        this.value = inputEl?.value;
        this.fillTrackSlider();
        this.handleTooltipPosition(inputEl.offsetWidth);
      }
    }
    // Handle changes to `min` or `max`
    if (changedProps.has('min') || changedProps.has('max')) {
      const inputEl = this.shadowRoot?.querySelector('input');
      if (inputEl) {
        const min = parseFloat(this.min);
        const max = parseFloat(this.max);
        let currentValue = parseFloat(this.value);
        if (currentValue < min) {
          currentValue = min;
        } else if (currentValue > max) {
          currentValue = max;
        }
        this.value = currentValue.toString();
        inputEl.min = this.min;
        inputEl.max = this.max;
        this.fillTrackSlider();
        this.handleTooltipPosition(inputEl.offsetWidth);
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
