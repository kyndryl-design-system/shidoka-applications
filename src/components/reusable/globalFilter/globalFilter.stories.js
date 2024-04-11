import { html } from 'lit';

import './globalFilter.sample';
import './globalFilter.chart.sample';
import './globalFilter.table.sample';

export default {
  title: 'Patterns/Global Filter',
  component: 'kyn-global-filter',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=3101%3A467&mode=dev',
    },
  },
};

export const GlobalFilter = {
  render: () => {
    return html`
      <sample-filter-component></sample-filter-component>

      <br />

      <p>
        This example shows a standalone Global Filter pattern. It will update
        the selected Tags automatically when changing checkbox selections. For
        client-side filtering, you may want to perform the filtering immediately
        on checkbox change. For server-side filtering, you may want to perform
        filtering on the modal close event instead. There are example event
        handler functions for each of the controls contained within.
      </p>

      <br />

      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/components/reusable/globalFilter/globalFilter.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
};

export const WithChart = {
  parameters: {
    a11y: {
      // disable violations flagged in chartjs-plugin-a11y-legend
      config: {
        rules: [
          {
            id: 'aria-toggle-field-name',
            enabled: false,
          },
          {
            id: 'aria-required-parent',
            enabled: false,
          },
        ],
      },
    },
  },
  render: () => {
    return html`
      <sample-filter-chart-component></sample-filter-chart-component>

      <br />

      <p>This example shows a Global Filter pattern applied to a Chart.</p>

      <br />

      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/components/reusable/globalFilter/globalFilter.chart.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
};

export const WithTable = {
  render: () => {
    return html`
      <sample-filter-table-component></sample-filter-table-component>
      <br />

      <p>This example shows a Global Filter pattern applied to a Table.</p>

      <br />

      <a
        href="https://github.com/kyndryl-design-system/shidoka-applications/blob/main/src/components/reusable/globalFilter/globalFilter.table.sample.ts"
        target="_blank"
        rel="noopener"
      >
        See the full example component code here.
      </a>
    `;
  },
};
