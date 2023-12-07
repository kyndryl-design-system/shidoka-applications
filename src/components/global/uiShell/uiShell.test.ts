import { UiShell } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-ui-shell', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-ui-shell');
    assert.instanceOf(el, UiShell);
  });
});
