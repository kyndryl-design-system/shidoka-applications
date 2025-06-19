/**
 * Helper functions for positioning and managing popover panels using the `@floating-ui/dom` library.
 *
 * This module provides utilities for:
 * - Automatically positioning popover panels relative to anchor elements, including arrow positioning and collision handling.
 * - Managing keyboard focus within popover panels for accessibility.
 * - Generating and applying CSS styles for panel positioning.
 * - Supporting responsive positioning rules.
 * - Cleaning up focus traps when panels are closed.
 *
 * @see {@link https://floating-ui.com/}
 */
import { computePosition, offset, flip, shift, arrow } from '@floating-ui/dom';
import type { Placement } from '@floating-ui/dom';

export type PositionType = 'fixed' | 'absolute';

export interface Coords {
  top: number;
  left: number;
}

const DEFAULT_ANCHOR_DISTANCE = 8;
const DEFAULT_EDGE_SHIFT = 8;
const DEFAULT_ARROW_MIN_PADDING = 6;

export async function autoPosition(
  anchor: HTMLElement,
  panel: HTMLElement,
  arrowEl: HTMLElement,
  placementOverride: Placement | undefined,
  opts: {
    anchorDistance?: number;
    edgeShift?: number;
    arrowMinPadding?: number;
  } = {}
): Promise<{
  x: number;
  y: number;
  placement: string;
  arrowX?: number;
  arrowY?: number;
}> {
  const useAnchorDistance = opts.anchorDistance;
  const useEdgeShift = opts.edgeShift;
  const useArrrowMinPadding = opts.arrowMinPadding;

  const baseGutter = useAnchorDistance ?? DEFAULT_ANCHOR_DISTANCE;
  const baseShift = useEdgeShift ?? DEFAULT_EDGE_SHIFT;
  const baseArrow = useArrrowMinPadding ?? DEFAULT_ARROW_MIN_PADDING;
  const placement = placementOverride ?? 'bottom';

  const config = {
    anchorDistance: baseGutter,
    edgeShift: baseShift,
    arrowMinPadding: baseArrow,
  };

  if (useAnchorDistance !== undefined) {
    config.anchorDistance = useAnchorDistance;
  } else {
    if (placement.startsWith('bottom')) config.anchorDistance = 16;
    else if (placement.startsWith('left')) config.anchorDistance = 12;
    else if (placement.startsWith('right')) config.anchorDistance = 16;
  }

  if (useEdgeShift !== undefined) {
    config.edgeShift = useEdgeShift;
  } else {
    if (placement.startsWith('bottom') || placement.startsWith('top'))
      config.edgeShift = 26;
    else if (placement.startsWith('left')) config.edgeShift = 45;
    else if (placement.startsWith('right')) config.edgeShift = 20;
  }

  if (useArrrowMinPadding !== undefined) {
    config.arrowMinPadding = useArrrowMinPadding;
  } else {
    if (placement.startsWith('bottom')) config.arrowMinPadding = 16;
    else if (placement.startsWith('top')) config.arrowMinPadding = 4;
    else if (placement.startsWith('left')) config.arrowMinPadding = 6;
    else if (placement.startsWith('right')) config.arrowMinPadding = 20;
  }

  const {
    x,
    y,
    placement: finalPlacement,
    middlewareData,
  } = await computePosition(anchor, panel, {
    placement,
    middleware: [
      offset(config.anchorDistance),
      flip(),
      shift({
        padding: config.edgeShift,
        crossAxis:
          placement.startsWith('top') || placement.startsWith('bottom')
            ? false
            : true,
      }),
      arrow({ element: arrowEl, padding: config.arrowMinPadding }),
    ],
  });

  Object.assign(panel.style, {
    left: `${Math.round(x)}px`,
    top: `${Math.round(y)}px`,
    position: 'fixed',
  });
  const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {};
  if (arrowX != null) arrowEl.style.left = `${Math.round(arrowX)}px`;
  if (arrowY != null) arrowEl.style.top = `${Math.round(arrowY)}px`;

  return { x, y, placement: finalPlacement, arrowX, arrowY };
}

export function handleFocusKeyboardEvents(panel: HTMLElement): {
  previouslyFocusedElement: HTMLElement | null;
  focusableElements: NodeListOf<HTMLElement>;
  keyboardListener: ((e: Event) => void) | null;
} {
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
}

export function getPanelStyle(
  positionType: PositionType,
  zIndex: number | undefined,
  triggerType: string,
  coords: Coords,
  top?: string,
  left?: string,
  bottom?: string,
  right?: string
): string {
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
}

export function removeFocusTrap(
  panel: HTMLElement | null,
  keyboardListener: ((e: Event) => void) | null,
  previouslyFocusedElement: HTMLElement | null
): void {
  if (keyboardListener && panel)
    panel.removeEventListener('keydown', keyboardListener);
  if (previouslyFocusedElement) previouslyFocusedElement.focus();
}

export function applyResponsivePosition(
  panel: HTMLElement,
  responsivePosition: string,
  coords: Coords,
  triggerType: string
): void {
  const viewportWidth = window.innerWidth;
  const rules = responsivePosition
    .split('|')
    .map((rule) => {
      const [bp, prop, val] = rule.split(':');
      return { breakpoint: parseInt(bp, 10), prop, value: val };
    })
    .sort((a, b) => b.breakpoint - a.breakpoint);

  for (const r of rules) {
    if (viewportWidth <= r.breakpoint) {
      switch (r.prop) {
        case 'top':
        case 'left':
        case 'bottom':
        case 'right':
          panel.style[r.prop] = r.value;
          break;
        case 'offset-x':
          if (triggerType !== 'none') {
            const n = parseInt(r.value, 10);
            if (!isNaN(n)) {
              coords.left += n;
              panel.style.left = `${coords.left}px`;
            }
          }
          break;
        case 'offset-y':
          if (triggerType !== 'none') {
            const n = parseInt(r.value, 10);
            if (!isNaN(n)) {
              coords.top += n;
              panel.style.top = `${coords.top}px`;
            }
          }
          break;
      }
    }
  }
}
