import { html } from 'lit';
import './index';

export default {
  title: 'Components/Page Heading',
  component: 'kyn-page-heading',
};

const args = {
  unnamed: 'Page Heading',
  description: 'Description Text',
};

export const PageHeading = {
  args,
  render: (args) => {
    return html`
      <kyn-page-heading>
        <h1>${args.unnamed}</h1>
      </kyn-page-heading>
    `;
  },
};

export const WithDescription = {
  args,
  render: (args) => {
    return html`
      <kyn-page-heading>
        <h1>${args.unnamed}</h1>
        <span slot="description">${args.description}</span>
      </kyn-page-heading>
    `;
  },
};
