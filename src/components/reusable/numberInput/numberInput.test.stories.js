import { LitElement, html, css } from 'lit';
import { expect } from 'storybook/test';
import './index';

export default {
  title: 'Tests/Components/Number Input',
  component: 'kyn-number-input',
  tags: ['!autodocs'],
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
};

class NumberInputBehaviorDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 28rem;
    }

    .stack {
      display: flex;
      flex-direction: column;
      gap: var(--kd-spacing-24);
    }

    .title {
      margin: 0 0 var(--kd-spacing-8);
      font-weight: var(--kd-font-weight-medium);
    }

    .hint {
      margin: 0 0 var(--kd-spacing-8);
      color: var(--kd-color-text-secondary);
    }

    .emitted {
      margin: var(--kd-spacing-8) 0 0;
      color: var(--kd-color-text-secondary);
      font-family: var(--kd-font-family-code-view, monospace);
    }
  `;

  static properties = {
    defaultEmitted: { state: true },
    emptyEmitted: { state: true },
    digitsEmitted: { state: true },
  };

  constructor() {
    super();
    this.defaultEmitted = 0;
    this.emptyEmitted = 0;
    this.digitsEmitted = 0;
  }

  _format(value) {
    return value === null ? 'null' : String(value);
  }

  render() {
    return html`
      <div class="stack">
        <section>
          <p class="title">Default</p>
          <p class="hint">Delete the value. It resets to 0 (existing apps).</p>
          <kyn-number-input
            name="default-clear"
            label="Default"
            .value=${0}
            @on-input=${(e) => {
              this.defaultEmitted = e.detail.value;
            }}
          ></kyn-number-input>
          <p class="emitted">
            Last on-input value: ${this._format(this.defaultEmitted)}
          </p>
        </section>

        <section>
          <p class="title">allowEmpty</p>
          <p class="hint">
            Delete the value. The field stays blank and emits null.
          </p>
          <kyn-number-input
            name="allow-empty"
            label="Allow empty"
            allowEmpty
            .value=${0}
            @on-input=${(e) => {
              this.emptyEmitted = e.detail.value;
            }}
          ></kyn-number-input>
          <p class="emitted">
            Last on-input value: ${this._format(this.emptyEmitted)}
          </p>
        </section>

        <section>
          <p class="title">16 digits</p>
          <p class="hint">
            Type or paste 9999999999999999. The field should keep those digits,
            not jump to 10000000000000000.
          </p>
          <kyn-number-input
            name="sixteen-digits"
            label="Unsafe integer"
            .value=${0}
            @on-input=${(e) => {
              this.digitsEmitted = e.detail.value;
            }}
          ></kyn-number-input>
          <p class="emitted">
            Last on-input value: ${this._format(this.digitsEmitted)} (JS Number
            may round; the field text should not)
          </p>
        </section>
      </div>
    `;
  }
}

if (!customElements.get('sb-number-input-behavior-demo')) {
  customElements.define(
    'sb-number-input-behavior-demo',
    NumberInputBehaviorDemo
  );
}

export const IllustrativeExample = {
  name: 'Illustrative example',
  render: () =>
    html`<sb-number-input-behavior-demo></sb-number-input-behavior-demo>`,
  play: async ({ canvasElement }) => {
    const demo = canvasElement.querySelector('sb-number-input-behavior-demo');
    await demo.updateComplete;
    const inputs = demo.shadowRoot.querySelectorAll('kyn-number-input');
    expect(inputs).toHaveLength(3);
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
  },
};
