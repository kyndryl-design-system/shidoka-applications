declare module '*.scss' {
  import type { CSSResultGroup } from 'lit';
  const styles: CSSResultGroup;
  export default styles;
}

declare module 'flatpickr/dist/esm/l10n/*.js' {
  import type { CustomLocale } from 'flatpickr/dist/types/locale';
  const locale: CustomLocale;
  export default locale;
}
