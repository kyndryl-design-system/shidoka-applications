declare module '*.scss' {
  import { CSSResultGroup } from 'lit';
  const styles: CSSResultGroup;
  export default styles;
}

declare module '*.svg';

declare module '*?raw' {
  const content: string;
  export default content;
}

declare module '*?inline' {
  const content: string;
  export default content;
}

declare module 'flatpickr/dist/esm/l10n/*.js' {
  import type { CustomLocale } from 'flatpickr/dist/types/locale';
  const locale: CustomLocale;
  export default locale;
}

declare module 'flatpickr/dist/esm/plugins/*' {
  const plugin: any;
  export default plugin;
}
