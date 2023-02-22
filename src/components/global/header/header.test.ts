import {
  Header,
  HeaderNav,
  HeaderLink,
  HeaderFlyouts,
  HeaderFlyout,
  HeaderAvatar,
} from '../../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kyn-header', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-header');
    assert.instanceOf(el, Header);
  });
});

suite('kyn-header-nav', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-header-nav');
    assert.instanceOf(el, HeaderNav);
  });
});

suite('kyn-header-link', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-header-link');
    assert.instanceOf(el, HeaderLink);
  });
});

suite('kyn-header-flyouts', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-header-flyouts');
    assert.instanceOf(el, HeaderFlyouts);
  });
});

suite('kyn-header-flyout', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-header-flyout');
    assert.instanceOf(el, HeaderFlyout);
  });
});

suite('kyn-header-avatar', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-header-avatar');
    assert.instanceOf(el, HeaderAvatar);
  });
});
