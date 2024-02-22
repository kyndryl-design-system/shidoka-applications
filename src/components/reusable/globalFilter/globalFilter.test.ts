import { GlobalFilter } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-global-filter', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-global-filter');
    assert.instanceOf(el, GlobalFilter);
  });
});
