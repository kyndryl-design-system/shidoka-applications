import { TimePicker } from '../../../../dist/index.js';
import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('kyn-time-picker', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-time-picker');
    assert.instanceOf(el, TimePicker);
  });
});
