import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '../button';
import '../link';

import '../overflowMenu';

const notificationBodyMsg =
  'Message, this is an additional line Ipsum iMessage, Lorem Ipsum is simply dummy and typesetting industry.';

export default {
  title: 'Components/Notification',
  component: 'kyn-notification',
  argTypes: {
    type: {
      options: ['normal', 'clickable', 'inline', 'toast'],
      control: { type: 'select' },
    },
    tagStatus: {
      options: ['default', 'info', 'warning', 'success', 'error'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/CQuDZEeLiuGiALvCWjAKlu/Applications---Component-Library?type=design&node-id=9370-44581&mode=design&t=LXc9LDk5mGkf8vnl-0',
    },
    a11y: {
      disable: true,
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
      type=${args.type}
      tagStatus=${args.tagStatus}
      ?unRead=${args.unRead}
      @on-notification-click=${(e) => action(e.type)(e)}
      style="width:464px;"
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
            <kyn-overflow-menu-item @on-click=${(e) => action(e.type)(e)}
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
        @on-close=${(e) => action(e.type)(e)}
      >
        <div>${notificationBodyMsg}</div>
      </kyn-notification>
      <br />
      <p><u>Without Description</u></p>
      <br />
      <kyn-notification
        notificationTitle=${args.notificationTitle}
        assistiveNotificationTypeText=${args.assistiveNotificationTypeText}
        notificationRole=${args.notificationRole}
        type=${args.type}
        tagStatus=${args.tagStatus}
        closeBtnDescription=${args.closeBtnDescription}
        ?hideCloseButton=${args.hideCloseButton}
        @on-close=${(e) => action(e.type)(e)}
      >
      </kyn-notification>
      <br />
      <p><u>With Action Link</u></p>
      <br />
      <kyn-notification
        notificationTitle=${args.notificationTitle}
        assistiveNotificationTypeText=${args.assistiveNotificationTypeText}
        notificationRole=${args.notificationRole}
        closeBtnDescription=${args.closeBtnDescription}
        type=${args.type}
        tagStatus=${args.tagStatus}
        ?hideCloseButton=${args.hideCloseButton}
        @on-close=${(e) => action(e.type)(e)}
      >
        <div>
          ${notificationBodyMsg}
          <div style="margin-top: 10px;">
            <kyn-link
              href="#"
              shade="dark"
              @on-click=${(e) => e.preventDefault()}
            >
              Link
            </kyn-link>
          </div>
        </div>
      </kyn-notification> `;
  },
};

export const Toast = {
  decorators: [
    (story) =>
      html`
        <div
          style="height: 80vh; min-height: 250px; transform: translate3d(0,0,0); margin: var(--kd-negative-page-gutter);"
        >
          ${story()}
        </div>
      `,
  ],
  args: {
    notificationTitle: 'Notification Title',
    assistiveNotificationTypeText: 'Information toast',
    notificationRole: 'alert',
    tagStatus: 'info',
    hideCloseButton: false,
    timeout: 6,
  },
  render: (args) => {
    return html`
      <p>
        Wrap your <code>kyn-notification</code> component inside
        <code>kyn-notification-container</code>
      </p>
      <br />

      <kyn-notification-container>
        <kyn-notification
          notificationTitle=${args.notificationTitle}
          assistiveNotificationTypeText=${args.assistiveNotificationTypeText}
          notificationRole=${args.notificationRole}
          type="toast"
          tagStatus=${args.tagStatus}
          timeout=${args.timeout}
          ?hideCloseButton=${args.hideCloseButton}
          @on-close=${(e) => action(e.type)(e)}
          style="width:440px;"
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
          @on-close=${(e) => action(e.type)(e)}
          style="width:440px;"
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
          @on-close=${(e) => action(e.type)(e)}
          timeout=${12}
          style="width:440px;"
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
          @on-close=${(e) => action(e.type)(e)}
          timeout=${0}
          style="width:440px;"
        >
          <div>I will remain untill you click on <code>X</code> icon.</div>
        </kyn-notification>
      </kyn-notification-container>
    `;
  },
};
