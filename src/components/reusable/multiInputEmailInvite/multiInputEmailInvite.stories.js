import { html } from 'lit';
import './multiInputEmailInvite';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Multi Input Email Invite',
  component: 'kyn-email-invite-input',
  argTypes: {
    allowedEmails: { control: 'object' },
    emails: { control: 'array', table: { disable: true } },
    invalids: { control: 'array', table: { disable: true } },
    invalidText: { control: 'text', table: { disable: true } },
    invalid: { control: 'boolean', table: { disable: true } },
    label: { control: 'text' },
    caption: { control: 'text' },
    required: { control: 'boolean' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    name: { control: 'text' },
    maxLength: { control: 'number' },
    minLength: { control: 'number' },
    maxEmailAddresses: { control: 'number' },
  },
};

const Template = (args) => html`
  <kyn-email-invite-input
    .allowedEmails=${args.allowedEmails}
    .emails=${args.emails}
    .invalidText=${args.invalidText}
    ?invalid=${args.invalid}
    .invalids=${args.invalids}
    label=${args.label}
    caption=${args.caption}
    ?required=${args.required}
    placeholder=${args.placeholder}
    ?disabled=${args.disabled}
    ?readonly=${args.readonly}
    ?hideLabel=${args.hideLabel}
    name=${args.name}
    maxEmailAddresses=${ifDefined(args.maxEmailAddresses)}
    maxLength=${ifDefined(args.maxLength)}
    minLength=${ifDefined(args.minLength)}
    @emails-changed=${(e) => action('emails-changed')(e.detail)}
  ></kyn-email-invite-input>
`;

export const Default = Template.bind({});
Default.args = {
  allowedEmails: [
    'example@email.com',
    'john.doe@email.com',
    'suzy.example@email.com',
  ],
  emails: [],
  invalidText: '',
  invalid: false,
  label: 'Label',
  caption: '',
  required: false,
  placeholder: 'Add email addresses and press Enter',
  disabled: false,
  readonly: false,
  hideLabel: false,
  name: 'invite',
  invalids: [],
  maxLength: undefined,
  minLength: undefined,
  maxEmailAddresses: undefined,
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  ...Default.args,
  emails: ['bad@invalid.com'],
  invalidText: 'This email is not on the allowed list.',
  invalid: true,
};

export const MaxEmailExample = Template.bind({});
MaxEmailExample.args = {
  ...Default.args,
  emails: ['example@email.com'],
  caption: 'You can only add up to 10 email addresses.',
  maxEmailAddresses: 10,
};

export const DisabledState = Template.bind({});
DisabledState.args = {
  ...Default.args,
  disabled: true,
  emails: ['exampl@email.com', 'john.doe@example.com'],
};

export const ReadonlyState = Template.bind({});
ReadonlyState.args = {
  ...Default.args,
  readonly: true,
  emails: ['exampl@email.com', 'john.doe@example.com'],
};
