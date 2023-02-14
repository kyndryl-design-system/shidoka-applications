import { Button } from '../../../../dist/index.js';

import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('kyn-button', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-button');
    assert.instanceOf(el, Button);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<kyn-button></kyn-button>`);
    assert.shadowDom.equal(
      el,
      `
      <button class="btn btn--primary btn--md" part="button">
        <slot></slot>
      </button>
    `
    );
  });

  test('renders disabled', async () => {
    const el = await fixture(html`<kyn-button disabled></kyn-button>`);
    assert.shadowDom.equal(
      el,
      `
      <button class="btn btn--primary btn--md" disabled part="button">
        <slot></slot>
      </button>
    `
    );
  });
});
