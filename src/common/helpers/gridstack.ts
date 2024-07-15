export const Config = {
  handle: 'kyn-widget-drag-handle', // set the drag handle
  margin: 16, // 32px gap
  animate: false, // disable animation until after initial load
  columnOpts: {
    breakpointForWindow: true, // break based on viewport size, not grid size
    breakpoints: [
      { w: 671, c: 4 }, // shidoka-foundation sm breakpoint, 4 column grid
      { w: 1183, c: 8 }, // shidoka-foundation md breakpoint, 8 column grid
    ],
  },
};

export const WidgetSizes = {
  pill: {
    max: {
      w: 2,
      h: 2,
    },
    xl: {
      w: 3,
      h: 3,
    },
    lg: {
      w: 3,
      h: 3,
    },
    md: {
      w: 4,
      h: 4,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  standard: {
    max: {
      w: 4,
      h: 4,
    },
    xl: {
      w: 4,
      h: 4,
    },
    lg: {
      w: 4,
      h: 4,
    },
    md: {
      w: 8,
      h: 8,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  standardShort: {
    max: {
      w: 4,
      h: 2,
    },
    xl: {
      w: 4,
      h: 3,
    },
    lg: {
      w: 4,
      h: 4,
    },
    md: {
      w: 8,
      h: 5,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  wide: {
    max: {
      w: 6,
      h: 4,
    },
    xl: {
      w: 6,
      h: 4,
    },
    lg: {
      w: 6,
      h: 4,
    },
    md: {
      w: 8,
      h: 8,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  wideShort: {
    max: {
      w: 6,
      h: 3,
    },
    xl: {
      w: 6,
      h: 4,
    },
    lg: {
      w: 6,
      h: 4,
    },
    md: {
      w: 8,
      h: 4,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  xlWide: {
    max: {
      w: 8,
      h: 4,
    },
    xl: {
      w: 8,
      h: 4,
    },
    lg: {
      w: 8,
      h: 4,
    },
    md: {
      w: 8,
      h: 8,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  xlWideShort: {
    max: {
      w: 8,
      h: 3,
    },
    xl: {
      w: 8,
      h: 4,
    },
    lg: {
      w: 8,
      h: 4,
    },
    md: {
      w: 8,
      h: 5,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  xxlWide: {
    max: {
      w: 10,
      h: 4,
    },
    xl: {
      w: 10,
      h: 4,
    },
    lg: {
      w: 10,
      h: 4,
    },
    md: {
      w: 8,
      h: 8,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  xxlWideShort: {
    max: {
      w: 10,
      h: 3,
    },
    xl: {
      w: 10,
      h: 4,
    },
    lg: {
      w: 10,
      h: 4,
    },
    md: {
      w: 8,
      h: 5,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  xxxlWide: {
    max: {
      w: 12,
      h: 4,
    },
    xl: {
      w: 12,
      h: 4,
    },
    lg: {
      w: 12,
      h: 4,
    },
    md: {
      w: 8,
      h: 8,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  xxxlWideShort: {
    max: {
      w: 12,
      h: 3,
    },
    xl: {
      w: 12,
      h: 3,
    },
    lg: {
      w: 12,
      h: 4,
    },
    md: {
      w: 8,
      h: 5,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
  tower: {
    max: {
      w: 12,
      h: 7,
    },
    xl: {
      w: 12,
      h: 7,
    },
    lg: {
      w: 12,
      h: 7,
    },
    md: {
      w: 8,
      h: 8,
    },
    sm: {
      w: 4,
      h: 4,
    },
  },
};

export const WidgetConstraints = {
  default: {
    max: {
      minW: WidgetSizes.pill.max.w,
      minH: WidgetSizes.pill.max.h,
    },
    xl: {
      minW: WidgetSizes.pill.xl.w,
      minH: WidgetSizes.pill.xl.h,
    },
    lg: {
      minW: WidgetSizes.pill.lg.w,
      minH: WidgetSizes.pill.lg.h,
    },
    md: {
      minW: WidgetSizes.pill.md.w,
      minH: WidgetSizes.pill.md.h,
    },
    sm: {
      minW: WidgetSizes.pill.sm.w,
      minH: WidgetSizes.pill.sm.h,
    },
  },
  table: {
    max: {
      minW: WidgetSizes.wide.max.w,
      minH: WidgetSizes.wide.max.h,
    },
    xl: {
      minW: WidgetSizes.wide.xl.w,
      minH: WidgetSizes.wide.xl.h,
    },
    lg: {
      minW: WidgetSizes.wide.lg.w,
      minH: WidgetSizes.wide.lg.h,
    },
    md: {
      minW: WidgetSizes.wide.md.w,
      minH: WidgetSizes.wide.md.h,
    },
    sm: {
      minW: WidgetSizes.wide.sm.w,
      minH: WidgetSizes.wide.sm.h,
    },
  },
  chart: {
    max: {
      minW: WidgetSizes.wide.max.w,
      minH: WidgetSizes.wide.max.h,
    },
    xl: {
      minW: WidgetSizes.wide.xl.w,
      minH: WidgetSizes.wide.xl.h,
    },
    lg: {
      minW: WidgetSizes.wide.lg.w,
      minH: WidgetSizes.wide.lg.h,
    },
    md: {
      minW: WidgetSizes.wide.md.w,
      minH: WidgetSizes.wide.md.h,
    },
    sm: {
      minW: WidgetSizes.wide.sm.w,
      minH: WidgetSizes.wide.sm.h,
    },
  },
  list: {
    max: {
      minW: WidgetSizes.standard.max.w,
      minH: WidgetSizes.standard.max.h,
    },
    xl: {
      minW: WidgetSizes.standard.xl.w,
      minH: WidgetSizes.standard.xl.h,
    },
    lg: {
      minW: WidgetSizes.standard.lg.w,
      minH: WidgetSizes.standard.lg.h,
    },
    md: {
      minW: WidgetSizes.standard.md.w,
      minH: WidgetSizes.standard.md.h,
    },
    sm: {
      minW: WidgetSizes.standard.sm.w,
      minH: WidgetSizes.standard.sm.h,
    },
  },
  content: {
    max: {
      minW: WidgetSizes.standard.max.w,
      minH: WidgetSizes.standard.max.h,
    },
    xl: {
      minW: WidgetSizes.standard.xl.w,
      minH: WidgetSizes.standard.xl.h,
    },
    lg: {
      minW: WidgetSizes.standard.lg.w,
      minH: WidgetSizes.standard.lg.h,
    },
    md: {
      minW: WidgetSizes.standard.md.w,
      minH: WidgetSizes.standard.md.h,
    },
    sm: {
      minW: WidgetSizes.standard.sm.w,
      minH: WidgetSizes.standard.sm.h,
    },
  },
  alert: {
    max: {
      minW: WidgetSizes.standard.max.w,
      minH: WidgetSizes.standard.max.h,
    },
    xl: {
      minW: WidgetSizes.standard.xl.w,
      minH: WidgetSizes.standard.xl.h,
    },
    lg: {
      minW: WidgetSizes.standard.lg.w,
      minH: WidgetSizes.standard.lg.h,
    },
    md: {
      minW: WidgetSizes.standard.md.w,
      minH: WidgetSizes.standard.md.h,
    },
    sm: {
      minW: WidgetSizes.standard.sm.w,
      minH: WidgetSizes.standard.sm.h,
    },
  },
  cards: {
    max: {
      minW: WidgetSizes.wide.max.w,
      minH: WidgetSizes.wide.max.h,
    },
    xl: {
      minW: WidgetSizes.wide.xl.w,
      minH: WidgetSizes.wide.xl.h,
    },
    lg: {
      minW: WidgetSizes.wide.lg.w,
      minH: WidgetSizes.wide.lg.h,
    },
    md: {
      minW: WidgetSizes.wide.md.w,
      minH: WidgetSizes.wide.md.h,
    },
    sm: {
      minW: WidgetSizes.wide.sm.w,
      minH: WidgetSizes.wide.sm.h,
    },
  },
  accordion: {
    max: {
      minW: WidgetSizes.standard.max.w,
      minH: WidgetSizes.standard.max.h,
    },
    xl: {
      minW: WidgetSizes.standard.xl.w,
      minH: WidgetSizes.standard.xl.h,
    },
    lg: {
      minW: WidgetSizes.standard.lg.w,
      minH: WidgetSizes.standard.lg.h,
    },
    md: {
      minW: WidgetSizes.standard.md.w,
      minH: WidgetSizes.standard.md.h,
    },
    sm: {
      minW: WidgetSizes.standard.sm.w,
      minH: WidgetSizes.standard.sm.h,
    },
  },
};
