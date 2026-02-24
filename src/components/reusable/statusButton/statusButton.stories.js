import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';

export default {
  title: 'Components/Indicators & Labels/Status Button',
  component: 'kyn-status-btn',
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
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=9214-16831&m=dev',
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
      <kyn-status-btn
        label=${args.label}
        kind=${args.kind}
        ?disabled=${args.disabled}
        ?selected=${args.selected}
        ?noTruncation=${args.noTruncation}
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      ></kyn-status-btn>
    `;
  },
};

export const WithIcon = {
  args,
  render: (args) => {
    return html`
      <kyn-status-btn
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
    </kyn-status-btn>
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
        <kyn-status-btn label="Success" kind="success"></kyn-status-btn>
        <kyn-status-btn label="Warning" kind="warning"></kyn-status-btn>
        <kyn-status-btn label="Error" kind="error"></kyn-status-btn>
      </div>
      <br />
      <div class="heading kd-type--headline-06 heading-text">
        Opportunity Status
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <kyn-status-btn label="Low" kind="low"></kyn-status-btn>
        <kyn-status-btn label="Medium" kind="medium"></kyn-status-btn>
        <kyn-status-btn label="High" kind="high"></kyn-status-btn>
      </div>
      <br />
      <div class="heading kd-type--headline-06 heading-text">AI</div>
      <kyn-status-btn label="AI" kind="ai"></kyn-status-btn>
      <br />
      <br />
      <div class="heading kd-type--headline-06 heading-text">Disabled</div>
      <kyn-status-btn label="Label" kind="success" disabled></kyn-status-btn>
      <style>
        .heading-text {
          margin-bottom: var(--kd-spacing-12);
        }
      </style>
    `;
  },
};
