import { html } from 'lit';
import './multiInputEmailInvite';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Multi Input Email Invite',
  component: 'kyn-email-invite-input',
  argTypes: {
    allowedEmails: { control: 'object' },
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
  },
};

const Template = (args) => html`
  <kyn-email-invite-input
    .allowedEmails=${args.allowedEmails}
    label=${args.label}
    caption=${args.caption}
    ?required=${args.required}
    placeholder=${args.placeholder}
    ?disabled=${args.disabled}
    ?readonly=${args.readonly}
    ?hideLabel=${args.hideLabel}
    name=${args.name}
    maxLength=${ifDefined(args.maxLength)}
    minLength=${ifDefined(args.minLength)}
    @emails-changed=${(e) => action('emails-changed')(e.detail)}
  ></kyn-email-invite-input>
`;

export const Default = Template.bind({});
Default.args = {
  allowedEmails: [],
  label: 'Invite by email',
  caption: '',
  required: false,
  placeholder: 'Type address and hit enter... ',
  disabled: false,
  readonly: false,
  hideLabel: false,
  name: 'invite',
  maxLength: undefined,
  minLength: undefined,
};

export const WithAllowedList = Template.bind({});
WithAllowedList.args = {
  ...Default.args,
  allowedEmails: ['alice@example.com', 'bob@example.com'],
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  ...Default.args,
  readonly: true,
};
