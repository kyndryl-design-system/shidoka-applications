import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import Styles from './sliderInput.scss';
import { FormMixin } from '../../../common/mixins/form-input';
import '../button';
import { deepmerge } from 'deepmerge-ts';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';

const _defaultTextStrings = {
  error: 'Error',
};

/**
 * Slider Input.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {number} min - The minimum value.
 * @prop {number} max - The maximum value.
 * @prop {number} step - The step between values.
 * @slot tooltip - Slot for tooltip.
 *
 */
@customElement('kyn-slider-input')
export class SliderInput extends FormMixin(LitElement) {
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
  max = 100;

  /** Minimum value. */
  @property({ type: Number })
  min = 0;

  /** The step between values */
  @property({ type: Number })
  step = 1;

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

  /** Whether or not to show tick marks on slider */
  @property({ type: Boolean })
  enableTickMarker = false;

  /** Whether or not to show scale marks below slider */
  @property({ type: Boolean })
  enableScaleMarker = false;

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

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input[type="number"]')
  _inputEl!: HTMLInputElement;

  override render() {
    // Calculate the number of ticks based on the step, min, and max values
    const styles = {
      'slider-wrapper': true,
      'mb-20': this.enableScaleMarker,
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
        <div class="slider-container">
          <div class="${classMap(styles)}">
              <input
                type="range"
                id=${this.name}
                name=${this.name}
                value=${this.value.toString()}
                ?disabled=${this.disabled}
                step=${ifDefined(this.step)}
                min=${ifDefined(this.min)}
                max=${ifDefined(this.max)}
                aria-label="slider range input"
                aria-valuetext=${this.value.toString()}
                aria-valuemin=${ifDefined(this.min)}
                aria-valuemax=${ifDefined(this.max)}
                aria-valuenow=${this.value.toString()}
                @input=${(e: any) => this._handleInput(e)}
                @focus=${() => this._showTooltip()}
                @blur=${() => this._hideTooltip()}
              />

        ${this.enableTickMarker ? this._renderTickMarker(tickCount) : null}
          ${this.enableScaleMarker ? this._renderScaleMarker(tickCount) : null}
                ${
                  this.tooltipVisible && !this.editableInput
                    ? this._renderTooltip()
                    : null
                }
              </div>
            ${this.editableInput ? this._renderEditableInput() : null}

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
        </div>
      </div>
    `;
  }

  //render TickMarker Html
  private _renderTickMarker(tickCount: any) {
    return html`
      <div class="tick-wrapper">
        ${Array.from({ length: tickCount + 1 }).map((_, index) => {
          const tickPosition =
            index === tickCount ? '100%' : (index * 100) / tickCount + '%';
          const midIndex = Math.floor(tickCount / 2);
          const maxOffset = 12; // Maximum offset in pixels, --thumb-height/2
          const offset =
            index <= midIndex
              ? maxOffset - (index * maxOffset) / midIndex // Decrease offset proportionally until mid
              : -((index - midIndex) * maxOffset) / midIndex; //Decrease offset negatively

          return html`
            <div
              class="tick"
              style="left: calc(${tickPosition} + ${offset}px);"
            ></div>
          `;
        })}
      </div>
    `;
  }

  //render ScaleMarker Html
  private _renderScaleMarker(tickCount: any) {
    return html`
      <div class="scale-wrapper">
        ${Array.from({ length: tickCount + 1 }).map((_, index) => {
          const midIndex = Math.floor(tickCount / 2);
          const label = this.min + index * this.step;
          const isMin = index === 0;
          const isMax = index === tickCount;
          const isMid = index === midIndex;
          const displayLabel = isMin || isMid || isMax ? label : '';
          return html`
            <span class="scale-wrapper__ticks">${displayLabel}</span>
          `;
        })}
      </div>
    `;
  }

  //render Tooltip Html
  private _renderTooltip() {
    return html` <span
      role="tooltip"
      class="slider-tooltip"
      style="left: ${this._getTooltipPosition()}; visibility: ${this
        .tooltipVisible
        ? 'visible'
        : 'hidden'}"
    >
      ${this.value}
    </span>`;
  }

  //render EditableInput Html
  private _renderEditableInput() {
    return html`
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
    `;
  }

  // Handle show the tooltip
  private _showTooltip() {
    this.tooltipVisible = true;
  }

  // Handle hide the tooltip
  private _hideTooltip() {
    setTimeout(() => {
      this.tooltipVisible = false;
    }, 100);
  }

  private _handleInput(e: any) {
    if (e.target.value === '') {
      this.value = 0;
      this._inputRangeEl.value = '0';
    } else {
      this.value = Number(e.target.value);
    }
    if (!this.editableInput) {
      this._updateTooltipPosition();
    }
    if (this.enableScaleMarker) {
      this.showTickMark();
    }
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

  private _updateTooltipPosition() {
    const inputEl = this.shadowRoot?.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;
    if (!inputEl) return;
    const min = this.min;
    const max = this.max;
    const value = Number(this._inputRangeEl.value);
    const positionRatio = (value - this.min) / (this.max - this.min);
    const knobOffset = 24 * (positionRatio - 0.5) * -1; // knob width 24
    const percentage = Math.floor(((value - min) * 100) / (max - min));
    this.tooltipPosition = `calc(${percentage}% + (${knobOffset}px))`;
  }

  private showTickMark() {
    const inputEl = this.shadowRoot?.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;
    if (!inputEl) return;
    const min = this.min;
    const max = this.max;
    const step = this.step;
    const value = Number(this._inputRangeEl.value);
    const clampedValue = Math.min(Math.max(value, min), max);
    // Ensure value is clamped within the valid range
    const ticks = this.shadowRoot?.querySelectorAll('.tick');
    ticks?.forEach((tick: any) => {
      // Get the tick's percentage position from its style
      const tickStyleLeft = tick.style.left;
      const tickPercentage = parseFloat(
        tickStyleLeft.match(/([\d.]+)%/)?.[1] ?? '0'
      );

      // Calculate the current thumb position as a percentage
      const thumbPercentage = ((clampedValue - min) / (max - min)) * 100;

      // Compare the tick's position with the thumb's position
      const isFilled = tickPercentage <= thumbPercentage;
      tick.classList.toggle('tick-filled', isFilled);
      tick.classList.toggle('tick-unfilled', !isFilled);
      tick.classList.remove('tick-OnKnob');

      const tickStepPosition = Math.round(tickPercentage); // Round to avoid floating point precision issues
      const valueAtTick = (tickStepPosition * (max - min)) / 100 + min;
      if (Math.abs(value - valueAtTick) < step / 2) {
        // Thumb is exactly on a tick
        if (this.disabled) {
          tick.style.background = 'none';
        } else {
          tick.classList.add('tick-OnKnob');
          tick.classList.remove('tick-filled', 'tick-unfilled');
          tick.style.background = '';
        }
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
    if (
      changedProps.has('value') ||
      changedProps.has('min') ||
      changedProps.has('max') ||
      changedProps.has('step') ||
      changedProps.has('enableTicksOnSlider') ||
      changedProps.has('disabled')
    ) {
      this._inputRangeEl.value = this.value.toString();
      if (this._inputEl) {
        this._inputEl.value = this.value.toString();
      }
      this.showTickMark();
      this._updateTooltipPosition();
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
