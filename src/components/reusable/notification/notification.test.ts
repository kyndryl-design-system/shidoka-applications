import { Notification } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-notification', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-notification');
    assert.instanceOf(el, Notification);
  });
});
