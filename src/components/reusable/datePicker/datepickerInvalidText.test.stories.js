import { html, css, LitElement } from 'lit';
import { expect, waitFor } from 'storybook/test';

import './index';

const FUTURE_ERROR = 'Must be in the future';

/**
 * Simulates a controlled consumer: on every on-change it writes back `value`
 * and sets `invalidText` when the selected datetime is not in the future.
 * Before the fix, value sync cleared host `invalidText`, so the error never
 * (or only intermittently) rendered for dateFormat with time enabled.
 */
class DatepickerInvalidTextHost extends LitElement {
  static properties = {
    value: { attribute: false },
    invalidText: { type: String },
    deferHostWrite: { type: Boolean },
    _lastSource: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 420px;
    }

    .status {
      margin-top: 0.75rem;
      font-size: 0.875rem;
    }
  `;

  constructor() {
    super();
    this.value = null;
    this.invalidText = '';
    this.deferHostWrite = false;
    this._lastSource = 'initial';
  }

  connectedCallback() {
    super.connectedCallback();
    // Seed a past datetime so the story opens already in the failing state
    // consumers hit: controlled value + external invalidText + enableTime.
    if (this.value == null && this._lastSource === 'initial') {
      this.value = new Date(2020, 0, 15, 10, 30, 0);
      this.invalidText = FUTURE_ERROR;
      this._lastSource = 'seeded-past-value';
    }
  }

  isFuture(date) {
    return (
      date instanceof Date && !Number.isNaN(date.getTime()) && date > new Date()
    );
  }

  applyChange(dateObjects) {
    if (
      dateObjects === null ||
      (Array.isArray(dateObjects) && dateObjects.length === 0)
    ) {
      this.value = null;
      this.invalidText = '';
      this._lastSource = 'cleared';
      return;
    }

    const next = Array.isArray(dateObjects) ? dateObjects[0] : dateObjects;
    const date = next instanceof Date ? next : new Date(next);
    // New Date instance, matching Vue/React storing a copy rather than
    // the same reference handleDateChange already assigned.
    this.value = Number.isNaN(date.getTime()) ? date : new Date(date.getTime());
    this.invalidText = this.isFuture(this.value) ? '' : FUTURE_ERROR;
    this._lastSource = 'on-change';
  }

  onChange(e) {
    const dateObjects = e.detail?.dateObjects ?? null;
    if (this.deferHostWrite) {
      setTimeout(() => this.applyChange(dateObjects), 0);
      return;
    }
    this.applyChange(dateObjects);
  }

  render() {
    return html`
      <kyn-date-picker
        name="datepicker-invalid-text"
        label="Scheduled start"
        dateFormat="Y-m-d H:i:S"
        valueFormat="dateFormat"
        size="md"
        .value=${this.value}
        .invalidText=${this.invalidText}
        ?twentyFourHourFormat=${true}
        @on-change=${(e) => this.onChange(e)}
      ></kyn-date-picker>

      <p class="status" data-testid="host-status">
        Host invalidText:
        <strong data-testid="host-invalid-text"
          >${this.invalidText || '(empty)'}</strong
        >
      </p>
    `;
  }
}

if (!customElements.get('datepicker-invalid-text-host')) {
  customElements.define(
    'datepicker-invalid-text-host',
    DatepickerInvalidTextHost
  );
}

export default {
  title: 'Tests/Components/Datepicker Invalid Text',
  tags: ['!autodocs'],
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: false },
          { id: 'aria-required-parent', enabled: false },
          { id: 'aria-required-children', enabled: false },
        ],
      },
    },
  },
};

const getHostAndPicker = async (canvasElement) => {
  const host = canvasElement.querySelector('datepicker-invalid-text-host');
  expect(host).not.toBeNull();
  await host.updateComplete;

  const picker = host.shadowRoot.querySelector('kyn-date-picker');
  expect(picker).not.toBeNull();
  await picker.updateComplete;

  return { host, picker };
};

const expectErrorVisible = async (picker, message) => {
  await waitFor(() => {
    expect(picker.invalidText).toBe(message);
    const error = picker.shadowRoot.querySelector('.error-text');
    expect(error).not.toBeNull();
    expect(error.textContent).toContain(message);
    expect(picker.validity.customError).toBe(true);
    expect(picker.validity.valid).toBe(false);
    expect(picker.validationMessage).toBe(message);
  });
};

const expectErrorCleared = async (picker) => {
  await waitFor(() => {
    expect(picker.invalidText).toBe('');
    expect(picker.shadowRoot.querySelector('.error-text')).toBeNull();
    expect(picker.validity.valid).toBe(true);
    expect(picker.validity.customError).toBe(false);
  });
};

/** Manual / visual: seeded past value with host invalidText already applied. */
export const ControlledDatetimeShowsHostInvalidText = {
  name: 'Controlled Datetime Shows Host InvalidText',
  render: () => html`
    <datepicker-invalid-text-host></datepicker-invalid-text-host>
  `,
  play: async ({ canvasElement }) => {
    const { host, picker } = await getHostAndPicker(canvasElement);

    await waitFor(() => {
      expect(host.invalidText).toBe(FUTURE_ERROR);
      expect(
        host.shadowRoot.querySelector('[data-testid="host-invalid-text"]')
          .textContent
      ).toContain(FUTURE_ERROR);
    });

    await expectErrorVisible(picker, FUTURE_ERROR);
  },
};

/**
 * Regression: writing controlled value + invalidText together (the consumer
 * pattern) must keep rendering invalidText and mark ElementInternals invalid.
 */
export const ValueSyncPreservesHostInvalidText = {
  name: 'Value Sync Preserves Host InvalidText',
  render: () => html`
    <datepicker-invalid-text-host></datepicker-invalid-text-host>
  `,
  play: async ({ canvasElement }) => {
    const { host, picker } = await getHostAndPicker(canvasElement);

    // Clear first so we exercise a fresh controlled write of value + invalidText.
    host.value = null;
    host.invalidText = '';
    await host.updateComplete;
    await picker.updateComplete;

    const past = new Date(2019, 5, 1, 8, 15, 30);
    host.value = past;
    host.invalidText = FUTURE_ERROR;
    await host.updateComplete;
    await picker.updateComplete;

    // Give Lit another frame — previously value `updated()` cleared invalidText
    // after FormMixin applied it.
    await picker.updateComplete;
    await host.updateComplete;

    expect(host.invalidText).toBe(FUTURE_ERROR);
    await expectErrorVisible(picker, FUTURE_ERROR);
  },
};

/**
 * on-change → host sets value + invalidText for a past date, then a future
 * date clears it, then past again still shows the error (not “only once”).
 */
export const OnChangePastFuturePastKeepsInvalidText = {
  name: 'OnChange Past → Future → Past Keeps InvalidText',
  render: () => html`
    <datepicker-invalid-text-host .value=${null}></datepicker-invalid-text-host>
  `,
  play: async ({ canvasElement }) => {
    const { host, picker } = await getHostAndPicker(canvasElement);

    host.value = null;
    host.invalidText = '';
    host._lastSource = 'cleared-for-test';
    await host.updateComplete;
    await picker.updateComplete;

    const pastA = new Date(2021, 2, 10, 12, 0, 0);
    await picker.handleDateChange([pastA], '2021-03-10 12:00:00');
    await host.updateComplete;
    await picker.updateComplete;
    await expectErrorVisible(picker, FUTURE_ERROR);

    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    future.setSeconds(0, 0);
    await picker.handleDateChange([future], 'future');
    await host.updateComplete;
    await picker.updateComplete;
    await expectErrorCleared(picker);

    const pastB = new Date(2022, 8, 20, 9, 45, 0);
    await picker.handleDateChange([pastB], '2022-09-20 09:45:00');
    await host.updateComplete;
    await picker.updateComplete;
    await expectErrorVisible(picker, FUTURE_ERROR);

    expect(host.invalidText).toBe(FUTURE_ERROR);
  },
};

/**
 * Vue/React apply `:value` + `invalidText` on the next macrotask, after
 * handleDateChange's Lit flush. Regression: that flush used to re-sync value
 * and paint valid before the host write landed.
 */
export const NextTickHostWriteKeepsInvalidText = {
  name: 'Next-Tick Host Write Keeps InvalidText',
  render: () => html`
    <datepicker-invalid-text-host
      .value=${null}
      ?deferHostWrite=${true}
    ></datepicker-invalid-text-host>
  `,
  play: async ({ canvasElement }) => {
    const { host, picker } = await getHostAndPicker(canvasElement);

    host.deferHostWrite = true;
    host.value = null;
    host.invalidText = '';
    host._lastSource = 'cleared-for-test';
    await host.updateComplete;
    await picker.updateComplete;

    const past = new Date(2021, 2, 10, 12, 0, 0);
    await picker.handleDateChange([past], '2021-03-10 12:00:00');
    await new Promise((resolve) => setTimeout(resolve, 0));
    await host.updateComplete;
    await picker.updateComplete;
    await picker.updateComplete;

    expect(host.invalidText).toBe(FUTURE_ERROR);
    await expectErrorVisible(picker, FUTURE_ERROR);
  },
};
