import flatpickr from 'flatpickr';
import l10n from 'flatpickr/dist/l10n';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';
import { Instance } from 'flatpickr/dist/types/instance';
import { BaseOptions } from 'flatpickr/dist/types/options';

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

export function isSupportedLocale(locale: string): boolean {
  return langsArray.includes(locale as SupportedLocale);
}

export function modifyEngDayShorthands(): void {
  l10n.en.weekdays.shorthand.forEach((_day: string, index: number) => {
    const currentDay = l10n.en.weekdays.shorthand;
    currentDay[index] = currentDay[index].charAt(0);
  });
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

export async function initializeRangeFlatpickr(
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

    // Function to create or find input element
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

export async function initializeSingleFlatpickr(
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
    } else {
      inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.style.display = 'none';

      if (appendToBody) {
        document.body.appendChild(inputElement);
      } else {
        anchorEl.appendChild(inputElement);
      }
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

export function getPlaceholder(dateFormat: string): string {
  if (isValidDateFormat(dateFormat)) {
    return DATE_FORMAT_OPTIONS[dateFormat];
  }
  return 'Select date';
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
