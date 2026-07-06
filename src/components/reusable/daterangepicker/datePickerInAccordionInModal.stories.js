import { html, css, LitElement } from 'lit';
import { action } from 'storybook/actions';

import '../../../components/reusable/widget';
import '../../../components/reusable/modal';
import '../../../components/reusable/accordion';
import '../../../components/reusable/daterangepicker';
import '../../../components/reusable/button';

/**
 * Host web component with its OWN shadow root.
 *
 * This mirrors how a consumer embeds Shidoka components inside their own
 * LitElement/web component. Because the modal, accordion, and date range picker
 * all render inside this host's shadow root, the Flatpickr calendar (which is
 * appended to the modal) also lands in this shadow root rather than the light
 * DOM. The globally injected Flatpickr theme in `document.head` cannot pierce
 * that shadow boundary, which is what caused the calendar to render unstyled.
 *
 * The fix (`ensureFlatpickrStylesInRoot`) injects the theme into the root node
 * that actually contains the rendered calendar, so it is styled correctly here.
 */
class ExampleModalHost extends LitElement {
  static properties = {
    staticPosition: { type: Boolean },
    dateFormat: { type: String },
    size: { type: String },
    locale: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .widget-action-center {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
    }
  `;

  constructor() {
    super();
    this.staticPosition = true;
    this.dateFormat = 'Y-m-d';
    this.size = 'md';
    this.locale = 'en';
  }

  render() {
    return html`
      <kyn-widget widgetTitle="Date range filters">
        <div class="widget-action-center">
          <kyn-modal
            size="md"
            titleText="Filters"
            labelText="Example"
            okText="Apply"
            cancelText="Cancel"
            closeText="Close"
            @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
            @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
                <div slot="body">
                  <p>
                    This modal lives inside a host web component's shadow root.
                  </p>
                </div>
              </kyn-accordion-item>

              <kyn-accordion-item>
                <span slot="title">Lost Date</span>
                <span slot="subtitle">All</span>
                <div slot="body">
                  <kyn-date-range-picker
                    name="demo-date-range"
                    label="Filter date by range"
                    locale=${this.locale}
                    .dateFormat=${this.dateFormat}
                    .size=${this.size}
                    ?staticPosition=${this.staticPosition}
                    caption="Select a start and end date."
                    style="width: 100%;"
                    @on-change=${(e) =>
                      action(e.type)({ ...e, detail: e.detail })}
                  ></kyn-date-range-picker>
                </div>
              </kyn-accordion-item>
            </kyn-accordion>
          </kyn-modal>
        </div>
      </kyn-widget>
    `;
  }
}

if (!customElements.get('example-modal-host')) {
  customElements.define('example-modal-host', ExampleModalHost);
}

/**
 * Example: a Date Range Picker nested inside an Accordion, inside a Modal,
 * all rendered inside a consumer's own shadow-DOM web component.
 *
 * This is the tricky composition that surfaced the calendar-styling issue and
 * validates the fix for it. Open the modal, expand "Lost Date", select a range,
 * apply/close the modal, then repeat the same sequence to confirm the calendar
 * remains fully styled on the second open.
 */
export default {
  title: 'Examples/Date Range Picker in Accordion in Modal',
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates a `kyn-date-range-picker` inside a `kyn-accordion-item`, inside a ' +
          '`kyn-modal`, all rendered within a consumer web component that has its own shadow ' +
          'root. This reproduces the nested shadow-DOM context where the Flatpickr calendar ' +
          'previously rendered unstyled. Validate both first-open and second-open behavior by ' +
          'opening the modal, expanding "Lost Date", selecting a range, applying/closing, then ' +
          'reopening and modifying the range.',
      },
    },
  },
  argTypes: {
    staticPosition: { control: { type: 'boolean' } },
    dateFormat: {
      options: ['Y-m-d', 'm-d-Y', 'd-m-Y'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    locale: { control: { type: 'text' } },
  },
};

export const DateRangePickerInAccordionInModal = {
  args: {
    staticPosition: true,
    dateFormat: 'Y-m-d',
    size: 'md',
    locale: 'en',
  },
  render: (args) => html`
    <example-modal-host
      ?staticPosition=${args.staticPosition}
      .dateFormat=${args.dateFormat}
      .size=${args.size}
      .locale=${args.locale}
    ></example-modal-host>
  `,
};
DateRangePickerInAccordionInModal.storyName =
  'Date Range Picker in Accordion in Modal';
