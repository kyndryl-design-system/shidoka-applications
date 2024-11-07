import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { DATE_PICKER_TYPES } from '../datePicker/defs';
import { FormMixin } from '../../../common/mixins/form-input';
import DateRangePickerScss from './daterangepicker.scss';
import { deepmerge } from 'deepmerge-ts';
import '../../reusable/loaders/skeleton';

const _defaultTextStrings = {
  requiredText: 'Required',
};

/**
 * Date-Range picker
 * @fires on-input - Captures the input event and emits the selected values and original event details. (Only if startDate <= endDate)
 * @prop {string} minDate - Mimimum date in YYYY-MM-DD format. If the value isn't a possible date string in the format, then the element has no minimum date value.
 * @prop {string} maxDate - Maximum date in YYYY-MM-DD format. If the value isn't a possible date string in the format, then the element has no maximum date value.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends FormMixin(LitElement) {
  static override styles = DateRangePickerScss;

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Datepicker size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Datepicker Start date in YYYY-MM-DD format. */
  @property({ type: String })
  startDate = '';

  /** Datepicker End date in YYYY-MM-DD format. */
  @property({ type: String })
  endDate = '';

  /** Makes the date required. */
  @property({ type: Boolean })
  required = false;

  /** Date disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Date range picker types. Default 'single' */
  @property({ type: String })
  datePickerType: DATE_PICKER_TYPES = DATE_PICKER_TYPES.SINGLE;

  /** Date warning text */
  @property({ type: String })
  warnText = '';

  /** Maximum date in YYYY-MM-DD format.
   * If the value isn't a possible date string in the format, then the element has no maximum date value
   */
  @property({ type: String })
  maxDate!: string;

  /** Minimum date in YYYY-MM-DD format,
   * If the value isn't a possible date string in the format, then the element has no minimum date value.
   */
  @property({ type: String })
  minDate!: string;

  /** Specifies the granularity that the value must adhere to, or the special value any,
   * For date inputs, the value of step is given in days; and is treated as a number of milliseconds equal to 86,400,000 times the step value.
   * The default value of step is 1, indicating 1 day.*/
  @property({ type: String })
  step!: string;

  /**
   * Queries the Start Date <input> DOM element.
   * @ignore
   */
  @query('input.date-start')
  inputElStart!: HTMLInputElement;

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /**
   * Queries the End Date <input> DOM element.
   * @ignore
   */
  @query('input.date-end')
  inputElEnd!: HTMLInputElement;

  /**
   * skeleton state
   */
  @property({ type: Boolean })
  skeleton = false;

  override render() {
    return html`
      <div class="daterange-picker" ?disabled=${this.disabled}>
        <label class="label-text" for=${this.name} ?disabled=${this.disabled}>
          ${this.required
            ? html`<abbr
                class="required"
                title=${this._textStrings.requiredText}
                aria-label=${this._textStrings.requiredText}
                >*</abbr
              >`
            : null}
          <slot></slot>
        </label>

        <div class="wrapper">
          <div class="input-wrapper">
            ${this.skeleton
              ? html` <kyn-skeleton class="block-skeleton"></kyn-skeleton> `
              : html`
                  <input
                    class="${classMap({
                      'date-start': true,
                      'size--sm': this.size === 'sm',
                      'size--lg': this.size === 'lg',
                    })}"
                    type=${this.datePickerType === DATE_PICKER_TYPES.WITHITIME
                      ? 'datetime-local'
                      : 'date'}
                    id="${this.name}-start"
                    name="${this.name}-end"
                    aria-label="Start Date"
                    value=${this.startDate}
                    ?required=${this.required}
                    ?disabled=${this.disabled}
                    ?invalid=${this._isInvalid}
                    aria-invalid=${this._isInvalid}
                    aria-describedby=${this._isInvalid
                      ? 'error'
                      : this.warnText !== '' && !this._isInvalid
                      ? 'warning'
                      : ''}
                    min=${ifDefined(this.minDate)}
                    max=${ifDefined(this.endDate ?? this.maxDate ?? '')}
                    step=${ifDefined(this.step)}
                    @input=${(e: any) => this.handleStartDate(e)}
                  />
                `}
          </div>

          <span class="range-span">—</span>
          <div class="input-wrapper">
            ${this.skeleton
              ? html` <kyn-skeleton class="block-skeleton"></kyn-skeleton> `
              : html`
                  <input
                    class="${classMap({
                      'date-end': true,
                      'size--sm': this.size === 'sm',
                      'size--lg': this.size === 'lg',
                    })}"
                    type=${this.datePickerType === DATE_PICKER_TYPES.WITHITIME
                      ? 'datetime-local'
                      : 'date'}
                    id="${this.name}-end"
                    name="${this.name}-end"
                    aria-label="End Date"
                    value=${this.endDate}
                    ?required=${this.required}
                    ?disabled=${this.disabled}
                    ?invalid=${this._isInvalid}
                    aria-invalid=${this._isInvalid}
                    aria-describedby=${this._isInvalid
                      ? 'error'
                      : this.warnText !== '' && !this._isInvalid
                      ? 'warning'
                      : ''}
                    min=${ifDefined(this.startDate ?? this.minDate ?? '')}
                    max=${ifDefined(this.maxDate)}
                    step=${ifDefined(this.step)}
                    @input=${(e: any) => this.handleEndDate(e)}
                  />
                `}
          </div>
        </div>

        ${this.caption !== ''
          ? html` <div class="caption">${this.caption}</div> `
          : null}
        ${this._isInvalid
          ? html`
              <div id="error" class="error">
                ${this.invalidText || this._internalValidationMsg}
              </div>
            `
          : null}
        ${this.warnText !== '' && !this._isInvalid
          ? html`<div id="warning" class="warn">${this.warnText}</div>`
          : null}
      </div>
    `;
  }

  override updated(changedProps: PropertyValues) {
    // preserve FormMixin updated function
    this._onUpdated(changedProps);

    if (changedProps.has('startDate')) {
      this.inputElStart.value = this.startDate;
    }

    if (changedProps.has('endDate')) {
      this.inputElEnd.value = this.endDate;
    }

    if (changedProps.has('startDate') || changedProps.has('endDate')) {
      this._validate(false, false);

      const combineVals =
        this.startDate !== '' && this.endDate !== ''
          ? `${this.startDate}:${this.endDate}`
          : '';
      // set form value on element internals
      this._internals.setFormValue(combineVals);
    }
  }

  // on-change start date
  private async handleStartDate(e: any) {
    this.startDate = e.target.value;

    await this.updateComplete;
    this._validate(true, false);
    this._emitValue(e);
  }

  // on-change end date
  private async handleEndDate(e: any) {
    this.endDate = e.target.value;

    await this.updateComplete;
    this._validate(true, false);
    this._emitValue(e);
  }

  private _validate(interacted: Boolean, report: Boolean) {
    const StartValid = this.inputElStart.checkValidity();
    const EndValid = this.inputElEnd.checkValidity();

    if (StartValid && EndValid) {
      // clear validation errors
      this._internals.setValidity({});
    } else if (!StartValid) {
      // validate start date

      // get validity state from inputEl, combine customError flag if invalidText is provided
      const Validity =
        this.invalidText !== ''
          ? { ...this.inputElStart.validity, customError: true }
          : this.inputElStart.validity;

      // set validationMessage to invalidText if present, otherwise use inputEl validationMessage
      const ValidationMessage =
        this.invalidText !== ''
          ? this.invalidText
          : this.inputElStart.validationMessage;

      this._internals.setValidity(
        Validity,
        ValidationMessage,
        this.inputElStart
      );
    } else if (!EndValid) {
      // validate end date

      // get validity state from inputEl, combine customError flag if invalidText is provided
      const Validity =
        this.invalidText !== ''
          ? { ...this.inputElEnd.validity, customError: true }
          : this.inputElEnd.validity;

      // set validationMessage to invalidText if present, otherwise use inputEl validationMessage
      const ValidationMessage =
        this.invalidText !== ''
          ? this.invalidText
          : this.inputElEnd.validationMessage;

      this._internals.setValidity(Validity, ValidationMessage, this.inputElEnd);
    }

    // set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg =
        this.inputElStart.validationMessage ||
        this.inputElEnd.validationMessage;
    }

    // focus the form field to show validity
    if (report) {
      this._internals.reportValidity();
    }
  }

  private _emitValue(e: any) {
    const event = new CustomEvent('on-input', {
      detail: {
        startDate: this.startDate,
        endDate: this.endDate,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  // private _handleFormdata(e: any) {
  //   const combineVals =
  //     this.startDate !== '' && this.endDate !== ''
  //       ? `${this.startDate}:${this.endDate}`
  //       : '';
  //   e.formData.append(this.name, combineVals);
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
