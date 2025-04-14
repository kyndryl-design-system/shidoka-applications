import { LitElement, PropertyValues, html } from 'lit';
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
 * @prop {string} min - The minimum value.
 * @prop {string} max - The maximum value.
 * @prop {number} step - A value determining how much the value should increase/decrease by moving the thumb by mouse. If a value other than 1 is provided and the input is not hidden, the new step requirement should be added to a visible label. Values outside the step increment will be considered invalid..
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
  @property({ type: Number })
  max!: number;

  /** Specifies minimum allowed range. */
  @property({ type: Number })
  min!: number;

  /** Specifies step intervals */
  @property({ type: Number })
  step = 1;

  /** Input value. */
  @property({ type: Number })
  override value = 0;

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

  /** Set this to `true` for editable Input. */
  @property({ type: Boolean })
  editableInput = false;

  /** Set this to `true` to show ticks on slider track */
  @property({ type: Boolean })
  showTicks = false;

  /** Set this to `true` to show limits(min/max or similar). */
  @property({ type: Boolean })
  showlimits = false;

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
  @query('input[type="range"]')
  _inputRangeEl!: HTMLInputElement;

  @query('input[type="number"]')
  _inputEl!: HTMLInputElement;

  _themeObserver: any = new MutationObserver(() => {
    console.log('Theme changed');
    this.fillTrackSlider();
  });

  override render() {
    const classes = {
      'editable-input': this.showlimits && this.editableInput,
    };

    // Calculate the number of ticks based on the step, min, and max values
    const tickCount = Math.floor((this.max - this.min) / this.step);

    return html`
      <div class="text-input" ?disabled=${this.disabled}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          <span>${this.label}</span>
          <slot name="tooltip"></slot>
        </label>
        <div class="range">
          <!-- div for tick mark alignment -->
          <div class="slider-input-container">
            <div class="slider-track-wrapper">
              <div class="slider-wrapper">
                <input
                  type="range"
                  id=${this.name}
                  name=${this.name}
                  value=${this.value.toString()}
                  ?disabled=${this.disabled}
                  ?invalid=${this._isInvalid}
                  aria-invalid=${this._isInvalid}
                  aria-describedby=${this._isInvalid ? 'error' : ''}
                  min=${ifDefined(this.min)}
                  max=${ifDefined(this.max)}
                  step=${ifDefined(this.step)}
                  @input=${(e: any) => this._handleInput(e)}
                  @focus=${() => this.showTooltip()}
                  @blur=${() => this.hideTooltip()}
                />
                <!-- Dynamically generate ticks -->
                ${this.showTicks
                  ? html`
                      ${Array.from({ length: tickCount + 1 }).map(
                        (_, index) => {
                          // Adjust the last tick to be at 99% instead of 100%
                          const tickPosition =
                            index === tickCount
                              ? '99.5%'
                              : ((index * 100) / tickCount).toFixed(2) + '%';
                          const style = index === 0 ? 'display: none;' : '';
                          return html`
                            <span
                              class="tick"
                              style="left: ${tickPosition};${style}"
                            ></span>
                          `;
                        }
                      )}
                    `
                  : null}
                ${!this.editableInput
                  ? html`
                      <span
                        role="tooltip"
                        class="slider-tooltip"
                        style="left: ${this._getTooltipPosition()}; visibility: ${this
                          .tooltipVisible
                          ? 'visible'
                          : 'hidden'}"
                      >
                        ${this.value}
                      </span>
                    `
                  : null}
              </div>
              <!-- slot for tickmark varient  -->
              <div class="tickmarks-wrapper display-value">
                <slot name="tickmark" ?disabled=${this.disabled}></slot>
              </div>
            </div>
            ${this.editableInput
              ? html`
                  <div class="${classMap(classes)} number-input-wrapper">
                    <input
                      type="number"
                      value=${this.value.toString()}
                      id="editableInput"
                      name="editableInput"
                      ?disabled=${this.disabled}
                      aria-label="editable range input"
                      ?invalid=${this._isInvalid}
                      aria-invalid=${this._isInvalid}
                      aria-describedby=${this._isInvalid ? 'error' : ''}
                      min=${ifDefined(this.min)}
                      max=${ifDefined(this.max)}
                      step=${ifDefined(this.step)}
                      @input=${(e: any) => this._handleNumberInput(e)}
                    />
                  </div>
                `
              : null}
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

  // Handle show the tooltip
  private showTooltip() {
    this.tooltipVisible = true;
  }

  // Handle hide the tooltip
  private hideTooltip() {
    this.tooltipVisible = false;
  }

  // Get tooltip position
  private _getTooltipPosition() {
    return this.tooltipPosition;
  }

  // Handle text input
  private _handleNumberInput(e: any) {
    if (e.target.value === '') {
      // this.value = 0;
      this._inputEl.value = '0';
      // this._inputRangeEl.value = '0';
    } else {
      this.value = Number(e.target.value);
    }
    this._validate(true, false);
    this.emitDispatchEvent(e);
  }

  // Handle input event
  // This is triggered when the user interacts with the slider
  private _handleInput(e: any) {
    this.value = Number(e.target.value);
    //this._validate(true, false);
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

  // Handle the track slider fill
  private fillTrackSlider() {
    const inputEl = this.shadowRoot?.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;
    console.log('inputEl---', inputEl, this._inputRangeEl.value);
    const value = Number(this._inputRangeEl.value);
    const min = this.min;
    const max = this.max;
    const step = this.step;

    // Calculate the position of the slider value
    let pos = (value - min) / (max - min);
    // console.log('thumbCorrect', thumbCorrect);
    const newVal = Number(((value - min) * 100) / (max - min));

    const newPosition = 10 - newVal * 0.22;
    this.tooltipPosition = `calc(${newVal}% + (${newPosition}px))`;

    // Update the tick color based on the progress
    if (this.showTicks) {
      this.showTickMarkOnSlider(value, newVal, min, max, step);
    }

    pos = Math.round(pos * 99); // track the progress
    const trackProgessFillColor = this.disabled
      ? getTokenThemeVal('--kd-color-text-level-disabled')
      : getTokenThemeVal('--kd-color-border-container-selected');
    if (inputEl) {
      inputEl.style.background = `linear-gradient(to right, ${trackProgessFillColor} ${pos}%, ${getTokenThemeVal(
        '--kd-color-border-level-tertiary'
      )} ${pos + 1}%)`;
    }
  }

  private showTickMarkOnSlider(
    value: any,
    newVal: any,
    min: any,
    max: any,
    step: any
  ) {
    const ticks = this.shadowRoot?.querySelectorAll('.tick');
    ticks?.forEach((tick: any) => {
      const tickPosition = parseFloat(tick.style.left);
      // If the tick is before the progress (i.e., within the filled range), set its color to white
      if (tickPosition <= newVal) {
        tick.style.backgroundColor = this.disabled
          ? 'grey'
          : getTokenThemeVal('--kd-color-background-accent-subtle'); // Change to white
      } else {
        tick.style.backgroundColor = getTokenThemeVal(
          '--kd-color-background-accent-secondary'
        ); // Default color for unfilled ticks
      }
      // Now check if the thumb is directly on this tick (if the tick aligns with the step value)
      const tickStepPosition = Math.round(tickPosition); // Round to avoid floating point precision issues
      const valueAtTick = (tickStepPosition * (max - min)) / 100 + min;
      if (Math.abs(value - valueAtTick) < step / 2) {
        // Thumb is exactly on a tick
        tick.style.backgroundColor = this.disabled
          ? getTokenThemeVal('--kd-color-text-level-disabled')
          : 'inherit';
      }
    });
  }

  private handleValueChange() {
    // if (
    //   this.value !== undefined &&
    //   this.value >= this.min &&
    //   this.value <= this.max &&
    //   !this._isInvalid
    // ) {
    //   this._inputRangeEl.value = this.value.toString();
    //   this.fillTrackSlider();
    // }
    // this._validate(true, false);

    const { value, min, max, step } = this;
    const isStepValid = (value - min) % step === 0 || step === 1;
    const isValueValid = value >= min && value <= max && isStepValid;

    // If the value is valid, allow the UI to update
    if (isValueValid) {
      this._inputRangeEl.value = value.toString();
      console.log(
        'this._inputRangeEl.value if',
        this._inputRangeEl.value,
        this.value.toString()
      );
      this.fillTrackSlider();
    } else {
      // If the form is invalid, do not update thumb position or background
      this._inputRangeEl.value = value.toString();
      console.log(
        'this._inputRangeEl.value ',
        this._inputRangeEl.value,
        this.value.toString()
      );
      this.fillTrackSlider();
      console.warn(
        'Invalid value; skipping slider fill & value update to avoid visual inconsistency.'
      );
    }
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // get validity state from inputEl, combine customError flag if invalidText is provided
    let isValid = true;
    let message = '';

    // Validate slider input value against min, max, and step
    const val = this.value;
    const min = this.min;
    const max = this.max;
    const step = this.step;
    const isStepValid = (val - min) % step === 0 || step === 1;

    if (val < min || val > max) {
      isValid = false;
      message = `Value must be between ${min} and ${max}.`;
    } else if (!isStepValid) {
      isValid = false;
      message = `Value must be a multiple of ${step}.`;
    }
    if (this.editableInput && this._inputEl) {
      const Validity =
        this.invalidText !== ''
          ? { ...this._inputEl.validity, customError: true }
          : this._inputEl.validity;
      // set validationMessage to invalidText if present, otherwise use inputEl validationMessage
      const ValidationMessage =
        this.invalidText !== ''
          ? this.invalidText
          : this._inputEl.validationMessage;
      console.log('validate');
      // set validity on custom element, anchor to inputEl
      this._internals.setValidity(Validity, ValidationMessage, this._inputEl);
      // set internal validation message if value was changed by user input
      if (interacted) {
        this._internalValidationMsg = this._inputEl.validationMessage;
      }
    } else {
      // Fall back to slider input element
      this._internals.setValidity(
        !isValid ? { customError: true } : {},
        !isValid ? message : '',
        this._inputRangeEl
      );
      console.log('message', message);
      this._internalValidationMsg = message;
    }

    // focus the form field to show validity
    if (report) {
      this._internals.reportValidity();
    }
    this._isInvalid = !isValid;
  }

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    // skip update if internal properties have changed
    const onlyInternalChanges = [...changedProps.keys()].every((prop) =>
      ['tooltipVisible', 'tooltipPosition', '_internalValidationMsg'].includes(
        prop
      )
    );
    if (onlyInternalChanges) return;
    this._onUpdated(changedProps);

    if (this._isInvalid) {
      this._inputRangeEl.style.pointerEvents = 'none';
    } else {
      this._inputRangeEl.style.pointerEvents = '';
    }
    if (changedProps.has('disabled') || changedProps.has('showTicks')) {
      this.fillTrackSlider();
    }
    if (
      changedProps.has('value') ||
      changedProps.has('min') ||
      changedProps.has('max') ||
      changedProps.has('step')
    ) {
      console.log('value changed');
      this.handleValueChange();
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    this._themeObserver.observe(
      document.querySelector('meta[name="color-scheme"]'),
      { attributes: true }
    );
  }

  override disconnectedCallback() {
    this._themeObserver.disconnect();
    super.disconnectedCallback();
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
