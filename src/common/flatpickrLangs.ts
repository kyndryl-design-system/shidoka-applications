import { Locale } from 'flatpickr/dist/types/locale';

import { default as English } from 'flatpickr/dist/l10n/default.js';

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
] as const;

export type SupportedLocale = (typeof langsArray)[number];

export function isSupportedLocale(locale: string): boolean {
  const baseLocale = locale.split('-')[0].toLowerCase();
  return langsArray.includes(baseLocale as SupportedLocale);
}

const localeCache: Record<string, Partial<Locale>> = {};

export async function loadLocale(locale: string): Promise<Partial<Locale>> {
  const base = locale.split('-')[0].toLowerCase();

  if (base === 'en') {
    return English;
  }

  if (localeCache[base]) {
    return localeCache[base]!;
  }

  if (!isSupportedLocale(base)) {
    console.warn(`Unsupported locale "${locale}". Falling back to English.`);
    return English;
  }

  const filenameMap: Record<string, string> = {
    zh_tw: 'zh-tw',
  };
  const fileName = filenameMap[base] ?? base;

  try {
    const module = await import(`flatpickr/dist/l10n/${fileName}.js`);

    const localeConfig: Partial<Locale> | undefined =
      (module as any)[base] ||
      (module.default as any)?.[base] ||
      module.default;

    if (!localeConfig) {
      console.warn(
        `Locale configuration not found for "${locale}". Falling back to English.`
      );
      return English;
    }

    localeCache[base] = localeConfig;
    return localeConfig;
  } catch (err) {
    console.error(
      `Failed to load locale "${locale}". Falling back to English.`,
      err
    );
    return English;
  }
}
