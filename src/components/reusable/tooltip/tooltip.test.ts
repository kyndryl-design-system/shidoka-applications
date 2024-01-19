import { Tooltip } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-tooltip', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-tooltip');
    assert.instanceOf(el, Tooltip);
  });
});
