import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import DateRangePickerScss from './daterangepicker.scss';

/**
 * Date-Range picker
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} minDate - Mimimum date in YYYY-MM-DD format. If the value isn't a possible date string in the format, then the element has no minimum date value.
 * @prop {string} maxDate - Maximum date in YYYY-MM-DD format. If the value isn't a possible date string in the format, then the element has no maximum date value
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends LitElement {
  static override styles = DateRangePickerScss;
  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /**
   * Attached internals for form association.
   * @ignore
   */
  @state()
  internals = this.attachInternals();

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

  /** Datepicker name. */
  @property({ type: String })
  name = '';

  /** Makes the date required. */
  @property({ type: Boolean })
  required = false;

  /** Date disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Date invalid text. */
  @property({ type: String })
  invalidText = '';

  /** Date warning text */
  @property({ type: String })
  warnText = '';

  /** Maximum date in YYYY-MM-DD format.
   * If the value isn't a possible date string in the format, then the element has no maximum date value
   */
  @property({ type: String })
  maxDate = '';

  /** Minimum date in YYYY-MM-DD format,
   * If the value isn't a possible date string in the format, then the element has no minimum date value.
   */
  @property({ type: String })
  minDate = '';

  /** Specifies the granularity that the value must adhere to, or the special value any,
   * For date inputs, the value of step is given in days; and is treated as a number of milliseconds equal to 86,400,000 times the step value.
   * The default value of step is 1, indicating 1 day.*/
  @property({ type: String })
  step = '';

  override render() {
    return html`
      <label
        class="datepicker-label-text"
        for=${this.name}
        ?disabled=${this.disabled}
      >
        ${this.required ? html`<span class="required">*</span>` : null}
        <slot></slot>
      </label>

      <div
        class="${classMap({
          'input-wrapper': true,
        })}"
      >
        <input
          class="${classMap({
            'size--sm': this.size === 'sm',
            'size--lg': this.size === 'lg',
          })}"
          type="date"
          id=${this.name ? this.name : 'date-range-1'}
          name=${this.name}
          value=${this.startDate}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?invalid=${this.invalidText !== ''}
          min=${ifDefined(this.minDate)}
          max=${ifDefined(this.maxDate)}
          step=${ifDefined(this.step)}
          @input=${(e: any) => this.handleStartDate(e)}
        />
      </div>

      <span class="range-span">—</span>
      <div class="input-wrapper">
        <input
          class="${classMap({
            'size--sm': this.size === 'sm',
            'size--lg': this.size === 'lg',
          })}"
          type="date"
          id=${this.name ? `${this.name}-2` : 'date-range-2'}
          value=${this.endDate}
          ?disabled=${this.disabled}
          ?invalid=${this.invalidText !== ''}
          min=${ifDefined(this.startDate ?? '')}
          max=${ifDefined(this.maxDate)}
          step=${ifDefined(this.step)}
          @input=${(e: any) => this.handleEndDate(e)}
        />
      </div>

      ${this.caption !== ''
        ? html` <div class="caption">${this.caption}</div> `
        : null}
      ${this.invalidText !== ''
        ? html` <div class="error">${this.invalidText}</div> `
        : null}
      ${this.warnText !== '' && this.invalidText === ''
        ? html`<div class="warn">${this.warnText}</div>`
        : null}
    `;
  }

  override updated(changedProps: PropertyValues) {
    if (changedProps.has('startDate')) {
      // set form data value
      this.internals.setFormValue(this.startDate);
      this.internals.setValidity({});
      this.invalidText = '';
      // set validity
      if (this.required && (!this.startDate || this.startDate === '')) {
        this.internals.setValidity(
          { valueMissing: true },
          'Start date is required.'
        );
      }
      this.invalidText = this.internals.validationMessage;
      return;
    }
    if (changedProps.has('endDate')) {
      this.internals.setFormValue(this.endDate);
      this.startDate !== '' &&  this.endDate !== '' ? this.internals.setValidity({}) : null;
      this.startDate !== '' &&  this.endDate !== '' ? this.invalidText = '' : this.invalidText;
      // set validity
      if (this.required && (!this.endDate || this.endDate === '')) {
        this.internals.setValidity(
          { valueMissing: true },
          'End date is required.'
        );
      }
      this.invalidText = this.internals.validationMessage;
      return;
    }
  }

  private handleStartDate(e: any) {
    this.startDate = e.target.value;
  }
  private handleEndDate(e: any) {
    this.endDate = e.target.value;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
