import { NotificationPanel, Notification } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-notification-panel', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-notification-panel');
    assert.instanceOf(el, NotificationPanel);
  });
});

suite('kyn-notification', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-notification');
    assert.instanceOf(el, Notification);
  });
});
