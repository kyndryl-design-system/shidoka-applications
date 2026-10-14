import { html } from 'lit';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import './index';

export default {
  title: 'Tests/Components/Card',
  component: 'kyn-card',
  tags: ['!autodocs'],
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
};

export const SelectionPersists = {
  render: () => html`
    <kyn-card type="clickable" selectable>
      <h3>Selectable service</h3>
    </kyn-card>
  `,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('kyn-card');
    await card.updateComplete;
    const surface = card.shadowRoot.querySelector('[part="card-wrapper"]');
    const select = fn();
    card.addEventListener('on-select', select);
    expect(surface.getAttribute('role')).toBe('checkbox');
    expect(surface.getAttribute('aria-checked')).toBe('false');
    expect(surface.getAttribute('tabindex')).toBe('0');
    expect(getComputedStyle(surface).borderTopWidth).toBe('1px');
    expect(card.shadowRoot.querySelector('kyn-checkbox')).toBeNull();
    await userEvent.click(surface);
    await card.updateComplete;
    expect(card.selected).toBe(true);
    expect(surface.getAttribute('aria-checked')).toBe('true');
    expect(getComputedStyle(surface).borderTopWidth).toBe('2px');
    await userEvent.unhover(surface);
    const selectedBoxShadow = getComputedStyle(surface).boxShadow;
    await userEvent.hover(surface);
    await waitFor(() => {
      expect(getComputedStyle(surface).boxShadow).not.toBe(selectedBoxShadow);
    });
    await userEvent.unhover(surface);
    expect(select.mock.calls[0][0].detail.selected).toBe(true);
    await userEvent.click(surface);
    await card.updateComplete;
    expect(card.selected).toBe(false);
    expect(surface.getAttribute('aria-checked')).toBe('false');
    expect(select.mock.calls[1][0].detail.selected).toBe(false);
    card.removeEventListener('on-select', select);
  },
};

export const SelectionKeyboardInteraction = {
  render: () => html`
    <kyn-card type="clickable" selectable>
      <h3>Selectable service</h3>
    </kyn-card>
  `,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('kyn-card');
    await card.updateComplete;
    const surface = card.shadowRoot.querySelector('[part="card-wrapper"]');
    surface.focus();
    await userEvent.keyboard('{Enter}');
    await card.updateComplete;
    expect(card.selected).toBe(true);
    await userEvent.keyboard(' ');
    await card.updateComplete;
    expect(card.selected).toBe(false);
  },
};

export const StaticCardsIgnoreSelection = {
  render: () => html`
    <kyn-card type="normal" selectable selected>
      <h3>Static service</h3>
    </kyn-card>
  `,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('kyn-card');
    await card.updateComplete;
    const surface = card.shadowRoot.querySelector('[part="card-wrapper"]');
    const select = fn();
    card.addEventListener('on-select', select);

    expect(surface.getAttribute('role')).toBeNull();
    expect(surface.hasAttribute('aria-checked')).toBe(false);
    expect(surface.hasAttribute('tabindex')).toBe(false);
    expect(surface.classList.contains('selectable')).toBe(false);
    expect(surface.classList.contains('selected')).toBe(false);

    await userEvent.click(surface);
    surface.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    surface.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );

    expect(card.selected).toBe(true);
    expect(select).not.toHaveBeenCalled();
    card.removeEventListener('on-select', select);
  },
};

export const ClickableRemainsUnchanged = {
  render: () => html`
    <kyn-card type="clickable" hideBorder>
      <h3>Open service</h3>
    </kyn-card>
  `,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('kyn-card');
    await card.updateComplete;
    const surface = card.shadowRoot.querySelector('[part="card-wrapper"]');
    expect(surface.getAttribute('role')).toBe('link');
    expect(surface.getAttribute('tabindex')).toBe('0');
    expect(card.shadowRoot.querySelector('kyn-checkbox')).toBeNull();
    const activate = fn();
    const select = fn();
    card.addEventListener('on-card-click', activate);
    card.addEventListener('on-select', select);
    try {
      await userEvent.click(surface);
      surface.focus();
      await userEvent.keyboard('{Enter}');
      expect(activate).toHaveBeenCalledTimes(2);
      expect(select).not.toHaveBeenCalled();
    } finally {
      surface.blur();
      card.removeEventListener('on-card-click', activate);
      card.removeEventListener('on-select', select);
    }
  },
};
