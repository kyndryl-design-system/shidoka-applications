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
    return Boolean(this._inputEl?.value) || this.value.some((d) => d !== null);
  }

  override render(): TemplateResult {
    const anchorId =
      this.name ||
      `${COMPONENT_ID_PREFIX}-${Math.random().toString(36).slice(2)}`;
    const placeholder = getPlaceholder(this.dateFormat, true);
    const showClear = this.hasValue() && !this.readonly && !this.disabled;

    if (this.multiInput) {
      return this.renderMultiInputStructure(anchorId, placeholder, showClear);
    }

    return this.renderBaseStructure(anchorId, placeholder, showClear);
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

  override async firstUpdated(changedProps: PropertyValues): Promise<void> {
    await super.firstUpdated(changedProps);
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
    await this.initializeFlatpickr();
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('dateRangePickerDisabled')) {
      this.disabled = this.dateRangePickerDisabled;
    }
  }

  protected updateFormValue(): void {
    if (this._internals && this._inputEl) {
      const val = this.value
        .filter(Boolean)
        .map((d) => (d as Date).toISOString())
        .join(',');
      this._internals.setFormValue(val);
      this._inputEl.setAttribute('value', val);
    }
  }

  protected async getComponentFlatpickrOptions(): Promise<
    Partial<BaseOptions>
  > {
    const opts = await this.getBaseFlatpickrOptions();
    opts.mode = 'range';
    opts.closeOnSelect = this.closeOnSelection;

    const isWideScreen = window.innerWidth >= VIEWPORT_BREAKPOINT;
    opts.showMonths = isWideScreen ? (this.showSingleMonth ? 1 : 2) : 1;

    const originalOnOpen = opts.onOpen;
    opts.onOpen = (selectedDates, dateStr, instance) => {
      this._checkAndUpdateForViewportChange();

      if (!this.multiInput && originalOnOpen) {
        if (typeof originalOnOpen === 'function') {
          originalOnOpen(selectedDates, dateStr, instance);
        } else if (Array.isArray(originalOnOpen)) {
          originalOnOpen.forEach((hook) =>
            hook(selectedDates, dateStr, instance)
          );
        }
      }
    };

    if (this.defaultDate && Array.isArray(this.defaultDate)) {
      const validatedDates = this._validateAndFilterDefaultDates(
        this.defaultDate,
        this.dateFormat,
        this.minDate,
        this.maxDate
      );

      if (validatedDates.validDates.length > 0) {
        opts.defaultDate = validatedDates.validDates;
      }

      if (validatedDates.hasErrors) {
        this._hasInteracted = true;
        this.invalidText = validatedDates.errorMessage;
      }
    }

    if (this.rangeEditMode !== DateRangeEditableMode.BOTH) {
      return applyDateRangeEditingRestrictions(
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

    const current = this.value ?? [null, null];
    const bothSelected = start instanceof Date && end instanceof Date;
    const isProgrammatic = event?.type === 'input' || event?.type === 'change';

    const valueChanged =
      current[0]?.getTime() !== start?.getTime() ||
      current[1]?.getTime() !== end?.getTime();

    if (bothSelected && valueChanged && !isProgrammatic) {
      this.value = [start, end];
      this.updateFormValue();
      await this.updateComplete;
    }

    this.emitFlatpickrChange(
      instance,
      [start ?? null, end ?? null],
      dateStr,
      event
    );
  }

  protected override async _handleClear(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.flatpickrInstance) {
      console.warn('Cannot clear: Flatpickr instance not available');
      return;
    }

    this._isClearing = true;

    try {
      await this.clearValue();
      this.flatpickrInstance.clear();
      this.invalidText = '';
      this.emitChangeEvent();
      this._validate(true, false);
      this.requestUpdate();
    } catch (error) {
      console.error('Error clearing picker:', error);
    } finally {
      this._isClearing = false;
    }
  }

  protected override emitChangeEvent(source?: string): void {
    if (this.flatpickrInstance) {
      const dateStr = (this._inputEl as HTMLInputElement)?.value || '';
      const selectedDates = this.value.filter(
        (date): date is Date => date !== null
      );
      this.emitFlatpickrChange(this.flatpickrInstance, selectedDates, dateStr, {
        type: source ?? 'manual',
      } as Event);
    }
  }

  protected getAriaLabel(): string {
    return 'Date range picker';
  }

  protected getPickerIcon(): string {
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

  public override async initializeFlatpickr() {
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());

    if (this.multiInput) {
      this.flatpickrInstance = await initializeMultiAnchorFlatpickr({
        inputEl: this._inputEl,
        endinputEl: this._endInputEl,
        config: await this.getComponentFlatpickrOptions(),
        onChange: (selectedDates, dateStr, instance, event) =>
          this.handleDateChange(selectedDates, dateStr, instance, event),
        onReady: (_, __, instance) => {
          const isWideScreen = window.innerWidth >= VIEWPORT_BREAKPOINT;
          const shouldShowSingleMonth = !isWideScreen || this.showSingleMonth;

          if (shouldShowSingleMonth && instance.calendarContainer) {
            instance.calendarContainer.classList.add(
              'flatpickr-calendar-single-month'
            );
          }

          setCalendarAttributes(instance, false);
        },
        setInitialDates: (instance) => this.setInitialDates(instance),
      });
    } else {
      await super.initializeFlatpickr();
    }
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
