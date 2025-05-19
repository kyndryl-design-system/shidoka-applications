import {
  WidgetSizes,
  WidgetConstraints,
} from '../../../common/helpers/gridstack';

export default {
  max: [
    {
      id: 'w1',
      ...WidgetSizes.pill.max,
      ...WidgetConstraints.default.max,
    },
    {
      id: 'w2',
      ...WidgetSizes.pill.max,
      ...WidgetConstraints.default.max,
    },
  ],
  xl: [
    {
      id: 'w1',
      ...WidgetSizes.standard.xl,
      ...WidgetConstraints.default.xl,
    },
    {
      id: 'w2',
      ...WidgetSizes.standard.xl,
      ...WidgetConstraints.default.xl,
    },
  ],
  lg: [
    {
      id: 'w1',
      ...WidgetSizes.standard.lg,
      ...WidgetConstraints.default.lg,
    },
    {
      id: 'w2',
      ...WidgetSizes.standard.lg,
      ...WidgetConstraints.default.lg,
    },
  ],
  md: [
    {
      id: 'w1',
      ...WidgetSizes.pill.md,
      ...WidgetConstraints.default.md,
    },
    {
      id: 'w2',
      ...WidgetSizes.pill.md,
      ...WidgetConstraints.default.md,
    },
  ],
  sm: [
    {
      id: 'w1',
      ...WidgetSizes.pill.sm,
      ...WidgetConstraints.default.sm,
    },
    {
      id: 'w2',
      ...WidgetSizes.pill.sm,
      ...WidgetConstraints.default.sm,
    },
  ],
};
