import { Locale } from 'flatpickr/dist/types/locale';
import { default as English } from 'flatpickr/dist/esm/l10n/default.js';

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

const localeCache: Record<string, Partial<Locale>> = {};

const loaderMap: Record<SupportedLocale, () => Promise<any>> = {
  ar: () => import('flatpickr/dist/esm/l10n/ar.js'),
  at: () => import('flatpickr/dist/esm/l10n/at.js'),
  az: () => import('flatpickr/dist/esm/l10n/az.js'),
  be: () => import('flatpickr/dist/esm/l10n/be.js'),
  bg: () => import('flatpickr/dist/esm/l10n/bg.js'),
  bn: () => import('flatpickr/dist/esm/l10n/bn.js'),
  bs: () => import('flatpickr/dist/esm/l10n/bs.js'),
  cat: () => import('flatpickr/dist/esm/l10n/cat.js'),
  cs: () => import('flatpickr/dist/esm/l10n/cs.js'),
  cy: () => import('flatpickr/dist/esm/l10n/cy.js'),
  da: () => import('flatpickr/dist/esm/l10n/da.js'),
  de: () => import('flatpickr/dist/esm/l10n/de.js'),
  eo: () => import('flatpickr/dist/esm/l10n/eo.js'),
  es: () => import('flatpickr/dist/esm/l10n/es.js'),
  et: () => import('flatpickr/dist/esm/l10n/et.js'),
  fa: () => import('flatpickr/dist/esm/l10n/fa.js'),
  fi: () => import('flatpickr/dist/esm/l10n/fi.js'),
  fo: () => import('flatpickr/dist/esm/l10n/fo.js'),
  fr: () => import('flatpickr/dist/esm/l10n/fr.js'),
  ga: () => import('flatpickr/dist/esm/l10n/ga.js'),
  gr: () => import('flatpickr/dist/esm/l10n/gr.js'),
  he: () => import('flatpickr/dist/esm/l10n/he.js'),
  hi: () => import('flatpickr/dist/esm/l10n/hi.js'),
  hr: () => import('flatpickr/dist/esm/l10n/hr.js'),
  hu: () => import('flatpickr/dist/esm/l10n/hu.js'),
  id: () => import('flatpickr/dist/esm/l10n/id.js'),
  is: () => import('flatpickr/dist/esm/l10n/is.js'),
  it: () => import('flatpickr/dist/esm/l10n/it.js'),
  ja: () => import('flatpickr/dist/esm/l10n/ja.js'),
  ka: () => import('flatpickr/dist/esm/l10n/ka.js'),
  km: () => import('flatpickr/dist/esm/l10n/km.js'),
  ko: () => import('flatpickr/dist/esm/l10n/ko.js'),
  kz: () => import('flatpickr/dist/esm/l10n/kz.js'),
  lt: () => import('flatpickr/dist/esm/l10n/lt.js'),
  lv: () => import('flatpickr/dist/esm/l10n/lv.js'),
  mk: () => import('flatpickr/dist/esm/l10n/mk.js'),
  mn: () => import('flatpickr/dist/esm/l10n/mn.js'),
  ms: () => import('flatpickr/dist/esm/l10n/ms.js'),
  my: () => import('flatpickr/dist/esm/l10n/my.js'),
  nl: () => import('flatpickr/dist/esm/l10n/nl.js'),
  no: () => import('flatpickr/dist/esm/l10n/no.js'),
  pa: () => import('flatpickr/dist/esm/l10n/pa.js'),
  pl: () => import('flatpickr/dist/esm/l10n/pl.js'),
  pt: () => import('flatpickr/dist/esm/l10n/pt.js'),
  ro: () => import('flatpickr/dist/esm/l10n/ro.js'),
  ru: () => import('flatpickr/dist/esm/l10n/ru.js'),
  si: () => import('flatpickr/dist/esm/l10n/si.js'),
  sk: () => import('flatpickr/dist/esm/l10n/sk.js'),
  sl: () => import('flatpickr/dist/esm/l10n/sl.js'),
  sq: () => import('flatpickr/dist/esm/l10n/sq.js'),
  sr: () => import('flatpickr/dist/esm/l10n/sr.js'),
  sv: () => import('flatpickr/dist/esm/l10n/sv.js'),
  th: () => import('flatpickr/dist/esm/l10n/th.js'),
  tr: () => import('flatpickr/dist/esm/l10n/tr.js'),
  uk: () => import('flatpickr/dist/esm/l10n/uk.js'),
  uz: () => import('flatpickr/dist/esm/l10n/uz.js'),
  uz_latn: () => import('flatpickr/dist/esm/l10n/uz_latn.js'),
  vn: () => import('flatpickr/dist/esm/l10n/vn.js'),
  zh_tw: () => import('flatpickr/dist/esm/l10n/zh-tw.js'),
  zh: () => import('flatpickr/dist/esm/l10n/zh.js'),
  en: () => Promise.resolve({} as Partial<Locale>),
};

export function isSupportedLocale(locale: string): boolean {
  const base = locale.split('-')[0].toLowerCase() as SupportedLocale;
  return langsArray.includes(base);
}

export async function loadLocale(locale: string): Promise<Partial<Locale>> {
  if (locale === 'en') return English;
  if (localeCache[locale]) return localeCache[locale];

  const base = locale.split('-')[0].toLowerCase() as SupportedLocale;
  if (!isSupportedLocale(locale)) {
    console.warn(`Unsupported locale "${locale}". Falling back to English.`);
    return English;
  }

  const importer = loaderMap[base];
  try {
    const module = await importer();
    const config =
      (module as any)[base] ??
      (module.default && (module.default as any)[base]) ??
      module.default;

    if (!config) {
      console.warn(
        `Locale data missing for "${locale}". Falling back to English.`
      );
      return English;
    }

    localeCache[locale] = config;
    return config;
  } catch (error) {
    console.error(`Error loading locale "${locale}":`, error);
    return English;
  }
}
