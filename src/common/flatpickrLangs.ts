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

const localeCache: Record<string, CustomLocale> = Object.create(null);
const alias = (base: string) => (base === 'zh_tw' ? 'zh-tw' : base);

const loaders = import.meta.glob('/node_modules/flatpickr/dist/esm/l10n/*.js');

export function isSupportedLocale(locale: string): boolean {
  const base = locale.split('-')[0].toLowerCase() as SupportedLocale;
  return langsArray.includes(base);
}

export async function loadLocale(locale: string): Promise<CustomLocale> {
  const base = locale.split('-')[0].toLowerCase();
  if (base === 'en') return English as CustomLocale;
  if (localeCache[base]) return localeCache[base];
  if (!isSupportedLocale(base)) return English as CustomLocale;

  const key = `/node_modules/flatpickr/dist/esm/l10n/${alias(base)}.js`;
  const load = (loaders as Record<string, () => Promise<any>>)[key];
  if (!load) return English as CustomLocale;

  const mod = await load();
  const pick =
    mod?.default?.[base] ??
    mod?.default ??
    mod?.[base] ??
    Object.values(mod).find((v) => v && typeof v === 'object');

  const resolved = (
    pick ? { ...(English as object), ...(pick as object) } : English
  ) as CustomLocale;
  localeCache[base] = Object.freeze(resolved);
  return localeCache[base];
}
