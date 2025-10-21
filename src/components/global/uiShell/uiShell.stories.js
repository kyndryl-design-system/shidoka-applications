import { html } from 'lit';
import './index';
import '../footer';
import '../header';
import '../localNav';
import '../../reusable/table';

import { LocalNav } from '../localNav/localNav.stories.js';
import {
  Header,
  WithEverything as HeaderWithEverything,
} from '../header/Header.stories.js';
import { WithLinks as FooterWithLinks } from '../footer/footer.stories';
import { Basic as BasicTable } from '../../reusable/table/table.stories.js';
import { PageTitle } from '../../reusable/pagetitle/pageTitle.stories.js';

export default {
  title: 'Global Components/UI Shell',
  component: 'kyn-ui-shell',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  decorators: [
    (story) =>
      html`
        <div style="margin: var(--kd-negative-page-gutter);">${story()}</div>
      `,
  ],
};

export const UIShell = {
  render: () => html`
    <kyn-ui-shell>
      ${Header.render({ ...Header.args })}

      <main>Main content here.</main>

      ${FooterWithLinks.render({ ...FooterWithLinks.args })}
    </kyn-ui-shell>
  `,
};

export const WithLocalNav = {
  render: () => html`
    <kyn-ui-shell>
      ${Header.render({ ...Header.args })}
      ${LocalNav.render({ ...LocalNav.args })}

      <main>Main content here.</main>

      ${FooterWithLinks.render({ ...FooterWithLinks.args })}
    </kyn-ui-shell>
  `,
};

export const WithEverything = {
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: () => {
    return html`
      <kyn-ui-shell>
        ${HeaderWithEverything.render({ ...HeaderWithEverything.args })}
        ${LocalNav.render({ ...LocalNav.args })}

        <main>
          ${PageTitle.render({ ...PageTitle.args })}
          <br />
          ${BasicTable.render({ ...BasicTable.args })}
        </main>

        ${FooterWithLinks.render({ ...FooterWithLinks.args })}
      </kyn-ui-shell>
    `;
  },
};
