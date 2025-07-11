import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './multiInputField';
import { action } from 'storybook/actions';
import { defaultTextStrings } from '../../../common/helpers/multiInputValidationsHelper';
import { ifDefined } from 'lit/directives/if-defined.js';

import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark.svg';

export default {
  title: 'Components/Multi Input Field',
  component: 'kyn-multi-input-field',
  argTypes: {
    inputType: { control: 'select', options: ['email', 'default'] },
    autoSuggestionDisabled: { control: 'boolean' },
    label: { control: 'text' },
    caption: { control: 'text' },
    required: { control: 'boolean' },
    validationsDisabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    hideIcon: { control: 'boolean' },
    name: { control: 'text' },
    maxItems: { control: 'number' },
    pattern: { control: 'text' },
    textStrings: { control: 'object' },
    customSuggestions: { control: 'array' },
    value: {
      control: 'text',
      table: { category: 'attributes' },
      defaultValue: '',
      description:
        'Comma-separated list of email addresses. For proper tag creation, include @ symbol or commas.',
    },
  },
};

const Template = (args) => html`
  <kyn-multi-input-field
    .value=${args.value}
    .inputType=${args.inputType}
    .textStrings=${args.textStrings}
    .customSuggestions=${args.customSuggestions}
    ?autoSuggestionDisabled=${args.autoSuggestionDisabled}
    ?validationsDisabled=${args.validationsDisabled}
    label=${args.label}
    caption=${args.caption}
    ?required=${args.required}
    placeholder=${args.placeholder}
    ?disabled=${args.disabled}
    ?readonly=${args.readonly}
    ?hideLabel=${args.hideLabel}
    ?hideIcon=${args.hideIcon}
    name=${args.name}
    pattern=${ifDefined(args.pattern)}
    maxItems=${ifDefined(args.maxItems)}
    @on-change=${(e) => action('on-change')(e.detail)}
  >
    ${unsafeSVG(userIcon)}
  </kyn-multi-input-field>
`;

export const DefaultMultiInput = Template.bind({});
DefaultMultiInput.args = {
  value: 'Tag 1',
  inputType: 'default',
  label: 'Label',
  caption: '',
  required: false,
  validationsDisabled: true,
  placeholder: `Add items and press 'Enter'...`,
  disabled: false,
  autoSuggestionDisabled: true,
  readonly: false,
  hideLabel: false,
  hideIcon: true,
  name: 'invite',
  pattern: undefined,
  maxItems: undefined,
  textStrings: {
    ...defaultTextStrings,
  },
};

export const EmailMultiInput = Template.bind({});
EmailMultiInput.args = {
  ...DefaultMultiInput.args,
  inputType: 'email',
  value: 'email@example.com, not-an-email',
  caption:
    'Validates email addresses and provides suggestions based on user input.',
  validationsDisabled: false,
  autoSuggestionDisabled: false,
  maxItems: 10,
  customSuggestions: [
    'alice@example.com',
    'bob.smith@example.com',
    'charlie@example.org',
    'someone@acme.com',
    'evan@example.net',
    'frank@example.io',
    'example@email.com',
    'john.doe@email.com',
    'suzy.example@email.com',
  ],
};

export const InvalidEmailFormat = Template.bind({});
InvalidEmailFormat.args = {
  ...DefaultMultiInput.args,
  inputType: 'email',
  value: 'not-an-email',
  caption: 'Shows custom error message for invalid email format.',
  hideIcon: false,
  autoSuggestionDisabled: false,
  validationsDisabled: false,
  placeholder: 'Add email addresses and press Enter...',
  textStrings: {
    invalidFormatError: 'Please enter a valid email address format.',
  },
};

export const MaxEmailsExceeded = Template.bind({});
MaxEmailsExceeded.args = {
  ...DefaultMultiInput.args,
  inputType: 'email',
  value: 'john.doe@email.com, example@email.com, suzy.example@email.com',
  caption: 'Shows error when maximum number of emails is exceeded.',
  hideIcon: false,
  autoSuggestionDisabled: false,
  validationsDisabled: false,
  maxItems: 2,
  placeholder: 'Add email addresses and press Enter...',
  textStrings: {
    maxExceededError: 'You cannot add more than 2 email addresses.',
  },
};

export const DuplicateEmail = Template.bind({});
DuplicateEmail.args = {
  ...DefaultMultiInput.args,
  inputType: 'email',
  value: 'john.doe@email.com, john.doe@email.com',
  caption: 'Shows error for duplicate email addresses',
  hideIcon: false,
  autoSuggestionDisabled: false,
  validationsDisabled: false,
  placeholder: 'Add email addresses and press Enter...',
  textStrings: {
    duplicateError: 'This email address has already been added.',
  },
};

export const CustomEmailPattern = Template.bind({});
CustomEmailPattern.args = {
  ...DefaultMultiInput.args,
  inputType: 'email',
  value: 'user@example.com',
  caption: 'Uses a custom pattern to validate email addresses.',
  hideIcon: false,
  autoSuggestionDisabled: false,
  validationsDisabled: false,
  pattern: '[a-zA-Z0-9._%+-]+@example\\.com$',
  customSuggestions: [
    'test@example.com',
    'dev@example.com',
    'support@example.com',
    'sales@example.com',
    'info@example.com',
  ],
  placeholder: 'Add email addresses and press Enter...',
  textStrings: {
    invalidFormatError:
      'Please enter a valid email address from example.com domain.',
  },
};

export const SuggestionValidationDisabled = Template.bind({});
SuggestionValidationDisabled.storyName = 'Suggestions + Validations Disabled';
SuggestionValidationDisabled.args = {
  ...DefaultMultiInput.args,
  inputType: 'email',
  value: '',
  autoSuggestionDisabled: true,
  validationsDisabled: true,
  caption:
    'No validations, no suggestions. Whatever the user types is accepted and converted to a tag.',
  maxItems: 10,
};

export const CustomSuggestions = Template.bind({});
CustomSuggestions.args = {
  ...DefaultMultiInput.args,
  inputType: 'email',
  value: '',
  caption:
    'Populate suggestions with data provided through the customSuggestions prop.',
  hideIcon: false,
  autoSuggestionDisabled: false,
  validationsDisabled: false,
  customSuggestions: [
    'custom1@company.com',
    'custom2@company.com',
    'custom3@company.com',
    'anotheruser@organization.net',
    'specialuser@company.org',
  ],
};

export const WithCustomIcon = (args) => html`
  <kyn-multi-input-field
    .value=${args.value}
    .inputType=${args.inputType}
    .textStrings=${args.textStrings}
    .customSuggestions=${args.customSuggestions}
    ?autoSuggestionDisabled=${args.autoSuggestionDisabled}
    ?validationsDisabled=${args.validationsDisabled}
    label=${args.label}
    caption=${args.caption}
    ?required=${args.required}
    placeholder=${args.placeholder}
    ?disabled=${args.disabled}
    ?readonly=${args.readonly}
    ?hideLabel=${args.hideLabel}
    ?hideIcon=${args.hideIcon}
    name=${args.name}
    pattern=${ifDefined(args.pattern)}
    maxItems=${ifDefined(args.maxItems)}
    @on-change=${(e) => action('on-change')(e.detail)}
  >
    ${unsafeSVG(checkmarkIcon)}
  </kyn-multi-input-field>
`;
WithCustomIcon.args = {
  ...DefaultMultiInput.args,
  hideIcon: false,
  placeholder: `Add attachments and press 'Enter'…`,
};
