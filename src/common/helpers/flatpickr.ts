import flatpickr from 'flatpickr';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';
import { Instance } from 'flatpickr/dist/types/instance';
import { BaseOptions, Hook } from 'flatpickr/dist/types/options';
import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/l10n/default.js';
import { langsArray, SupportedLocale } from '../flatpickrLangs';

let flatpickrStylesInjected = false;

interface BaseFlatpickrContext {
  getFlatpickrOptions: () => Promise<Partial<BaseOptions>>;
  setCalendarAttributes: (instance: Instance) => void;
  setInitialDates?: (instance: Instance) => void;
}

interface SingleFlatpickrContext extends BaseFlatpickrContext {
  inputEl: HTMLElement;
}

interface RangeFlatpickrContext extends BaseFlatpickrContext {
  inputEl: HTMLElement;
  endinputEl?: HTMLElement;
}

const DATE_FORMAT_OPTIONS = {
  'Y-m-d': 'yyyy-mm-dd',
  'm-d-Y': 'mm-dd-yyyy',
  'd-m-Y': 'dd-mm-yyyy',
  'Y-m-d H:i': 'yyyy-mm-dd —— : ——',
  'Y-m-d h:i K': 'yyyy-mm-dd —— : ——',
  'm-d-Y H:i': 'mm-dd-yyyy —— : ——',
  'm-d-Y h:i K': 'mm-dd-yyyy —— : ——',
  'd-m-Y H:i': 'dd-mm-yyyy —— : ——',
  'd-m-Y h:i K': 'dd-mm-yyyy —— : ——',
  'Y-m-d H:i:s': 'yyyy-mm-dd —— : —— ——',
  'm-d-Y H:i:s': 'mm-dd-yyyy —— : —— ——',
  'd-m-Y H:i:s': 'dd-mm-yyyy —— : —— ——',
} as const;

type DateFormatOption = keyof typeof DATE_FORMAT_OPTIONS;

interface FlatpickrOptionsContext {
  locale: string;
  dateFormat?: string;
  defaultDate?: string | Date | string[] | Date[];
  defaultHour?: number;
  defaultMinute?: number;
  enableTime: boolean;
  twentyFourHourFormat?: boolean;
  endinputEl?: HTMLElement;
  inputEl: HTMLElement;
  allowInput?: boolean;
  minDate?: string | number | Date;
  maxDate?: string | number | Date;
  minTime?: string | number | Date;
  maxTime?: string | number | Date;
  enable?: (string | number | Date)[];
  disable?: (string | number | Date)[];
  onChange?: Hook;
  onClose?: Hook;
  onOpen?: Hook;
  loadLocale: (locale: string) => Promise<Partial<Locale>>;
  mode?: 'single' | 'multiple' | 'range' | 'time';
  closeOnSelect?: boolean;
  wrap?: boolean;
  noCalendar?: boolean;
  appendTo?: HTMLElement;
  static?: boolean;
}

export function isSupportedLocale(locale: string): boolean {
  const baseLocale = locale.split('-')[0].toLowerCase();
  return langsArray.includes(baseLocale as SupportedLocale);
}

export function preventFlatpickrOpen(
  event: Event,
  setShouldFlatpickrOpen: (value: boolean) => void
): void {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  setShouldFlatpickrOpen(false);
}

export function handleInputClick(
  setShouldFlatpickrOpen: (value: boolean) => void
): void {
  setShouldFlatpickrOpen(true);
}

export function handleInputFocus(
  shouldFlatpickrOpen: boolean,
  closeFlatpickr: () => void,
  setShouldFlatpickrOpen: (value: boolean) => void
): void {
  if (!shouldFlatpickrOpen) {
    closeFlatpickr();
    setShouldFlatpickrOpen(true);
  }
}

export function modifyWeekdayShorthands(localeOptions: Partial<Locale>): void {
  if (localeOptions.weekdays && localeOptions.weekdays.shorthand) {
    localeOptions.weekdays.shorthand = localeOptions.weekdays.shorthand.map(
      (day) => day.charAt(0)
    ) as [string, string, string, string, string, string, string];
  }
}

export function injectFlatpickrStyles(customStyle: string): void {
  if (!flatpickrStylesInjected) {
    const styleElement = document.createElement('style');
    styleElement.id = 'flatpickr-custom-styles';
    styleElement.textContent = customStyle;
    document.head.appendChild(styleElement);
    flatpickrStylesInjected = true;
  }
}

export async function initializeMultiAnchorFlatpickr(
  context: RangeFlatpickrContext
): Promise<Instance | undefined> {
  const {
    inputEl,
    endinputEl,
    getFlatpickrOptions,
    setCalendarAttributes,
    setInitialDates,
  } = context;

  if (!inputEl) {
    console.error('Cannot initialize Flatpickr: inputEl is undefined');
    return undefined;
  }

  try {
    const options = await getFlatpickrOptions();

    const getInputElement = (el: HTMLElement): HTMLInputElement => {
      if (el instanceof HTMLInputElement) {
        return el;
      } else {
        try {
          let input = el.querySelector('input') as HTMLInputElement | null;
          if (!input) {
            input = document.createElement('input');
            input.type = 'text';
            input.style.display = 'none';
            if (!el.isConnected) {
              throw new Error('Element is not connected to the DOM');
            }
            el.appendChild(input);
          }
          return input;
        } catch (error) {
          console.error('Error creating or appending input element:', error);
          throw error;
        }
      }
    };

    const inputElement = getInputElement(inputEl);
    if (endinputEl) {
      const endInputElement = getInputElement(endinputEl);
      options.plugins = [
        ...(options.plugins || []),
        rangePlugin({ input: endInputElement }),
      ];
    }

    const flatpickrInstance = flatpickr(inputElement, options) as Instance;

    if (flatpickrInstance) {
      setTimeout(() => {
        if (setCalendarAttributes) {
          setCalendarAttributes(flatpickrInstance);
        }
      }, 0);

      if (setInitialDates) {
        setInitialDates(flatpickrInstance);
      }

      if (!(inputEl instanceof HTMLInputElement)) {
        inputEl.addEventListener('click', () => {
          flatpickrInstance.open();
        });
      }

      if (endinputEl && !(endinputEl instanceof HTMLInputElement)) {
        endinputEl.addEventListener('click', () => {
          flatpickrInstance.open();
        });
      }

      return flatpickrInstance;
    } else {
      console.error('Failed to initialize Flatpickr');
      return undefined;
    }
  } catch (error) {
    console.error('Error initializing Flatpickr:', error);
    return undefined;
  }
}

export async function initializeSingleAnchorFlatpickr(
  context: SingleFlatpickrContext & { appendTo?: HTMLElement }
): Promise<Instance | undefined> {
  const {
    inputEl,
    getFlatpickrOptions,
    setCalendarAttributes,
    setInitialDates,
    appendTo,
  } = context;
  if (!inputEl) {
    console.error('Cannot initialize Flatpickr: inputEl is undefined');
    return undefined;
  }
  try {
    const options = await getFlatpickrOptions();
    const effectiveDateFormat =
      options.dateFormat || (options.mode === 'time' ? 'H:i' : 'Y-m-d');
    options.dateFormat = effectiveDateFormat;

    let inputElement: HTMLInputElement;
    if (inputEl instanceof HTMLInputElement) {
      inputElement = inputEl;
      options.clickOpens = true;
    } else {
      try {
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.style.display = 'none';

        const targetElement = appendTo || inputEl;
        if (!targetElement) {
          throw new Error('No valid element to append input to');
        }

        targetElement.appendChild(inputElement);
        options.clickOpens = false;
        options.positionElement = inputEl;
      } catch (error) {
        console.error('Error creating input element:', error);
        throw error;
      }
    }
    const flatpickrInstance = flatpickr(inputElement, options) as Instance;
    if (flatpickrInstance) {
      setTimeout(() => {
        if (setCalendarAttributes) {
          setCalendarAttributes(flatpickrInstance);
        }
      }, 0);
      if (setInitialDates) {
        setInitialDates(flatpickrInstance);
      }
      if (!(inputEl instanceof HTMLInputElement)) {
        inputEl.addEventListener('click', () => flatpickrInstance.open());
      }
      return flatpickrInstance;
    } else {
      console.error('Failed to initialize Flatpickr');
      return undefined;
    }
  } catch (error) {
    console.error('Error initializing Flatpickr:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return undefined;
  }
}

export function isValidDateFormat(format: string): format is DateFormatOption {
  return format in DATE_FORMAT_OPTIONS;
}

export function getPlaceholder(
  dateFormat: string,
  isDateRange?: boolean
): string {
  if (!dateFormat) {
    return isDateRange ? 'yyyy-mm-dd to yyyy-mm-dd' : 'yyyy-mm-dd';
  }

  if (isValidDateFormat(dateFormat)) {
    const placeholder = isDateRange
      ? `${DATE_FORMAT_OPTIONS[dateFormat]} to ${DATE_FORMAT_OPTIONS[dateFormat]}`
      : DATE_FORMAT_OPTIONS[dateFormat];
    return placeholder;
  }
  return 'Select date';
}

export function getModalContainer(element: HTMLElement): HTMLElement {
  return (
    ['kyn-modal', 'kyn-side-drawer']
      .map((selector) => element.closest(selector))
      .find((el): el is HTMLElement => el !== null) || document.body
  );
}

export async function getFlatpickrOptions(
  context: FlatpickrOptionsContext
): Promise<Partial<BaseOptions>> {
  if (!context) {
    console.error('Context is required for getFlatpickrOptions');
    return {};
  }

  const {
    locale,
    dateFormat,
    enableTime,
    twentyFourHourFormat,
    inputEl,
    allowInput,
    minDate,
    maxDate,
    minTime,
    maxTime,
    defaultDate,
    defaultHour,
    defaultMinute,
    enable,
    disable,
    mode = 'single',
    closeOnSelect,
    wrap = false,
    noCalendar = false,
    appendTo,
    onChange,
    onClose,
    onOpen,
    loadLocale,
  } = context;

  if (!locale) {
    console.warn('Locale not provided. Falling back to default.');
  }

  if (!dateFormat) {
    console.warn('Date format not provided. Using default format.');
  }

  let localeOptions;
  try {
    localeOptions = await loadLocale(locale);
    modifyWeekdayShorthands(localeOptions);
  } catch (error) {
    console.warn('Error loading locale, falling back to default:', error);
    localeOptions = English;
  }

  const baseLocale = locale.split('-')[0].toLowerCase();
  const isEnglishOr12HourLocale = ['en', 'es'].includes(baseLocale);

  const isWideScreen = window.innerWidth >= 767;

  const effectiveDateFormat =
    dateFormat ||
    (mode === 'time' ? (twentyFourHourFormat ? 'H:i' : 'h:i K') : 'Y-m-d');

  const options: Partial<BaseOptions> = {
    dateFormat: effectiveDateFormat,
    mode: mode === 'time' ? 'single' : mode,
    enableTime: mode === 'time' ? true : enableTime,
    noCalendar: mode === 'time' ? true : noCalendar,
    defaultDate: defaultDate,
    enableSeconds: false,
    allowInput: allowInput || false,
    clickOpens: true,
    time_24hr:
      typeof twentyFourHourFormat === 'boolean'
        ? twentyFourHourFormat
        : !isEnglishOr12HourLocale,
    weekNumbers: false,
    static: context.static ?? false,
    wrap,
    showMonths: mode === 'range' && isWideScreen ? 2 : 1,
    monthSelectorType: 'static',
    locale: localeOptions,
    closeOnSelect: closeOnSelect ?? !(mode === 'multiple' || enableTime),
    onChange: (selectedDates, dateStr, instance) => {
      onChange && onChange(selectedDates, dateStr, instance);
    },
    onClose: (selectedDates, dateStr, instance) => {
      if (mode === 'range' && instance.calendarContainer) {
        const timeContainer =
          instance.calendarContainer.querySelector('.flatpickr-time');
        if (selectedDates.length === 0) {
          timeContainer?.classList.add('default-time-select');
          timeContainer?.classList.remove('start-date', 'end-date');
        }
      }
      onClose && onClose(selectedDates, dateStr, instance);
    },
    onOpen: (selectedDates, dateStr, instance) => {
      onOpen && onOpen(selectedDates, dateStr, instance);
    },
  };

  if (mode === 'range') {
    options.onReady = (_, __, instance) => {
      if (instance.calendarContainer) {
        const timeContainer =
          instance.calendarContainer.querySelector('.flatpickr-time');
        timeContainer?.classList.add('default-time-select');
      }
    };
  }

  if (!(inputEl instanceof HTMLInputElement)) {
    options.positionElement = inputEl;
  }

  if (minDate) options.minDate = minDate;
  if (maxDate) options.maxDate = maxDate;
  if (minTime) options.minTime = minTime;
  if (maxTime) options.maxTime = maxTime;

  if (defaultDate) {
    if (
      Array.isArray(defaultDate) &&
      (mode === 'range' || mode === 'multiple')
    ) {
      options.defaultDate = defaultDate;
    } else if (!Array.isArray(defaultDate)) {
      if (typeof defaultDate === 'string') {
        let parsedDate: Date | null = null;
        switch (effectiveDateFormat) {
          case 'Y-m-d': {
            const [year, month, day] = defaultDate.split('-').map(Number);
            parsedDate =
              !isNaN(year) && !isNaN(month) && !isNaN(day)
                ? new Date(year, month - 1, day, 12)
                : null;
            break;
          }
          case 'd-m-Y': {
            const [day, month, year] = defaultDate.split('-').map(Number);
            parsedDate =
              !isNaN(day) && !isNaN(month) && !isNaN(year)
                ? new Date(year, month - 1, day, 12)
                : null;
            break;
          }
          case 'm-d-Y': {
            const [month, day, year] = defaultDate.split('-').map(Number);
            parsedDate =
              !isNaN(month) && !isNaN(day) && !isNaN(year)
                ? new Date(year, month - 1, day, 12)
                : null;
            break;
          }
          default:
            parsedDate = new Date(defaultDate);
            break;
        }
        options.defaultDate = parsedDate || defaultDate;
      }
    }
  }
  if (defaultHour !== undefined && defaultHour !== null)
    options.defaultHour = defaultHour;
  if (defaultMinute !== undefined && defaultMinute !== null)
    options.defaultMinute = defaultMinute;
  if (enable && enable.length > 0) options.enable = enable;
  if (disable && disable.length > 0) {
    options.disable = disable.map((date) => {
      if (date instanceof Date) return date;
      if (typeof date === 'number') return new Date(date);
      if (typeof date === 'string') {
        const parsed = flatpickr.parseDate(date, effectiveDateFormat);
        return parsed || date;
      }
      return date;
    });
  }
  if (appendTo) options.appendTo = appendTo;

  return options;
}

export function updateEnableTime(dateFormat: string): boolean {
  return dateFormat.includes('H:') || dateFormat.includes('h:');
}

export function setCalendarAttributes(
  instance: Instance,
  modalDetected?: boolean
): void {
  if (instance?.calendarContainer) {
    requestAnimationFrame(() => {
      try {
        const { calendarContainer, config } = instance;
        calendarContainer.setAttribute('role', 'application');
        calendarContainer.setAttribute('aria-label', 'Calendar');

        calendarContainer.classList.remove('container-modal', 'container-body');
        const containerClass = modalDetected
          ? 'container-modal'
          : 'container-default';
        calendarContainer.classList.add(containerClass);

        if (config && typeof config.static !== 'undefined') {
          calendarContainer.classList.remove(
            'static-position-true',
            'static-position-false'
          );
          calendarContainer.classList.add(`static-position-${config.static}`);
        }
      } catch (error) {
        console.warn('Error setting calendar attributes:', error);
      }
    });
  } else {
    console.warn('Calendar container not available...');
  }
}

const localeCache: Record<string, Partial<Locale>> = {};

export async function loadLocale(locale: string): Promise<Partial<Locale>> {
  if (locale === 'en') return English;
  if (localeCache[locale]) return localeCache[locale];
  if (!isSupportedLocale(locale)) {
    console.warn(`Unsupported locale "${locale}". Falling back to English.`);
    return English;
  }
  try {
    const baseLocale = locale.split('-')[0].toLowerCase();
    const module = await import(`flatpickr/dist/l10n/${baseLocale}.js`);
    const localeConfig =
      module[baseLocale] ?? module.default?.[baseLocale] ?? module.default;
    if (!localeConfig) {
      console.warn(
        `Locale configuration not found for "${locale}". Falling back to English.`
      );
      return English;
    }
    localeCache[locale] = localeConfig;
    return localeConfig;
  } catch (error) {
    console.error(
      `Failed to load locale "${locale}". Falling back to English.`,
      error
    );
    return English;
  }
}

export function hideEmptyYear(): void {
  const currentMonth = document.querySelector(
    '.flatpickr-current-month span.cur-month'
  ) as HTMLElement;
  document.querySelectorAll('.numInputWrapper').forEach((wrapper) => {
    const yearInput = wrapper.querySelector(
      '.numInput.cur-year'
    ) as HTMLInputElement;
    if (
      yearInput &&
      yearInput.min &&
      yearInput.max &&
      yearInput.min === yearInput.max
    ) {
      (wrapper as HTMLElement).style.display = 'none';

      if (currentMonth) {
        currentMonth.style.marginLeft = 'auto';
      }
    }
  });
}

export function validate(
  inputEl: HTMLInputElement,
  required: boolean,
  invalidText: string,
  defaultErrorMessage: string,
  hasInteracted: boolean,
  internals: ElementInternals
): { isValid: boolean; validationMessage: string } {
  if (!inputEl) {
    console.warn('Input element is undefined...');
    return { isValid: true, validationMessage: '' };
  }

  const isEmpty = !inputEl.value.trim();
  const isRequired = required;

  let validity = inputEl.validity;
  let validationMessage = inputEl.validationMessage;

  if (isRequired && isEmpty) {
    validity = { ...validity, valueMissing: true };
    validationMessage = defaultErrorMessage;
  }

  if (invalidText) {
    validity = { ...validity, customError: true };
    validationMessage = invalidText;
  }

  internals.setValidity(validity, validationMessage, inputEl);

  const isValid =
    !invalidText && (!hasInteracted || !isEmpty || (isEmpty && !isRequired));

  return { isValid, validationMessage };
}

export function emitValue(
  element: HTMLElement,
  eventName: string,
  detail: any
): void {
  element.dispatchEvent(
    new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    })
  );
}

export async function clearFlatpickrInput(
  flatpickrInstance: Instance | undefined,
  inputEl: HTMLInputElement | undefined,
  updateCallback?: () => void
): Promise<void> {
  if (flatpickrInstance) {
    flatpickrInstance.clear();
  }

  if (inputEl) {
    inputEl.value = '';
  }

  if (updateCallback) {
    await updateCallback();
  }
}

export async function setupFlatpickr(
  component: HTMLElement,
  inputEl: HTMLInputElement,
  getOptionsCallback: () => Promise<Partial<BaseOptions>>,
  attributesCallback?: (instance: Instance) => void,
  initialDatesCallback?: (instance: Instance) => void
): Promise<Instance | undefined> {
  if (!inputEl || !inputEl.isConnected) {
    console.warn(
      'Cannot initialize Flatpickr: input element not available or not connected to DOM'
    );
    return undefined;
  }

  try {
    const instance = await initializeSingleAnchorFlatpickr({
      inputEl,
      getFlatpickrOptions: getOptionsCallback,
      setCalendarAttributes: (instance) => {
        try {
          if (!instance?.calendarContainer) {
            throw new Error('Calendar container not available');
          }
          const container = getModalContainer(component);
          setCalendarAttributes(instance, container !== document.body);

          if (attributesCallback) {
            attributesCallback(instance);
          }
        } catch (error) {
          console.warn('Error setting calendar attributes:', error);
        }
      },
      setInitialDates: initialDatesCallback,
    });

    if (!instance) {
      throw new Error('Failed to initialize Flatpickr instance');
    }

    hideEmptyYear();
    return instance;
  } catch (error) {
    console.error('Error initializing Flatpickr:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return undefined;
  }
}

export function createFlatpickrDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 100
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

export function validateDateTimeInput(
  inputEl: HTMLInputElement | undefined,
  internals: ElementInternals,
  options: {
    disabled: boolean;
    required: boolean;
    hasValue: boolean;
    hasInteracted: boolean;
    invalidText?: string;
    defaultErrorMessage?: string;
  }
): { isValid: boolean; validationMessage: string } {
  if (!inputEl || !(inputEl instanceof HTMLInputElement)) {
    return { isValid: true, validationMessage: '' };
  }

  if (options.disabled) {
    internals.setValidity({}, '', inputEl);
    return { isValid: true, validationMessage: '' };
  }

  const isEmpty = !options.hasValue;
  const isRequired = options.required;

  let validity = inputEl.validity;
  let validationMessage = inputEl.validationMessage;

  if (isRequired && isEmpty) {
    validity = { ...validity, valueMissing: true };
    validationMessage = options.defaultErrorMessage || 'This field is required';
  }

  if (options.invalidText) {
    validity = { ...validity, customError: true };
    validationMessage = options.invalidText;
  }

  const isValid = !validity.valueMissing && !validity.customError;

  if (!isValid && !validationMessage) {
    validationMessage = 'Please provide a valid value';
  }

  internals.setValidity(validity, validationMessage, inputEl);

  return {
    isValid: isValid,
    validationMessage: validationMessage,
  };
}

export enum DateRangeEditableMode {
  BOTH = 'both',
  START = 'start',
  END = 'end',
  NONE = 'none',
}

export function addLockedDateStyles(): void {
  const styleId = 'kyn-date-range-picker-locked-dates-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .flatpickr-locked-date:not(.flatpickr-disabled) {
        opacity: 0.8 !important;
        background: var(--kd-color-date-and-time-picker-background-default) !important;
        border-color: var(--kd-color-date-and-time-picker-border-focus) !important;
        cursor: not-allowed !important;
      }
      .flatpickr-locked-date.inRange {
        color: var(--kd-color-date-and-time-picker-text-secondary) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export function createDateRangeDayLockHandler(
  editableMode: DateRangeEditableMode,
  currentValue: [Date | null, Date | null]
): (
  dObj: Date,
  dStr: string,
  fp: Instance,
  dayElem: HTMLElement & { dateObj: Date }
) => void {
  return (_dObj, _dStr, _fp, dayElem: HTMLElement & { dateObj: Date }) => {
    const currentDate = dayElem.dateObj;

    if (
      editableMode === DateRangeEditableMode.END &&
      currentValue[0] !== null
    ) {
      if (currentDate.getTime() <= currentValue[0].getTime()) {
        if (currentDate.getTime() === currentValue[0].getTime()) {
          dayElem.classList.add('flatpickr-locked-date');
          dayElem.setAttribute('title', 'Start date is locked');
          dayElem.setAttribute('locked', 'start');
          dayElem.setAttribute('aria-readonly', 'true');
        } else {
          dayElem.classList.add('flatpickr-locked-date', 'flatpickr-disabled');
          dayElem.setAttribute('title', 'Date is not available');
        }
      }
    } else if (
      editableMode === DateRangeEditableMode.START &&
      currentValue[1] !== null
    ) {
      if (currentDate.getTime() >= currentValue[1].getTime()) {
        if (currentDate.getTime() === currentValue[1].getTime()) {
          dayElem.classList.add('flatpickr-locked-date');
          dayElem.setAttribute('title', 'End date is locked');
          dayElem.setAttribute('locked', 'end');
          dayElem.setAttribute('aria-readonly', 'true');
        } else {
          dayElem.classList.add('flatpickr-locked-date', 'flatpickr-disabled');
          dayElem.setAttribute('title', 'Date is not available');
        }
      }
    } else if (
      editableMode === DateRangeEditableMode.NONE &&
      currentValue[0] !== null &&
      currentValue[1] !== null
    ) {
      if (currentDate.getTime() === currentValue[0].getTime()) {
        dayElem.classList.add('flatpickr-locked-date');
        dayElem.setAttribute('title', 'Date is locked');
        dayElem.setAttribute('locked', 'start');
        dayElem.setAttribute('aria-readonly', 'true');
      } else if (currentDate.getTime() === currentValue[1].getTime()) {
        dayElem.classList.add('flatpickr-locked-date');
        dayElem.setAttribute('title', 'Date is locked');
        dayElem.setAttribute('locked', 'end');
        dayElem.setAttribute('aria-readonly', 'true');
      } else if (
        currentDate.getTime() > currentValue[0].getTime() &&
        currentDate.getTime() < currentValue[1].getTime()
      ) {
        dayElem.classList.add('flatpickr-locked-date');
        dayElem.setAttribute('title', 'Date is in selected range');
      } else {
        dayElem.classList.add('flatpickr-locked-date', 'flatpickr-disabled');
        dayElem.setAttribute('title', 'Date is not available');
      }
    }

    if (
      dayElem.classList.contains('flatpickr-disabled') &&
      !dayElem.classList.contains('flatpickr-locked-date')
    ) {
      dayElem.classList.add('flatpickr-locked-date');
    }
  };
}

export function createDateRangeChangeLockHandler(
  editableMode: DateRangeEditableMode,
  currentValue: [Date | null, Date | null],
  originalOnChange: Hook | Hook[]
): (selectedDates: Date[], dateStr: string, instance: Instance) => void {
  return (selectedDates, dateStr, instance) => {
    if (
      editableMode === DateRangeEditableMode.NONE &&
      currentValue[0] !== null &&
      currentValue[1] !== null
    ) {
      instance.setDate([currentValue[0], currentValue[1]], false);
      return;
    }

    if (currentValue[0] === null && currentValue[1] === null) {
      callOriginalOnChange(originalOnChange, selectedDates, dateStr, instance);
      return;
    }

    if (
      editableMode === DateRangeEditableMode.END &&
      currentValue[0] !== null
    ) {
      let modified = false;
      const newDates = [...selectedDates];

      if (
        selectedDates.length === 2 &&
        selectedDates[0].getTime() !== currentValue[0].getTime()
      ) {
        newDates[0] = currentValue[0];
        modified = true;
      } else if (selectedDates.length === 1) {
        newDates.splice(0, 0, currentValue[0]);
        modified = true;
      }

      if (modified) {
        instance.setDate(newDates, false);
        callOriginalOnChange(
          originalOnChange,
          newDates,
          instance.input.value,
          instance
        );
        return;
      }
    }

    if (
      editableMode === DateRangeEditableMode.START &&
      currentValue[1] !== null
    ) {
      let modified = false;
      const newDates = [...selectedDates];

      if (
        selectedDates.length === 2 &&
        selectedDates[1].getTime() !== currentValue[1].getTime()
      ) {
        newDates[1] = currentValue[1];
        modified = true;
      } else if (selectedDates.length === 1) {
        newDates.push(currentValue[1]);
        modified = true;
      }

      if (modified) {
        instance.setDate(newDates, false);
        callOriginalOnChange(
          originalOnChange,
          newDates,
          instance.input.value,
          instance
        );
        return;
      }
    }

    callOriginalOnChange(originalOnChange, selectedDates, dateStr, instance);
  };
}

function callOriginalOnChange(
  originalOnChange: Hook | Hook[],
  selectedDates: Date[],
  dateStr: string,
  instance: Instance
): void {
  try {
    if (typeof originalOnChange === 'function') {
      originalOnChange(selectedDates, dateStr, instance);
    } else if (Array.isArray(originalOnChange)) {
      originalOnChange.forEach((hook) => {
        if (typeof hook === 'function') {
          try {
            hook(selectedDates, dateStr, instance);
          } catch (e) {
            console.warn('Error in onChange hook:', e);
          }
        }
      });
    }
  } catch (e) {
    console.warn('Error calling original onChange handler:', e);
  }
}

export function applyDateRangeEditingRestrictions(
  options: Partial<BaseOptions>,
  editableMode: DateRangeEditableMode,
  currentValue: [Date | null, Date | null]
): Partial<BaseOptions> {
  const newOptions = { ...options };

  if (editableMode === DateRangeEditableMode.BOTH) {
    return newOptions;
  }

  addLockedDateStyles();

  const originalOnChange = newOptions.onChange;

  newOptions.clickOpens = true;

  try {
    newOptions.onDayCreate = createDateRangeDayLockHandler(
      editableMode,
      currentValue
    ) as any;

    newOptions.onChange = createDateRangeChangeLockHandler(
      editableMode,
      currentValue,
      originalOnChange || (() => {})
    );
  } catch (e) {
    console.warn('Error setting up date range editing restrictions:', e);
  }

  return newOptions;
}
