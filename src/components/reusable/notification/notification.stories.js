import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import '../button';
import '../link';

import '../overflowMenu';

import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import documentTaskIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-task.svg';

const notificationBodyMsg =
  'Message, this is an additional line Ipsum iMessage, Lorem Ipsum is simply dummy and typesetting industry.';

export default {
  title: 'Components/Feedback & Status/Notification',
  component: 'kyn-notification',
  subcomponents: {
    'kyn-notification-container': 'kyn-notification-container',
  },
  argTypes: {
    type: {
      options: ['normal', 'clickable', 'inline', 'toast'],
      control: { type: 'select' },
    },
    target: {
      options: ['_self', '_blank'],
      control: { type: 'select' },
    },
    tagStatus: {
      options: ['default', 'info', 'warning', 'success', 'error', 'ai'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-549977&p=f&m=dev',
    },
  },
};

export const Notification = {
  args: {
    notificationTitle: 'Notification Title',
    notificationSubtitle: '',
    timeStamp: 'Updated 2 mins ago',
    notificationRole: 'status',
    href: '#',
    target: '_self',
    type: 'normal',
    tagStatus: 'default',
    assistiveNotificationTypeText: 'Clickable notification',
    unRead: false,
  },
  render: (args) => {
    return html`<kyn-notification
      notificationTitle=${args.notificationTitle}
      notificationSubtitle=${args.notificationSubtitle}
      timeStamp=${args.timeStamp}
      notificationRole=${args.notificationRole}
      assistiveNotificationTypeText=${args.assistiveNotificationTypeText}
      href=${args.href}
      target=${args.target}
      type=${args.type}
      tagStatus=${args.tagStatus}
      ?unRead=${args.unRead}
      @on-notification-click=${(e) =>
        action(e.type)({ ...e, detail: e.detail })}
    >
      ${args.type === 'normal' || args.type === 'clickable'
        ? html` <kyn-overflow-menu
            slot="actions"
            anchorRight
            assistiveText="Menu option"
            @click=${(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <kyn-overflow-menu-item
              @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
              >Mark as Read</kyn-overflow-menu-item
            >
            <kyn-overflow-menu-item>View Details</kyn-overflow-menu-item>
          </kyn-overflow-menu>`
        : null}
      <div>${notificationBodyMsg}</div>
    </kyn-notification>`;
  },
};

export const Inline = {
  args: {
    notificationTitle: 'Notification Title',
    assistiveNotificationTypeText: 'Inline info notification',
    notificationRole: 'status',
    type: 'inline',
    tagStatus: 'info',
    closeBtnDescription: 'Close',
    hideCloseButton: false,
  },
  render: (args) => {
    return html`<kyn-notification
        notificationTitle=${args.notificationTitle}
        assistiveNotificationTypeText=${args.assistiveNotificationTypeText}
        notificationRole=${args.notificationRole}
        type=${args.type}
        tagStatus=${args.tagStatus}
        closeBtnDescription=${args.closeBtnDescription}
        ?hideCloseButton=${args.hideCloseButton}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <div>${notificationBodyMsg}</div>
      </kyn-notification>
      <br />
      <p class="kd-type--body-01">Without Description</p>
      <br />
      <kyn-notification
        notificationTitle=${args.notificationTitle}
        assistiveNotificationTypeText=${args.assistiveNotificationTypeText}
        notificationRole=${args.notificationRole}
        type=${args.type}
        tagStatus=${args.tagStatus}
        closeBtnDescription=${args.closeBtnDescription}
        ?hideCloseButton=${args.hideCloseButton}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
      </kyn-notification>
      <br />
      <p class="kd-type--body-01">With Action Link</p>
      <br />
      <kyn-notification
        notificationTitle=${args.notificationTitle}
        assistiveNotificationTypeText=${args.assistiveNotificationTypeText}
        notificationRole=${args.notificationRole}
        closeBtnDescription=${args.closeBtnDescription}
        type=${args.type}
        tagStatus=${args.tagStatus}
        ?hideCloseButton=${args.hideCloseButton}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <div>
          ${notificationBodyMsg}
          <div style="margin-top: 10px; font-size: 16px; font-weight: 400;">
            <kyn-link
              kind="secondary"
              href="#"
              standalone
              @on-click=${(e) => e.preventDefault()}
            >
              Link
            </kyn-link>
          </div>
        </div>
      </kyn-notification>
      <br />
      <p class="kd-type--body-01">With Custom Icon</p>
      <br />
      <kyn-notification
        notificationTitle=${args.notificationTitle}
        assistiveNotificationTypeText=${args.assistiveNotificationTypeText}
        notificationRole=${args.notificationRole}
        closeBtnDescription=${args.closeBtnDescription}
        type=${args.type}
        tagStatus=${args.tagStatus}
        ?hideCloseButton=${args.hideCloseButton}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <span slot="icon" style="display:flex"
          >${unsafeSVG(documentTaskIcon)}</span
        >
        <div>${notificationBodyMsg}</div>
      </kyn-notification> `;
  },
};

export const Toast = {
  parameters: {
    a11y: {
      disable: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-213406&p=f&m=dev',
    },
  },
  decorators: [
    (story) => html` <div style="min-height: 400px;">${story()}</div> `,
  ],
  args: {
    notificationTitle: 'Notification Title',
    assistiveNotificationTypeText: 'Information toast',
    notificationRole: 'alert',
    tagStatus: 'info',
    hideCloseButton: false,
    timeout: 6,
    containerBottom: false,
  },
  render: (args) => {
    return html`
      <p>
        Wrap your <code>kyn-notification</code> component inside
        <code>kyn-notification-container</code>
      </p>
      <br />

      <kyn-notification-container ?bottom=${args.containerBottom}>
        <kyn-notification
          notificationTitle=${args.notificationTitle}
          assistiveNotificationTypeText=${args.assistiveNotificationTypeText}
          notificationRole=${args.notificationRole}
          type="toast"
          tagStatus=${args.tagStatus}
          timeout=${args.timeout}
          ?hideCloseButton=${args.hideCloseButton}
          @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <div>
            I will disappear as requested, after
            <code>${args.timeout}</code> seconds.
          </div>
        </kyn-notification>

        <kyn-notification
          notificationTitle=${args.notificationTitle}
          assistiveNotificationTypeText="Default toast"
          notificationRole=${args.notificationRole}
          type="toast"
          tagStatus="default"
          timeout=${8}
          ?hideCloseButton=${args.hideCloseButton}
          @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <div>I will disappear after (default) <code>8</code> seconds.</div>
        </kyn-notification>

        <kyn-notification
          notificationTitle=${args.notificationTitle}
          assistiveNotificationTypeText="Warning toast"
          notificationRole=${args.notificationRole}
          type="toast"
          tagStatus="warning"
          ?hideCloseButton=${args.hideCloseButton}
          @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
          timeout=${12}
        >
          <div>I will disappear after <code>10</code> seconds.</div>
        </kyn-notification>

        <kyn-notification
          notificationTitle=${args.notificationTitle}
          assistiveNotificationTypeText="Success toast"
          notificationRole=${args.notificationRole}
          type="toast"
          tagStatus="success"
          ?hideCloseButton=${args.hideCloseButton}
          @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
          timeout=${12}
        >
          <div>I will disappear after <code>12</code> seconds.</div>
        </kyn-notification>

        <kyn-notification
          notificationTitle=${args.notificationTitle}
          assistiveNotificationTypeText="Error toast"
          notificationRole=${args.notificationRole}
          type="toast"
          tagStatus="error"
          ?hideCloseButton=${args.hideCloseButton}
          @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
          timeout=${0}
        >
          <div>I will remain untill you click on <code>X</code> icon.</div>
        </kyn-notification>

        <kyn-notification
          notificationTitle="No description example"
          assistiveNotificationTypeText="Info toast"
          notificationRole=${args.notificationRole}
          type="toast"
          tagStatus="info"
          ?hideCloseButton=${args.hideCloseButton}
          @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
          timeout=${0}
        >
        </kyn-notification>

        <kyn-notification
          notificationTitle=${args.notificationTitle}
          assistiveNotificationTypeText="AI toast"
          notificationRole=${args.notificationRole}
          type="toast"
          tagStatus="ai"
          timeout=${14}
          ?hideCloseButton=${args.hideCloseButton}
          @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        >
          <div>I will disappear after <code>14</code> seconds.</div>
        </kyn-notification>
      </kyn-notification-container>
    `;
  },
};
