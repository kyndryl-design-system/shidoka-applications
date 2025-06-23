export const defaultTextStrings = {
  requiredText: 'Required',
  errorText: 'Email is not in the allowed list.',
  placeholderAdditional: 'Add another email address...',
  invalidEmailError: 'Invalid email format',
  emailMaxExceededError: 'Maximum number of email addresses exceeded.',
  duplicateEmail: 'Email address already added',
  emailRequired: 'At least one email address is required',
};

export const isValidEmail = (email: string): boolean => {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_RE.test(email);
};

const validateEmailTags = (
  emails: string[],
  allowedEmails: string[],
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
  const hasUnallowedEmails = emails.some(
    (email) => !allowedEmails.includes(email) && isValidEmail(email)
  );

  const state = { customError: false, valueMissing: false };
  let msg = '';
  let hasError = false;

  if (isEmptyButRequired) {
    state.valueMissing = true;
    msg = _textStrings.emailRequired || _textStrings.requiredText;
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
    msg = invalidText || _textStrings.duplicateEmail;
    hasError = true;
  } else if (hasUnallowedEmails) {
    state.customError = true;
    msg = invalidText || _textStrings.errorText;
    hasError = true;
  }

  return {
    isValid: !hasError,
    validationState: state,
    validationMessage: msg,
  };
};

export const wouldExceedMaxEmails = (
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
  allowedEmails: string[],
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
    message = invalidText || '';
    hasError = true;
  } else {
    const validationResult = validateEmailTags(
      emails,
      allowedEmails,
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
