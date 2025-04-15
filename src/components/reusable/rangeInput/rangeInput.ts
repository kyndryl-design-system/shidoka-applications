import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './rangeInput.scss';
import { FormMixin } from '../../../common/mixins/form-input';
import '../button';
import { deepmerge } from 'deepmerge-ts';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

const _defaultTextStrings = {
  error: 'Error',
};

/**
 * Range input To be deleted.
 * @fires on-input - Captures the input event and emits the value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-range-input')
export class RangeInput extends FormMixin(LitElement) {
  static override styles = Styles;

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Input value. */
  @property({ type: Number })
  override value = 0;

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Maximum value. */
  @property({ type: Number })
  max!: number;

  /** Minimum value. */
  @property({ type: Number })
  min!: number;

  /** Step value. */
  @property({ type: Number })
  step = 1;

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

  /** Internal tooltipVisible state.
   * @internal
   */
  @state()
  tooltipVisible = true;

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
    // this.fillTrackSlider();
  });

  override render() {
    // Calculate the number of ticks based on the step, min, and max values
    const tickCount = Math.floor((this.max - this.min) / this.step);
    return html`
      <div ?disabled=${this.disabled}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${this.label}
          <slot name="tooltip"></slot>
        </label>
        <div class="slider-container">
  <input type="range" min=${ifDefined(this.min)}
  max=${ifDefined(
    this.max
  )} value=${this.value.toString()} step="10" class="slider" style="--val: ${this.value.toString()}" @input=${(
      e: any
    ) => this._handleInput(e)}/>
</div>
        <!-- <div style="display: flex;">
          <div style="position: relative;flex-grow: 1;">
            <div style="padding-block-start:1rem;padding-block-end:10px">
              <div>
                <input
                  class=""
                  type="range"
                  id=${this.name}
                  name=${this.name}
                  value=${this.value.toString()}
                  ?disabled=${this.disabled}
                  step=${ifDefined(this.step)}
                  min=${ifDefined(this.min)}
                  max=${ifDefined(this.max)}
                  @input=${(e: any) => this._handleInput(e)}
                />
                generate ticks on slider -->
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

                <span
                  role="tooltip"
                  class="slider-tooltip"
                  style="left: ${this._getTooltipPosition()}; visibility: ${
      this.tooltipVisible ? 'visible' : 'hidden'
    }"
                >
                  ${this.value}
                </span>
              </div>
            </div>
            <!-- generate marker below slider -->
            <div class="steps" aria-hidden="true">
              ${Array.from({
                length: Math.floor((this.max - this.min) / this.step) + 1,
              }).map((_, index, array) => {
                const value = this.min + index * this.step;
                const position =
                  ((value - this.min) / (this.max - this.min)) * 100;

                // Only display the label for the first and last steps
                const label =
                  index === 0 || index === array.length - 1 ? value : '';

                return html`
                  <div class="step-container" style="left: ${position}%;">
                    <div class="step-label">${label}</div>
                  </div>
                `;
              })}
            </div>
          </div>
          <div style="margin-inline-start: 1rem;">
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
        </div> 
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
                    aria-label=${this._textStrings.error}
                    >${unsafeSVG(errorIcon)}</span
                  >
                  ${this.invalidText || this._internalValidationMsg}
                </div>
              `
            : null
        }
      </div>
    `;
  }

  // Get tooltip position
  private _getTooltipPosition() {
    return this.tooltipPosition;
  }

  private _handleNumberInput(e: any) {
    if (e.target.value === '') {
      // this.value = 0;
      this._inputEl.value = '0';
      // this._inputRangeEl.value = '0';
    } else {
      this.value = Number(e.target.value);
    }
    this._validate(true, false);

    this._emitValue(e);

    // this.fillTrackSlider();
  }

  private _handleInput(e: any) {
    if (e.target.value === '') {
      this.value = 0;
      this._inputRangeEl.value = '0';
    } else {
      this.value = Number(e.target.value);
    }
    e.target.style.setProperty('--val', e.target.value);
    // this.fillTrackSlider();
    this._emitValue(e);
    const editableInput = this.shadowRoot?.querySelector(
      'input[type="number"]'
    );
    if (editableInput) {
      (editableInput as HTMLInputElement).value = this.value.toString();
    }
    this._validate(true, false);
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
    if (!this._inputEl) return;
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
          ? getTokenThemeVal('--kd-color-text-level-disabled')
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

  private fillTrackSlider() {
    const inputEl = this.shadowRoot?.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;
    if (!inputEl) return;
    const value = Number(this._inputRangeEl.value);
    const min = this.min;
    const max = this.max;
    const step = this.step;
    const defaultFilledColor = getTokenThemeVal(
      '--kd-color-border-level-tertiary'
    );

    console.log('value', Number(this._inputRangeEl.value));

    //this.showTickMarkOnSlider(value, newVal, min, max, step);

    // Ensure value is clamped within the valid range
    const clampedValue = Math.min(Math.max(value, min), max);

    const newVal = Number(((value - min) * 100) / (max - min));

    const newPosition = 10 - newVal * 0.2;
    this.tooltipPosition = `calc(${newVal}% + (${newPosition}px))`;

    this.showTickMarkOnSlider(value, clampedValue, min, max, step);

    // Handle edge case where step is larger than the range
    const range = max - min;
    if (range <= 0 || this.step > range) {
      console.log('invalid range');
      inputEl.style.background = `${defaultFilledColor}`;
      return;
    }

    // Calculate the position of the slider value
    let pos = (clampedValue - min) / range;
    pos = Math.round(pos * 99); // Convert to percentage

    const trackProgressFillColor = this.disabled
      ? getTokenThemeVal('--kd-color-text-level-disabled')
      : getTokenThemeVal('--kd-color-border-container-selected');
    inputEl.style.background = `linear-gradient(90deg, ${trackProgressFillColor} ${pos}%, ${defaultFilledColor} ${
      pos + 1
    }%`;
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
    if (
      changedProps.has('value') ||
      changedProps.has('min') ||
      changedProps.has('max') ||
      changedProps.has('step') ||
      changedProps.has('disabled')
    ) {
      this._inputRangeEl.value = this.value.toString();
      console.log('value', this._inputRangeEl.value);
      //this.fillTrackSlider();
    }
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-range-input': RangeInput;
  }
}
