import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/link';

import closeIcon from '@carbon/icons/es/close/16';

import '../overflowMenu';

const notificationBodyMsg =
  'Message, this is an additional line Ipsum iMessage, Lorem Ipsum is simply dummy and typesetting industry.';

const handleOverflowClick = (e) => {
  action(e.type)(e);
  // overflow link click logic here to mark as unread
};

const onClose = (e) => {
  action(e.type)(e);
  // To close notification
};

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
  },
};

export const Notification = {
  args: {
    notificationTitle: 'Notification Title',
    notificationSubtitle: '',
    timeStamp: '2 mins ago',
    href: '#',
    type: 'normal',
    tagStatus: 'default',
    unRead: false,
  },
  render: (args) => {
    return html`<kyn-notification
      notificationTitle=${args.notificationTitle}
      notificationSubtitle=${args.notificationSubtitle}
      timeStamp=${args.timeStamp}
      href=${args.href}
      type=${args.type}
      tagStatus=${args.tagStatus}
      ?unRead=${args.unRead}
      @on-notification-click=${(e) => action(e.type)(e)}
      style="width:464px;"
    >
      <kyn-overflow-menu
        slot="actions"
        anchorRight
        @click=${(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <kyn-overflow-menu-item @on-click=${(e) => handleOverflowClick(e)}
          >Mark as Read</kyn-overflow-menu-item
        >
        <kyn-overflow-menu-item>View Details</kyn-overflow-menu-item>
      </kyn-overflow-menu>

      <div>${notificationBodyMsg}</div>
    </kyn-notification>`;
  },
};

export const Inline = {
  args: {
    notificationTitle: 'Notification Title',
    type: 'inline',
    tagStatus: 'info',
  },
  render: (args) => {
    return html`<kyn-notification
        notificationTitle=${args.notificationTitle}
        type=${args.type}
        tagStatus=${args.tagStatus}
        @on-notification-click=${(e) => action(e.type)(e)}
      >
        <kd-button
          slot="actions"
          kind="tertiary"
          size="small"
          description="close-btn"
          iconPosition="left"
          @on-click="${(e) => onClose(e)}"
        >
          <kd-icon slot="icon" fill="#3D3C3C" .icon=${closeIcon}></kd-icon>
        </kd-button>

        <div>${notificationBodyMsg}</div>
      </kyn-notification>
      <br />
      <p><u>Without Description</u></p>
      <br />
      <kyn-notification
        notificationTitle=${args.notificationTitle}
        type=${args.type}
        tagStatus=${args.tagStatus}
        @on-notification-click=${(e) => action(e.type)(e)}
      >
        <kd-button
          slot="actions"
          kind="tertiary"
          size="small"
          description="close-btn"
          iconPosition="left"
          @on-click="${(e) => onClose(e)}"
        >
          <kd-icon slot="icon" fill="#3D3C3C" .icon=${closeIcon}></kd-icon>
        </kd-button>
      </kyn-notification> `;
  },
};

export const Toast = {
  args: {
    notificationTitle: 'Notification Title',
    type: 'toast',
    tagStatus: 'info',
  },
  render: (args) => {
    return html`<kyn-notification
        notificationTitle=${args.notificationTitle}
        type=${args.type}
        tagStatus=${args.tagStatus}
        @on-notification-click=${(e) => action(e.type)(e)}
        style="width:440px;"
      >
        <kd-button
          slot="actions"
          kind="tertiary"
          size="small"
          description="close-btn"
          iconPosition="left"
          @on-click="${(e) => onClose(e)}"
        >
          <kd-icon slot="icon" fill="#3D3C3C" .icon=${closeIcon}></kd-icon>
        </kd-button>
        <div>${notificationBodyMsg}</div>
      </kyn-notification>
      <br />
      <p><u>With Action link</u></p>
      <br />
      <kyn-notification
        notificationTitle=${args.notificationTitle}
        notificationSubtitle=${args.notificationSubtitle}
        type=${args.type}
        tagStatus=${args.tagStatus}
        @on-notification-click=${(e) => action(e.type)(e)}
        style="width:440px;"
      >
        <kd-button
          slot="actions"
          kind="tertiary"
          size="small"
          description="close-btn"
          iconPosition="left"
          @on-click="${(e) => onClose(e)}"
        >
          <kd-icon slot="icon" fill="#3D3C3C" .icon=${closeIcon}></kd-icon>
        </kd-button>

        <kd-link
          slot="action-link"
          href="#"
          @on-click=${(e) => e.preventDefault()}
        >
          Link
        </kd-link>

        <div>${notificationBodyMsg}</div>
      </kyn-notification> `;
  },
};
