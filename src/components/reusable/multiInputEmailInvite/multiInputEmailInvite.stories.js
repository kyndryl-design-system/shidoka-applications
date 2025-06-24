import { html } from 'lit';
import './multiInputEmailInvite';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Multi Input Email Invite',
  component: 'kyn-email-invite-input',
  argTypes: {
    value: { control: 'text', table: { category: 'attributes' } },
    invalidText: { control: 'text' },
    invalid: { control: 'boolean' },
    autoSuggestionDisabled: { control: 'boolean' },
    label: { control: 'text' },
    caption: { control: 'text' },
    required: { control: 'boolean' },
    validationsDisabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    name: { control: 'text' },
    maxEmailAddresses: { control: 'number' },
    textStrings: { control: 'object' },
  },
};

const Template = (args) => html`
  <kyn-email-invite-input
    .value=${args.value}
    .invalidText=${args.invalidText}
    .textStrings=${args.textStrings}
    ?autoSuggestionDisabled=${args.autoSuggestionDisabled}
    ?validationsDisabled=${args.validationsDisabled}
    ?invalid=${args.invalid}
    label=${args.label}
    caption=${args.caption}
    ?required=${args.required}
    placeholder=${args.placeholder}
    ?disabled=${args.disabled}
    ?readonly=${args.readonly}
    ?hideLabel=${args.hideLabel}
    name=${args.name}
    maxEmailAddresses=${ifDefined(args.maxEmailAddresses)}
    @on-change=${(e) => action('on-change')(e.detail)}
  ></kyn-email-invite-input>
`;

export const Default = Template.bind({});
Default.args = {
  value: '',
  invalidText: '',
  invalid: false,
  label: 'Label',
  caption: 'Automatic suggestions and validations are enabled.',
  required: false,
  validationsDisabled: false,
  placeholder: 'Add email addresses and press Enter',
  disabled: false,
  autoSuggestionDisabled: false,
  readonly: false,
  hideLabel: false,
  name: 'invite',
  maxEmailAddresses: undefined,
  textStrings: {
    requiredText: 'Required',
    errorText: 'Invalid email format.',
    placeholderAdditional: 'Add another email address ...',
    invalidEmailError: 'Invalid email format. Please check and try again.',
    emailMaxExceededError: 'Maximum number of email addresses exceeded.',
    duplicateEmail: 'Email address already added.',
    emailRequired: 'At least one email address is required.',
  },
};

export const SuggestionValidationDisabled = Template.bind({});
SuggestionValidationDisabled.storyName = 'Suggestions + Validations Disabled';
SuggestionValidationDisabled.args = {
  ...Default.args,
  autoSuggestionDisabled: true,
  validationsDisabled: true,
  caption:
    'No validations, no suggestions. Whatever the user types is accepted and converted to a tag.',
  maxEmailAddresses: 5,
};

export const MaxEmailExample = Template.bind({});
MaxEmailExample.args = {
  ...Default.args,
  value: 'example@email.com',
  caption: 'You can add up to 10 email addresses.',
  maxEmailAddresses: 10,
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  ...Default.args,
  value: 'bad@invalid.com',
  caption: '',
};

export const InvalidEmailFormat = Template.bind({});
InvalidEmailFormat.args = {
  ...Default.args,
  caption: 'Shows custom error message for invalid email format',
  value: 'not-an-email',
  textStrings: {
    invalidEmailError: 'Please enter a valid email address format',
  },
};

export const MaxEmailsExceeded = Template.bind({});
MaxEmailsExceeded.args = {
  ...Default.args,
  caption: 'Shows error when maximum number of emails is exceeded',
  value: 'john.doe@email.com, example@email.com, suzy.example@email.com',
  maxEmailAddresses: 2,
  textStrings: {
    emailMaxExceededError: 'You cannot add more than 2 email addresses',
  },
};

export const DuplicateEmail = Template.bind({});
DuplicateEmail.args = {
  ...Default.args,
  caption: 'Shows error for duplicate email addresses',
  value: 'john.doe@email.com, john.doe@email.com',
  textStrings: {
    duplicateEmail: 'This email address has already been added',
  },
};
