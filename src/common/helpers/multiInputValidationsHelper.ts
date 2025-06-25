export const defaultTextStrings = {
  requiredText: 'Required',
  requiredError: 'At least one item is required',
  placeholderSecondary: 'Add another item...',
  invalidFormatError: 'Invalid format.',
  maxExceededError: 'Maximum number of items exceeded.',
  duplicateError: 'Item already added',
};

export const isValidEmail = (email: string): boolean => {
  const EMAIL_RE =
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;
  return EMAIL_RE.test(email);
};

export const isValidInput = (
  input: string,
  inputType: string,
  pattern?: string
): boolean => {
  if (pattern) {
    try {
      const regex = new RegExp(pattern);
      return regex.test(input);
    } catch (e) {
      console.error('Invalid regex pattern:', e);
      return true;
    }
  }

  if (inputType === 'email') {
    return isValidEmail(input);
  }

  return true;
};

const validateInputTags = (
  inputs: string[],
  required: boolean,
  inputType: string,
  pattern?: string,
  maxItems?: number,
  invalidText?: string,
  textStrings?: any,
  validationsDisabled?: boolean
): { isValid: boolean; validationState: any; validationMessage: string } => {
  if (validationsDisabled) {
    return {
      isValid: true,
      validationState: { customError: false, valueMissing: false },
      validationMessage: '',
    };
  }

  const _textStrings = { ...defaultTextStrings, ...(textStrings || {}) };

  const invalidTagIndexes = inputs
    .map((input, i) => (!isValidInput(input, inputType, pattern) ? i : -1))
    .filter((i) => i >= 0);
  const hasInvalidTags = invalidTagIndexes.length > 0;
  const isEmptyButRequired = required && inputs.length === 0;
  const isMaxExceeded = maxItems !== undefined && inputs.length > maxItems;
  const uniqueInputs = new Set(inputs);
  const hasDuplicates = uniqueInputs.size < inputs.length;

  const state = { customError: false, valueMissing: false };
  let msg = '';
  let hasError = false;

  if (isEmptyButRequired) {
    state.valueMissing = true;
    msg = invalidText || _textStrings.requiredError;
    hasError = true;
  } else if (hasInvalidTags) {
    state.customError = true;
    msg = invalidText || _textStrings.invalidFormatError;
    hasError = true;
  } else if (isMaxExceeded) {
    state.customError = true;
    msg = invalidText || _textStrings.maxExceededError;
    hasError = true;
  } else if (hasDuplicates) {
    state.customError = true;
    msg = invalidText || _textStrings.duplicateError;
    hasError = true;
  }

  return {
    isValid: !hasError,
    validationState: state,
    validationMessage: msg,
  };
};

export const maxItemsExceededCheck = (
  currentCount: number,
  newCount: number,
  maxItems?: number
): boolean => maxItems !== undefined && currentCount + newCount > maxItems;

export const isItemDuplicate = (
  item: string,
  existingItems: Set<string> | string[]
): boolean => {
  if (existingItems instanceof Set) {
    return existingItems.has(item);
  }
  return existingItems.includes(item);
};

export const validateAllTags = (
  inputs: string[],
  required: boolean,
  maxItems?: number,
  invalidText?: string,
  textStrings?: Partial<typeof defaultTextStrings>,
  validationsDisabled?: boolean,
  forceInvalid?: boolean,
  inputType = 'default',
  pattern?: string
): { state: any; message: string; hasError: boolean } => {
  const mergedTextStrings = {
    ...defaultTextStrings,
    ...(textStrings || {}),
  };

  let state = { customError: false, valueMissing: false };
  let message = '';
  let hasError = false;

  if (validationsDisabled) {
    return { state, message: '', hasError: false };
  }

  if (forceInvalid) {
    state.customError = true;
    message = invalidText || mergedTextStrings.invalidFormatError;
    hasError = true;
  } else {
    const { isValid, validationState, validationMessage } = validateInputTags(
      inputs,
      required,
      inputType,
      pattern,
      maxItems,
      invalidText,
      mergedTextStrings,
      validationsDisabled
    );
    if (!isValid) {
      state = { ...state, ...validationState };
      message = validationMessage;
      hasError = true;
    }
  }

  return { state, message, hasError };
};

export const processTagsFromValue = (
  inputValue: string,
  existingItems: string[],
  maxItems?: number,
  validationsDisabled?: boolean,
  textStrings?: typeof defaultTextStrings,
  inputType = 'default',
  pattern?: string
): {
  newItems: string[];
  validationState: { customError: boolean; valueMissing: boolean };
  validationMessage: string;
  hasError: boolean;
  invalidIndexes: Set<number>;
} => {
  const _textStrings = textStrings || defaultTextStrings;
  const parts = inputValue
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  if (
    !validationsDisabled &&
    maxItemsExceededCheck(existingItems.length, parts.length, maxItems)
  ) {
    return {
      newItems: [],
      validationState: { customError: true, valueMissing: false },
      validationMessage: _textStrings.maxExceededError,
      hasError: true,
      invalidIndexes: new Set<number>(),
    };
  }

  const invalidIndexes = new Set<number>();
  const existingSet = new Set(existingItems);
  const newItems: string[] = [];
  let duplicateFound = false;

  for (const part of parts) {
    if (!validationsDisabled && isItemDuplicate(part, existingSet)) {
      duplicateFound = true;
      break;
    }

    existingSet.add(part);
    newItems.push(part);

    const idx = existingItems.length + newItems.length - 1;
    if (!validationsDisabled && !isValidInput(part, inputType, pattern)) {
      invalidIndexes.add(idx);
    }
  }

  if (duplicateFound) {
    return {
      newItems: [],
      validationState: { customError: true, valueMissing: false },
      validationMessage: _textStrings.duplicateError,
      hasError: true,
      invalidIndexes: new Set<number>(),
    };
  }

  return {
    newItems,
    validationState: { customError: false, valueMissing: false },
    validationMessage: '',
    hasError: false,
    invalidIndexes,
  };
};

export const updateInvalidIndexesAfterRemoval = (
  invalidIndexes: Set<number>,
  removedIndex: number
): Set<number> => {
  const newInvalidIndexes = new Set<number>();

  for (const idx of invalidIndexes) {
    if (idx !== removedIndex) {
      newInvalidIndexes.add(idx > removedIndex ? idx - 1 : idx);
    }
  }

  return newInvalidIndexes;
};
