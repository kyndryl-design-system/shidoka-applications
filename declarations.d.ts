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

/** Storybook: splitView.scss → four compiled CSS strings (see .storybook/main.js). */
declare module 'virtual:split-view-css' {
  export const SPLIT_VIEW_PATTERN_SHADOW_CSS: string;
  export const SPLIT_VIEW_CODE_RAIL_SHADOW_CSS: string;
  export const SPLIT_VIEW_BLOCK_CODE_FLUSH_CSS: string;
  export const SPLIT_VIEW_STORY_LIGHT_DOM_CSS: string;
}

declare module 'flatpickr/dist/esm/l10n/*.js' {
  import type { CustomLocale } from 'flatpickr/dist/types/locale';
  const locale: CustomLocale;
  export default locale;
}

declare module 'flatpickr/dist/esm/plugins/*.js' {
  const plugin: any;
  export default plugin;
}
