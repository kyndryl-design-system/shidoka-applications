import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

import '../overflowMenu';

const notificationBodyMsg =
  'Message, this is an additional line Ipsum iMessage, Lorem Ipsum is simply dummy and typesetting industry.';

const notificationTagArr = [
  { tagStatus: 'info', tagLabel: 'Info' },
  { tagStatus: 'warning', tagLabel: 'Warning' },
  { tagStatus: 'success', tagLabel: 'Success' },
  { tagStatus: 'error', tagLabel: 'Error' },
];

export default {
  title: 'Components/Notification',
  component: 'kyn-notification',
  argTypes: {
    type: {
      options: ['normal', 'clickable'],
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

export const Default = {
  args: {
    notificationTitle: 'Notification Title',
    notificationSubtitle: '',
    timeStamp: '2 mins ago',
    href: '#',
    type: 'normal',
    tagStatus: 'default',
  },
  render: (args) => {
    return html`<kyn-notification
      notificationTitle=${args.notificationTitle}
      notificationSubtitle=${args.notificationSubtitle}
      timeStamp=${args.timeStamp}
      href=${args.href}
      type=${args.type}
      tagStatus=${args.tagStatus}
      tagLabel=${args.tagLabel}
      @on-notification-click=${(e) => action(e.type)(e)}
      style="width:464px;"
    >
      <kyn-overflow-menu
        slot="action-slot"
        anchorRight
        @click=${(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <kyn-overflow-menu-item>Mark as Read</kyn-overflow-menu-item>
        <kyn-overflow-menu-item>View Details</kyn-overflow-menu-item>
      </kyn-overflow-menu>

      <div slot="notification-body-slot">${notificationBodyMsg}</div>
    </kyn-notification>`;
  },
};

export const WithStatusTag = {
  args: { ...Default.args, notificationSubtitle: 'Application or Service' },
  render: (args) => {
    return html`
      ${notificationTagArr.map((ele) => {
        return html`<kyn-notification
          notificationTitle=${args.notificationTitle}
          notificationSubtitle=${args.notificationSubtitle}
          timeStamp=${args.timeStamp}
          href=${args.href}
          type=${args.type}
          tagStatus=${ele.tagStatus}
          tagLabel=${ele.tagLabel}
          @on-notification-click=${(e) => action(e.type)(e)}
          style="width:464px;"
        >
          <kyn-overflow-menu
            slot="action-slot"
            anchorRight
            @click=${(e) => e.preventDefault()}
          >
            <kyn-overflow-menu-item>Mark as Read</kyn-overflow-menu-item>
            <kyn-overflow-menu-item>View Details</kyn-overflow-menu-item>
          </kyn-overflow-menu>

          <div slot="notification-body-slot">${notificationBodyMsg}</div>
        </kyn-notification>`;
      })}
    `;
  },
};
