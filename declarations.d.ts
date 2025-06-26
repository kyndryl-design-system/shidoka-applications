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
