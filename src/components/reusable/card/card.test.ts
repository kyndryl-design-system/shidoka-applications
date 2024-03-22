import { Card } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-card', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-card');
    assert.instanceOf(el, Card);
  });
});
