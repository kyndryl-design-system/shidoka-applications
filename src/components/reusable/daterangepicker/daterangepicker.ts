import { html, TemplateResult, PropertyValues, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property, query } from 'lit/decorators.js';
import flatpickr from 'flatpickr';
import { BaseOptions } from 'flatpickr/dist/types/options';

import {
  FlatpickrBase,
  FlatpickrConfig,
  FlatpickrTextStrings,
} from '../../../common/base/flatpickr-base';
import {
  getPlaceholder,
  injectFlatpickrStyles,
  initializeMultiAnchorFlatpickr,
  setCalendarAttributes,
  applyDateRangeEditingRestrictions,
  DateRangeEditableMode,
} from '../../../common/helpers/flatpickr';

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import '../button';

import DateRangePickerStyles from './daterangepicker.scss?inline';
import ShidokaFlatpickrTheme from '../../../common/scss/shidoka-flatpickr-theme.scss?inline';
import calendarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/calendar.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

const VIEWPORT_BREAKPOINT = 767;
const COMPONENT_ID_PREFIX = 'date-range';

/**
 * Default text strings for the date-range picker.
 */
const _defaultTextStrings = {
  requiredText: 'Required',
  clearAll: 'Clear',
  pleaseSelectDate: 'Please select a date',
  pleaseSelectValidDate: 'Please select a valid date',
  pleaseSelectBothDates: 'Please select a start and end date.',
  dateRange: 'Date range',
  noDateSelected: 'No dates selected',
  startDateSelected: 'Start date selected: {0}. Please select end date.',
  invalidDateRange:
    'Invalid date range: End date cannot be earlier than start date',
  dateRangeSelected: 'Selected date range: {0} to {1}',
  lockedStartDate: 'Start date is locked',
  lockedEndDate: 'End date is locked',
  dateLocked: 'Date is locked',
  dateNotAvailable: 'Date is not available',
  dateInSelectedRange: 'Date is in selected range',
};

/**
 * Date Range Picker: uses Flatpickr library, range picker implementation.
 * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-date-range-picker')
export class DateRangePicker extends FlatpickrBase {
  static override styles = [
    unsafeCSS(DateRangePickerStyles),
    unsafeCSS(ShidokaFlatpickrTheme),
  ];

  private _initialValueSet = false;
  private _initialValue: [Date | null, Date | null] = [null, null];
  private _resizeListener?: () => void;

  /**
   * Controlled value for the date range.
   * @type {[Date | null, Date | null]}
   */
  override value: [Date | null, Date | null] = [null, null];

  /** Editable parts of the date range. */
  @property({ type: String })
  accessor rangeEditMode: DateRangeEditableMode = DateRangeEditableMode.BOTH;

  /** Sets entire date range picker form element to enabled/disabled. */
  @property({ type: Boolean })
  accessor dateRangePickerDisabled = false;

  /** Close on selection. */
  @property({ type: Boolean })
  accessor closeOnSelection = false;

  /** Custom text overrides. */
  @property({ type: Object })
  override accessor textStrings: Partial<FlatpickrTextStrings> =
    _defaultTextStrings;

  protected get config(): FlatpickrConfig {
    return {
      mode: 'range',
      enableTime: false,
      noCalendar: false,
    };
  }

  @query('input[data-end-input]')
  protected accessor _endInputEl!: HTMLInputElement;

  protected hasValue(): boolean {
    return (
      this.value.some((d) => d instanceof Date) ||
      Boolean(this._inputEl?.value?.trim())
    );
  }

  override render(): TemplateResult {
    const anchorId =
      this.name ||
      `${COMPONENT_ID_PREFIX}-${Math.random().toString(36).slice(2)}`;
    const placeholder = getPlaceholder(this.dateFormat, true);
    const showClear = this.hasValue() && !this.readonly && !this.disabled;

    return this.multiInput
      ? this.renderMultiInputStructure(anchorId, placeholder, showClear)
      : this.renderBaseStructure(anchorId, placeholder, showClear);
  }

  protected renderMultiInputStructure(
    anchorId: string,
    placeholder: string,
    showClear: boolean
  ): TemplateResult {
    const fmt = (d: Date) => flatpickr.formatDate(d, this.dateFormat);
    const startId = `${anchorId}-start`;
    const endId = `${anchorId}-end`;

    return html`
      <div id="${anchorId}" class="${classMap(this.getPickerClasses())}">
        <div class="input-group">
          <label class="input-label" for="${startId}">
            ${this._textStrings.startLabel}
          </label>
          <div class="input-wrapper">
            <input
              id="${startId}"
              data-start-input
              class="date-range-picker__input"
              placeholder="${placeholder}"
              .value=${this.value[0] ? fmt(this.value[0]!) : ''}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
            />
            ${this.value[0] && showClear
              ? html`<kyn-button
                  ?disabled=${this.dateRangePickerDisabled}
                  class="clear-button"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${this._handleClearStart}
                >
                  <span style="display:flex;" slot="icon">
                    ${unsafeSVG(clearIcon)}
                  </span>
                </kyn-button>`
              : html`<span class="input-icon" aria-hidden="true">
                  ${unsafeSVG(calendarIcon)}
                </span>`}
          </div>
        </div>

        <div class="input-group">
          <label class="input-label" for="${endId}">
            ${this._textStrings.endLabel}
          </label>
          <div class="input-wrapper">
            <input
              id="${endId}"
              data-end-input
              class="date-range-picker__input"
              placeholder="${placeholder}"
              .value=${this.value[1] ? fmt(this.value[1]!) : ''}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
            />
            ${this.value[1] && showClear
              ? html`<kyn-button
                  ?disabled=${this.dateRangePickerDisabled}
                  class="clear-button"
                  kind="ghost"
                  size="small"
                  description=${this._textStrings.clearAll}
                  @click=${this._handleClearEnd}
                >
                  <span style="display:flex;" slot="icon">
                    ${unsafeSVG(clearIcon)}
                  </span>
                </kyn-button>`
              : html`<span class="input-icon" aria-hidden="true">
                  ${unsafeSVG(calendarIcon)}
                </span>`}
          </div>
        </div>

        <slot name="tooltip"></slot>
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._resizeListener = () => this._checkAndUpdateForViewportChange();
    window.addEventListener('resize', this._resizeListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._resizeListener!);
  }

  override async firstUpdated(changedProps: PropertyValues) {
    await super.firstUpdated(changedProps);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
    await this.initializeFlatpickr();
    this._checkAndUpdateForViewportChange();
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('dateRangePickerDisabled')) {
      this.disabled = this.dateRangePickerDisabled;
    }
    if (changedProperties.has('showSingleMonth') && this.flatpickrInstance) {
      this._checkAndUpdateForViewportChange();
    }
  }

  protected updateFormValue(): void {
    if (this._internals && this._inputEl) {
      const formValue = JSON.stringify([
        this.value[0]?.toISOString() || null,
        this.value[1]?.toISOString() || null,
      ]);
      this._internals.setFormValue(formValue);
      this._inputEl.setAttribute('value', formValue);
    }
  }

  protected async getComponentFlatpickrOptions(): Promise<
    Partial<BaseOptions>
  > {
    let opts = await this.getBaseFlatpickrOptions(false);
    const isWideScreen = window.innerWidth >= VIEWPORT_BREAKPOINT;
    opts.showMonths = this.showSingleMonth || !isWideScreen ? 1 : 2;
    opts.mode = 'range';
    opts.closeOnSelect = this.closeOnSelection;

    const originalOnOpen = opts.onOpen;
    opts.onOpen = (sel, str, inst) => {
      if (!this.multiInput && originalOnOpen) {
        Array.isArray(originalOnOpen)
          ? originalOnOpen.forEach((fn) => fn(sel, str, inst))
          : originalOnOpen(sel, str, inst);
      }
    };

    if (this.defaultDate && Array.isArray(this.defaultDate)) {
      const validated = this._validateAndFilterDefaultDates(
        this.defaultDate,
        this.dateFormat,
        this.minDate,
        this.maxDate
      );
      if (validated.validDates.length) opts.defaultDate = validated.validDates;
      if (validated.hasErrors) {
        this._hasInteracted = true;
        this.invalidText = validated.errorMessage;
      }
    }

    if (this.rangeEditMode !== DateRangeEditableMode.BOTH) {
      opts = applyDateRangeEditingRestrictions(
        opts,
        this.rangeEditMode,
        this._initialValue,
        {
          lockedStartDate: this._textStrings.lockedStartDate,
          lockedEndDate: this._textStrings.lockedEndDate,
          dateLocked: this._textStrings.dateLocked,
          dateNotAvailable: this._textStrings.dateNotAvailable,
          dateInSelectedRange: this._textStrings.dateInSelectedRange,
        }
      );
      opts.mode = 'range';
    }

    return opts;
  }

  protected setInitialDates(instance?: flatpickr.Instance): void {
    const dates = instance?.selectedDates ?? [];
    this.value = [dates[0] ?? null, dates[1] ?? null];
    if (!this._initialValueSet) {
      this._initialValue = [...this.value];
      this._initialValueSet = true;
    }
  }

  protected clearValue(): Promise<void> {
    return Promise.resolve().then(() => {
      this.value = [null, null];
    });
  }

  protected resetValue(): void {
    this.value = [null, null];
  }

  protected override async handleDateChange(
    selectedDates: Date[],
    dateStr: string,
    instance: flatpickr.Instance,
    event?: Event
  ): Promise<void> {
    if (this._isClearing) return;
    this._hasInteracted = true;

    const [start, end] = selectedDates;
    const isProgrammatic = event?.type === 'input' || event?.type === 'change';

    if (
      this.multiInput &&
      selectedDates.length === 1 &&
      start instanceof Date
    ) {
      instance.setDate([start], false);
      this.value = [start, null];
      this.updateFormValue();
      await this.updateComplete;
      this.emitFlatpickrChange(instance, [start], dateStr, event);
      return;
    }

    const bothSelected = start instanceof Date && end instanceof Date;

    if (bothSelected && !isProgrammatic) {
      this.value = [start, end];
      this.updateFormValue();
      await this.updateComplete;
    }

    if (this.multiInput && event?.target) {
      if (event.target === this._inputEl && start instanceof Date) {
        instance.set('minDate', start);
      }
      if (event.target === this._endInputEl && end instanceof Date) {
        instance.set('maxDate', end);
      }
    }

    const emitDates: Date[] = selectedDates.filter(
      (d): d is Date => d instanceof Date
    );
    this.emitFlatpickrChange(instance, emitDates, dateStr, event);
  }

  protected override async _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.flatpickrInstance) return;

    this._isClearing = true;
    try {
      await this.clearValue();
      this.flatpickrInstance.clear();
      this.flatpickrInstance.set('minDate', this.minDate || null);
      this.flatpickrInstance.set('maxDate', this.maxDate || null);
      this.invalidText = '';
      this.emitChangeEvent();
      this._validate(true, false);
      this.requestUpdate();
    } finally {
      this._isClearing = false;
    }
  }

  protected override emitChangeEvent(source?: string): void {
    if (!this.flatpickrInstance) return;
    const dateStr = (this._inputEl as HTMLInputElement).value || '';
    const selected = this.value.filter((d): d is Date => d !== null);
    this.emitFlatpickrChange(
      this.flatpickrInstance,
      selected,
      dateStr,
      new CustomEvent('on-change', { detail: { source } })
    );
  }

  protected getAriaLabel() {
    return 'Date range picker';
  }
  protected getPickerIcon() {
    return calendarIcon;
  }
  protected getPickerClasses(): Record<string, boolean> {
    return {
      'date-range-picker': true,
      'date-range-picker__enable-time': this._enableTime,
      'date-range-picker__disabled': this.disabled,
      'date-range-picker__single-month': this.showSingleMonth,
      'date-range-picker__multi-input': this.multiInput,
      'date-range-picker__multi-input--with-time':
        this.multiInput && this._enableTime,
    };
  }

  override async initializeFlatpickr() {
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());

    if (this.multiInput) {
      const config = await this.getComponentFlatpickrOptions();
      this.flatpickrInstance = await initializeMultiAnchorFlatpickr({
        inputEl: this._inputEl,
        endinputEl: this._endInputEl,
        config,
        onChange: (d, s, i, e) => this.handleDateChange(d, s, i, e),
        onReady: (_, __, inst) => {
          if (inst.calendarContainer && config.showMonths === 1) {
            inst.calendarContainer.classList.add(
              'flatpickr-calendar-single-month'
            );
          }
          setCalendarAttributes(inst, false);
        },
        setInitialDates: (inst) => this.setInitialDates(inst),
      });
    } else {
      await super.initializeFlatpickr();
    }
  }

  protected override async _checkAndUpdateForViewportChange(): Promise<void> {
    if (!this.flatpickrInstance) return;
    const isWide = window.innerWidth >= VIEWPORT_BREAKPOINT;
    const single = !isWide || this.showSingleMonth;
    if (this.flatpickrInstance.calendarContainer) {
      this.flatpickrInstance.set('showMonths', single ? 1 : 2);
      const c = this.flatpickrInstance.calendarContainer;
      c.classList.toggle('flatpickr-calendar-single-month', single);
      const upd = (this.flatpickrInstance as any).updateLayout;
      if (typeof upd === 'function') upd();
    }
  }

  protected override async _clearDateAt(
    index: 0 | 1,
    source: string
  ): Promise<void> {
    if (!this.flatpickrInstance) return;
    const newVal: [Date | null, Date | null] = [...this.value];
    newVal[index] = null;
    this.value = newVal;
    this.updateFormValue();
    this._validate(true, false);

    const emitDates: Date[] = this.value.filter((d): d is Date => d !== null);
    this.emitFlatpickrChange(
      this.flatpickrInstance,
      emitDates,
      (this._inputEl as HTMLInputElement).value,
      new CustomEvent('on-change', { detail: { source } })
    );
  }

  private _handleClearStart = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this._clearDateAt(0, 'clear-start');
  };

  private _handleClearEnd = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this._clearDateAt(1, 'clear-end');
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-date-range-picker': DateRangePicker;
  }
}
