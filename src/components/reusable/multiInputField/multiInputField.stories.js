import { html } from 'lit';
import './multiInputField';
import { action } from '@storybook/addon-actions';
import { defaultTextStrings } from '../../../common/helpers/multiInputValidationsHelper';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Multi Input Field',
  component: 'kyn-multi-input-field',
  argTypes: {
    invalidText: { control: 'text' },
    inputType: { control: 'select', options: ['email', 'text'] },
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
    maxItems: { control: 'number' },
    pattern: { control: 'text' },
    textStrings: { control: 'object' },
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
    pattern=${args.pattern}
    maxItems=${ifDefined(args.maxItems)}
    @on-change=${(e) => action('on-change')(e.detail)}
  ></kyn-multi-input-field>
`;

export const Default = Template.bind({});
Default.args = {
  value: '',
  inputType: 'email',
  invalidText: '',
  invalid: false,
  label: 'Label',
  caption: 'Automatic suggestions and validations are enabled.',
  required: false,
  validationsDisabled: false,
  placeholder: `Add email addresses and press 'Enter'...`,
  disabled: false,
  autoSuggestionDisabled: false,
  readonly: false,
  hideLabel: false,
  name: 'invite',
  pattern: undefined,
  maxItems: undefined,
  textStrings: {
    ...defaultTextStrings,
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
  maxItems: 10,
};

export const InvalidEmailFormat = Template.bind({});
InvalidEmailFormat.args = {
  ...Default.args,
  caption: 'Shows custom error message for invalid email format.',
  value: 'not-an-email',
  textStrings: {
    invalidFormatError: 'Please enter a valid email address format.',
  },
};

export const MaxEmailsExceeded = Template.bind({});
MaxEmailsExceeded.args = {
  ...Default.args,
  caption: 'Shows error when maximum number of emails is exceeded.',
  value: 'john.doe@email.com, example@email.com, suzy.example@email.com',
  maxItems: 2,
  textStrings: {
    maxExceededError: 'You cannot add more than 2 email addresses.',
  },
};

export const DuplicateEmail = Template.bind({});
DuplicateEmail.args = {
  ...Default.args,
  caption: 'Shows error for duplicate email addresses',
  value: 'john.doe@email.com, john.doe@email.com',
  textStrings: {
    duplicateError: 'This email address has already been added.',
  },
};

export const CustomEmailPattern = Template.bind({});
CustomEmailPattern.args = {
  ...Default.args,
  caption: 'Uses a custom pattern to validate email addresses.',
  value: 'user@example.com',
  pattern: '[a-zA-Z0-9._%+-]+@example\\.com$',
  textStrings: {
    invalidFormatError:
      'Please enter a valid email address from example.com domain.',
  },
};

export const DefaultInputType = Template.bind({});
DefaultInputType.args = {
  ...Default.args,
  inputType: 'default',
  caption: 'Uses default input type for generic content tags.',
  value: 'Tag 1, Tag 2',
  placeholder: `Add tags and press 'Enter'...`,
  textStrings: {
    ...defaultTextStrings,
    placeholderAdditional: 'Add more tags...',
  },
};
