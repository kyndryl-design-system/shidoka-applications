import { html, css, LitElement } from 'lit';
import { expect, userEvent, waitFor } from 'storybook/test';

import '../../../components/reusable/widget';
import '../../../components/reusable/modal';
import '../../../components/reusable/accordion';
import '../../../components/reusable/daterangepicker';
import '../../../components/reusable/button';

class DateRangePickerModalRegressionHost extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <kyn-widget>
        <kyn-modal
          size="md"
          titleText="Filters"
          labelText="Example"
          okText="Apply"
          cancelText="Cancel"
          closeText="Close"
        >
          <kyn-button slot="anchor" kind="primary">Open modal</kyn-button>

          <kyn-accordion
            filledHeaders
            compact
            expandLabel="Expand all"
            collapseLabel="Collapse all"
          >
            <kyn-accordion-item opened>
              <span slot="title">Overview</span>
              <div slot="body">Overview content</div>
            </kyn-accordion-item>

            <kyn-accordion-item>
              <span slot="title">Lost Date</span>
              <span slot="subtitle">All</span>
              <div slot="body">
                <kyn-date-range-picker
                  name="demo-date-range"
                  label="Filter date by range"
                  dateFormat="Y-m-d"
                  caption="Select a start and end date."
                  style="width: 100%;"
                ></kyn-date-range-picker>
              </div>
            </kyn-accordion-item>
          </kyn-accordion>
        </kyn-modal>
      </kyn-widget>
    `;
  }
}

if (!customElements.get('date-range-picker-modal-regression-host')) {
  customElements.define(
    'date-range-picker-modal-regression-host',
    DateRangePickerModalRegressionHost
  );
}

export default {
  title: 'Tests/Examples/Date Range Picker in Accordion in Modal',
  tags: ['!autodocs'],
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
};

const getNestedElements = async (canvasElement) => {
  const host = canvasElement.querySelector(
    'date-range-picker-modal-regression-host'
  );
  expect(host).not.toBeNull();
  await host.updateComplete;

  const root = host.shadowRoot;
  const modal = root.querySelector('kyn-modal');
  const accordionItems = root.querySelectorAll('kyn-accordion-item');
  const targetAccordionItem = accordionItems[1];
  const picker = root.querySelector('kyn-date-range-picker');

  expect(modal).not.toBeNull();
  expect(targetAccordionItem).not.toBeNull();
  expect(picker).not.toBeNull();

  await modal.updateComplete;
  await targetAccordionItem.updateComplete;
  await picker.updateComplete;

  return { root, modal, targetAccordionItem, picker };
};

const openPicker = async ({ root, modal, targetAccordionItem, picker }) => {
  modal.open = true;
  await modal.updateComplete;

  targetAccordionItem.opened = true;
  await targetAccordionItem.updateComplete;
  await picker.updateComplete;

  const input = picker.shadowRoot.querySelector('input');
  expect(input).not.toBeNull();

  await userEvent.click(input);

  await waitFor(() => {
    const calendar = root.querySelector('.flatpickr-calendar');
    const themeStyle = root.querySelector('style[data-flatpickr-theme]');

    expect(calendar).not.toBeNull();
    expect(themeStyle).not.toBeNull();
    expect(themeStyle.textContent).toContain('.flatpickr-calendar');
  });
};

export const RestoresShadowRootCalendarThemeOnSecondOpen = {
  render: () => html`
    <date-range-picker-modal-regression-host></date-range-picker-modal-regression-host>
  `,
  play: async ({ canvasElement }) => {
    const elements = await getNestedElements(canvasElement);

    await openPicker(elements);

    const firstThemeStyle = elements.root.querySelector(
      'style[data-flatpickr-theme]'
    );
    expect(firstThemeStyle).not.toBeNull();

    firstThemeStyle.remove();
    expect(
      elements.root.querySelector('style[data-flatpickr-theme]')
    ).toBeNull();

    elements.picker.flatpickrInstance?.close();
    elements.modal.open = false;
    await elements.modal.updateComplete;

    await openPicker(elements);
  },
};
