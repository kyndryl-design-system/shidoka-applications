/**
 * Helper functions for positioning + managing popover panels using the `@floating-ui/dom` library.
 *
 * Provides utilities for:
 * - automatically positioning popover panels relative to anchor elements, including arrow positioning
 * - managing keyboard focus within popover panels for accessibility
 * - generating and applying CSS styles for panel positioning
 * - supporting responsive positioning rules
 * - cleaning up focus when panels are closed
 *
 * @see {@link https://floating-ui.com/}
 */
import {
  computePosition,
  offset,
  flip,
  shift,
  arrow,
  size,
} from '@floating-ui/dom';
import type { Placement } from '@floating-ui/dom';

export type PositionType = 'fixed' | 'absolute';

export interface Coords {
  top: number;
  left: number;
}

const DEFAULT_ARROW_PADDING = 6;

export const autoPosition = async (
  anchor: HTMLElement,
  panel: HTMLElement,
  arrowEl: HTMLElement,
  placementOverride: Placement | undefined,
  opts: {
    offsetDistance?: number;
    shiftPadding?: number;
    positionType?: PositionType;
  } = {}
): Promise<{
  x: number;
  y: number;
  placement: string;
  arrowX?: number;
  arrowY?: number;
}> => {
  const placement = placementOverride ?? 'bottom';

  const baseOffset =
    opts.offsetDistance ??
    (placement.startsWith('bottom')
      ? 16
      : placement.startsWith('top')
      ? 4
      : placement.startsWith('left')
      ? 12
      : 16);
  const baseShift =
    opts.shiftPadding ??
    (placement.startsWith('bottom') || placement.startsWith('top')
      ? 26
      : placement.startsWith('left')
      ? 40
      : 20);

  const {
    x,
    y,
    placement: finalPlacement,
    middlewareData,
  } = await computePosition(anchor, panel, {
    strategy: opts.positionType,
    placement,
    middleware: [
      offset(baseOffset),
      flip(),
      shift({ padding: baseShift }),
      arrow({ element: arrowEl, padding: DEFAULT_ARROW_PADDING }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
    ],
  });

  const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {};
  return { x, y, placement: finalPlacement, arrowX, arrowY };
};

export const handleFocusKeyboardEvents = (
  panel: HTMLElement
): {
  previouslyFocusedElement: HTMLElement | null;
  focusableElements: NodeListOf<HTMLElement>;
  keyboardListener: ((e: Event) => void) | null;
} => {
  const previouslyFocusedElement = document.activeElement as HTMLElement;
  const focusableElements = panel.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  let keyboardListener: ((e: Event) => void) | null = null;

  if (focusableElements.length) {
    keyboardListener = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === 'Tab') {
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (keyEvent.shiftKey && document.activeElement === first) {
          keyEvent.preventDefault();
          last.focus();
        } else if (!keyEvent.shiftKey && document.activeElement === last) {
          keyEvent.preventDefault();
          first.focus();
        }
        return;
      }
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'Home',
          'End',
        ].includes(keyEvent.key)
      ) {
        keyEvent.preventDefault();
        const arr = Array.from(focusableElements);
        const idx = arr.indexOf(document.activeElement as HTMLElement);
        let next = idx;
        switch (keyEvent.key) {
          case 'ArrowUp':
          case 'ArrowLeft':
            next = idx > 0 ? idx - 1 : arr.length - 1;
            break;
          case 'ArrowDown':
          case 'ArrowRight':
            next = idx < arr.length - 1 ? idx + 1 : 0;
            break;
          case 'Home':
            next = 0;
            break;
          case 'End':
            next = arr.length - 1;
            break;
        }
        arr[next].focus();
      }
    };

    panel.addEventListener('keydown', keyboardListener);
  }

  return { previouslyFocusedElement, focusableElements, keyboardListener };
};

export const getPanelStyle = (
  positionType: PositionType,
  zIndex: number | undefined,
  triggerType: string,
  coords: Coords,
  top?: string,
  left?: string,
  bottom?: string,
  right?: string
): string => {
  let style = '';
  const pos = positionType || 'fixed';

  if (zIndex !== undefined) {
    style += `z-index: ${zIndex};`;
  }

  if (triggerType !== 'none') {
    return `position: ${pos}; top: ${coords.top}px; left: ${coords.left}px; ${style}`;
  }

  style += `position: ${pos};`;
  if (top) style += `top: ${top};`;
  if (left) style += `left: ${left};`;
  if (bottom) style += `bottom: ${bottom};`;
  if (right) style += `right: ${right};`;

  return style;
};

export const removeFocusListener = (
  panel: HTMLElement | null,
  keyboardListener: ((e: Event) => void) | null,
  previouslyFocusedElement: HTMLElement | null
): void => {
  if (keyboardListener && panel) {
    panel.removeEventListener('keydown', keyboardListener);
  }
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }
};
