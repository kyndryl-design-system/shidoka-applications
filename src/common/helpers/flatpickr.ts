import flatpickr from 'flatpickr';
import l10n from 'flatpickr/dist/l10n';
import { Instance } from 'flatpickr/dist/types/instance';

let flatpickrStylesInjected = false;

type SupportedLocale = (typeof langsArray)[number];

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
  console.log('this is being called');
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

export async function initializeFlatpickr(context: {
  startDateInputEl: HTMLElement | null;
  getFlatpickrOptions: () => Promise<object>;
  setCalendarAttributes: () => void;
  setInitialDates?: () => void;
}): Promise<Instance | undefined> {
  if (!context.startDateInputEl) {
    console.error('Start date input not found.');
    return undefined;
  }

  try {
    const options = await context.getFlatpickrOptions();
    const flatpickrInstance = flatpickr(
      context.startDateInputEl,
      options
    ) as Instance;

    if (flatpickrInstance) {
      context.setCalendarAttributes();
      if (context.setInitialDates) {
        context.setInitialDates();
      }
      return flatpickrInstance;
    } else {
      console.error('Unable to create flatpickr instance.');
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
