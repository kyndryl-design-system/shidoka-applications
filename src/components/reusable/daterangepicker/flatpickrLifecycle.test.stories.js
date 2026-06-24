import { html } from 'lit';
import { expect, userEvent, waitFor } from 'storybook/test';

import '../../../components/reusable/datePicker';
import '../../../components/reusable/daterangepicker';
import {
  CONFIG_DEBOUNCE_DELAY,
  RESIZE_DEBOUNCE_DELAY,
} from '../../../common/helpers/flatpickr/index';

export default {
  title: 'Tests/Components/Flatpickr Lifecycle',
  tags: ['!autodocs'],
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
};

const waitForFlatpickr = async (picker) => {
  await waitFor(() => {
    expect(picker.flatpickrInstance).toBeTruthy();
  });
};

const openPicker = async (picker) => {
  const input = picker.shadowRoot.querySelector('input');
  expect(input).not.toBeNull();

  await userEvent.click(input);

  await waitFor(() => {
    expect(picker.flatpickrInstance?.isOpen).toBe(true);
  });
};

const closePicker = async (picker) => {
  picker.flatpickrInstance?.close();

  await waitFor(() => {
    expect(picker.flatpickrInstance?.isOpen).toBe(false);
  });
};

const waitForConfigDebounce = () =>
  new Promise((resolve) => {
    window.setTimeout(resolve, CONFIG_DEBOUNCE_DELAY + 50);
  });

const waitForResizeDebounce = () =>
  new Promise((resolve) => {
    window.setTimeout(resolve, RESIZE_DEBOUNCE_DELAY + 50);
  });

export const DatePickerAppliesPendingConfigReinitAfterClose = {
  render: () => html`
    <kyn-date-picker
      name="date-picker-pending-config"
      label="Date"
      dateFormat="Y-m-d"
    ></kyn-date-picker>
  `,
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector('kyn-date-picker');
    expect(picker).not.toBeNull();
    await picker.updateComplete;
    await waitForFlatpickr(picker);

    const originalInstance = picker.flatpickrInstance;
    await openPicker(picker);

    picker.dateFormat = 'm-d-Y';
    await picker.updateComplete;
    await waitForConfigDebounce();

    expect(picker.flatpickrInstance).toBe(originalInstance);
    expect(picker.flatpickrInstance?.config.dateFormat).toBe('Y-m-d');

    await closePicker(picker);

    await waitFor(() => {
      expect(picker.flatpickrInstance).not.toBe(originalInstance);
      expect(picker.flatpickrInstance?.config.dateFormat).toBe('m-d-Y');
    });
  },
};

export const DateRangePickerAppliesPendingConfigReinitAfterClose = {
  render: () => html`
    <kyn-date-range-picker
      name="date-range-picker-pending-config"
      label="Date range"
      dateFormat="Y-m-d"
    ></kyn-date-range-picker>
  `,
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector('kyn-date-range-picker');
    expect(picker).not.toBeNull();
    await picker.updateComplete;
    await waitForFlatpickr(picker);

    const originalInstance = picker.flatpickrInstance;
    await openPicker(picker);

    picker.dateFormat = 'm-d-Y';
    await picker.updateComplete;
    await waitForConfigDebounce();

    expect(picker.flatpickrInstance).toBe(originalInstance);
    expect(picker.flatpickrInstance?.config.dateFormat).toBe('Y-m-d');

    await closePicker(picker);

    await waitFor(() => {
      expect(picker.flatpickrInstance).not.toBe(originalInstance);
      expect(picker.flatpickrInstance?.config.dateFormat).toBe('m-d-Y');
    });
  },
};

export const DateRangePickerAppliesPendingResizeReinitAfterClose = {
  render: () => html`
    <kyn-date-range-picker
      name="date-range-picker-pending-resize"
      label="Date range"
      dateFormat="Y-m-d"
    ></kyn-date-range-picker>
  `,
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector('kyn-date-range-picker');
    expect(picker).not.toBeNull();
    await picker.updateComplete;
    await waitForFlatpickr(picker);

    const originalInstance = picker.flatpickrInstance;
    await openPicker(picker);

    window.dispatchEvent(new Event('resize'));
    await waitForResizeDebounce();

    expect(picker.flatpickrInstance).toBe(originalInstance);

    await closePicker(picker);

    await waitFor(() => {
      expect(picker.flatpickrInstance).not.toBe(originalInstance);
    });
  },
};

export const DateRangePickerReinitializesAfterReconnect = {
  render: () => html`
    <div id="reconnect-host">
      <kyn-date-range-picker
        name="date-range-picker-reconnect"
        label="Date range"
        dateFormat="Y-m-d"
      ></kyn-date-range-picker>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('#reconnect-host');
    const picker = host.querySelector('kyn-date-range-picker');
    expect(host).not.toBeNull();
    expect(picker).not.toBeNull();

    await picker.updateComplete;
    await waitForFlatpickr(picker);

    host.removeChild(picker);

    await waitFor(() => {
      expect(picker.flatpickrInstance).toBeUndefined();
    });

    host.appendChild(picker);
    await picker.updateComplete;

    await waitForFlatpickr(picker);
    await openPicker(picker);
    expect(picker.flatpickrInstance?.calendarContainer).toBeTruthy();
  },
};
