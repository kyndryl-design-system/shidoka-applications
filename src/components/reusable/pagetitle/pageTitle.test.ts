import { PageTitle } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-page-title', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-page-title');
    assert.instanceOf(el, PageTitle);
  });
});
