import { DateRangePicker } from '../../../../dist/index.js';
import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('kyn-date-range-picker', () => {
    test('is defined', () => {
      const el = document.createElement('kyn-date-range-picker');
      assert.instanceOf(el, DateRangePicker);
    });
});