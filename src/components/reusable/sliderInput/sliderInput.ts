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
import '../../reusable/tooltip';

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
  tooltipPosition = '';

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  _inputEl!: HTMLInputElement;

  override render() {
    const classes = {
      'display-value': true,
    };

    const orientationClasses = {
      range: true,
    };

    // Calculate the number of ticks based on the step, min, and max values
    const tickCount = Math.floor(
      (parseFloat(this.max) - parseFloat(this.min)) / this.step
    );

    return html`
      <div class="text-input" ?disabled=${this.disabled}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          <span>${this.label}</span>
          <slot name="tooltip"></slot>
        </label>
        <div class="${classMap(orientationClasses)}">
          <!-- div for tick mark alignment -->
          <div class="slider-wrapper">
            <!-- Dynamically generate ticks -->
            ${this.multirange
              ? html`
                  ${Array.from({ length: tickCount + 1 }).map((_, index) => {
                    // Adjust the last tick to be at 99% instead of 100%
                    const tickPosition =
                      index === tickCount
                        ? '99.5%'
                        : ((index * 100) / tickCount).toFixed(2) + '%';
                    return html`
                      <span class="tick" style="left: ${tickPosition}"></span>
                    `;
                  })}
                `
              : null}
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
              @mouseenter=${() => this.showTooltip()}
              @mouseleave=${() => this.hideTooltip()}
              @focus=${() => this.showTooltip()}
              @blur=${() => this.hideTooltip()}
            />

            ${!this.editableInput
              ? html`
                  <span
                    role="tooltip"
                    class="slider-tooltip"
                    style="left: ${this.getTooltipPosition()}; visibility: ${this
                      .tooltipVisible
                      ? 'visible'
                      : 'hidden'}"
                  >
                    ${this.value}
                  </span>
                `
              : null}

            <!-- slot for tickmark varient  -->
            <slot name="tickmark" ?disabled=${this.disabled}></slot>
          </div>
          ${this.editableInput
            ? html`
                <div class="${classMap(classes)}">
                  <input
                    type="number"
                    value=${this.value.toString()}
                    id="editableInput"
                    name="editableInput"
                    min=${ifDefined(this.min)}
                    max=${ifDefined(this.max)}
                    step=${ifDefined(this.step)}
                    ?invalid=${this._isInvalid}
                    aria-invalid=${this._isInvalid}
                    aria-describedby=${this._isInvalid ? 'error' : ''}
                    @input=${(e: any) => this._handleTextInput(e)}
                    ?disabled=${this.disabled}
                    aria-label="editable range input"
                  />
                </div>
              `
            : null}
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
  private _handleTextInput(e: any) {
    this._isInvalid = false;
    const input = e.target as HTMLInputElement;
    const newValue = input.value;
    console.log('text input', newValue);

    if (e.target.value === '') {
      this.value = 0;
      this._inputEl.value = '0';
    } else {
      this.value = Number(e.target.value);
    }

    // this._validate(true, false);
    // Ensure the value is within bounds (min and max)
    if (newValue !== '') {
      const numValue = this.value;
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
  }

  // Handle input event
  // This is triggered when the user interacts with the slider
  private handleInput(e: any) {
    if (this._isInvalid) {
      e.preventDefault();
      return;
    }
    this.value = e.target.value;
    console.log('input value', this.value);
    this._validate(true, false);
    this.emitDispatchEvent(e);
    if (!this._isInvalid) {
      const editableInput = this.shadowRoot?.querySelector(
        'input[type="number"]'
      );
      if (editableInput) {
        (editableInput as HTMLInputElement).value = this.value.toString();
      }
    }
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
    const value = parseFloat(this.value);
    const min = parseFloat(this.min);
    const max = parseFloat(this.max);
    const step = this.step;

    // Calculate the position of the slider value
    let pos = (value - min) / (max - min);
    // thumb width 20px
    const thumbCorrect = 16 * (pos - 0.5) * -1;

    // this.tooltipPosition = `calc(${value}% + (${8 - value * 0.15}px))`;

    const newVal = Number(((value - min) * 100) / (max - min));
    // thumb width 20px/2 10px
    this.tooltipPosition = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
    console.log('input width', `calc(${newVal}% + (${8 - newVal * 0.15}px))`);
    console.log(
      'thumb correct----',
      `calc(${pos * 100}% + (${thumbCorrect}px))`
    );

    // Update the tick color based on the progress
    if (this.multirange) {
      const ticks = this.shadowRoot?.querySelectorAll('.tick');
      ticks?.forEach((tick: any) => {
        const tickPosition = parseFloat(tick.style.left);
        // If the tick is before the progress (i.e., within the filled range), set its color to white
        if (tickPosition <= newVal) {
          tick.style.backgroundColor = this.disabled
            ? 'grey'
            : getTokenThemeVal('--kd-color-background-ui-hollow-default'); // Change to white
        } else {
          tick.style.backgroundColor = getTokenThemeVal(
            '--kd-color-background-ui-default-dark'
          ); // Default color for unfilled ticks
        }
        // Now check if the thumb is directly on this tick (if the tick aligns with the step value)
        const tickStepPosition = Math.round(tickPosition); // Round to avoid floating point precision issues
        const valueAtTick = (tickStepPosition * (max - min)) / 100 + min;
        if (Math.abs(value - valueAtTick) < step / 2) {
          // Thumb is exactly on a tick
          tick.style.backgroundColor = this.disabled
            ? getTokenThemeVal('--kd-color-text-level-disabled')
            : getTokenThemeVal(
                '--kd-color-background-button-primary-state-default'
              );
        }
      });
    }

    pos = Math.round(pos * 99); // track the progress
    const trackProgessFillColor = this.disabled
      ? getTokenThemeVal('--kd-color-text-level-disabled')
      : getTokenThemeVal('--kd-color-background-button-primary-state-default');
    if (inputEl) {
      inputEl.style.background = `linear-gradient(90deg, ${trackProgessFillColor} ${pos}%, ${getTokenThemeVal(
        '--kd-color-background-accent-tertiary'
      )} ${pos + 1}%)`;
    }

    // this.requestUpdate();
  }

  // Handle keydown event
  // This is triggered when the user presses a key while the slider is focused
  private handleKeydown(e: KeyboardEvent) {
    if (this._isInvalid) {
      e.preventDefault();
      return;
    }
    if (this.disabled || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      return;
    }
    if (!this.editableInput) {
      this.showTooltip();
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
    if (this._isInvalid) return;
    const currentValue = parseFloat(this.value);
    if (isNaN(currentValue)) {
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

  private handleValueChange() {
    this._inputEl.value = this.value.toString();
    const inputEl = this.shadowRoot?.querySelector('input');
    if (inputEl) {
      this.value = inputEl?.value;
      this.fillTrackSlider();
    }
  }

  private handleMinMaxChange() {
    const inputEl = this.shadowRoot?.querySelector('input');
    if (inputEl) {
      const min = parseFloat(this.min);
      const max = parseFloat(this.max);
      let currentValue = parseFloat(this.value);

      // Ensure value is within the bounds of min/max
      currentValue = Math.min(Math.max(currentValue, min), max);
      this.value = currentValue.toString();

      inputEl.min = this.min;
      inputEl.max = this.max;
      this.fillTrackSlider();
    }
  }

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    this._onUpdated(changedProps);
    if (changedProps.has('disabled')) {
      this.fillTrackSlider();
    }
    if (changedProps.has('value')) {
      this.handleValueChange();
    }
    // Handle changes to `min` or `max`
    if (changedProps.has('min') || changedProps.has('max')) {
      this.handleMinMaxChange();
    }
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  // override connectedCallback() {
  //   super.connectedCallback();
  //   document.addEventListener('keydown', (e) => this.handleKeydown(e));
  // }

  // override disconnectedCallback() {
  //   document.removeEventListener('keydown', (e) => this.handleKeydown(e));
  //   super.disconnectedCallback();
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-slider-input': SliderInput;
  }
}
