import { Breadcrumbs, BreadcrumbItem } from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-breadcrumbs', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-breadcrumbs');
    assert.instanceOf(el, Breadcrumbs);
  });
});

suite('kyn-breadcrumb-item', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-breadcrumb-item');
    assert.instanceOf(el, BreadcrumbItem);
  });
});
