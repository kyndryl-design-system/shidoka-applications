import { computePosition, offset, flip, shift, arrow } from '@floating-ui/dom';
import type { Placement } from '@floating-ui/dom';

export type PositionType = 'fixed' | 'absolute';

export interface Coords {
  top: number;
  left: number;
}

export async function autoPosition(
  anchor: HTMLElement,
  panel: HTMLElement,
  arrowEl: HTMLElement,
  placementOverride: Placement | undefined,
  opts: {
    gutter?: number;
    shiftPadding?: number;
    arrowPadding?: number;
  } = {}
): Promise<{
  x: number;
  y: number;
  placement: string;
  arrowX?: number;
  arrowY?: number;
}> {
  const baseGutter = opts.gutter ?? 8;
  const baseShiftPadding = opts.shiftPadding ?? 8;
  const baseArrowPadding = opts.arrowPadding ?? 6;

  const placement = placementOverride ?? 'bottom';

  const config = {
    gutter: baseGutter,
    shiftPadding: baseShiftPadding,
    arrowPadding: baseArrowPadding,
  };

  if (placement.startsWith('bottom')) {
    config.gutter = 16;
    config.shiftPadding = 26;
    config.arrowPadding = 16;
  } else if (placement.startsWith('top')) {
    config.shiftPadding = 26;
    config.arrowPadding = 4;
  } else if (placement.startsWith('left')) {
    config.gutter = 12;
    config.shiftPadding = 45;
    config.arrowPadding = 6;
  } else if (placement.startsWith('right')) {
    config.gutter = 16;
    config.shiftPadding = 20;
    config.arrowPadding = 20;
  }

  const {
    x,
    y,
    placement: finalPlacement,
    middlewareData,
  } = await computePosition(anchor, panel, {
    placement,
    middleware: [
      offset(config.gutter),
      flip(),
      shift({
        padding: config.shiftPadding,
        crossAxis:
          placement.startsWith('top') || placement.startsWith('bottom')
            ? false
            : true,
      }),
      arrow({ element: arrowEl, padding: config.arrowPadding }),
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

export function setupFocusTrap(
  panel: HTMLElement,
  autoFocus: boolean
): {
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
    if (autoFocus) focusableElements[0].focus();

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
  anchorType: string,
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

  if (anchorType !== 'none') {
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
  anchorType: string
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
          if (anchorType !== 'none') {
            const n = parseInt(r.value, 10);
            if (!isNaN(n)) {
              coords.left += n;
              panel.style.left = `${coords.left}px`;
            }
          }
          break;
        case 'offset-y':
          if (anchorType !== 'none') {
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
