import { html, css, LitElement } from 'lit';
import { expect, waitFor } from 'storybook/test';

import './index';

const FUTURE_ERROR = 'Range must start in the future';

/**
 * Controlled consumer for date-range-picker: writes back `value` and sets
 * `invalidText` when the range start is not in the future. Before the fix,
 * successful value sync (`setInitialDates`) cleared host `invalidText`.
 */
class DaterangepickerInvalidTextHost extends LitElement {
  static properties = {
    value: { attribute: false },
    invalidText: { type: String },
    deferHostWrite: { type: Boolean },
    _lastSource: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 520px;
    }

    .status {
      margin-top: 0.75rem;
      font-size: 0.875rem;
    }
  `;

  constructor() {
    super();
    this.value = [null, null];
    this.invalidText = '';
    this.deferHostWrite = false;
    this._lastSource = 'initial';
  }

  connectedCallback() {
    super.connectedCallback();
    if (
      Array.isArray(this.value) &&
      this.value[0] == null &&
      this.value[1] == null &&
      this._lastSource === 'initial'
    ) {
      this.value = [
        new Date(2020, 0, 10, 9, 0, 0),
        new Date(2020, 0, 20, 17, 0, 0),
      ];
      this.invalidText = FUTURE_ERROR;
      this._lastSource = 'seeded-past-range';
    }
  }

  isFutureStart(start) {
    return (
      start instanceof Date &&
      !Number.isNaN(start.getTime()) &&
      start > new Date()
    );
  }

  applyChange(dateObjects) {
    if (
      !Array.isArray(dateObjects) ||
      (dateObjects[0] == null && dateObjects[1] == null)
    ) {
      this.value = [null, null];
      this.invalidText = '';
      this._lastSource = 'cleared';
      return;
    }

    const start =
      dateObjects[0] instanceof Date
        ? new Date(dateObjects[0].getTime())
        : dateObjects[0]
        ? new Date(dateObjects[0])
        : null;
    const end =
      dateObjects[1] instanceof Date
        ? new Date(dateObjects[1].getTime())
        : dateObjects[1]
        ? new Date(dateObjects[1])
        : null;

    this.value = [start, end];
    this.invalidText = start && !this.isFutureStart(start) ? FUTURE_ERROR : '';
    this._lastSource = 'on-change';
  }

  onChange(e) {
    const dateObjects = e.detail?.dateObjects;
    if (this.deferHostWrite) {
      setTimeout(() => this.applyChange(dateObjects), 0);
      return;
    }
    this.applyChange(dateObjects);
  }

  render() {
    return html`
      <kyn-date-range-picker
        name="daterangepicker-invalid-text"
        label="Schedule window"
        dateFormat="Y-m-d H:i:S"
        valueFormat="dateFormat"
        size="md"
        .value=${this.value}
        .invalidText=${this.invalidText}
        ?twentyFourHourFormat=${true}
        @on-change=${(e) => this.onChange(e)}
      ></kyn-date-range-picker>

      <p class="status" data-testid="host-status">
        Host invalidText:
        <strong data-testid="host-invalid-text"
          >${this.invalidText || '(empty)'}</strong
        >
      </p>
    `;
  }
}

if (!customElements.get('daterangepicker-invalid-text-host')) {
  customElements.define(
    'daterangepicker-invalid-text-host',
    DaterangepickerInvalidTextHost
  );
}

export default {
  title: 'Tests/Components/Daterangepicker Invalid Text',
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
  const host = canvasElement.querySelector('daterangepicker-invalid-text-host');
  expect(host).not.toBeNull();
  await host.updateComplete;

  const picker = host.shadowRoot.querySelector('kyn-date-range-picker');
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

export const ControlledDatetimeShowsHostInvalidText = {
  name: 'Controlled Datetime Shows Host InvalidText',
  render: () => html`
    <daterangepicker-invalid-text-host></daterangepicker-invalid-text-host>
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

export const ValueSyncPreservesHostInvalidText = {
  name: 'Value Sync Preserves Host InvalidText',
  render: () => html`
    <daterangepicker-invalid-text-host></daterangepicker-invalid-text-host>
  `,
  play: async ({ canvasElement }) => {
    const { host, picker } = await getHostAndPicker(canvasElement);

    host.value = [null, null];
    host.invalidText = '';
    await host.updateComplete;
    await picker.updateComplete;

    const pastStart = new Date(2019, 5, 1, 8, 0, 0);
    const pastEnd = new Date(2019, 5, 5, 18, 0, 0);
    host.value = [pastStart, pastEnd];
    host.invalidText = FUTURE_ERROR;
    await host.updateComplete;
    await picker.updateComplete;
    await picker.updateComplete;
    await host.updateComplete;

    expect(host.invalidText).toBe(FUTURE_ERROR);
    await expectErrorVisible(picker, FUTURE_ERROR);
  },
};

export const OnChangePastFuturePastKeepsInvalidText = {
  name: 'OnChange Past → Future → Past Keeps InvalidText',
  render: () => html`
    <daterangepicker-invalid-text-host
      .value=${[null, null]}
    ></daterangepicker-invalid-text-host>
  `,
  play: async ({ canvasElement }) => {
    const { host, picker } = await getHostAndPicker(canvasElement);

    host.value = [null, null];
    host.invalidText = '';
    host._lastSource = 'cleared-for-test';
    await host.updateComplete;
    await picker.updateComplete;

    const pastAStart = new Date(2021, 2, 10, 12, 0, 0);
    const pastAEnd = new Date(2021, 2, 12, 12, 0, 0);
    await picker.handleDateChange(
      [pastAStart, pastAEnd],
      '2021-03-10 12:00:00 to 2021-03-12 12:00:00'
    );
    await host.updateComplete;
    await picker.updateComplete;
    await expectErrorVisible(picker, FUTURE_ERROR);

    const futureStart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    futureStart.setSeconds(0, 0);
    const futureEnd = new Date(futureStart.getTime() + 2 * 24 * 60 * 60 * 1000);
    await picker.handleDateChange([futureStart, futureEnd], 'future-range');
    await host.updateComplete;
    await picker.updateComplete;
    await expectErrorCleared(picker);

    const pastBStart = new Date(2022, 8, 20, 9, 0, 0);
    const pastBEnd = new Date(2022, 8, 22, 9, 0, 0);
    await picker.handleDateChange(
      [pastBStart, pastBEnd],
      '2022-09-20 09:00:00 to 2022-09-22 09:00:00'
    );
    await host.updateComplete;
    await picker.updateComplete;
    await expectErrorVisible(picker, FUTURE_ERROR);

    expect(host.invalidText).toBe(FUTURE_ERROR);
  },
};

export const NextTickHostWriteKeepsInvalidText = {
  name: 'Next-Tick Host Write Keeps InvalidText',
  render: () => html`
    <daterangepicker-invalid-text-host
      .value=${[null, null]}
      ?deferHostWrite=${true}
    ></daterangepicker-invalid-text-host>
  `,
  play: async ({ canvasElement }) => {
    const { host, picker } = await getHostAndPicker(canvasElement);

    host.deferHostWrite = true;
    host.value = [null, null];
    host.invalidText = '';
    host._lastSource = 'cleared-for-test';
    await host.updateComplete;
    await picker.updateComplete;

    const pastStart = new Date(2021, 2, 10, 12, 0, 0);
    const pastEnd = new Date(2021, 2, 12, 12, 0, 0);
    await picker.handleDateChange(
      [pastStart, pastEnd],
      '2021-03-10 12:00:00 to 2021-03-12 12:00:00'
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    await host.updateComplete;
    await picker.updateComplete;
    await picker.updateComplete;

    expect(host.invalidText).toBe(FUTURE_ERROR);
    await expectErrorVisible(picker, FUTURE_ERROR);
  },
};
