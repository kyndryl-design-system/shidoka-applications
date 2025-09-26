export enum BUTTON_TYPES {
  BUTTON = 'button',
  SUBMIT = 'submit',
  RESET = 'reset',
}

export enum BUTTON_KINDS {
  PRIMARY = 'primary',
  PRIMARY_AI = 'primary-ai',
  PRIMARY_DESTRUCTIVE = 'primary-destructive',
  SECONDARY = 'secondary',
  SECONDARY_DESTRUCTIVE = 'secondary-destructive',
  TERTIARY = 'tertiary',
  OUTLINE = 'outline',
  OUTLINE_DESTRUCTIVE = 'outline-destructive',
  GHOST = 'ghost',
  GHOST_AI = 'ghost-ai',
  GHOST_DESTRUCTIVE = 'ghost-destructive',
  CONTENT = 'content',
}

export enum BUTTON_SIZES {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
  EXTRA_SMALL = 'extra-small',
}

export enum BUTTON_ICON_POSITION {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
}

export const BUTTON_KINDS_SOLID = [
  BUTTON_KINDS.PRIMARY,
  BUTTON_KINDS.PRIMARY_AI,
  BUTTON_KINDS.PRIMARY_DESTRUCTIVE,
  BUTTON_KINDS.SECONDARY,
  BUTTON_KINDS.SECONDARY_DESTRUCTIVE,
  BUTTON_KINDS.TERTIARY,
  BUTTON_KINDS.CONTENT,
];

export const BUTTON_KINDS_OUTLINE = [
  BUTTON_KINDS.OUTLINE,
  BUTTON_KINDS.OUTLINE_DESTRUCTIVE,
];
