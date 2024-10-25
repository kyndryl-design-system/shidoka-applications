import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';

import './index';
import '../tooltip';

import informationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';

export default {
  title: 'Components/Progress Bar',
  component: 'kyn-progress-bar',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/AIX4LLzoDHnFCXzQCiPHJk/Vienna?node-id=4308-129&node-type=canvas&t=NIQViMjgDrgdLGdi-0',
    },
  },
  argTypes: {
    showInlineLoadStatus: { control: 'boolean' },
    value: { control: 'number' },
    max: { control: 'number' },
    showActiveHelperText: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['active', 'success', 'error'],
    },
  },
};

const Template = (args) => html`
  <kyn-progress-bar
    .showInlineLoadStatus=${args.showInlineLoadStatus}
    .showActiveHelperText=${args.showActiveHelperText}
    .status=${args.status}
    .value=${args.value}
    .max=${args.max}
    .label=${args.label}
    .progressBarId=${args.progressBarId}
    .helperText=${args.helperText}
    .unit=${args.unit}
    unnamed=${args.unnamed}
    .hideLabel=${args.hideLabel}
  >
    ${args.unnamed
      ? html`<kyn-tooltip slot="unnamed">
          <span slot="anchor"
            ><span class="info-icon">${unsafeSVG(informationIcon)}</span></span
          >
          ${args.unnamed}
        </kyn-tooltip>`
      : ''}
  </kyn-progress-bar>
`;

export const Default = Template.bind({});
Default.args = {
  showInlineLoadStatus: true,
  showActiveHelperText: true,
  status: 'active',
  value: 65,
  max: 100,
  label: 'Default Progress Bar (Fixed % Value)',
  helperText: 'Optional helper text.',
  progressBarId: 'example-progress-bar',
  unit: '%',
  unnamed: 'Example tooltip content.',
  hideLabel: false,
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  ...Default.args,
  showActiveHelperText: false,
  value: null,
  max: null,
  helperText: '',
  label: 'Indeterminate Progress Bar',
  unnamed: '',
  hideLabel: false,
};

export const SimulatedSuccess = Template.bind({});
SimulatedSuccess.args = {
  ...Default.args,
  showInlineLoadStatus: true,
  status: 'active',
  value: null,
  max: 650,
  label: 'Simulated Successful Progression (MB)',
  helperText: '',
  unit: 'MB',
  unnamed: '',
  hideLabel: false,
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  status: 'error',
  label: 'Error Progress Bar',
  helperText: 'Error: Operation failed.',
  value: 22,
  hideLabel: false,
};
