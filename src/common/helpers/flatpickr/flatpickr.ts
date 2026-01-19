import flatpickr from 'flatpickr';
import rangePlugin from 'flatpickr/dist/esm/plugins/rangePlugin';
import { Instance } from 'flatpickr/dist/types/instance';
import { BaseOptions, Hook } from 'flatpickr/dist/types/options';
import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/esm/l10n/default.js';
import { loadLocale as loadLocaleFromLangs } from './langs';
import { fixedOverlayPositionPlugin } from './overlay';

let flatpickrStylesInjected = false;

export const _defaultCalendarTooltipStrings = {
  lockedStartDate: 'Start date is locked',
  lockedEndDate: 'End date is locked',
  dateLocked: 'Date is locked',
  dateNotAvailable: 'Date is not available',
  dateInSelectedRange: 'Date is in selected range',
};

export type FlatpickrTextStrings = Partial<
  typeof _defaultCalendarTooltipStrings
>;

let currentTooltipStrings = { ..._defaultCalendarTooltipStrings };

export function setTooltipStrings(
  customTextStrings: FlatpickrTextStrings = {}
): void {
  currentTooltipStrings = {
    ..._defaultCalendarTooltipStrings,
    ...customTextStrings,
  };
}

export function getTextStrings(
  customTextStrings: FlatpickrTextStrings = {}
): typeof _defaultCalendarTooltipStrings {
  return { ...currentTooltipStrings, ...customTextStrings };
}

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
  'Y-m-d H:i:S': 'yyyy-mm-dd —— : —— ——',
  'm-d-Y H:i:s': 'mm-dd-yyyy —— : —— ——',
  'm-d-Y H:i:S': 'mm-dd-yyyy —— : —— ——',
  'd-m-Y H:i:s': 'dd-mm-yyyy —— : —— ——',
  'd-m-Y H:i:S': 'dd-mm-yyyy —— : —— ——',
} as const;

type DateFormatOption = keyof typeof DATE_FORMAT_OPTIONS;

interface FlatpickrOptionsContext {
  locale: string;
  dateFormat?: string;
  /** @deprecated Prefer passing pre-normalized `value` and using setInitialDates in the component. */
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
  onReady?: Hook;
  loadLocale: (locale: string) => Promise<Partial<Locale>>;
  mode?: 'single' | 'multiple' | 'range' | 'time';
  closeOnSelect?: boolean;
  wrap?: boolean;
  noCalendar?: boolean;
  appendTo?: HTMLElement;
  static?: boolean;
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
  if (localeOptions.weekdays?.shorthand) {
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

      const __anchorClickHandlers: { el: HTMLElement; fn: EventListener }[] =
        [];

      if (!(inputEl instanceof HTMLInputElement)) {
        const handler = () => {
          flatpickrInstance.open();
        };
        inputEl.addEventListener('click', handler);
        __anchorClickHandlers.push({ el: inputEl, fn: handler });
      }

      if (endinputEl && !(endinputEl instanceof HTMLInputElement)) {
        const handler = () => {
          flatpickrInstance.open();
        };
        endinputEl.addEventListener('click', handler);
        __anchorClickHandlers.push({ el: endinputEl, fn: handler });
      }

      (flatpickrInstance as any).__anchorClickHandlers = __anchorClickHandlers;

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
        const handler = () => flatpickrInstance.open();
        inputEl.addEventListener('click', handler);
        (flatpickrInstance as any).__anchorClickHandlers = [
          { el: inputEl, fn: handler },
        ];
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

export function loadLocale(locale: string): Promise<Partial<Locale>> {
  return loadLocaleFromLangs(locale);
}

export function getModalContainer(element: HTMLElement): HTMLElement {
  let node: Node | null = element;

  while (node) {
    if (node instanceof ShadowRoot) {
      node = node.host;
      continue;
    }

    if (node instanceof Element) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'kyn-modal' || tag === 'kyn-side-drawer') {
        return node as HTMLElement;
      }
      node = node.parentNode;
      continue;
    }

    break;
  }

  return document.body;
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

  const isWideScreen =
    typeof window !== 'undefined' && window.innerWidth >= 767;

  const effectiveDateFormat =
    dateFormat ||
    (mode === 'time' ? (twentyFourHourFormat ? 'H:i' : 'h:i K') : 'Y-m-d');

  const modalContainer = getModalContainer(context.inputEl);
  const inOverlay = modalContainer !== document.body;

  const options: Partial<BaseOptions> = {
    dateFormat: effectiveDateFormat,
    mode: mode === 'time' ? 'single' : mode,
    enableTime: mode === 'time' ? true : enableTime,
    noCalendar: mode === 'time' ? true : noCalendar,
    defaultDate: defaultDate,
    enableSeconds: effectiveDateFormat.toLowerCase().includes(':s'),
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

  if (inOverlay) {
    options.appendTo = modalContainer;
    options.static = false;
    (options.plugins ||= []).push(
      fixedOverlayPositionPlugin({
        offset: 6,
        minViewportMargin: 8,
        preferTop: false,
      }) as any
    );
  }

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
  const df = dateFormat || '';
  return (
    df.includes('H:') || df.includes('h:') || df.toLowerCase().includes(':s')
  );
}

export function setCalendarAttributes(
  instance: Instance,
  modalDetected = false
): void {
  if (!instance || !instance.config) {
    return;
  }

  const container = instance.calendarContainer;
  if (!container) return;

  const { minDate, maxDate } = instance.config;
  if (minDate && maxDate) {
    const minY = new Date(minDate).getFullYear();
    const maxY = new Date(maxDate).getFullYear();
    if (minY === maxY) {
      container.classList.add('single-year');
    } else {
      container.classList.remove('single-year');
    }
  }

  requestAnimationFrame(() => {
    if (!instance || !instance.config) {
      return;
    }

    const mode = instance.config.mode as
      | 'single'
      | 'multiple'
      | 'range'
      | 'time';

    container.setAttribute('role', 'application');
    container.setAttribute('aria-label', 'Calendar');
    container.classList.remove(
      'container-modal',
      'container-body',
      'container-default'
    );
    container.classList.add(
      modalDetected ? 'container-modal' : 'container-default'
    );

    const monthsEl = container.querySelector<HTMLElement>('.flatpickr-months');
    monthsEl?.setAttribute('tabindex', '0');
    monthsEl?.setAttribute('role', 'group');
    monthsEl?.setAttribute('aria-label', 'Month and year navigation');

    const prevBtn = container.querySelector<HTMLElement>(
      '.flatpickr-prev-month'
    );
    prevBtn?.setAttribute('tabindex', '0');
    prevBtn?.setAttribute('role', 'button');
    prevBtn?.setAttribute('aria-label', 'Previous month');
    if (prevBtn) {
      const anyPrev = prevBtn as any;
      if (anyPrev._kynKeydown) {
        prevBtn.removeEventListener('keydown', anyPrev._kynKeydown);
      }
      const prevKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          instance.changeMonth(-1);
        }
      };
      prevBtn.addEventListener('keydown', prevKeydown);
      anyPrev._kynKeydown = prevKeydown;
    }

    const nextBtn = container.querySelector<HTMLElement>(
      '.flatpickr-next-month'
    );
    nextBtn?.setAttribute('tabindex', '0');
    nextBtn?.setAttribute('role', 'button');
    nextBtn?.setAttribute('aria-label', 'Next month');
    if (nextBtn) {
      const anyNext = nextBtn as any;
      if (anyNext._kynKeydown) {
        nextBtn.removeEventListener('keydown', anyNext._kynKeydown);
      }
      const nextKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          instance.changeMonth(1);
        }
      };
      nextBtn.addEventListener('keydown', nextKeydown);
      anyNext._kynKeydown = nextKeydown;
    }

    const firstMonth = container.querySelector<HTMLElement>('.flatpickr-month');
    const yearInput = firstMonth?.querySelector<HTMLInputElement>(
      'input.numInput.cur-year'
    );
    if (yearInput) {
      yearInput.tabIndex = 0;
      yearInput.setAttribute('role', 'spinbutton');
      yearInput.setAttribute('aria-label', 'Year');
      if (instance.config.minDate) {
        yearInput.setAttribute(
          'aria-valuemin',
          String(new Date(instance.config.minDate!).getFullYear())
        );
      }
      if (instance.config.maxDate) {
        yearInput.setAttribute(
          'aria-valuemax',
          String(new Date(instance.config.maxDate!).getFullYear())
        );
      }
      const updateNow = () =>
        yearInput.setAttribute('aria-valuenow', yearInput.value);

      const anyYear = yearInput as any;
      if (anyYear._kynKeydown) {
        yearInput.removeEventListener('keydown', anyYear._kynKeydown);
      }

      const yearKeydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          instance.changeYear(1);
          setTimeout(updateNow, 0);
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          instance.changeYear(-1);
          setTimeout(updateNow, 0);
        }
      };

      yearInput.addEventListener('keydown', yearKeydown);
      anyYear._kynKeydown = yearKeydown;
      setTimeout(updateNow, 0);
    }

    const daysGrid = container.querySelector<HTMLElement>('.flatpickr-days');
    daysGrid?.removeAttribute('tabindex');
    daysGrid?.setAttribute('role', 'grid');
    daysGrid?.setAttribute(
      'aria-multiselectable',
      mode === 'multiple' ? 'true' : 'false'
    );

    const enabledDays = Array.from(
      container.querySelectorAll<HTMLElement>(
        '.flatpickr-day:not(.flatpickr-disabled)'
      )
    );
    enabledDays.forEach((day) => {
      day.tabIndex = 0;
      day.setAttribute('role', mode === 'range' ? 'gridcell' : 'button');
    });

    const oldNav = (container as any)._keyboardNav as EventListener | undefined;
    if (oldNav) container.removeEventListener('keydown', oldNav);

    const keyboardNav = (e: KeyboardEvent) => {
      const targetDay = (e.target as HTMLElement).closest<HTMLElement>(
        '.flatpickr-day:not(.flatpickr-disabled)'
      );
      if (!targetDay) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          targetDay.click();
          return;
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowUp': {
          e.preventDefault();
          const idx = enabledDays.indexOf(targetDay);
          let nextIdx: number;
          switch (e.key) {
            case 'ArrowRight':
              nextIdx = idx + 1;
              break;
            case 'ArrowLeft':
              nextIdx = idx - 1;
              break;
            case 'ArrowDown':
              nextIdx = idx + 7;
              break;
            case 'ArrowUp':
              nextIdx = idx - 7;
              break;
            default:
              return;
          }
          const next = enabledDays[nextIdx];
          if (next) next.focus();
          return;
        }
      }
    };
    container.addEventListener('keydown', keyboardNav);
    (container as any)._keyboardNav = keyboardNav;

    const hourInput = container.querySelector<HTMLInputElement>(
      'input.flatpickr-hour'
    );
    if (hourInput) {
      hourInput.tabIndex = 0;
      hourInput.setAttribute('role', 'spinbutton');
      hourInput.setAttribute('aria-label', 'Hour');
      hourInput.setAttribute('aria-valuemin', hourInput.min);
      hourInput.setAttribute('aria-valuemax', hourInput.max);
      hourInput.setAttribute('aria-valuenow', hourInput.value);

      const anyHour = hourInput as any;
      if (anyHour._kynKeydown) {
        hourInput.removeEventListener('keydown', anyHour._kynKeydown);
      }

      const hourKeydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          hourInput.stepUp();
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          hourInput.stepDown();
        }
        setTimeout(
          () => hourInput.setAttribute('aria-valuenow', hourInput.value),
          0
        );
      };

      hourInput.addEventListener('keydown', hourKeydown);
      anyHour._kynKeydown = hourKeydown;

      // add click handlers for hour arrow buttons
      const hourWrapper = hourInput.closest('.numInputWrapper');
      if (hourWrapper) {
        const hourArrowUp = hourWrapper.querySelector<HTMLElement>('.arrowUp');
        const hourArrowDown =
          hourWrapper.querySelector<HTMLElement>('.arrowDown');

        if (hourArrowUp) {
          const anyArrowUp = hourArrowUp as any;
          if (anyArrowUp._kynClick) {
            hourArrowUp.removeEventListener('click', anyArrowUp._kynClick);
          }
          const arrowUpClick = () => {
            hourInput.stepUp();
            hourInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(
              () => hourInput.setAttribute('aria-valuenow', hourInput.value),
              0
            );
          };
          hourArrowUp.addEventListener('click', arrowUpClick);
          anyArrowUp._kynClick = arrowUpClick;
        }

        if (hourArrowDown) {
          const anyArrowDown = hourArrowDown as any;
          if (anyArrowDown._kynClick) {
            hourArrowDown.removeEventListener('click', anyArrowDown._kynClick);
          }
          const arrowDownClick = () => {
            hourInput.stepDown();
            hourInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(
              () => hourInput.setAttribute('aria-valuenow', hourInput.value),
              0
            );
          };
          hourArrowDown.addEventListener('click', arrowDownClick);
          anyArrowDown._kynClick = arrowDownClick;
        }
      }
    }

    const minuteInput = container.querySelector<HTMLInputElement>(
      'input.flatpickr-minute'
    );
    if (minuteInput) {
      minuteInput.tabIndex = 0;
      minuteInput.setAttribute('role', 'spinbutton');
      minuteInput.setAttribute('aria-label', 'Minute');
      minuteInput.setAttribute('aria-valuemin', minuteInput.min);
      minuteInput.setAttribute('aria-valuemax', minuteInput.max);
      minuteInput.setAttribute('aria-valuenow', minuteInput.value);

      const anyMinute = minuteInput as any;
      if (anyMinute._kynKeydown) {
        minuteInput.removeEventListener('keydown', anyMinute._kynKeydown);
      }

      const minuteKeydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          minuteInput.stepUp();
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          minuteInput.stepDown();
        }
        setTimeout(
          () => minuteInput.setAttribute('aria-valuenow', minuteInput.value),
          0
        );
      };

      minuteInput.addEventListener('keydown', minuteKeydown);
      anyMinute._kynKeydown = minuteKeydown;

      // add click handlers for minute arrow buttons
      const minuteWrapper = minuteInput.closest('.numInputWrapper');
      if (minuteWrapper) {
        const minuteArrowUp =
          minuteWrapper.querySelector<HTMLElement>('.arrowUp');
        const minuteArrowDown =
          minuteWrapper.querySelector<HTMLElement>('.arrowDown');

        if (minuteArrowUp) {
          const anyArrowUp = minuteArrowUp as any;
          if (anyArrowUp._kynClick) {
            minuteArrowUp.removeEventListener('click', anyArrowUp._kynClick);
          }
          const arrowUpClick = () => {
            minuteInput.stepUp();
            minuteInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(
              () =>
                minuteInput.setAttribute('aria-valuenow', minuteInput.value),
              0
            );
          };
          minuteArrowUp.addEventListener('click', arrowUpClick);
          anyArrowUp._kynClick = arrowUpClick;
        }

        if (minuteArrowDown) {
          const anyArrowDown = minuteArrowDown as any;
          if (anyArrowDown._kynClick) {
            minuteArrowDown.removeEventListener(
              'click',
              anyArrowDown._kynClick
            );
          }
          const arrowDownClick = () => {
            minuteInput.stepDown();
            minuteInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(
              () =>
                minuteInput.setAttribute('aria-valuenow', minuteInput.value),
              0
            );
          };
          minuteArrowDown.addEventListener('click', arrowDownClick);
          anyArrowDown._kynClick = arrowDownClick;
        }
      }
    }

    // add seconds input handling if present
    const secondInput = container.querySelector<HTMLInputElement>(
      'input.flatpickr-second'
    );
    if (secondInput) {
      secondInput.tabIndex = 0;
      secondInput.setAttribute('role', 'spinbutton');
      secondInput.setAttribute('aria-label', 'Second');
      secondInput.setAttribute('aria-valuemin', secondInput.min);
      secondInput.setAttribute('aria-valuemax', secondInput.max);
      secondInput.setAttribute('aria-valuenow', secondInput.value);

      const anySecond = secondInput as any;
      if (anySecond._kynKeydown) {
        secondInput.removeEventListener('keydown', anySecond._kynKeydown);
      }

      const secondKeydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          secondInput.stepUp();
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          secondInput.stepDown();
        }
        setTimeout(
          () => secondInput.setAttribute('aria-valuenow', secondInput.value),
          0
        );
      };

      secondInput.addEventListener('keydown', secondKeydown);
      anySecond._kynKeydown = secondKeydown;

      // add click handlers for second arrow buttons
      const secondWrapper = secondInput.closest('.numInputWrapper');
      if (secondWrapper) {
        const secondArrowUp =
          secondWrapper.querySelector<HTMLElement>('.arrowUp');
        const secondArrowDown =
          secondWrapper.querySelector<HTMLElement>('.arrowDown');

        if (secondArrowUp) {
          const anyArrowUp = secondArrowUp as any;
          if (anyArrowUp._kynClick) {
            secondArrowUp.removeEventListener('click', anyArrowUp._kynClick);
          }
          const arrowUpClick = () => {
            secondInput.stepUp();
            secondInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(
              () =>
                secondInput.setAttribute('aria-valuenow', secondInput.value),
              0
            );
          };
          secondArrowUp.addEventListener('click', arrowUpClick);
          anyArrowUp._kynClick = arrowUpClick;
        }

        if (secondArrowDown) {
          const anyArrowDown = secondArrowDown as any;
          if (anyArrowDown._kynClick) {
            secondArrowDown.removeEventListener(
              'click',
              anyArrowDown._kynClick
            );
          }
          const arrowDownClick = () => {
            secondInput.stepDown();
            secondInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(
              () =>
                secondInput.setAttribute('aria-valuenow', secondInput.value),
              0
            );
          };
          secondArrowDown.addEventListener('click', arrowDownClick);
          anyArrowDown._kynClick = arrowDownClick;
        }
      }
    }

    const ampmToggle = container.querySelector<HTMLElement>('.flatpickr-am-pm');
    if (ampmToggle) {
      ampmToggle.tabIndex = 0;
      ampmToggle.setAttribute('role', 'button');
      ampmToggle.setAttribute('aria-label', 'Toggle AM/PM');

      const anyAmPm = ampmToggle as any;
      if (anyAmPm._kynKeydown) {
        ampmToggle.removeEventListener('keydown', anyAmPm._kynKeydown);
      }
      const ampmKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          ampmToggle.click();
        }
      };
      ampmToggle.addEventListener('keydown', ampmKeydown);
      anyAmPm._kynKeydown = ampmKeydown;
    }
  });
}

export function hideEmptyYear(): void {
  // force year input to always be visible - don't hide it even when min === max
  document.querySelectorAll('.numInputWrapper').forEach((wrapper) => {
    const yearInput = wrapper.querySelector(
      '.numInput.cur-year'
    ) as HTMLInputElement;
    if (yearInput) {
      (wrapper as HTMLElement).style.display = '';

      yearInput.style.display = '';
      yearInput.disabled = false;

      if (!yearInput.hasAttribute('tabindex')) {
        yearInput.tabIndex = 0;
      }
    }
  });
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

export enum DateRangeEditableMode {
  BOTH = 'both',
  START = 'start',
  END = 'end',
  NONE = 'none',
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
          dayElem.setAttribute('title', getTextStrings().dateNotAvailable);
          dayElem.setAttribute('locked', 'start');
          dayElem.setAttribute('aria-disabled', 'true');
        } else {
          dayElem.classList.add('flatpickr-locked-date', 'flatpickr-disabled');
          dayElem.setAttribute('title', getTextStrings().lockedStartDate);
        }
      }
    } else if (
      editableMode === DateRangeEditableMode.START &&
      currentValue[1] !== null
    ) {
      if (currentDate.getTime() >= currentValue[1].getTime()) {
        if (currentDate.getTime() === currentValue[1].getTime()) {
          dayElem.classList.add('flatpickr-locked-date');
          dayElem.setAttribute('title', getTextStrings().lockedEndDate);
          dayElem.setAttribute('locked', 'end');
          dayElem.setAttribute('aria-disabled', 'true');
        } else {
          dayElem.classList.add('flatpickr-locked-date', 'flatpickr-disabled');
          dayElem.setAttribute('title', getTextStrings().dateNotAvailable);
        }
      }
    } else if (
      editableMode === DateRangeEditableMode.NONE &&
      currentValue[0] !== null &&
      currentValue[1] !== null
    ) {
      if (currentDate.getTime() === currentValue[0].getTime()) {
        dayElem.classList.add('flatpickr-locked-date');
        dayElem.setAttribute('title', getTextStrings().dateLocked);
        dayElem.setAttribute('locked', 'start');
        dayElem.setAttribute('aria-disabled', 'true');
      } else if (currentDate.getTime() === currentValue[1].getTime()) {
        dayElem.classList.add('flatpickr-locked-date');
        dayElem.setAttribute('title', getTextStrings().dateLocked);
        dayElem.setAttribute('locked', 'end');
        dayElem.setAttribute('aria-disabled', 'true');
      } else if (
        currentDate.getTime() > currentValue[0].getTime() &&
        currentDate.getTime() < currentValue[1].getTime()
      ) {
        dayElem.classList.add('flatpickr-locked-date');
        dayElem.setAttribute('title', getTextStrings().dateInSelectedRange);
      } else {
        dayElem.classList.add('flatpickr-locked-date', 'flatpickr-disabled');
        dayElem.setAttribute('title', getTextStrings().dateNotAvailable);
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
    let lockedStartDate: Date | null = null;
    let lockedEndDate: Date | null = null;

    if (
      editableMode === DateRangeEditableMode.END &&
      currentValue[0] !== null
    ) {
      lockedStartDate = currentValue[0];
    }
    if (
      editableMode === DateRangeEditableMode.START &&
      currentValue[1] !== null
    ) {
      lockedEndDate = currentValue[1];
    }

    if (editableMode === DateRangeEditableMode.NONE) {
      if (currentValue[0] !== null && currentValue[1] !== null) {
        instance.setDate([currentValue[0], currentValue[1]], false);
        return;
      }
    }

    if (currentValue[0] === null && currentValue[1] === null) {
      callOriginalOnChange(originalOnChange, selectedDates, dateStr, instance);
      return;
    }

    if (
      editableMode === DateRangeEditableMode.END &&
      lockedStartDate !== null
    ) {
      let modified = false;
      const newDates = [...selectedDates];

      if (
        selectedDates.length === 2 &&
        selectedDates[0].getTime() !== lockedStartDate.getTime()
      ) {
        newDates[0] = lockedStartDate;
        modified = true;
      } else if (selectedDates.length === 1) {
        newDates.splice(0, 0, lockedStartDate);
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
      lockedEndDate !== null
    ) {
      let modified = false;
      const newDates = [...selectedDates];

      if (
        selectedDates.length === 2 &&
        selectedDates[1].getTime() !== lockedEndDate.getTime()
      ) {
        newDates[1] = lockedEndDate;
        modified = true;
      } else if (selectedDates.length === 1) {
        newDates.push(lockedEndDate);
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
  currentValue: [Date | null, Date | null],
  tooltipStrings?: FlatpickrTextStrings
): Partial<BaseOptions> {
  if (tooltipStrings) {
    setTooltipStrings(tooltipStrings);
  }
  const newOptions = { ...options };

  if (editableMode === DateRangeEditableMode.BOTH) {
    return newOptions;
  }

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
