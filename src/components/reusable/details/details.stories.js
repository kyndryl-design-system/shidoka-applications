import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions'; // used to log an action in storybook

export default {
  title: 'Components/Details', // component name
  component: 'kyn-details', // custom element tag name
  parameters: {
    design: {
      type: 'figma',
      url: '', // figma reference link
    },
  },
};

const args = {
  summary: 'Click to view details',
  details: [
    'Get GitHub access.',
    'Clone the repos and run locally',
    'Spend some time reviewing Lit docs and tutorials.',
    'Look into Storybook docs if you are not already familiar',
    'Observe how the JSDoc comments are converted into Storybook documentation.',
    'Try creating a sample component in Applications.',
    'I pushed up a component template that may help.',
    'Any extra time, take a look at Chart.js docs for Shidoka Charts.',
  ],
};

export const Component = {
  args,
  render: (args) => {
    console.log('render : args', args);
    return html`<kyn-details
      summary=${args.summary}
      .details=${args.details}
    ></kyn-details>`;
  },
};
