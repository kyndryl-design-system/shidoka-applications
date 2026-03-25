export const MIN_PANE_PX = 120;
export const MIN_CENTER_PX = 160;
export const DIVIDER_PX = 8;
export const COMPACT_BREAKPOINT_PX = 768;
export const KEYBOARD_RESIZE_STEP_PX = 16;
export const KEYBOARD_RESIZE_LARGE_STEP_PX = 48;

export type SplitViewPaneCount = 2 | 3;
export type SplitViewDivider = 1 | 2;
export type SplitViewPane = 1 | 2 | 3;

export interface SplitViewWidthsInput {
  panes: SplitViewPaneCount;
  trackWidth: number;
  leftPx: number;
  rightPx: number;
}

export interface SplitViewDefaultsInput {
  panes: SplitViewPaneCount;
  trackWidth: number;
  defaultStartPaneWidthPx?: number;
  defaultStartPaneFraction?: number;
  defaultEndPaneWidthPx?: number;
}

export interface SplitViewClampResult {
  leftPx: number;
  rightPx: number;
}

export interface SplitViewKeyboardResizeInput extends SplitViewWidthsInput {
  divider: SplitViewDivider;
  key: string;
  shiftKey?: boolean;
}

export function normalizePaneCount(value: number): SplitViewPaneCount {
  return value === 3 ? 3 : 2;
}

export function shouldUseCompactMode(
  width: number,
  breakpoint = COMPACT_BREAKPOINT_PX
) {
  return width > 0 && width <= breakpoint;
}

export function normalizeCompactActivePane(
  activePane: number,
  panes: SplitViewPaneCount
): SplitViewPane {
  if (panes === 2) {
    return activePane === 1 ? 1 : 2;
  }

  if (activePane === 1 || activePane === 2 || activePane === 3) {
    return activePane;
  }

  return 2;
}

export function getDefaultWidths(
  input: SplitViewDefaultsInput
): SplitViewClampResult {
  const {
    panes,
    trackWidth,
    defaultStartPaneWidthPx,
    defaultStartPaneFraction,
  } = input;
  let leftPx = 0;
  let rightPx = 0;

  if (
    defaultStartPaneWidthPx != null &&
    !Number.isNaN(defaultStartPaneWidthPx)
  ) {
    leftPx = defaultStartPaneWidthPx;
  } else if (
    defaultStartPaneFraction != null &&
    !Number.isNaN(defaultStartPaneFraction) &&
    defaultStartPaneFraction > 0 &&
    defaultStartPaneFraction < 1
  ) {
    leftPx = trackWidth * defaultStartPaneFraction;
  } else if (panes === 2) {
    leftPx = trackWidth * 0.36;
  } else {
    leftPx = trackWidth * 0.34;
  }

  if (panes === 3) {
    const endWidth = input.defaultEndPaneWidthPx;
    rightPx =
      endWidth != null && !Number.isNaN(endWidth)
        ? endWidth
        : trackWidth * 0.28;
  }

  return clampSplitViewWidths({
    panes,
    trackWidth,
    leftPx,
    rightPx,
  });
}

export function clampLeftWidth(
  leftPx: number,
  trackWidth: number,
  panes: SplitViewPaneCount,
  rightPx = 0
) {
  if (panes === 2) {
    const maxLeft = Math.max(
      MIN_PANE_PX,
      trackWidth - DIVIDER_PX - MIN_CENTER_PX
    );
    return Math.min(Math.max(MIN_PANE_PX, leftPx), maxLeft);
  }

  const maxLeft = Math.max(
    MIN_PANE_PX,
    trackWidth - 2 * DIVIDER_PX - rightPx - MIN_CENTER_PX
  );
  return Math.min(Math.max(MIN_PANE_PX, leftPx), maxLeft);
}

export function clampRightWidth(
  rightPx: number,
  trackWidth: number,
  leftPx: number
) {
  const maxRight = Math.max(
    MIN_PANE_PX,
    trackWidth - 2 * DIVIDER_PX - leftPx - MIN_CENTER_PX
  );
  return Math.min(Math.max(MIN_PANE_PX, rightPx), maxRight);
}

export function clampSplitViewWidths(
  input: SplitViewWidthsInput
): SplitViewClampResult {
  const { panes, trackWidth } = input;
  const leftPx = clampLeftWidth(
    input.leftPx,
    trackWidth,
    panes,
    panes === 3 ? input.rightPx : 0
  );
  const rightPx =
    panes === 3 ? clampRightWidth(input.rightPx, trackWidth, leftPx) : 0;

  return { leftPx, rightPx };
}

export function getKeyboardResizeResult(
  input: SplitViewKeyboardResizeInput
): SplitViewClampResult | null {
  const step = input.shiftKey
    ? KEYBOARD_RESIZE_LARGE_STEP_PX
    : KEYBOARD_RESIZE_STEP_PX;

  if (input.divider === 1) {
    return getLeftDividerKeyboardResize(input, step);
  }

  if (input.panes === 3) {
    return getRightDividerKeyboardResize(input, step);
  }

  return null;
}

function getLeftDividerKeyboardResize(
  input: SplitViewKeyboardResizeInput,
  step: number
) {
  const minLeft = MIN_PANE_PX;
  const maxLeft =
    input.panes === 2
      ? Math.max(MIN_PANE_PX, input.trackWidth - DIVIDER_PX - MIN_CENTER_PX)
      : Math.max(
          MIN_PANE_PX,
          input.trackWidth - 2 * DIVIDER_PX - input.rightPx - MIN_CENTER_PX
        );

  switch (input.key) {
    case 'ArrowLeft':
      return clampSplitViewWidths({
        ...input,
        leftPx: input.leftPx - step,
      });
    case 'ArrowRight':
      return clampSplitViewWidths({
        ...input,
        leftPx: input.leftPx + step,
      });
    case 'Home':
      return clampSplitViewWidths({
        ...input,
        leftPx: minLeft,
      });
    case 'End':
      return clampSplitViewWidths({
        ...input,
        leftPx: maxLeft,
      });
    default:
      return null;
  }
}

function getRightDividerKeyboardResize(
  input: SplitViewKeyboardResizeInput,
  step: number
) {
  const minRight = MIN_PANE_PX;
  const maxRight = Math.max(
    MIN_PANE_PX,
    input.trackWidth - 2 * DIVIDER_PX - input.leftPx - MIN_CENTER_PX
  );

  switch (input.key) {
    case 'ArrowLeft':
      return clampSplitViewWidths({
        ...input,
        rightPx: input.rightPx + step,
      });
    case 'ArrowRight':
      return clampSplitViewWidths({
        ...input,
        rightPx: input.rightPx - step,
      });
    case 'Home':
      return clampSplitViewWidths({
        ...input,
        rightPx: minRight,
      });
    case 'End':
      return clampSplitViewWidths({
        ...input,
        rightPx: maxRight,
      });
    default:
      return null;
  }
}
