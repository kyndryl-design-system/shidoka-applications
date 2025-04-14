import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import Styles from './sliderInput1.scss';
import { FormMixin } from '../../../common/mixins/form-input';
import '../button';
import { deepmerge } from 'deepmerge-ts';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

const _defaultTextStrings = {
  error: 'Error',
};

/**
 * Slider input example .
 * @fires on-input - Captures the input event and emits the value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-slider-input1')
export class SliderInput1 extends FormMixin(LitElement) {
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

  /** Visually hide the label. */
  @property({ type: Boolean })
  enableTicksOnSlider = false;

  /** Visually hide the label. */
  @property({ type: Boolean })
  enableScaleMarkers = false;

  /** Set this to `true` for editable Input. */
  @property({ type: Boolean })
  editableInput = false;

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
    this.showTickMarkOnSlider();
  });

  override render() {
    // Calculate the number of ticks based on the step, min, and max values
    const styles = {
      'slider-wrapper': true,
      'margin-bottom20': this.enableScaleMarkers,
    };

    const tickCount = Math.floor((this.max - this.min) / this.step);
    return html`
      <div class="text-input" ?disabled=${this.disabled}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${this.label}
          <slot name="tooltip"></slot>
        </label>
        <div style="display: flex;">
          <div class="${classMap(styles)}">
            <div class="slider-container">
              <input
                class=""
                type="range"
                id=${this.name}
                name=${this.name}
                aria-label="slider range input"
                value=${this.value.toString()}
                ?disabled=${this.disabled}
                step=${ifDefined(this.step)}
                min=${ifDefined(this.min)}
                max=${ifDefined(this.max)}
                @input=${(e: any) => this._handleInput(e)}
                @focus=${() => this.showTooltip()}
                @blur=${() => this.hideTooltip()}
              />
              <!-- generate ticks and label on & below slider -->
              ${this.enableTicksOnSlider
                ? html`
                    <div class="tick-container">
                      ${Array.from({ length: tickCount + 1 }).map(
                        (_, index) => {
                          const tickPosition =
                            index === tickCount
                              ? '100%'
                              : ((index * 100) / tickCount).toFixed(2) + '%';
                          //   const style = index === 0 ? '' : '';
                          const midIndex = Math.floor(tickCount / 2);
                          const maxOffset = 10; // Maximum offset in pixels
                          const offset =
                            index === 0 || index === tickCount
                              ? 0 // No offset for the last tick
                              : index <= midIndex
                              ? maxOffset - (index * maxOffset) / midIndex // Decrease offset proportionally until mid
                              : -((index - midIndex) * maxOffset) / midIndex; //Decrease offset negatively

                          const label = this.min + index * this.step;
                          const isMin = index === 0;
                          const isMax = index === tickCount;
                          const isMid = index === midIndex;
                          const displayLabel =
                            isMin || isMid || isMax ? label : '';
                          return html`
                            ${this.enableScaleMarkers
                              ? html` <div
                                  class="tick-label"
                                  style="left: calc(${tickPosition} + ${offset}px);"
                                >
                                  ${displayLabel}
                                </div>`
                              : html` <div
                                  class="tick"
                                  style="left: calc(${tickPosition} + ${offset}px);"
                                ></div>`}
                          `;
                        }
                      )}
                    </div>
                  `
                : null}
              ${this.tooltipVisible && !this.editableInput
                ? html` <span
                    role="tooltip"
                    class="slider-tooltip"
                    style="left: ${this._getTooltipPosition()}; visibility: ${this
                      .tooltipVisible
                      ? 'visible'
                      : 'hidden'}"
                  >
                    ${this.value}
                  </span>`
                : null}
            </div>
            <!-- generate marker below slider -->
            <div aria-hidden="true">
              <!-- ${Array.from({
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
              })} -->
            </div>
          </div>
          ${this.editableInput
            ? html`
                <div class="number-input">
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

  // Handle show the tooltip
  private showTooltip() {
    this.tooltipVisible = true;
  }

  // Handle hide the tooltip
  private hideTooltip() {
    this.tooltipVisible = false;
  }

  private _handleInput(e: any) {
    if (e.target.value === '') {
      this.value = 0;
      this._inputRangeEl.value = '0';
    } else {
      this.value = Number(e.target.value);
    }
    this.showTickMarkOnSlider();
    this._emitValue(e);
    const editableInput = this.shadowRoot?.querySelector(
      'input[type="number"]'
    );
    if (editableInput) {
      (editableInput as HTMLInputElement).value = this.value.toString();
    }
    this._validate(true, false);
  }

  private _handleNumberInput(e: any) {
    if (e.target.value === '') {
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

  // Get tooltip position
  private _getTooltipPosition() {
    return this.tooltipPosition;
  }

  private showTickMarkOnSlider() {
    const inputEl = this.shadowRoot?.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;
    if (!inputEl) return;
    const value = Number(this._inputRangeEl.value);
    const min = this.min;
    const max = this.max;
    const step = this.step;

    const newVal = Number(((value - min) * 100) / (max - min));

    const newPosition = 10 - newVal * 0.2;
    this.tooltipPosition = `calc(${newVal}% + (${newPosition}px))`;

    // Ensure value is clamped within the valid range
    const clampedValue = Math.min(Math.max(value, min), max);
    const ticks = this.shadowRoot?.querySelectorAll('.tick');
    ticks?.forEach((tick: any) => {
      // Get the tick's percentage position from its style
      const tickStyleLeft = tick.style.left;
      const tickPercentage = parseFloat(tickStyleLeft.match(/(\d+)%/));

      // Calculate the current thumb position as a percentage
      const thumbPercentage = ((clampedValue - min) / (max - min)) * 100;

      // Compare the tick's position with the thumb's position
      if (tickPercentage <= thumbPercentage) {
        // Turn the tick white if the thumb has passed it
        tick.style.backgroundColor = this.disabled
          ? getTokenThemeVal('--kd-color-text-level-disabled')
          : getTokenThemeVal('--kd-color-background-accent-subtle'); // White color
      } else {
        // Reset the tick's color if the thumb hasn't passed it
        tick.style.backgroundColor = getTokenThemeVal(
          '--kd-color-background-accent-secondary'
        ); // Default color
      }

      const tickStepPosition = Math.round(tickPercentage); // Round to avoid floating point precision issues
      const valueAtTick = (tickStepPosition * (max - min)) / 100 + min;
      if (Math.abs(value - valueAtTick) < step / 2) {
        // Thumb is exactly on a tick
        tick.style.backgroundColor = this.disabled
          ? getTokenThemeVal('--kd-color-text-level-disabled')
          : 'inherit';
      }
    });
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

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    //skip update if internal properties have changed
    const onlyInternalChanges = [...changedProps.keys()].every((prop) =>
      ['tooltipVisible', 'tooltipPosition', '_internalValidationMsg'].includes(
        prop
      )
    );
    if (onlyInternalChanges) return;
    this._onUpdated(changedProps);

    // if (this._isInvalid) {
    //   this._inputRangeEl.style.pointerEvents = 'none';
    // } else {
    //   this._inputRangeEl.style.pointerEvents = '';
    // }
    // if (changedProps.has('disabled') || changedProps.has('showTicks')) {
    //   // this.fillTrackSlider();
    // }
    if (
      changedProps.has('value') ||
      changedProps.has('min') ||
      changedProps.has('max') ||
      changedProps.has('step')
    ) {
      this._inputRangeEl.value = this.value.toString();
      this._inputEl.value = this.value.toString();
      this.showTickMarkOnSlider();
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
    'kyn-slider-input1': SliderInput1;
  }
}
