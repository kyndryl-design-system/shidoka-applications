import { html, LitElement } from 'lit';
import { FormMixin } from '../../../common/mixins/form-input';
import { customElement, query } from 'lit/decorators.js';

@customElement('kyn-date-range-picker')
export class DateRangePicker extends FormMixin(LitElement) {
  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  _inputEl!: HTMLInputElement;

  override render() {
    return html`<div class="date-picker flatpickr" id="flatpickr-input">
      CUSTOM DATE RANGE PICKER
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
