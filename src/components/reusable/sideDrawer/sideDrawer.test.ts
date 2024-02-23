import { SideDrawer } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-side-drawer', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-side-drawer');
    assert.instanceOf(el, SideDrawer);
  });
});
