export const defaultTextStrings = {
  requiredText: 'Required',
  placeholderAdditional: 'Add another email address...',
  invalidEmailError:
    'Invalid email format. Please enter a valid email address.',
  defaultErrorText: 'Invalid email format.',
  emailMaxExceededError: 'Maximum number of email addresses exceeded.',
  duplicateEmailError: 'Email address already added',
  emailRequiredError: 'At least one email address is required',
};

export const isValidEmail = (email: string): boolean => {
  const EMAIL_RE =
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;
  return EMAIL_RE.test(email);
};

const validateEmailTags = (
  emails: string[],
  required: boolean,
  maxEmailAddresses?: number,
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
  const invalidTagIndexes = emails
    .map((e, i) => (!isValidEmail(e) ? i : -1))
    .filter((i) => i >= 0);
  const hasInvalidTags = invalidTagIndexes.length > 0;
  const isEmptyButRequired = required && emails.length === 0;
  const isMaxExceeded =
    maxEmailAddresses !== undefined && emails.length > maxEmailAddresses;
  const uniqueEmails = new Set(emails);
  const hasDuplicates = uniqueEmails.size < emails.length;

  const state = { customError: false, valueMissing: false };
  let msg = '';
  let hasError = false;

  if (isEmptyButRequired) {
    state.valueMissing = true;
    msg = _textStrings.emailRequiredError || _textStrings.requiredText;
    hasError = true;
  } else if (hasInvalidTags) {
    state.customError = true;
    msg = invalidText || _textStrings.invalidEmailError;
    hasError = true;
  } else if (isMaxExceeded) {
    state.customError = true;
    msg = invalidText || _textStrings.emailMaxExceededError;
    hasError = true;
  } else if (hasDuplicates) {
    state.customError = true;
    msg = invalidText || _textStrings.duplicateEmailError;
    hasError = true;
  }

  return {
    isValid: !hasError,
    validationState: state,
    validationMessage: msg,
  };
};

export const maxEmailsExceededCheck = (
  currentCount: number,
  newCount: number,
  maxEmailAddresses?: number
): boolean =>
  maxEmailAddresses !== undefined &&
  currentCount + newCount > maxEmailAddresses;

export const isEmailDuplicate = (
  email: string,
  existingEmails: Set<string> | string[]
): boolean => {
  if (existingEmails instanceof Set) {
    return existingEmails.has(email);
  }
  return existingEmails.includes(email);
};

export const validateAllEmailTags = (
  emails: string[],
  required: boolean,
  maxEmailAddresses?: number,
  invalidText?: string,
  textStrings?: any,
  validationsDisabled?: boolean,
  forceInvalid?: boolean
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
    const validationResult = validateEmailTags(
      emails,
      required,
      maxEmailAddresses,
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

export const processEmailTagsFromValue = (
  inputValue: string,
  existingEmails: string[],
  maxEmailAddresses?: number,
  validationsDisabled?: boolean,
  textStrings?: any
): {
  newEmails: string[];
  validationState: any;
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
    maxEmailsExceededCheck(
      existingEmails.length,
      parts.length,
      maxEmailAddresses
    )
  ) {
    const state = { customError: true, valueMissing: false };
    const msg = _textStrings.emailMaxExceededError;
    return {
      newEmails: [],
      validationState: state,
      validationMessage: msg,
      hasError: true,
      invalidIndexes: new Set<number>(),
    };
  }

  const invalidIndexes = new Set<number>();
  const existingEmailsSet = new Set(existingEmails);
  const newEmails: string[] = [];
  let duplicateFound = false;

  for (const email of parts) {
    if (!validationsDisabled && isEmailDuplicate(email, existingEmailsSet)) {
      duplicateFound = true;
      break;
    }

    existingEmailsSet.add(email);
    newEmails.push(email);

    const idx = existingEmails.length + newEmails.length - 1;
    if (!validationsDisabled && !isValidEmail(email)) {
      invalidIndexes.add(idx);
    }
  }

  if (duplicateFound) {
    const state = { customError: true, valueMissing: false };
    const msg = _textStrings.duplicateEmailError;
    return {
      newEmails: [],
      validationState: state,
      validationMessage: msg,
      hasError: true,
      invalidIndexes: new Set<number>(),
    };
  }

  return {
    newEmails,
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
