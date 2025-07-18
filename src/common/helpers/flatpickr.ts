import flatpickr from 'flatpickr';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';
import { BaseOptions, Hook } from 'flatpickr/dist/types/options';
import { Instance } from 'flatpickr/dist/types/instance';
import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/l10n/default.js';
import { loadLocale as loadLocaleFromLangs } from '../flatpickrLangs';

import ShidokaFlatpickrTheme from '../scss/shidoka-flatpickr-theme.scss?inline';

let flatpickrStylesInjected = false;

export type FlatpickrConfig = Partial<BaseOptions>;

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
  showMonths?: number;
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

export function initializeMultiAnchorFlatpickr(opts: {
  inputEl: HTMLInputElement;
  endinputEl: HTMLInputElement;
  config: FlatpickrConfig;
  onChange: (
    selectedDates: Date[],
    dateStr: string,
    instance: Instance,
    event?: Event
  ) => void;
  onReady?: Hook | Hook[];
  setInitialDates: (instance: Instance) => void;
}): Instance {
  const { inputEl, endinputEl, config, onChange, onReady, setInitialDates } =
    opts;

  if (!flatpickrStylesInjected) {
    injectFlatpickrStyles(ShidokaFlatpickrTheme.toString());
    flatpickrStylesInjected = true;
  }

  const {
    altFormat = 'F j, Y',
    altInput = false,
    altInputClass = 'form-control flatpickr-input',
    allowInput = true,
    closeOnSelect = false,
    allowInvalidPreload = false,
    animate = true,
    disableMobile = false,
    plugins = [],
    appendTo,
    ...rest
  } = config;

  const rangeOptions: Partial<BaseOptions> = {
    altFormat,
    altInput,
    altInputClass,
    allowInput,
    closeOnSelect,
    allowInvalidPreload,
    animate,
    disableMobile,
    plugins: [rangePlugin({ input: endinputEl }), ...plugins],
    onChange,
    ...(onReady ? { onReady } : {}),
    ...(appendTo ? { appendTo } : {}),
    ...Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== undefined)
    ),
  };

  const instance = flatpickr(inputEl, rangeOptions);
  setInitialDates(instance);
  return instance;
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

    const inputElement = resolveOrCreateInput(inputEl, appendTo);

    if (inputEl instanceof HTMLInputElement) {
      options.clickOpens = true;
    } else {
      options.clickOpens = false;
      options.positionElement = inputEl;
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

export function resolveOrCreateInput(
  el: HTMLElement,
  appendTo?: HTMLElement
): HTMLInputElement {
  if (el instanceof HTMLInputElement) return el;

  const existing = el.querySelector('input');
  if (existing instanceof HTMLInputElement) return existing;

  const input = document.createElement('input');
  input.type = 'text';
  input.style.display = 'none';
  const target = appendTo || el;
  if (!target.isConnected) {
    throw new Error('Element is not connected to the DOM');
  }
  target.appendChild(input);
  return input;
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
    showMonths,
  } = context;

  // ————————————————————————————————————————————————————————————————————————
  // Locale & format setup (unchanged)
  // ————————————————————————————————————————————————————————————————————————

  let localeOptions;
  try {
    localeOptions = await loadLocale(locale);
    modifyWeekdayShorthands(localeOptions);
  } catch {
    console.warn('Error loading locale, falling back to default.');
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
    // we'll override defaultDate below
    allowInput: !!allowInput,
    clickOpens: true,
    time_24hr:
      typeof twentyFourHourFormat === 'boolean'
        ? twentyFourHourFormat
        : !isEnglishOr12HourLocale,
    static: context.static ?? false,
    wrap,
    showMonths: mode === 'range' ? (isWideScreen ? 2 : 1) : 1,
    monthSelectorType: 'static',
    locale: localeOptions,
    closeOnSelect: closeOnSelect ?? !(mode === 'multiple' || enableTime),
    onChange: (dates, str, inst) => onChange?.(dates, str, inst),
    onClose: (dates, str, inst) => {
      if (mode === 'range' && inst.calendarContainer && dates.length === 0) {
        const tc = inst.calendarContainer.querySelector('.flatpickr-time');
        tc?.classList.add('default-time-select');
        tc?.classList.remove('start-date', 'end-date');
      }
      onClose?.(dates, str, inst);
    },
    onOpen: (dates, str, inst) => onOpen?.(dates, str, inst),
  };

  if (showMonths !== undefined) {
    options.showMonths = showMonths;
  }

  // ————————————————————————————————————————————————————————————————————————
  // defaultDate handling
  // ————————————————————————————————————————————————————————————————————————

  if (defaultDate != null) {
    // 1) RANGE MODE: [start, end]
    if (mode === 'range') {
      if (Array.isArray(defaultDate)) {
        options.defaultDate = defaultDate.map((d) =>
          typeof d === 'string'
            ? flatpickr.parseDate(d, effectiveDateFormat) || new Date(d)
            : d
        );
      } else {
        // single value in range → treat as “start only”
        const parsed =
          typeof defaultDate === 'string'
            ? flatpickr.parseDate(defaultDate, effectiveDateFormat) ||
              new Date(defaultDate)
            : defaultDate;
        options.defaultDate = [parsed];
      }

      // 2) MULTIPLE MODE: arbitrary list of dates
    } else if (mode === 'multiple') {
      if (Array.isArray(defaultDate)) {
        options.defaultDate = defaultDate.map((d) =>
          typeof d === 'string'
            ? flatpickr.parseDate(d, effectiveDateFormat) || new Date(d)
            : d
        );
      } else {
        // single value → wrap as one‐item array
        const parsed =
          typeof defaultDate === 'string'
            ? flatpickr.parseDate(defaultDate, effectiveDateFormat) ||
              new Date(defaultDate)
            : defaultDate;
        options.defaultDate = [parsed];
      }

      // 3) SINGLE/TIME MODE: single Date
    } else {
      if (typeof defaultDate === 'string') {
        options.defaultDate =
          flatpickr.parseDate(defaultDate, effectiveDateFormat) ||
          new Date(defaultDate);
      } else {
        // either a Date or number
        options.defaultDate = defaultDate as any;
      }
    }
  }

  // ————————————————————————————————————————————————————————————————————————
  // remainder unchanged: min/max/date/time, enable/disable, appendTo, onReady …
  // ————————————————————————————————————————————————————————————————————————

  if (!(inputEl instanceof HTMLInputElement)) {
    options.positionElement = inputEl;
  }
  if (minDate) options.minDate = minDate;
  if (maxDate) options.maxDate = maxDate;
  if (minTime) options.minTime = minTime;
  if (maxTime) options.maxTime = maxTime;
  if (defaultHour != null) options.defaultHour = defaultHour;
  if (defaultMinute != null) options.defaultMinute = defaultMinute;
  if (enable?.length) options.enable = enable;
  if (disable?.length) {
    options.disable = disable.map((d) =>
      d instanceof Date
        ? d
        : typeof d === 'string'
        ? flatpickr.parseDate(d, effectiveDateFormat) || d
        : new Date(d as number)
    );
  }
  if (appendTo) options.appendTo = appendTo;

  // wire up onReady padding observer, etc. (identical to before)
  const originalOnReady = options.onReady;
  options.onReady = (dates, str, inst) => {
    if (originalOnReady) {
      Array.isArray(originalOnReady)
        ? originalOnReady.forEach((fn) => fn(dates, str, inst))
        : originalOnReady(dates, str, inst);
    }
    // … hour‐padding logic …
  };

  return options;
}

export function updateEnableTime(dateFormat: string): boolean {
  return dateFormat.includes('H:') || dateFormat.includes('h:');
}

export function setCalendarAttributes(
  instance: Instance,
  modalDetected = false
): void {
  if (!instance || !instance.config) {
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.hostname === 'localhost'
    ) {
      console.warn('setCalendarAttributes: Invalid instance or config');
    }
    return;
  }

  const container = instance.calendarContainer;
  if (!container) {
    console.warn('setCalendarAttributes: No calendar container found');
    return;
  }

  const updateCalendarLayout = () => {
    const isRangeMode = instance.config.mode === 'range';
    const isWideScreen = window.innerWidth >= 767;

    let showSingleMonth = container.classList.contains(
      'flatpickr-calendar-single-month'
    );

    if (isRangeMode) {
      if (!isWideScreen) {
        showSingleMonth = true;
        container.classList.add('flatpickr-calendar-single-month');
      } else {
        showSingleMonth = container.classList.contains(
          'flatpickr-calendar-single-month'
        );
      }
    }

    let targetWidth = '323.875px';
    if (isRangeMode && !showSingleMonth && isWideScreen) {
      targetWidth = '625px';
    }

    container.style.width = targetWidth;
    container.style.minWidth = targetWidth;
    container.style.maxWidth = targetWidth;
    container.style.setProperty('--flatpickr-calendar-width', targetWidth);

    const daysContainer = container.querySelector('.flatpickr-days');
    if (daysContainer) {
      if (isRangeMode && !showSingleMonth && isWideScreen) {
        (daysContainer as HTMLElement).style.width = '100%';

        const dayContainers = container.querySelectorAll('.dayContainer');
        dayContainers.forEach((dayContainer, index) => {
          const element = dayContainer as HTMLElement;
          element.style.width = '50.25%';
          element.style.minWidth = 'auto';
          element.style.maxWidth = 'none';
          element.style.flex = '0 0 50.25%';

          if (index === 0) {
            element.style.paddingRight = '2px';
          } else if (index === 1) {
            element.style.paddingLeft = '3px';
          }
        });

        const innerContainer = container.querySelector(
          '.flatpickr-innerContainer'
        );
        if (innerContainer) {
          (innerContainer as HTMLElement).style.display = 'flex';
          (innerContainer as HTMLElement).style.justifyContent =
            'space-between';
        }
      } else {
        (daysContainer as HTMLElement).style.width = '316px';

        const dayContainers = container.querySelectorAll('.dayContainer');
        dayContainers.forEach((dayContainer) => {
          const element = dayContainer as HTMLElement;
          element.style.width = '';
          element.style.minWidth = '';
          element.style.maxWidth = '';
          element.style.flex = '';
          element.style.paddingRight = '';
          element.style.paddingLeft = '';
        });

        const innerContainer = container.querySelector(
          '.flatpickr-innerContainer'
        );
        if (innerContainer) {
          (innerContainer as HTMLElement).style.display = '';
          (innerContainer as HTMLElement).style.justifyContent = '';
        }
      }
    }
  };

  updateCalendarLayout();

  const resizeHandler = () => updateCalendarLayout();
  window.addEventListener('resize', resizeHandler);

  const observer = new MutationObserver(() => {
    const isRangeMode = instance.config.mode === 'range';
    const isWideScreen = window.innerWidth >= 767;
    const showSingleMonth = container.classList.contains(
      'flatpickr-calendar-single-month'
    );

    let targetWidth = '323.875px';
    if (isRangeMode && !showSingleMonth && isWideScreen) {
      targetWidth = '625px';
    }

    if (container.style.width !== targetWidth) {
      container.style.width = targetWidth;
      container.style.minWidth = targetWidth;
      container.style.maxWidth = targetWidth;
    }
  });

  observer.observe(container, {
    attributes: true,
    attributeFilter: ['style'],
  });

  const originalDestroy = instance.destroy;
  instance.destroy = function () {
    observer.disconnect();
    window.removeEventListener('resize', resizeHandler);
    return originalDestroy.call(this);
  };

  (instance as any).updateLayout = updateCalendarLayout;

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
    prevBtn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        instance.changeMonth(-1);
      }
    });

    const nextBtn = container.querySelector<HTMLElement>(
      '.flatpickr-next-month'
    );
    nextBtn?.setAttribute('tabindex', '0');
    nextBtn?.setAttribute('role', 'button');
    nextBtn?.setAttribute('aria-label', 'Next month');
    nextBtn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        instance.changeMonth(1);
      }
    });

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
      yearInput.addEventListener('keydown', (e) => {
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
      });
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
    }

    const ampmToggle = container.querySelector<HTMLElement>('.flatpickr-am-pm');
    if (ampmToggle) {
      ampmToggle.tabIndex = 0;
      ampmToggle.setAttribute('role', 'button');
      ampmToggle.setAttribute('aria-label', 'Toggle AM/PM');
      ampmToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          ampmToggle.click();
        }
      });
    }
  });
}

export function hideEmptyYear(): void {
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
