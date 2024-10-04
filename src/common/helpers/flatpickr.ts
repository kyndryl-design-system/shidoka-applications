import flatpickr from 'flatpickr';
import l10n from 'flatpickr/dist/l10n';
import { Instance } from 'flatpickr/dist/types/instance';

let isFlatpickrStylesInjected = false;

type SupportedLocale = (typeof langsArray)[number];

export function isSupportedLocale(locale: string): boolean {
  return langsArray.includes(locale as SupportedLocale);
}

export function modifyEngDayShorthands(): void {
  l10n.en.weekdays.shorthand.forEach((_day: string, index: number) => {
    const currentDay = l10n.en.weekdays.shorthand;
    if (currentDay[index] === 'Thu' || currentDay[index] === 'Th') {
      currentDay[index] = 'Th';
    } else {
      currentDay[index] = currentDay[index].charAt(0);
    }
  });
}

export function injectFlatpickrStyles(customStyle: string): void {
  if (!isFlatpickrStylesInjected) {
    const styleElement = document.createElement('style');
    styleElement.id = 'flatpickr-custom-styles';
    styleElement.textContent = customStyle;
    document.head.appendChild(styleElement);
    isFlatpickrStylesInjected = true;
  }
}

export async function initializeFlatpickr(context: {
  startDateInputEl: HTMLElement | null;
  getFlatpickrOptions: () => Promise<object>;
  setCalendarAttributes: () => void;
  setInitialDates: () => void;
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
      context.setInitialDates();
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
