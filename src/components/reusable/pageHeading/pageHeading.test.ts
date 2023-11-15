import { PageHeading } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-page-heading', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-page-heading');
    assert.instanceOf(el, PageHeading);
  });
});
