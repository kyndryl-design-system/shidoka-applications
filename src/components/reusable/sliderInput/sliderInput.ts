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
  @property({ type: Number })
  max!: number;

  /** Specifies minimum allowed range. */
  @property({ type: Number })
  min!: number;

  /** Specifies step intervals */
  @property({ type: Number })
  step = 1;

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
  _inputEl!: HTMLInputElement;

  _themeObserver: any = new MutationObserver(() => {
    this.fillTrackSlider();
  });

  override render() {
    const classes = {
      'display-value': true,
      'editable-input': this.showlimits && this.editableInput,
    };

    const orientationClasses = {
      range: true,
      'show-limits': this.showlimits || !this.editableInput,
      'editable-input_wolimits': !this.showlimits && this.editableInput,
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
        <div class="${classMap(orientationClasses)}">
          <!-- div for tick mark alignment -->
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
              @input=${(e: any) => this._handleInput(e)}
              @focus=${() => this.showTooltip()}
              @blur=${() => this.hideTooltip()}
            />
            <!-- Dynamically generate ticks -->
            ${this.showTicks
              ? html`
                  ${Array.from({ length: tickCount + 1 }).map((_, index) => {
                    // Adjust the last tick to be at 99% instead of 100%
                    const tickPosition =
                      index === tickCount
                        ? '100%'
                        : ((index * 100) / tickCount).toFixed(2) + '%';
                    const style = index === 0 ? 'display: none;' : '';
                    return html`
                      <span
                        class="tick"
                        style="left: ${tickPosition};${style}"
                      ></span>
                    `;
                  })}
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
                    @input=${(e: any) => this._handleNumberInput(e)}
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
  private _getTooltipPosition() {
    return this.tooltipPosition;
  }

  // Handle text input
  private _handleNumberInput(e: any) {
    this._isInvalid = false;

    const input = e.target as HTMLInputElement;
    const rawValue = input.value.trim();
    const min = this.min;
    const max = this.max;

    // Handle empty input case
    if (rawValue === '') {
      this.value = 0;
      this._inputEl.value = '0';
      return;
    }

    const numValue = Number(rawValue);
    // Validate the input value within min and max range

    if (
      !isNaN(numValue) &&
      numValue >= min &&
      numValue <= max &&
      (numValue - min) % this.step === 0
    ) {
      this.value = numValue;
      this._validate(true, false);
      this.emitDispatchEvent(e);
      input.setCustomValidity('');
    } else {
      this._isInvalid = true;
      let errorMessage = `Value must be between ${this.min} and ${this.max}`;
      if ((numValue - min) % this.step !== 0) {
        errorMessage += ` and in increments of ${this.step}`;
      }
      input.setCustomValidity(errorMessage);
      this._internalValidationMsg = errorMessage;
    }
  }

  // Handle input event
  // This is triggered when the user interacts with the slider
  private _handleInput(e: any) {
    if (this._isInvalid) {
      e.preventDefault();
      return;
    }
    this.value = e.target.value;
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

  // Handle the track slider fill
  private fillTrackSlider() {
    const inputEl = this.shadowRoot?.querySelector('input');
    const value = parseFloat(this.value);
    const min = this.min;
    const max = this.max;
    const step = this.step;

    // Calculate the position of the slider value
    let pos = (value - min) / (max - min);
    // thumb width 20px
    const thumbCorrect = 16 * (pos - 0.5) * -1;

    // this.tooltipPosition = `calc(${value}% + (${8 - value * 0.15}px))`;

    const newVal = Number(((value - min) * 100) / (max - min));
    // thumb width 20px/2 10px
    this.tooltipPosition = `calc(${newVal}% + (${8 - newVal * 0.18}px))`;
    //console.log('input width', `calc(${newVal}% + (${8 - newVal * 0.15}px))`);
    // console.log(
    //   'thumb correct----',
    //   `calc(${pos * 100}% + (${thumbCorrect}px))`
    // );

    // Update the tick color based on the progress
    if (this.showTicks) {
      const ticks = this.shadowRoot?.querySelectorAll('.tick');
      ticks?.forEach((tick: any) => {
        const tickPosition = parseFloat(tick.style.left);
        // If the tick is before the progress (i.e., within the filled range), set its color to white
        if (tickPosition <= newVal) {
          tick.style.backgroundColor = this.disabled ? 'grey' : 'white'; // Change to white
        } else {
          tick.style.backgroundColor = 'black'; // Default color for unfilled ticks
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

    pos = Math.round(pos * 99); // track the progress
    const trackProgessFillColor = this.disabled
      ? getTokenThemeVal('--kd-color-text-level-disabled')
      : getTokenThemeVal('--kd-color-border-container-selected');
    if (inputEl) {
      inputEl.style.background = `linear-gradient(to right, ${trackProgessFillColor} ${pos}%, ${getTokenThemeVal(
        '--kd-color-background-accent-tertiary'
      )} ${pos + 1}%)`;
    }
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
      const min = this.min;
      const max = this.max;
      let currentValue = parseFloat(this.value);

      // Ensure value is within the bounds of min/max
      currentValue = Math.min(Math.max(currentValue, min), max);
      this.value = currentValue.toString();

      inputEl.min = this.min.toString();
      inputEl.max = this.max.toString();
      this.fillTrackSlider();
    }
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

    // skip update if internal properties have changed
    const onlyInternalChanges = [...changedProps.keys()].every((prop) =>
      ['tooltipVisible', 'tooltipPosition', '_internalValidationMsg'].includes(
        prop
      )
    );
    if (this._isInvalid) {
      this._inputEl.style.pointerEvents = 'none';
    } else {
      this._inputEl.style.pointerEvents = '';
    }
    if (onlyInternalChanges) return;

    this._onUpdated(changedProps);

    if (changedProps.has('disabled') || changedProps.has('showTicks')) {
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
