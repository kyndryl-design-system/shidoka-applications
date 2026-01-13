/**
 * Unit tests for flatpickr utility functions.
 * Tests cover debounce, ID generation, date parsing, value checking,
 * flatpickr instance cleanup, form integration, and validation utilities.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock window for node environment (debounce uses window.setTimeout/clearTimeout)
// We need to set this up before importing utils, so use a getter that always
// returns the current global timer functions (which vitest will mock)
if (typeof globalThis.window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    value: {
      get setTimeout() {
        return globalThis.setTimeout;
      },
      get clearTimeout() {
        return globalThis.clearTimeout;
      },
    },
    writable: true,
    configurable: true,
  });
}

import {
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
  updateFormValue,
  createFormSubmitListener,
  validatePickerInput,
  mergeTextStrings,
  CONFIG_DEBOUNCE_DELAY,
  RESIZE_DEBOUNCE_DELAY,
  VISIBILITY_CHECK_INTERVAL,
} from './utils';

// ============================================================================
// DEBOUNCE TESTS
// ============================================================================

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous calls when called again within wait time', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the debounced function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should use the latest arguments when called multiple times', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    debounced('second');
    debounced('third');

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('third');
  });
});

// ============================================================================
// ID GENERATION TESTS
// ============================================================================

describe('generateRandomId', () => {
  it('should generate an ID with the given prefix', () => {
    const id = generateRandomId('test');
    expect(id).toMatch(/^test-[a-z0-9]+$/);
  });

  it('should generate unique IDs', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateRandomId('prefix'));
    }
    expect(ids.size).toBe(100);
  });

  it('should handle empty prefix', () => {
    const id = generateRandomId('');
    expect(id).toMatch(/^-[a-z0-9]+$/);
  });

  it('should handle special characters in prefix', () => {
    const id = generateRandomId('my-picker');
    expect(id).toMatch(/^my-picker-[a-z0-9]+$/);
  });
});

// ============================================================================
// DATE PARSING TESTS
// ============================================================================

describe('parseDateOnly', () => {
  it('should parse valid Y-m-d format', () => {
    const date = parseDateOnly('2024-03-15');
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(2024);
    expect(date!.getMonth()).toBe(2); // 0-indexed
    expect(date!.getDate()).toBe(15);
  });

  it('should return null for invalid format', () => {
    expect(parseDateOnly('03-15-2024')).toBeNull();
    expect(parseDateOnly('2024/03/15')).toBeNull();
    expect(parseDateOnly('2024-3-15')).toBeNull();
    expect(parseDateOnly('not a date')).toBeNull();
  });

  it('should return null for invalid month', () => {
    expect(parseDateOnly('2024-00-15')).toBeNull();
    expect(parseDateOnly('2024-13-15')).toBeNull();
  });

  it('should return null for invalid day', () => {
    expect(parseDateOnly('2024-03-00')).toBeNull();
    expect(parseDateOnly('2024-03-32')).toBeNull();
  });

  it('should return null for rollover dates', () => {
    // Feb 31 would roll over to Mar 2 or 3
    expect(parseDateOnly('2024-02-31')).toBeNull();
    // Apr 31 would roll over to May 1
    expect(parseDateOnly('2024-04-31')).toBeNull();
  });

  it('should handle leap year correctly', () => {
    // 2024 is a leap year
    const leapDate = parseDateOnly('2024-02-29');
    expect(leapDate).not.toBeNull();
    expect(leapDate!.getDate()).toBe(29);

    // 2023 is not a leap year
    expect(parseDateOnly('2023-02-29')).toBeNull();
  });
});

describe('parseDateTime', () => {
  it('should parse Y-m-d H:i format', () => {
    const dt = parseDateTime('2024-03-15 14:30');
    expect(dt).not.toBeNull();
    expect(dt!.getFullYear()).toBe(2024);
    expect(dt!.getMonth()).toBe(2);
    expect(dt!.getDate()).toBe(15);
    expect(dt!.getHours()).toBe(14);
    expect(dt!.getMinutes()).toBe(30);
    expect(dt!.getSeconds()).toBe(0);
  });

  it('should parse Y-m-d H:i:s format', () => {
    const dt = parseDateTime('2024-03-15 14:30:45');
    expect(dt).not.toBeNull();
    expect(dt!.getHours()).toBe(14);
    expect(dt!.getMinutes()).toBe(30);
    expect(dt!.getSeconds()).toBe(45);
  });

  it('should parse ISO-like format with T separator', () => {
    const dt = parseDateTime('2024-03-15T14:30');
    expect(dt).not.toBeNull();
    expect(dt!.getHours()).toBe(14);
    expect(dt!.getMinutes()).toBe(30);
  });

  it('should return null for invalid time values', () => {
    expect(parseDateTime('2024-03-15 24:00')).toBeNull();
    expect(parseDateTime('2024-03-15 14:60')).toBeNull();
    expect(parseDateTime('2024-03-15 14:30:60')).toBeNull();
  });

  it('should return null for invalid date portion', () => {
    expect(parseDateTime('2024-13-15 14:30')).toBeNull();
    expect(parseDateTime('2024-02-31 14:30')).toBeNull();
  });

  it('should return null for invalid format', () => {
    expect(parseDateTime('2024-03-15')).toBeNull();
    expect(parseDateTime('14:30')).toBeNull();
    expect(parseDateTime('not a datetime')).toBeNull();
  });
});

describe('parseTimeString', () => {
  it('should return Date objects as-is', () => {
    const date = new Date(2024, 2, 15, 14, 30, 0);
    const result = parseTimeString(date);
    expect(result).toBe(date);
  });

  it('should convert timestamps to Date', () => {
    const timestamp = Date.now();
    const result = parseTimeString(timestamp);
    expect(result).not.toBeNull();
    expect(result!.getTime()).toBe(timestamp);
  });

  it('should parse 24-hour format (HH:mm)', () => {
    const result = parseTimeString('14:30');
    expect(result).not.toBeNull();
    expect(result!.getHours()).toBe(14);
    expect(result!.getMinutes()).toBe(30);
  });

  it('should parse 24-hour format with seconds (HH:mm:ss)', () => {
    const result = parseTimeString('14:30:45');
    expect(result).not.toBeNull();
    expect(result!.getHours()).toBe(14);
    expect(result!.getMinutes()).toBe(30);
    expect(result!.getSeconds()).toBe(45);
  });

  it('should parse 12-hour format with AM', () => {
    const result = parseTimeString('9:30 AM');
    expect(result).not.toBeNull();
    expect(result!.getHours()).toBe(9);
    expect(result!.getMinutes()).toBe(30);
  });

  it('should parse 12-hour format with PM', () => {
    const result = parseTimeString('2:30 PM');
    expect(result).not.toBeNull();
    expect(result!.getHours()).toBe(14);
    expect(result!.getMinutes()).toBe(30);
  });

  it('should handle 12 AM as midnight', () => {
    const result = parseTimeString('12:00 AM');
    expect(result).not.toBeNull();
    expect(result!.getHours()).toBe(0);
  });

  it('should handle 12 PM as noon', () => {
    const result = parseTimeString('12:00 PM');
    expect(result).not.toBeNull();
    expect(result!.getHours()).toBe(12);
  });

  it('should be case-insensitive for AM/PM', () => {
    expect(parseTimeString('2:30 pm')!.getHours()).toBe(14);
    expect(parseTimeString('2:30 PM')!.getHours()).toBe(14);
    expect(parseTimeString('9:30 am')!.getHours()).toBe(9);
    expect(parseTimeString('9:30 AM')!.getHours()).toBe(9);
  });

  it('should return null for invalid time values', () => {
    expect(parseTimeString('25:00')).toBeNull();
    expect(parseTimeString('14:60')).toBeNull();
    expect(parseTimeString('14:30:60')).toBeNull();
  });

  it('should return null for invalid format', () => {
    expect(parseTimeString('not a time')).toBeNull();
    expect(parseTimeString('')).toBeNull();
  });

  it('should return null for invalid number timestamps', () => {
    expect(parseTimeString(NaN)).toBeNull();
  });
});

describe('normalizeToDate', () => {
  it('should return null for falsy values', () => {
    expect(normalizeToDate(null)).toBeNull();
    expect(normalizeToDate(undefined)).toBeNull();
    expect(normalizeToDate('')).toBeNull();
  });

  it('should return valid Date objects as-is', () => {
    const date = new Date(2024, 2, 15);
    const result = normalizeToDate(date);
    expect(result).toBe(date);
  });

  it('should return null for invalid Date objects', () => {
    const invalidDate = new Date('invalid');
    expect(normalizeToDate(invalidDate)).toBeNull();
  });

  it('should convert timestamps to Date', () => {
    const timestamp = Date.now();
    const result = normalizeToDate(timestamp);
    expect(result!.getTime()).toBe(timestamp);
  });

  it('should return null for invalid timestamps', () => {
    expect(normalizeToDate(NaN)).toBeNull();
  });

  it('should parse ISO strings', () => {
    const result = normalizeToDate('2024-03-15T14:30:00.000Z');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2024);
  });

  it('should parse date-only strings', () => {
    const result = normalizeToDate('2024-03-15');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(15);
  });

  it('should parse datetime strings', () => {
    const result = normalizeToDate('2024-03-15 14:30');
    expect(result).not.toBeNull();
    expect(result!.getHours()).toBe(14);
    expect(result!.getMinutes()).toBe(30);
  });

  it('should use custom parser when provided', () => {
    const customParser = vi.fn().mockReturnValue(new Date(2024, 0, 1));
    const result = normalizeToDate('custom-format', customParser);

    expect(customParser).toHaveBeenCalledWith('custom-format');
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(0);
    expect(result!.getDate()).toBe(1);
  });
});

// ============================================================================
// VALUE CHECKING TESTS
// ============================================================================

describe('isEmptyValue', () => {
  it('should return true for null', () => {
    expect(isEmptyValue(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isEmptyValue(undefined)).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isEmptyValue('')).toBe(true);
  });

  it('should return true for whitespace-only string', () => {
    expect(isEmptyValue('   ')).toBe(true);
    expect(isEmptyValue('\t\n')).toBe(true);
  });

  it('should return false for non-empty string', () => {
    expect(isEmptyValue('hello')).toBe(false);
    expect(isEmptyValue('  hello  ')).toBe(false);
  });

  it('should return true for empty array', () => {
    expect(isEmptyValue([])).toBe(true);
  });

  it('should return true for array of null/undefined', () => {
    expect(isEmptyValue([null])).toBe(true);
    expect(isEmptyValue([undefined])).toBe(true);
    expect(isEmptyValue([null, undefined])).toBe(true);
  });

  it('should return true for array of empty strings', () => {
    expect(isEmptyValue([''])).toBe(true);
    expect(isEmptyValue(['', '  '])).toBe(true);
  });

  it('should return false for array with non-empty values', () => {
    expect(isEmptyValue(['value'])).toBe(false);
    expect(isEmptyValue([null, 'value'])).toBe(false);
  });

  it('should return false for array with Date objects', () => {
    expect(isEmptyValue([new Date()])).toBe(false);
  });

  it('should return false for non-empty objects', () => {
    expect(isEmptyValue({ key: 'value' })).toBe(false);
  });

  it('should return false for numbers', () => {
    expect(isEmptyValue(0)).toBe(false);
    expect(isEmptyValue(42)).toBe(false);
  });

  it('should return false for Date objects', () => {
    expect(isEmptyValue(new Date())).toBe(false);
  });
});

describe('timesEqual', () => {
  it('should return true for two null/undefined values', () => {
    expect(timesEqual(null, null)).toBe(true);
    expect(timesEqual(undefined, undefined)).toBe(true);
    expect(timesEqual(null, undefined)).toBe(true);
  });

  it('should return false when one is null/undefined', () => {
    expect(timesEqual(new Date(), null)).toBe(false);
    expect(timesEqual(null, new Date())).toBe(false);
  });

  it('should return true for same time', () => {
    const a = new Date(2024, 2, 15, 14, 30, 45);
    const b = new Date(2024, 5, 20, 14, 30, 45); // Different date, same time
    expect(timesEqual(a, b)).toBe(true);
  });

  it('should return false for different hours', () => {
    const a = new Date(2024, 2, 15, 14, 30, 45);
    const b = new Date(2024, 2, 15, 15, 30, 45);
    expect(timesEqual(a, b)).toBe(false);
  });

  it('should return false for different minutes', () => {
    const a = new Date(2024, 2, 15, 14, 30, 45);
    const b = new Date(2024, 2, 15, 14, 31, 45);
    expect(timesEqual(a, b)).toBe(false);
  });

  it('should return false for different seconds', () => {
    const a = new Date(2024, 2, 15, 14, 30, 45);
    const b = new Date(2024, 2, 15, 14, 30, 46);
    expect(timesEqual(a, b)).toBe(false);
  });
});

describe('datesEqual', () => {
  it('should return true for two null/undefined values', () => {
    expect(datesEqual(null, null)).toBe(true);
    expect(datesEqual(undefined, undefined)).toBe(true);
    expect(datesEqual(null, undefined)).toBe(true);
  });

  it('should return false when one is null/undefined', () => {
    expect(datesEqual(new Date(), null)).toBe(false);
    expect(datesEqual(null, new Date())).toBe(false);
  });

  it('should return true for same date', () => {
    const a = new Date(2024, 2, 15, 10, 0, 0);
    const b = new Date(2024, 2, 15, 20, 30, 45); // Different time, same date
    expect(datesEqual(a, b)).toBe(true);
  });

  it('should return false for different year', () => {
    const a = new Date(2024, 2, 15);
    const b = new Date(2025, 2, 15);
    expect(datesEqual(a, b)).toBe(false);
  });

  it('should return false for different month', () => {
    const a = new Date(2024, 2, 15);
    const b = new Date(2024, 3, 15);
    expect(datesEqual(a, b)).toBe(false);
  });

  it('should return false for different day', () => {
    const a = new Date(2024, 2, 15);
    const b = new Date(2024, 2, 16);
    expect(datesEqual(a, b)).toBe(false);
  });
});

// ============================================================================
// FLATPICKR INSTANCE TESTS
// ============================================================================

describe('cleanupFlatpickrInstance', () => {
  it('should handle undefined instance', () => {
    expect(() => cleanupFlatpickrInstance(undefined)).not.toThrow();
  });

  it('should call destroy on instance', () => {
    const mockInstance = {
      destroy: vi.fn(),
    };
    cleanupFlatpickrInstance(mockInstance as any);
    expect(mockInstance.destroy).toHaveBeenCalled();
  });

  it('should remove anchor click handlers', () => {
    const mockHandler1 = { el: { removeEventListener: vi.fn() }, fn: vi.fn() };
    const mockHandler2 = { el: { removeEventListener: vi.fn() }, fn: vi.fn() };

    const mockInstance = {
      destroy: vi.fn(),
      __anchorClickHandlers: [mockHandler1, mockHandler2],
    };

    cleanupFlatpickrInstance(mockInstance as any);

    expect(mockHandler1.el.removeEventListener).toHaveBeenCalledWith(
      'click',
      mockHandler1.fn
    );
    expect(mockHandler2.el.removeEventListener).toHaveBeenCalledWith(
      'click',
      mockHandler2.fn
    );
  });

  it('should handle missing anchor click handlers', () => {
    const mockInstance = {
      destroy: vi.fn(),
    };
    expect(() => cleanupFlatpickrInstance(mockInstance as any)).not.toThrow();
  });

  it('should handle errors during handler removal', () => {
    const mockHandler = {
      el: {
        removeEventListener: vi.fn().mockImplementation(() => {
          throw new Error('Test error');
        }),
      },
      fn: vi.fn(),
    };

    const mockInstance = {
      destroy: vi.fn(),
      __anchorClickHandlers: [mockHandler],
    };

    expect(() => cleanupFlatpickrInstance(mockInstance as any)).not.toThrow();
    expect(mockInstance.destroy).toHaveBeenCalled();
  });
});

// ============================================================================
// FORM INTEGRATION TESTS
// ============================================================================

describe('updateFormValue', () => {
  it('should set form value when both internals and input exist', () => {
    const mockInternals = {
      setFormValue: vi.fn(),
    };
    const mockInput = {
      value: 'test-value',
    };

    updateFormValue(mockInternals as any, mockInput as any);
    expect(mockInternals.setFormValue).toHaveBeenCalledWith('test-value');
  });

  it('should do nothing when internals is undefined', () => {
    const mockInput = { value: 'test-value' };
    expect(() => updateFormValue(undefined, mockInput as any)).not.toThrow();
  });

  it('should do nothing when input is null', () => {
    const mockInternals = { setFormValue: vi.fn() };
    expect(() => updateFormValue(mockInternals as any, null)).not.toThrow();
    expect(mockInternals.setFormValue).not.toHaveBeenCalled();
  });
});

describe('createFormSubmitListener', () => {
  it('should call validate function with interacted=true and report=true', () => {
    const validateFn = vi.fn();
    const checkValidityFn = vi.fn().mockReturnValue(true);
    const requiredCheck = vi.fn().mockReturnValue(false);

    const listener = createFormSubmitListener(
      validateFn,
      checkValidityFn,
      requiredCheck
    );
    const mockEvent = { preventDefault: vi.fn() } as any;

    listener(mockEvent);

    expect(validateFn).toHaveBeenCalledWith(true, true);
  });

  it('should prevent default when validity check fails', () => {
    const validateFn = vi.fn();
    const checkValidityFn = vi.fn().mockReturnValue(false);
    const requiredCheck = vi.fn().mockReturnValue(false);

    const listener = createFormSubmitListener(
      validateFn,
      checkValidityFn,
      requiredCheck
    );
    const mockEvent = { preventDefault: vi.fn() } as any;

    listener(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should prevent default when required check fails', () => {
    const validateFn = vi.fn();
    const checkValidityFn = vi.fn().mockReturnValue(true);
    const requiredCheck = vi.fn().mockReturnValue(true);

    const listener = createFormSubmitListener(
      validateFn,
      checkValidityFn,
      requiredCheck
    );
    const mockEvent = { preventDefault: vi.fn() } as any;

    listener(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent default when valid', () => {
    const validateFn = vi.fn();
    const checkValidityFn = vi.fn().mockReturnValue(true);
    const requiredCheck = vi.fn().mockReturnValue(false);

    const listener = createFormSubmitListener(
      validateFn,
      checkValidityFn,
      requiredCheck
    );
    const mockEvent = { preventDefault: vi.fn() } as any;

    listener(mockEvent);

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });
});

// ============================================================================
// VALIDATION TESTS
// ============================================================================

describe('validatePickerInput', () => {
  const createMockInput = (validity: Partial<ValidityState> = {}) => {
    return {
      validity: {
        valueMissing: false,
        customError: false,
        ...validity,
      } as ValidityState,
      validationMessage: '',
    } as HTMLInputElement;
  };

  it('should return valid result for non-required empty field', () => {
    const result = validatePickerInput({
      inputEl: createMockInput(),
      required: false,
      isEmpty: true,
      invalidText: '',
      defaultErrorMessage: '',
      hasInteracted: false,
    });

    expect(result.isValid).toBe(true);
  });

  it('should return invalid for required empty field', () => {
    const result = validatePickerInput({
      inputEl: createMockInput(),
      required: true,
      isEmpty: true,
      invalidText: '',
      defaultErrorMessage: 'Field is required',
      hasInteracted: true,
    });

    expect(result.isValid).toBe(false);
    expect(result.validity.valueMissing).toBe(true);
    expect(result.validationMessage).toBe('Field is required');
  });

  it('should use default message when no custom message provided', () => {
    const result = validatePickerInput({
      inputEl: createMockInput(),
      required: true,
      isEmpty: true,
      invalidText: '',
      defaultErrorMessage: '',
      hasInteracted: true,
    });

    expect(result.validationMessage).toBe('This field is required');
  });

  it('should return invalid when invalidText is set', () => {
    const result = validatePickerInput({
      inputEl: createMockInput(),
      required: false,
      isEmpty: false,
      invalidText: 'Custom error message',
      defaultErrorMessage: '',
      hasInteracted: true,
    });

    expect(result.isValid).toBe(false);
    expect(result.validity.customError).toBe(true);
    expect(result.validationMessage).toBe('Custom error message');
  });

  it('should apply custom validation', () => {
    const customValidation = vi
      .fn()
      .mockReturnValue({ valid: false, message: 'Custom validation failed' });

    const result = validatePickerInput({
      inputEl: createMockInput(),
      required: false,
      isEmpty: false,
      invalidText: '',
      defaultErrorMessage: '',
      hasInteracted: true,
      customValidation,
    });

    expect(result.isValid).toBe(false);
    expect(result.validity.customError).toBe(true);
    expect(result.validationMessage).toBe('Custom validation failed');
  });

  it('should pass when custom validation succeeds', () => {
    const customValidation = vi.fn().mockReturnValue({ valid: true });

    const result = validatePickerInput({
      inputEl: createMockInput(),
      required: false,
      isEmpty: false,
      invalidText: '',
      defaultErrorMessage: '',
      hasInteracted: true,
      customValidation,
    });

    expect(result.isValid).toBe(true);
  });
});

// ============================================================================
// TEXT STRINGS TESTS
// ============================================================================

describe('mergeTextStrings', () => {
  it('should return defaults when no custom provided', () => {
    const defaults = { a: 'default-a', b: 'default-b' };
    const result = mergeTextStrings(defaults);
    expect(result).toEqual(defaults);
  });

  it('should merge custom strings over defaults', () => {
    const defaults = { a: 'default-a', b: 'default-b' };
    const custom = { a: 'custom-a' };
    const result = mergeTextStrings(defaults, custom);
    expect(result).toEqual({ a: 'custom-a', b: 'default-b' });
  });

  it('should handle empty custom object', () => {
    const defaults = { a: 'default-a', b: 'default-b' };
    const result = mergeTextStrings(defaults, {});
    expect(result).toEqual(defaults);
  });

  it('should not modify original objects', () => {
    const defaults = { a: 'default-a', b: 'default-b' };
    const custom = { a: 'custom-a' };
    mergeTextStrings(defaults, custom);
    expect(defaults.a).toBe('default-a');
    expect(custom.a).toBe('custom-a');
  });
});

// ============================================================================
// CONSTANTS TESTS
// ============================================================================

describe('constants', () => {
  it('should export CONFIG_DEBOUNCE_DELAY', () => {
    expect(typeof CONFIG_DEBOUNCE_DELAY).toBe('number');
    expect(CONFIG_DEBOUNCE_DELAY).toBe(100);
  });

  it('should export RESIZE_DEBOUNCE_DELAY', () => {
    expect(typeof RESIZE_DEBOUNCE_DELAY).toBe('number');
    expect(RESIZE_DEBOUNCE_DELAY).toBe(250);
  });

  it('should export VISIBILITY_CHECK_INTERVAL', () => {
    expect(typeof VISIBILITY_CHECK_INTERVAL).toBe('number');
    expect(VISIBILITY_CHECK_INTERVAL).toBe(250);
  });
});
