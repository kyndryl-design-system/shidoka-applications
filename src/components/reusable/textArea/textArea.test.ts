import { TextArea } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-text-area', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-text-area');
    assert.instanceOf(el, TextArea);
  });
});
