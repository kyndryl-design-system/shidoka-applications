import { Checkbox, CheckboxGroup } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-checkbox', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-checkbox');
    assert.instanceOf(el, Checkbox);
  });
});

suite('kyn-checkbox-group', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-checkbox-group');
    assert.instanceOf(el, CheckboxGroup);
  });
});
