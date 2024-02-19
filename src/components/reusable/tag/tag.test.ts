import { Tag, TagGroup } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-tag', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-tag');
    assert.instanceOf(el, Tag);
  });
});

suite('kyn-tag-group', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-tag-group');
    assert.instanceOf(el, TagGroup);
  });
});
