export const defaultTextStrings = {
  requiredText: 'Required',
  placeholderAdditional: 'Add another item...',
  invalidInputError:
    'Invalid email format. Please enter a valid email address.',
  defaultErrorText: 'Invalid format.',
  maxExceededError: 'Maximum number of items exceeded.',
  duplicateError: 'Item already added',
  requiredError: 'At least one item is required',
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

  const _textStrings = textStrings || defaultTextStrings;
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
    msg = _textStrings.requiredError || _textStrings.requiredText;
    hasError = true;
  } else if (hasInvalidTags) {
    state.customError = true;
    msg =
      invalidText ||
      (inputType === 'email'
        ? _textStrings.invalidInputError
        : _textStrings.defaultErrorText);
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
  textStrings?: any,
  validationsDisabled?: boolean,
  forceInvalid?: boolean,
  inputType = 'email',
  pattern?: string
): { state: any; message: string; hasError: boolean } => {
  let state = { customError: false, valueMissing: false };
  let message = '';
  let hasError = false;

  if (validationsDisabled) {
    return { state, message: '', hasError: false };
  }

  if (forceInvalid) {
    state.customError = true;
    message =
      invalidText ||
      textStrings?.defaultErrorText ||
      defaultTextStrings.defaultErrorText;
    hasError = true;
  } else {
    const validationResult = validateInputTags(
      inputs,
      required,
      inputType,
      pattern,
      maxItems,
      invalidText,
      textStrings,
      validationsDisabled
    );

    if (!validationResult.isValid) {
      state = { ...state, ...validationResult.validationState };
      message = validationResult.validationMessage;
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
  inputType = 'email',
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
