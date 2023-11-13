import { Dropdown, DropdownOption } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-dropdown', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-dropdown');
    assert.instanceOf(el, Dropdown);
  });
});

suite('kyn-checkbox-group', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-dropdown-option');
    assert.instanceOf(el, DropdownOption);
  });
});
