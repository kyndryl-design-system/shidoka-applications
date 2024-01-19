import { Modal } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-modal', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-modal');
    assert.instanceOf(el, Modal);
  });
});
