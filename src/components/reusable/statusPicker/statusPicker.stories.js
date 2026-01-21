import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';

export default {
  title: 'Components/Status Picker',
  component: 'kyn-status-picker',
  argTypes: {
    kind: {
      options: ['success', 'warning', 'error', 'low', 'medium', 'high', 'ai'],
      control: { type: 'select' },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    selected: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: '', //To be added
    },
  },
};

const args = {
  label: 'Label',
  kind: 'success',
  noTruncation: false,
  disabled: false,
  selected: false,
};

export const Default = {
  args,
  render: (args) => {
    return html`
      <kyn-status-picker
        label=${args.label}
        kind=${args.kind}
        ?disabled=${args.disabled}
        ?selected=${args.selected}
        ?noTruncation=${args.noTruncation}
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      ></kyn-status-picker>
    `;
  },
};

export const WithIcon = {
  args,
  render: (args) => {
    return html`
      <kyn-status-picker
        label=${args.label}
        kind=${args.kind}
        ?disabled=${args.disabled}
        ?selected=${args.selected}
        ?noTruncation=${args.noTruncation}
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      />
      <span style="display: flex;" aria-label="User icon" aria-hidden="true">
        ${unsafeSVG(userIcon)}
      </span>
    </kyn-status-picker>
    `;
  },
};

export const Gallery = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    return html`
      <div class="heading kd-type--headline-06 heading-text">
        Operational Status
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <kyn-status-picker label="Success" kind="success"></kyn-status-picker>
        <kyn-status-picker label="Warning" kind="warning"></kyn-status-picker>
        <kyn-status-picker label="Error" kind="error"></kyn-status-picker>
      </div>
      <br />
      <div class="heading kd-type--headline-06 heading-text">
        Opportunity Status
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <kyn-status-picker label="Low" kind="low"></kyn-status-picker>
        <kyn-status-picker label="Medium" kind="medium"></kyn-status-picker>
        <kyn-status-picker label="High" kind="high"></kyn-status-picker>
      </div>
      <br />
      <div class="heading kd-type--headline-06 heading-text">AI</div>
      <kyn-status-picker label="AI" kind="ai"></kyn-status-picker>
      <br />
      <br />
      <div class="heading kd-type--headline-06 heading-text">Disabled</div>
      <kyn-status-picker
        label="Label"
        kind="success"
        disabled
      ></kyn-status-picker>

      <style>
        .heading-text {
          margin-bottom: var(--kd-spacing-12);
        }
      </style>
    `;
  },
};
