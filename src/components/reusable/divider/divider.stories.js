import { html } from 'lit';
import './index';

import '../card';
import '../metaData';
import { LinkWithIcon as Link } from '../link/Link.stories.js';

export default {
  title: 'Components/Divider',
  component: 'kyn-divider',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/s1p6FZKFQEhywrgNNYfeJl/Biscuit-2.7?node-id=5-166321&m=dev',
    },
  },
  decorators: [
    (story) => html`
      <style>
        .text_label {
          color: var(--kd-color-text-level-secondary);
        }
        .value_text {
          color: var(--kd-color-text-level-primary);
        }
        .v-align {
          display: flex;
          align-items: center;
          height: 1.5rem;
          gap: 8px;
        }
        .h-align {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .margin-24 {
          margin: var(--kd-spacing-8) 0;
        }
      </style>
      ${story()}
    `,
  ],
};

export const Default = {
  args: {
    vertical: false,
  },
  render: (args) => {
    return args.vertical
      ? html`
          <div style="height: 100px;width:1px">
            <kyn-divider .vertical=${args.vertical}></kyn-divider>
          </div>
        `
      : html` <kyn-divider .vertical=${args.vertical}></kyn-divider> `;
  },
};

export const Vertical = {
  args: {
    vertical: true,
  },
  render: (args) => {
    return args.vertical
      ? html` <div class="v-align">
          One
          <kyn-divider .vertical=${args.vertical}></kyn-divider>
          Two
          <kyn-divider .vertical=${args.vertical}></kyn-divider>
          Three
        </div>`
      : html`<div class="h-align">
          One
          <kyn-divider .vertical=${args.vertical}></kyn-divider>
          Two
          <kyn-divider .vertical=${args.vertical}></kyn-divider>
          Three
        </div>`;
  },
};

export const WithCard = {
  render: () => {
    return html`
      <kyn-card style="width:300px" type="normal">
        <div style="display: flex; flex-direction: column;">
          <kyn-meta-data noBackground>
            <div slot="label" class="kd-type--ui-03 text_label">Title</div>
            <div class="kd-type--ui-02 value_text">Value text</div>
          </kyn-meta-data>
          <kyn-divider></kyn-divider>
          <kyn-meta-data noBackground>
            <div slot="label" class="kd-type--ui-03 text_label">Title</div>
            <div class="kd-type--ui-02 value_text">Value text</div>
          </kyn-meta-data>
          <kyn-divider></kyn-divider>
          <kyn-meta-data noBackground>
            <div slot="label" class="kd-type--ui-03 text_label">Title</div>
            <div class="kd-type--ui-02 value_text">Value text</div>
          </kyn-meta-data>
        </div>
      </kyn-card>
    `;
  },
};

export const WithFullPage = {
  render: () => {
    return html`
      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>
      </div>

      <kyn-divider class="margin-24"></kyn-divider>

      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>

        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-2">
          <kyn-meta-data noBackground>
            <div slot="label">Label</div>
            <div>${Link.render({ standalone: true, ...Link.args })}</div>
          </kyn-meta-data>
        </div>
      </div>
      <kyn-divider class="margin-24"></kyn-divider>
    `;
  },
};
