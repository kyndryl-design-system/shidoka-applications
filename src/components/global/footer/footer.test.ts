import {
  Footer,
  FooterNav,
  FooterNavLink,
} from '../footer/index';

import { assert } from '@open-wc/testing';

suite('kyn-footer', () => {
  test('is added to dom', () => {
    const el = document.createElement('kyn-footer');
    assert.instanceOf(el, Footer);
  });
});

suite('kyn-footer-nav', () => {
  test('is added to dom', () => {
    const el = document.createElement('kyn-footer-nav');
    assert.instanceOf(el, FooterNav);
  });
});

suite('kyn-footer-link', () => {
  test('is added to dom', () => {
    const el = document.createElement('kyn-footer-link');
    assert.instanceOf(el, FooterNavLink);
  });
});
