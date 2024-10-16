import flatpickr from 'flatpickr';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';
import { Instance } from 'flatpickr/dist/types/instance';
import { BaseOptions, Hook } from 'flatpickr/dist/types/options';
import { Locale } from 'flatpickr/dist/types/locale';

let flatpickrStylesInjected = false;

type SupportedLocale = (typeof langsArray)[number];

interface BaseFlatpickrContext {
  getFlatpickrOptions: () => Promise<Partial<BaseOptions>>;
  setCalendarAttributes: (instance: Instance) => void;
  setInitialDates?: (instance: Instance) => void;
  appendToBody?: boolean;
}

interface SingleFlatpickrContext extends BaseFlatpickrContext {
  anchorEl: HTMLElement;
}

interface RangeFlatpickrContext extends BaseFlatpickrContext {
  startAnchorEl: HTMLElement;
  endAnchorEl?: HTMLElement;
}

const DATE_FORMAT_OPTIONS = {
  'Y-m-d': 'yyyy-mm-dd',
  'm-d-Y': 'mm-dd-yyyy',
  'd-m-Y': 'dd-mm-yyyy',
  'Y-m-d H:i': 'yyyy-mm-dd hh:mm',
  'Y-m-d H:i:s': 'yyyy-mm-dd hh:mm:ss',
  'm-d-Y H:i:s': 'mm-dd-yyyy hh:mm:ss',
  'd-m-Y H:i:s': 'dd-mm-yyyy hh:mm:ss',
} as const;

type DateFormatOption = keyof typeof DATE_FORMAT_OPTIONS;

interface FlatpickrOptionsContext {
  locale: string;
  dateFormat?: string;
  enableTime: boolean;
  twentyFourHourFormat: boolean;
  altFormat?: string;
  multipleInputs?: boolean;
  endAnchorEl?: HTMLElement;
  startAnchorEl: HTMLElement;
  minDate?: string | number | Date;
  maxDate?: string | number | Date;
  minTime?: string | number | Date;
  maxTime?: string | number | Date;
  defaultDate?: string | number | Date;
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
}

export function isSupportedLocale(locale: string): boolean {
  return langsArray.includes(locale as SupportedLocale);
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
    startAnchorEl,
    endAnchorEl,
    getFlatpickrOptions,
    setCalendarAttributes,
    setInitialDates,
  } = context;

  if (!startAnchorEl) {
    console.error('Cannot initialize Flatpickr: startAnchorEl is undefined');
    return undefined;
  }

  try {
    const options = await getFlatpickrOptions();

    const getInputElement = (anchorEl: HTMLElement): HTMLInputElement => {
      if (anchorEl instanceof HTMLInputElement) {
        return anchorEl;
      } else {
        let input = anchorEl.querySelector('input');
        if (!input) {
          input = document.createElement('input');
          input.type = 'text';
          input.style.display = 'none';
          anchorEl.appendChild(input);
        }
        return input as HTMLInputElement;
      }
    };

    const startInputElement = getInputElement(startAnchorEl);
    if (endAnchorEl) {
      const endInputElement = getInputElement(endAnchorEl);
      options.plugins = [
        ...(options.plugins || []),
        rangePlugin({ input: endInputElement }),
      ];
    }

    const flatpickrInstance = flatpickr(startInputElement, options) as Instance;

    if (flatpickrInstance) {
      setCalendarAttributes(flatpickrInstance);
      if (setInitialDates) {
        setInitialDates(flatpickrInstance);
      }

      if (!(startAnchorEl instanceof HTMLInputElement)) {
        startAnchorEl.addEventListener('click', () => {
          flatpickrInstance.open();
        });
      }

      if (endAnchorEl && !(endAnchorEl instanceof HTMLInputElement)) {
        endAnchorEl.addEventListener('click', () => {
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
  context: SingleFlatpickrContext
): Promise<Instance | undefined> {
  const {
    anchorEl,
    getFlatpickrOptions,
    setCalendarAttributes,
    setInitialDates,
    appendToBody,
  } = context;

  if (!anchorEl) {
    console.error('Cannot initialize Flatpickr: anchorEl is undefined');
    return undefined;
  }

  try {
    const options = await getFlatpickrOptions();
    let inputElement: HTMLInputElement;

    if (anchorEl instanceof HTMLInputElement) {
      inputElement = anchorEl;
      options.clickOpens = true;
    } else {
      inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.style.display = 'none';

      if (appendToBody) {
        document.body.appendChild(inputElement);
      } else {
        anchorEl.appendChild(inputElement);
      }

      options.clickOpens = false;
      options.positionElement = anchorEl;
    }

    const flatpickrInstance = flatpickr(inputElement, options) as Instance;

    if (flatpickrInstance) {
      setCalendarAttributes(flatpickrInstance);
      if (setInitialDates) {
        setInitialDates(flatpickrInstance);
      }

      if (!(anchorEl instanceof HTMLInputElement)) {
        anchorEl.addEventListener('click', () => {
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

export function isValidDateFormat(format: string): format is DateFormatOption {
  return format in DATE_FORMAT_OPTIONS;
}

export function getPlaceholder(
  dateFormat: string,
  isDateRange?: boolean
): string {
  let placeholderFormat;

  if (isValidDateFormat(dateFormat)) {
    if (isDateRange) {
      placeholderFormat = `${DATE_FORMAT_OPTIONS[dateFormat]} to ${DATE_FORMAT_OPTIONS[dateFormat]}`;
    } else {
      placeholderFormat = DATE_FORMAT_OPTIONS[dateFormat];
    }
    return placeholderFormat;
  }
  return 'Select date';
}

export async function getFlatpickrOptions(
  context: FlatpickrOptionsContext
): Promise<Partial<BaseOptions>> {
  const {
    locale,
    dateFormat,
    enableTime,
    twentyFourHourFormat,
    altFormat,
    multipleInputs,
    endAnchorEl,
    startAnchorEl,
    minDate,
    maxDate,
    minTime,
    maxTime,
    defaultDate,
    enable,
    disable,
    mode = 'single',
    closeOnSelect,
    wrap = false,
    noCalendar = false,
    onChange,
    onClose,
    onOpen,
    loadLocale,
  } = context;

  const localeOptions = await loadLocale(locale);
  modifyWeekdayShorthands(localeOptions);

  const isWideScreen = window.innerWidth > 767;

  const options: Partial<BaseOptions> = {
    dateFormat: dateFormat || (mode === 'time' ? 'H:i' : 'Y-m-d'),
    mode: mode === 'time' ? 'single' : mode,
    enableTime: mode === 'time' ? true : enableTime,
    noCalendar: mode === 'time' ? true : noCalendar,
    allowInput: false,
    clickOpens: true,
    time_24hr: twentyFourHourFormat,
    weekNumbers: false,
    wrap: wrap,
    showMonths: isWideScreen && mode === 'range' ? 2 : 1,
    monthSelectorType: 'static',
    locale: localeOptions,
    altFormat: altFormat,
    closeOnSelect: closeOnSelect ?? !(mode === 'multiple' || enableTime),
    onChange: (selectedDates, dateStr, instance) => {
      if (onChange) {
        onChange(selectedDates, dateStr, instance);
      }
    },
    onClose: (selectedDates, dateStr, instance) => {
      if (mode === 'range') {
        const timeContainer =
          instance.calendarContainer.querySelector('.flatpickr-time');
        if (selectedDates.length === 0) {
          timeContainer?.classList.add('default-time-select');
          timeContainer?.classList.remove('start-date', 'end-date');
        }
      }
      if (onClose) {
        onClose(selectedDates, dateStr, instance);
      }
    },
    onOpen: (selectedDates, dateStr, instance) => {
      if (onOpen) {
        onOpen(selectedDates, dateStr, instance);
      }
    },
  };

  if (mode === 'range') {
    options.onReady = (_, __, instance) => {
      const timeContainer =
        instance.calendarContainer.querySelector('.flatpickr-time');
      timeContainer?.classList.add('default-time-select');
    };
  }

  if (multipleInputs && endAnchorEl) {
    const endInput =
      endAnchorEl instanceof HTMLInputElement
        ? endAnchorEl
        : endAnchorEl.querySelector('input') || undefined;

    if (endInput) {
      options.plugins = [
        ...(options.plugins || []),
        rangePlugin({ input: endInput }),
      ];
    }
  }

  if (!(startAnchorEl instanceof HTMLInputElement)) {
    options.positionElement = startAnchorEl;
  }

  if (minDate) options.minDate = minDate;
  if (maxDate) options.maxDate = maxDate;
  if (minTime) options.minTime = minTime;
  if (maxTime) options.maxTime = maxTime;
  if (defaultDate) options.defaultDate = defaultDate;
  if (enable && enable.length > 0) options.enable = enable;
  if (disable && disable.length > 0) options.disable = disable;

  return options;
}

export const langsArray = [
  'ar', // Arabic
  'at', // Austria
  'az', // Azerbaijan
  'be', // Belarusian
  'bg', // Bulgarian
  'bn', // Bangla
  'bs', // Bosnia
  'cat', // Catalan
  'cs', // Czech
  'cy', // Welsh
  'da', // Danish
  'de', // German
  'en', // English
  'eo', // Esperanto
  'es', // Spanish
  'et', // Estonian
  'fa', // Persian
  'fi', // Finnish
  'fo', // Faroese
  'fr', // French
  'ga', // Gaelic
  'gr', // Greek
  'he', // Hebrew
  'hi', // Hindi
  'hr', // Croatian
  'hu', // Hungarian
  'id', // Indonesian
  'is', // Icelandic
  'it', // Italian
  'ja', // Japanese
  'ka', // Georgian
  'km', // Khmer
  'ko', // Korean
  'kz', // Kazakh
  'lt', // Lithuanian
  'lv', // Latvian
  'mk', // Macedonian
  'mn', // Mongolian
  'ms', // Malaysian
  'my', // Burmese
  'nl', // Dutch
  'no', // Norwegian
  'pa', // Punjabi
  'pl', // Polish
  'pt', // Portuguese
  'ro', // Romanian
  'ru', // Russian
  'si', // Sinhala
  'sk', // Slovak
  'sl', // Slovenian
  'sq', // Albanian
  'sr', // Serbian
  'sv', // Swedish
  'th', // Thai
  'tr', // Turkish
  'uk', // Ukrainian
  'uz', // Uzbek
  'uz_latn', // Uzbek Latin
  'vn', // Vietnamese
  'zh_tw', // Mandarin Traditional
  'zh', // Mandarin
];
