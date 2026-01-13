/**
 * Flatpickr helpers - centralized exports for date/time picker components.
 */

// Main flatpickr
export {
  _defaultCalendarTooltipStrings,
  type FlatpickrTextStrings,
  setTooltipStrings,
  getTextStrings,
  preventFlatpickrOpen,
  handleInputClick,
  handleInputFocus,
  modifyWeekdayShorthands,
  injectFlatpickrStyles,
  initializeMultiAnchorFlatpickr,
  initializeSingleAnchorFlatpickr,
  isValidDateFormat,
  getPlaceholder,
  loadLocale,
  getModalContainer,
  getFlatpickrOptions,
  updateEnableTime,
  setCalendarAttributes,
  hideEmptyYear,
  emitValue,
  clearFlatpickrInput,
  DateRangeEditableMode,
  createDateRangeDayLockHandler,
  createDateRangeChangeLockHandler,
  applyDateRangeEditingRestrictions,
} from './flatpickr';

// Locale/language support
export {
  langsArray,
  type SupportedLocale,
  isSupportedLocale,
  loadLocale as loadLocaleFromLangs,
  preloadAllLocales,
} from './langs';

// Calendar overlay positioning
export { fixedOverlayPositionPlugin } from './overlay';

// Shared utilities
export {
  debounce,
  generateRandomId,
  parseDateOnly,
  parseDateTime,
  parseTimeString,
  normalizeToDate,
  isEmptyValue,
  timesEqual,
  datesEqual,
  cleanupFlatpickrInstance,
  type AnchorClickHandler,
  updateFormValue,
  createFormSubmitListener,
  type ValidationResult,
  type ValidationOptions,
  validatePickerInput,
  mergeTextStrings,
  CONFIG_DEBOUNCE_DELAY,
  RESIZE_DEBOUNCE_DELAY,
  VISIBILITY_CHECK_INTERVAL,
} from './utils';
