/**
 * Shared utilities for flatpickr-based date/time picker components.
 * Extracts common patterns used across datepicker, daterangepicker, and timepicker.
 */

import type { Instance } from 'flatpickr/dist/types/instance';

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

/**
 * Creates a debounced version of a function that delays execution until
 * after `wait` milliseconds have elapsed since the last call.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      void func(...args);
      timeout = null;
    }, wait);
  };
}

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generates a random ID with a given prefix.
 * Used for creating unique IDs for inputs and their associated elements.
 */
export function generateRandomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
}

// ============================================================================
// DATE PARSING UTILITIES
// ============================================================================

/**
 * Parses a date string in Y-m-d format, validating month/day ranges
 * and rejecting rollover dates (e.g., 2024-02-31 becoming Mar 2).
 */
export function parseDateOnly(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;

  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);

  // Reject impossible month/day values
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;

  const date = new Date(y, m - 1, d);

  // Reject rollover dates
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }

  return isNaN(date.getTime()) ? null : date;
}

/**
 * Parses a datetime string in Y-m-d H:i or Y-m-d H:i:s format.
 */
export function parseDateTime(dateStr: string): Date | null {
  const dtMatch =
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(dateStr);
  if (!dtMatch) return null;

  const y = Number(dtMatch[1]);
  const mo = Number(dtMatch[2]);
  const da = Number(dtMatch[3]);
  const hh = Number(dtMatch[4]);
  const mm = Number(dtMatch[5]);
  const ss = dtMatch[6] !== undefined ? Number(dtMatch[6]) : 0;

  if (mo < 1 || mo > 12 || da < 1 || da > 31) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59 || ss < 0 || ss > 59) return null;

  const dt = new Date(y, mo - 1, da, hh, mm, ss);

  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo - 1 ||
    dt.getDate() !== da
  ) {
    return null;
  }

  return isNaN(dt.getTime()) ? null : dt;
}

/**
 * Parses a time string (e.g., "14:30", "2:30 PM", "02:30:45") into a Date
 * object anchored to today.
 */
export function parseTimeString(time: string | number | Date): Date | null {
  if (time instanceof Date) return time;

  if (typeof time === 'number') {
    const d = new Date(time);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (typeof time === 'string') {
    const str = time.trim();

    // Accept formats like '14:30', '2:30 PM', '02:30:45', etc.
    const ampmMatch = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap]m)?$/i.exec(str);
    if (!ampmMatch) return null;

    let hours = Number(ampmMatch[1]);
    const minutes = Number(ampmMatch[2]);
    const seconds = ampmMatch[3] !== undefined ? Number(ampmMatch[3]) : 0;
    const ampm = ampmMatch[4];

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
      return null;
    }

    if (ampm) {
      const a = ampm.toLowerCase();
      if (a === 'pm' && hours < 12) hours += 12;
      if (a === 'am' && hours === 12) hours = 0;
    }

    if (
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59 ||
      seconds < 0 ||
      seconds > 59
    ) {
      return null;
    }

    const d = new Date();
    d.setHours(hours, minutes, seconds, 0);
    return d;
  }

  return null;
}

/**
 * Normalizes a value to a Date object.
 * Handles Date objects, timestamps, and strings.
 */
export function normalizeToDate(
  value: string | number | Date | '' | null | undefined,
  parseDateString?: (str: string) => Date | null
): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof value === 'string') {
    // Use provided parser or fall back to basic parsing
    if (parseDateString) {
      return parseDateString(value);
    }

    // Try ISO format first
    if (value.includes('T')) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    // Try datetime format
    const dt = parseDateTime(value);
    if (dt) return dt;

    // Try date-only format
    return parseDateOnly(value);
  }

  return null;
}

// ============================================================================
// VALUE CHECKING UTILITIES
// ============================================================================

/**
 * Type guard that checks if a value is a valid Date object.
 * Returns true only if the value is a Date instance with a valid time value.
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Filters an array to only include valid Date objects.
 * Useful for defensive handling of flatpickr callbacks which may occasionally
 * pass non-Date values during certain interactions (e.g., time input changes).
 */
export function filterValidDates(dates: unknown[]): Date[] {
  return dates.filter((d): d is Date => isValidDate(d));
}

/**
 * Checks if a value is empty (null, undefined, empty string, or empty array).
 */
export function isEmptyValue(
  value: unknown
): value is null | undefined | '' | [] {
  if (value == null) return true;

  if (typeof value === 'string') return value.trim() === '';

  if (Array.isArray(value)) {
    return (
      value.length === 0 ||
      value.every((v) => {
        if (v == null) return true;
        return typeof v === 'string' ? v.trim() === '' : false;
      })
    );
  }

  return false;
}

/**
 * Checks if two Date objects represent the same time (hours, minutes, seconds).
 */
export function timesEqual(
  a: Date | null | undefined,
  b: Date | null | undefined
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.getHours() === b.getHours() &&
    a.getMinutes() === b.getMinutes() &&
    a.getSeconds() === b.getSeconds()
  );
}

/**
 * Checks if two Date objects represent the same date (year, month, day).
 */
export function datesEqual(
  a: Date | null | undefined,
  b: Date | null | undefined
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ============================================================================
// FLATPICKR INSTANCE UTILITIES
// ============================================================================

/**
 * Cleans up a flatpickr instance, removing event handlers and destroying it.
 */
export function cleanupFlatpickrInstance(instance: Instance | undefined): void {
  if (!instance) return;

  // Remove any anchor click handlers that were attached
  const __handlers = (instance as any).__anchorClickHandlers;
  if (Array.isArray(__handlers)) {
    __handlers.forEach((h: { el: HTMLElement; fn: EventListener }) => {
      try {
        h.el.removeEventListener('click', h.fn as EventListener);
      } catch {
        // ignore cleanup errors
      }
    });
  }

  instance.destroy();
}

/**
 * Type for anchor click handlers stored on flatpickr instance.
 */
export type AnchorClickHandler = {
  el: HTMLElement;
  fn: EventListener;
};

// ============================================================================
// FORM INTEGRATION UTILITIES
// ============================================================================

/**
 * Updates the form value for a picker component.
 */
export function updateFormValue(
  internals: ElementInternals | undefined,
  inputEl: HTMLInputElement | null
): void {
  if (internals && inputEl) {
    internals.setFormValue(inputEl.value);
  }
}

/**
 * Creates a submit listener for form validation.
 */
export function createFormSubmitListener(
  validateFn: (interacted: boolean, report: boolean) => void,
  checkValidityFn: () => boolean,
  requiredCheck: () => boolean
): (e: SubmitEvent) => void {
  return (e: SubmitEvent) => {
    validateFn(true, true);
    if (!checkValidityFn() || requiredCheck()) {
      e.preventDefault();
    }
  };
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  validity: ValidityState;
  validationMessage: string;
}

export interface ValidationOptions {
  inputEl: HTMLInputElement;
  required: boolean;
  isEmpty: boolean;
  invalidText: string;
  defaultErrorMessage: string;
  hasInteracted: boolean;
  customValidation?: () => { valid: boolean; message?: string };
}

/**
 * Performs validation for a picker input.
 * Returns validation state without modifying component state.
 */
export function validatePickerInput(
  options: ValidationOptions
): ValidationResult {
  const {
    inputEl,
    required,
    isEmpty,
    invalidText,
    defaultErrorMessage,
    customValidation,
  } = options;

  let validity = inputEl.validity;
  let validationMessage = inputEl.validationMessage;

  // Check required
  if (required && isEmpty) {
    validity = { ...validity, valueMissing: true };
    validationMessage = defaultErrorMessage || 'This field is required';
  }

  // Check custom validation
  if (customValidation) {
    const { valid, message } = customValidation();
    if (!valid) {
      validity = { ...validity, customError: true };
      if (message) validationMessage = message;
    }
  }

  // Check invalidText (external validation)
  if (invalidText) {
    validity = { ...validity, customError: true };
    validationMessage = invalidText;
  }

  const isValid = !validity.valueMissing && !validity.customError;

  return { isValid, validity, validationMessage };
}

// ============================================================================
// TEXT STRINGS UTILITIES
// ============================================================================

/**
 * Merges default text strings with custom overrides.
 */
export function mergeTextStrings<T extends Record<string, string>>(
  defaults: T,
  custom?: Partial<T>
): T {
  return { ...defaults, ...custom };
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Delay before re-initializing flatpickr after config changes (ms) */
export const CONFIG_DEBOUNCE_DELAY = 100;

/** Delay before re-initializing flatpickr after window resize (ms) */
export const RESIZE_DEBOUNCE_DELAY = 250;

/** Interval for checking if a hidden picker becomes visible (ms) */
export const VISIBILITY_CHECK_INTERVAL = 250;
