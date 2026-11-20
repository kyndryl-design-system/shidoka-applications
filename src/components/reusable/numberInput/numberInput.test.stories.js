import { html } from 'lit';
import { expect, waitFor } from 'storybook/test';
import './index';

export default {
  title: 'Tests/Components/Number Input',
  component: 'kyn-number-input',
  tags: ['!autodocs', '!dev'],
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
};

const getInput = (el) => el.shadowRoot.querySelector('input');

const fireInput = (input, value) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

export const DefaultClearResetsToZero = {
  name: 'Default clear resets to 0',
  render: () => html`
    <kyn-number-input
      name="numberInput"
      label="Label"
      .value=${0}
    ></kyn-number-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-number-input');
    await el.updateComplete;
    const input = getInput(el);
    const seen = [];
    el.addEventListener('on-input', (e) => seen.push(e.detail.value));

    fireInput(input, '');
    await el.updateComplete;

    expect(input.value).toBe('0');
    expect(el.value).toBe(0);
    expect(seen.at(-1)).toBe(0);
  },
};

export const AllowEmptyClearEmitsNull = {
  name: 'allowEmpty clear stays empty and emits null',
  render: () => html`
    <kyn-number-input
      name="numberInput"
      label="Label"
      allowEmpty
      .value=${0}
    ></kyn-number-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-number-input');
    await el.updateComplete;
    const input = getInput(el);
    const seen = [];
    el.addEventListener('on-input', (e) => seen.push(e.detail.value));

    fireInput(input, '');
    await el.updateComplete;

    expect(input.value).toBe('');
    expect(el.value).toBe(null);
    expect(seen.at(-1)).toBe(null);
  },
};

export const IntegerBlocksDecimalPoint = {
  name: 'integer blocks decimal point',
  render: () => html`
    <kyn-number-input
      name="numberInput"
      label="Label"
      integer
      .value=${5}
    ></kyn-number-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-number-input');
    await el.updateComplete;
    const input = getInput(el);

    const blocked = input.dispatchEvent(
      new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        data: '.',
        inputType: 'insertText',
      })
    );

    expect(blocked).toBe(false);
    expect(input.value).toBe('5');
    expect(el.value).toBe(5);
  },
};

export const IntegerRejectsDecimalValue = {
  name: 'integer rejects a decimal value',
  render: () => html`
    <kyn-number-input
      name="numberInput"
      label="Label"
      integer
      .value=${0}
    ></kyn-number-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-number-input');
    await el.updateComplete;
    const input = getInput(el);

    fireInput(input, '1.5');
    await el.updateComplete;

    expect(el.value).toBe(1.5);
    await waitFor(() => {
      expect(input.validity.stepMismatch).toBe(true);
      expect(el._isInvalid).toBe(true);
      expect(
        el.shadowRoot.querySelector('.error')?.textContent?.trim()
      ).not.toBe('');
    });
  },
};

export const SixteenNinesAreNotRewritten = {
  name: '16 nines are not rewritten to 1e16',
  render: () => html`
    <kyn-number-input
      name="numberInput"
      label="Label"
      .value=${0}
    ></kyn-number-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-number-input');
    await el.updateComplete;
    const input = getInput(el);

    fireInput(input, '9999999999999999');
    await el.updateComplete;

    expect(input.value).toBe('9999999999999999');
    expect(input.value).not.toBe('10000000000000000');
    await waitFor(() => {
      expect(el._isInvalid).toBe(true);
      expect(el.shadowRoot.querySelector('.error')?.textContent).toContain(
        'safe integer'
      );
    });
  },
};
