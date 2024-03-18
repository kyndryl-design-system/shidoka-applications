import { html } from 'lit';

import './globalFilter.sample';
import './globalFilter.chart.sample';

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

      This example shows a standalone Global Filter pattern. It will update the
      selected Tags automatically when changing checkbox selections. For
      client-side filtering, you may want to perform the filtering immediately
      on checkbox change. For server-side filtering, you may want to perform
      filtering on the modal close event instead. There are example event
      handler functions for each of the controls contained within.
    `;
  },
};

export const WithChart = {
  render: () => {
    return html`
      <sample-filter-chart-component></sample-filter-chart-component>

      <br />

      This example shows a Global Filter pattern applied to a Chart.
    `;
  },
};

export const WithTable = {
  render: () => {
    return html` To Do `;
  },
};
