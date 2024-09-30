import { html, LitElement, PropertyValues } from 'lit';
import { FormMixin } from '../../../common/mixins/form-input';
import { customElement, query } from 'lit/decorators.js';
import flatpickr from 'flatpickr';
import l10n from 'flatpickr/dist/l10n/index';

l10n.en.weekdays.shorthand.forEach((_day, index) => {
  const currentDay = l10n.en.weekdays.shorthand;
  if (currentDay[index] === 'Thu' || currentDay[index] === 'Th') {
    currentDay[index] = 'Th';
  } else {
    currentDay[index] = currentDay[index].charAt(0);
  }
});

/**
 * Datepicker -- uses flatpickr datetime picker library `https://flatpickr.js.org/`
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-date-picker')
export class DatePicker extends FormMixin(LitElement) {
  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  _inputEl!: HTMLInputElement;

  override render() {
    return html`<div class="date-picker flatpickr" id="flatpickr-input">
      CUSTOM DATEPICKER
    </div>`;
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    this.setFlatpickr();
  }
  override updated(_changedProperties: PropertyValues): void {
    this.setFlatpickr();
  }

  setFlatpickr() {
    const datePicker = flatpickr('#flatpickr-input', {});
    console.log(datePicker);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-picker': DatePicker;
  }
}
