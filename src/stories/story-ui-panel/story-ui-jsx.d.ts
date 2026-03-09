/* JSX types for Shidoka custom elements used in Story UI panel */
import type { HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'kyn-overflow-menu': HTMLAttributes<HTMLElement> & {
        open?: boolean;
        verticalDots?: boolean;
        anchorRight?: boolean;
        assistiveText?: string;
        'data-chat-id'?: string;
        'data-chat-title'?: string;
      };
      'kyn-overflow-menu-item': HTMLAttributes<HTMLElement> & {
        destructive?: boolean;
        'data-action'?: string;
      };
    }
  }
}

export {};
