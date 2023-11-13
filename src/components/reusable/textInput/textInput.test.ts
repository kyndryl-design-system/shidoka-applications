import { TextInput } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-text-input', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-text-input');
    assert.instanceOf(el, TextInput);
  });
});
