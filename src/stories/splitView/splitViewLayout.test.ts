import { describe, expect, it } from 'vitest';

import {
  COMPACT_BREAKPOINT_PX,
  KEYBOARD_RESIZE_LARGE_STEP_PX,
  KEYBOARD_RESIZE_STEP_PX,
  MIN_PANE_PX,
  clampSplitViewWidths,
  getDefaultWidths,
  getKeyboardResizeResult,
  normalizeCompactActivePane,
  normalizePaneCount,
  shouldUseCompactMode,
} from './splitViewLayout';

describe('splitViewLayout', () => {
  it('defaults to a two-pane layout when pane count is omitted or invalid', () => {
    expect(normalizePaneCount(2)).toBe(2);
    expect(normalizePaneCount(3)).toBe(3);
    expect(normalizePaneCount(0)).toBe(2);
    expect(normalizePaneCount(42)).toBe(2);
  });

  it('computes default widths for two-pane layouts', () => {
    expect(
      getDefaultWidths({
        panes: 2,
        trackWidth: 1000,
      })
    ).toEqual({
      leftPx: 360,
      rightPx: 0,
    });
  });

  it('respects px and fractional defaults before clamping', () => {
    expect(
      getDefaultWidths({
        panes: 2,
        trackWidth: 1000,
        defaultStartPaneFraction: 0.45,
      }).leftPx
    ).toBe(450);

    expect(
      getDefaultWidths({
        panes: 3,
        trackWidth: 1200,
        defaultStartPaneWidthPx: 280,
        defaultEndPaneWidthPx: 300,
      })
    ).toEqual({
      leftPx: 280,
      rightPx: 300,
    });
  });

  it('clamps widths to preserve minimum pane sizes', () => {
    expect(
      clampSplitViewWidths({
        panes: 2,
        trackWidth: 320,
        leftPx: 20,
        rightPx: 0,
      })
    ).toEqual({
      leftPx: MIN_PANE_PX,
      rightPx: 0,
    });

    expect(
      clampSplitViewWidths({
        panes: 3,
        trackWidth: 640,
        leftPx: 400,
        rightPx: 250,
      })
    ).toEqual({
      leftPx: 214,
      rightPx: 250,
    });
  });

  it('returns compact mode only when width is at or below the breakpoint', () => {
    expect(shouldUseCompactMode(COMPACT_BREAKPOINT_PX - 1)).toBe(true);
    expect(shouldUseCompactMode(COMPACT_BREAKPOINT_PX)).toBe(true);
    expect(shouldUseCompactMode(COMPACT_BREAKPOINT_PX + 1)).toBe(false);
  });

  it('normalizes the active compact pane to a valid visible pane', () => {
    expect(normalizeCompactActivePane(1, 2)).toBe(1);
    expect(normalizeCompactActivePane(3, 2)).toBe(2);
    expect(normalizeCompactActivePane(0, 3)).toBe(2);
    expect(normalizeCompactActivePane(3, 3)).toBe(3);
  });

  it('supports keyboard resizing for the first divider', () => {
    expect(
      getKeyboardResizeResult({
        panes: 2,
        trackWidth: 1000,
        leftPx: 360,
        rightPx: 0,
        divider: 1,
        key: 'ArrowRight',
      })
    ).toEqual({
      leftPx: 360 + KEYBOARD_RESIZE_STEP_PX,
      rightPx: 0,
    });

    expect(
      getKeyboardResizeResult({
        panes: 2,
        trackWidth: 1000,
        leftPx: 360,
        rightPx: 0,
        divider: 1,
        key: 'ArrowLeft',
        shiftKey: true,
      })
    ).toEqual({
      leftPx: 360 - KEYBOARD_RESIZE_LARGE_STEP_PX,
      rightPx: 0,
    });
  });

  it('supports keyboard resizing for the second divider in three-pane layouts', () => {
    expect(
      getKeyboardResizeResult({
        panes: 3,
        trackWidth: 1200,
        leftPx: 320,
        rightPx: 280,
        divider: 2,
        key: 'ArrowLeft',
      })
    ).toEqual({
      leftPx: 320,
      rightPx: 280 + KEYBOARD_RESIZE_STEP_PX,
    });

    expect(
      getKeyboardResizeResult({
        panes: 3,
        trackWidth: 1200,
        leftPx: 320,
        rightPx: 280,
        divider: 2,
        key: 'Home',
      })
    ).toEqual({
      leftPx: 320,
      rightPx: MIN_PANE_PX,
    });
  });

  it('ignores unsupported keyboard keys', () => {
    expect(
      getKeyboardResizeResult({
        panes: 3,
        trackWidth: 1200,
        leftPx: 320,
        rightPx: 280,
        divider: 2,
        key: 'PageDown',
      })
    ).toBeNull();
  });
});
