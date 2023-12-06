import { OverflowMenu, OverflowMenuItem } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-overflow-menu', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-overflow-menu');
    assert.instanceOf(el, OverflowMenu);
  });
});

suite('kyn-overflow-menu-item', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-overflow-menu-item');
    assert.instanceOf(el, OverflowMenuItem);
  });
});
