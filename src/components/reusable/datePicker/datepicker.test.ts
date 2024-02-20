import { DatePicker } from '../../../../dist/index.js';
import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('kyn-date-picker', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-date-picker');
    assert.instanceOf(el, DatePicker);
  });
});
