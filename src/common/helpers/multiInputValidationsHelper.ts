export const defaultTextStrings = {
  requiredText: 'Required',
  errorText: 'Invalid email format.',
  placeholderAdditional: 'Add another email address...',
  invalidEmailError:
    'Invalid email format. Please enter a valid email address.',
  emailMaxExceededError: 'Maximum number of email addresses exceeded.',
  duplicateEmail: 'Email address already added',
  emailRequired: 'At least one email address is required',
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
      invalidText || textStrings?.errorText || defaultTextStrings.errorText;
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
