import type { CustomLocale } from 'flatpickr/dist/types/locale';
import English from 'flatpickr/dist/esm/l10n/default.js';

export const langsArray = [
  'ar',
  'at',
  'az',
  'be',
  'bg',
  'bn',
  'bs',
  'cat',
  'cs',
  'cy',
  'da',
  'de',
  'en',
  'eo',
  'es',
  'et',
  'fa',
  'fi',
  'fo',
  'fr',
  'ga',
  'gr',
  'he',
  'hi',
  'hr',
  'hu',
  'id',
  'is',
  'it',
  'ja',
  'ka',
  'km',
  'ko',
  'kz',
  'lt',
  'lv',
  'mk',
  'mn',
  'ms',
  'my',
  'nl',
  'no',
  'pa',
  'pl',
  'pt',
  'ro',
  'ru',
  'si',
  'sk',
  'sl',
  'sq',
  'sr',
  'sv',
  'th',
  'tr',
  'uk',
  'uz',
  'uz_latn',
  'vn',
  'zh_tw',
  'zh',
] as const;
export type SupportedLocale = (typeof langsArray)[number];

const alias = (code: SupportedLocale) => (code === 'zh_tw' ? 'zh-tw' : code);

type Loader = () => Promise<any>;

const loaders: Record<SupportedLocale, Loader> = {
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
  en: () => import('flatpickr/dist/esm/l10n/default.js'),
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
  zh: () => import('flatpickr/dist/esm/l10n/zh.js'),
  zh_tw: () => import('flatpickr/dist/esm/l10n/zh-tw.js'),
};

const cache: Partial<Record<SupportedLocale, CustomLocale>> = {};

const resolveLocaleFromModule = (mod: any, key: string): CustomLocale => {
  const pick =
    mod?.default?.[key] ??
    mod?.default ??
    mod?.[key] ??
    Object.values(mod ?? {}).find((v) => v && typeof v === 'object');
  return (
    pick ? { ...(English as object), ...(pick as object) } : English
  ) as CustomLocale;
};

export const isSupportedLocale = (
  locale: string
): locale is SupportedLocale => {
  const base = locale.split('-')[0].toLowerCase();
  return (langsArray as readonly string[]).includes(base);
};

export async function loadLocale(locale: string): Promise<CustomLocale> {
  const base = locale.split('-')[0].toLowerCase() as SupportedLocale;
  if (base === 'en') return English as CustomLocale;
  if (!isSupportedLocale(base)) return English as CustomLocale;
  if (cache[base]) return cache[base]!;
  const mod = await loaders[base]();
  const merged = Object.freeze(resolveLocaleFromModule(mod, alias(base)));
  cache[base] = merged;
  return merged;
}

export async function preloadAllLocales(): Promise<void> {
  await Promise.all(
    (langsArray as readonly SupportedLocale[]).map(async (code) => {
      if (!cache[code]) {
        const mod = await loaders[code]();
        cache[code] = Object.freeze(resolveLocaleFromModule(mod, alias(code)));
      }
      return null;
    })
  );
}
