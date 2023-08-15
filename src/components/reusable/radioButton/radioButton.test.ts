import { RadioButton, RadioButtonGroup } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-radio-button', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-radio-button');
    assert.instanceOf(el, RadioButton);
  });
});

suite('kyn-radio-button-group', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-radio-button-group');
    assert.instanceOf(el, RadioButtonGroup);
  });
});
