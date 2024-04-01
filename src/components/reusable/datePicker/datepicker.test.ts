import { DatePicker } from '../../../../dist/index.js';
import { assert } from '@open-wc/testing';

suite('kyn-date-picker', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-date-picker');
    assert.instanceOf(el, DatePicker);
  });
});
