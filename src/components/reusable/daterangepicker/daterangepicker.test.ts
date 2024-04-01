import { DateRangePicker } from '../../../../dist/index.js';
import { assert } from '@open-wc/testing';

suite('kyn-date-range-picker', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-date-range-picker');
    assert.instanceOf(el, DateRangePicker);
  });
});
