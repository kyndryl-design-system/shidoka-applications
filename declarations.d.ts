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

declare module 'flatpickr/dist/esm/plugins/*.js' {
  const plugin: any;
  export default plugin;
}

// Minimal React types when @types/react is missing or empty (avoids TS2688)
declare module 'react' {
  export const createElement: any;
  export const useState: any;
  export const useEffect: any;
  export const useRef: any;
  export const useCallback: any;
  export const useReducer: any;
  export const useMemo: any;
  export default any;
}
declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
