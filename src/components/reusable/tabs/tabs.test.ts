import { Tabs, Tab, TabPanel } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-tabs', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-tabs');
    assert.instanceOf(el, Tabs);
  });
});

suite('kyn-tab', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-tab');
    assert.instanceOf(el, Tab);
  });
});

suite('kyn-tab-panel', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-tab-panel');
    assert.instanceOf(el, TabPanel);
  });
});
