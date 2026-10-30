export const SEGMENTED_CONTROL_SIZES = {
  MEDIUM: 'medium',
  SMALL: 'small',
} as const;

export type SEGMENTED_CONTROL_SIZES =
  (typeof SEGMENTED_CONTROL_SIZES)[keyof typeof SEGMENTED_CONTROL_SIZES];

export const SEGMENTED_CONTROL_ICON_POSITION = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export type SEGMENTED_CONTROL_ICON_POSITION =
  (typeof SEGMENTED_CONTROL_ICON_POSITION)[keyof typeof SEGMENTED_CONTROL_ICON_POSITION];

/** Maximum number of segments in one control. */
export const SEGMENTED_CONTROL_MAX_ITEMS = 5;
