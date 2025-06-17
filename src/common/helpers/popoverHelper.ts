export type Dir = 'top' | 'bottom' | 'left' | 'right';
export type AnchorPosition = 'start' | 'center' | 'end';
export type AnchorPoint =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
export type PositionType = 'fixed' | 'absolute';

export interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

export interface Coords {
  top: number;
  left: number;
}

export interface PositionResult {
  dir: Dir;
  anchorPos: AnchorPosition;
  coords: Coords;
  arrowOffset: number;
}

export const GUTTER = 8;
export const OFFSET_DIM = 22;
export const ARROW_HALF = 6;
export const SIZE_RATIO_MAP: Record<
  'mini' | 'narrow' | 'wide',
  {
    gap: number;
    shift: number;
    arrow: number;
  }
> = {
  mini: { gap: 0.2, shift: -0.25, arrow: 0.03 },
  narrow: { gap: 0.025, shift: -0.045, arrow: 0.06 },
  wide: { gap: 0.15, shift: -0.2, arrow: 0.08 },
};

export function chooseDirection(
  anchor: Rect,
  panel: Rect,
  popoverSize: 'mini' | 'narrow' | 'wide'
): Dir {
  const space = {
    top: anchor.top,
    bottom: window.innerHeight - anchor.bottom,
    left: anchor.left,
    right: window.innerWidth - anchor.right,
  };
  const sideNeeded = panel.width + OFFSET_DIM;

  const verticalSpaceNeeded =
    popoverSize === 'mini' ? panel.height + 10 : panel.height + OFFSET_DIM;

  if (popoverSize === 'mini') {
    if (space.bottom >= verticalSpaceNeeded) return 'bottom';
    if (space.top >= verticalSpaceNeeded) return 'top';
  }

  if (space.left >= sideNeeded) return 'left';
  if (space.right >= sideNeeded) return 'right';

  if (space.bottom >= panel.height + OFFSET_DIM) return 'bottom';
  return 'top';
}

export function chooseAnchorPos(anchor: Rect, dir: Dir): AnchorPosition {
  if (dir === 'top' || dir === 'bottom') {
    const anchorHorizontalCenter = anchor.left + anchor.width / 2;
    if (anchorHorizontalCenter < anchor.left + anchor.width * 0.33)
      return 'start';
    if (anchorHorizontalCenter > anchor.left + anchor.width * 0.67)
      return 'end';
    return 'center';
  } else {
    const anchorVerticalCenter = anchor.top + anchor.height / 2;
    if (anchorVerticalCenter < anchor.top + anchor.height * 0.33)
      return 'start';
    if (anchorVerticalCenter > anchor.top + anchor.height * 0.67) return 'end';
    return 'center';
  }
}

export function calcCoords(anchor: Rect, panel: Rect, dir: Dir): Coords {
  let top: number, left: number;
  if (dir === 'top' || dir === 'bottom') {
    const verticalOffset = 16;

    const idealLeft = anchor.left;
    left = Math.min(
      Math.max(idealLeft, GUTTER),
      window.innerWidth - panel.width - GUTTER
    );
    const rawTop =
      dir === 'top'
        ? anchor.top - panel.height - verticalOffset
        : anchor.bottom + verticalOffset;
    top = Math.min(
      Math.max(rawTop, GUTTER),
      window.innerHeight - panel.height - GUTTER
    );
  } else {
    const anchorVerticalCenter = anchor.top + anchor.height / 2;
    const topOffset = 20;
    const calcTop = anchorVerticalCenter - topOffset;

    top = Math.min(
      Math.max(calcTop, GUTTER),
      window.innerHeight - panel.height - GUTTER
    );

    let horizontalOffset = 8;

    if (panel.width < 300) {
      horizontalOffset = 10;
    } else if (panel.width < 500) {
      horizontalOffset = 12;
    } else {
      horizontalOffset = 14;
    }

    if (anchor.width < 30) {
      horizontalOffset -= 2;
    }

    const rawLeft =
      dir === 'left'
        ? anchor.left - panel.width - ARROW_HALF * 1.5
        : anchor.right + ARROW_HALF * 1.5;
    left = Math.min(
      Math.max(rawLeft, GUTTER),
      window.innerWidth - panel.width - GUTTER
    );
  }
  return { top, left };
}

export function clampArrowOffset(rawOffset: number, panelSize: number): number {
  return Math.max(ARROW_HALF, Math.min(rawOffset, panelSize - ARROW_HALF));
}

export function autoPosition(
  anchorEl: HTMLElement,
  panelEl: HTMLElement,
  popoverSize: 'mini' | 'narrow' | 'wide',
  forceDir?: Dir,
  manualArrowOffset?: number
): PositionResult {
  const anchor = anchorEl.getBoundingClientRect() as Rect;
  const panel = panelEl.getBoundingClientRect() as Rect;
  const dir = forceDir ?? chooseDirection(anchor, panel, popoverSize);

  let coords: Coords;
  let arrowOffset: number;

  const isSmallButton = anchor.width < 30 || anchor.height < 30;

  if (dir === 'top' || dir === 'bottom') {
    coords = calcCoords(anchor, panel, dir);

    if (isSmallButton && popoverSize === 'mini') {
      const centerAdjustment = anchor.width / 4;
      coords.left += centerAdjustment;
    }

    const { shift: sR } = SIZE_RATIO_MAP[popoverSize];
    const shiftX = panel.width * sR;
    const rawX = anchor.left + anchor.width / 2 - coords.left + shiftX;

    arrowOffset = manualArrowOffset ?? clampArrowOffset(rawX, panel.width);
  } else {
    const { gap: gR, shift: sR, arrow: aR } = SIZE_RATIO_MAP[popoverSize];

    let gap = panel.height * gR;

    if (isSmallButton) {
      const minGap = popoverSize === 'mini' ? 8 : 0;
      gap = Math.max(gap, minGap);
    }

    const shiftY = panel.height * sR;
    const arrowDy = panel.height * aR;

    const desiredTop = anchor.top + shiftY;
    const top = Math.min(
      Math.max(desiredTop, GUTTER),
      window.innerHeight - panel.height - GUTTER
    );
    const left =
      dir === 'left' ? anchor.left - panel.width - gap : anchor.right + gap;
    coords = { top, left };

    arrowOffset = manualArrowOffset ?? arrowDy;
  }

  return {
    dir,
    anchorPos: chooseAnchorPos(anchor, dir),
    coords,
    arrowOffset,
  };
}

export function getAnchorPoint(
  anchorRect: Rect,
  anchorPoint: AnchorPoint
): { x: number; y: number } {
  const { left, right, top, bottom, width, height } = anchorRect;

  switch (anchorPoint) {
    case 'top':
      return { x: left + width / 2, y: top };
    case 'bottom':
      return { x: left + width / 2, y: bottom };
    case 'left':
      return { x: left, y: top + height / 2 };
    case 'right':
      return { x: right, y: top + height / 2 };
    case 'top-left':
      return { x: left, y: top };
    case 'top-right':
      return { x: right, y: top };
    case 'bottom-left':
      return { x: left, y: bottom };
    case 'bottom-right':
      return { x: right, y: bottom };
    case 'center':
    default:
      return { x: left + width / 2, y: top + height / 2 };
  }
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
    if (autoFocus) {
      (focusableElements[0] as HTMLElement).focus();
    }

    keyboardListener = (e: Event) => {
      const keyEvent = e as KeyboardEvent;

      if (keyEvent.key === 'Tab') {
        const firstFocusable = focusableElements[0] as HTMLElement;
        const lastFocusable = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (keyEvent.shiftKey && document.activeElement === firstFocusable) {
          keyEvent.preventDefault();
          lastFocusable.focus();
        } else if (
          !keyEvent.shiftKey &&
          document.activeElement === lastFocusable
        ) {
          keyEvent.preventDefault();
          firstFocusable.focus();
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

        if (!focusableElements || focusableElements.length === 0) return;

        const currentIndex = Array.from(focusableElements).findIndex(
          (el) => el === document.activeElement
        );

        let nextIndex = currentIndex;

        switch (keyEvent.key) {
          case 'ArrowUp':
          case 'ArrowLeft':
            nextIndex =
              currentIndex > 0
                ? currentIndex - 1
                : focusableElements.length - 1;
            break;
          case 'ArrowDown':
          case 'ArrowRight':
            nextIndex =
              currentIndex < focusableElements.length - 1
                ? currentIndex + 1
                : 0;
            break;
          case 'Home':
            nextIndex = 0;
            break;
          case 'End':
            nextIndex = focusableElements.length - 1;
            break;
        }

        if (nextIndex !== currentIndex) {
          (focusableElements[nextIndex] as HTMLElement).focus();
        }
      }
    };

    panel.addEventListener('keydown', keyboardListener);
  }

  return {
    previouslyFocusedElement,
    focusableElements,
    keyboardListener,
  };
}

export function removeFocusTrap(
  panel: HTMLElement | null,
  keyboardListener: ((e: Event) => void) | null,
  previouslyFocusedElement: HTMLElement | null
): void {
  if (keyboardListener && panel) {
    panel.removeEventListener('keydown', keyboardListener);
  }

  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): {
  (...args: Parameters<T>): void;
  clear: () => void;
} {
  let timeout: number | null = null;

  const debouncedFn = (...args: Parameters<T>): void => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      fn(...args);
      timeout = null;
    }, delay);
  };

  debouncedFn.clear = () => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFn;
}

export function applyResponsivePosition(
  panel: HTMLElement,
  responsivePosition: string | undefined,
  coords: Coords,
  anchorType: string
): void {
  if (!responsivePosition) return;

  const viewportWidth = window.innerWidth;
  const rules = responsivePosition?.split('|') || [];
  const sortedRules = rules
    .map((rule) => {
      const [breakpoint, prop, value] = rule.split(':');
      return {
        breakpoint: parseInt(breakpoint, 10),
        prop,
        value,
      };
    })
    .sort((a, b) => b.breakpoint - a.breakpoint);

  for (const rule of sortedRules) {
    if (viewportWidth <= rule.breakpoint) {
      switch (rule.prop) {
        case 'top':
        case 'left':
        case 'bottom':
        case 'right':
          panel.style[rule.prop] = rule.value;
          break;
        case 'offset-x':
          if (anchorType !== 'none') {
            const offsetX = parseInt(rule.value, 10);
            if (!isNaN(offsetX)) {
              coords.left += offsetX;
              panel.style.left = `${coords.left}px`;
            }
          }
          break;
        case 'offset-y':
          if (anchorType !== 'none') {
            const offsetY = parseInt(rule.value, 10);
            if (!isNaN(offsetY)) {
              coords.top += offsetY;
              panel.style.top = `${coords.top}px`;
            }
          }
          break;
      }
    }
  }
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
  const position = positionType || 'fixed';

  if (zIndex !== undefined) {
    style += `z-index: ${zIndex};`;
  }

  if (anchorType !== 'none') {
    return `position: ${position}; top: ${coords.top}px; left: ${coords.left}px; ${style}`;
  }

  let panelPosition = `position: ${position};`;
  if (top) panelPosition += `top: ${top};`;
  if (left) panelPosition += `left: ${left};`;
  if (bottom) panelPosition += `bottom: ${bottom};`;
  if (right) panelPosition += `right: ${right};`;

  return panelPosition + style;
}
