import { ToggleButton } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-toggle-button', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-toggle-button');
    assert.instanceOf(el, ToggleButton);
  });
});
