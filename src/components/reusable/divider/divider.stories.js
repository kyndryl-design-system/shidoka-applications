import { html } from 'lit';
import './index';

import '../card';
import '../metaData';
import { LinkWithIcon as Link } from '../link/Link.stories.js';

export default {
  title: 'Components/Layout & Structure/Divider',
  component: 'kyn-divider',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4550-7394&p=f&m=dev',
    },
  },
  decorators: [
    (story) => html`
      <style>
        .v-align {
          display: flex;
          gap: var(--kd-spacing-8);
        }
        .card-container {
          display: flex;
          flex-direction: column;
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
          <div style="height: 100px;" class="v-align">
            <kyn-divider vertical></kyn-divider>
          </div>
        `
      : html` <kyn-divider .vertical=${args.vertical}></kyn-divider> `;
  },
};

export const Vertical = {
  render: () => {
    return html` <div class="v-align">
      One
      <kyn-divider vertical></kyn-divider>
      Two
      <kyn-divider vertical></kyn-divider>
      Three
    </div>`;
  },
};

/** Visual drag-handle pattern composition. Resize behavior is owned by consuming layouts. */
export const VerticalDragHandle = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    return html`
      <style>
        .divider-drag-demo {
          box-sizing: border-box;
          width: 100%;
          max-width: 1024px;
          margin: 0 auto;
          padding: var(--kd-spacing-24);
        }
        .divider-drag-demo__intro {
          font: var(--kd-font-body-01);
          color: var(--kd-color-text-level-secondary);
          margin: 0 0 var(--kd-spacing-16);
          max-width: 72ch;
        }
        .divider-drag-demo__intro a {
          color: var(--kd-color-text-link-level-default);
          text-decoration: underline;
        }
        .divider-drag-demo__intro a:hover {
          color: var(--kd-color-text-link-level-hover);
        }
        .divider-drag-demo__layout {
          min-height: min(560px, calc(100vh - 48px));
          display: flex;
          border: 1px solid var(--kd-color-border-level-secondary);
          border-radius: 8px;
          overflow: hidden;
          background: var(--kd-color-background-page-default);
        }
        .divider-drag-demo__pane {
          flex: 1 1 0;
          padding: var(--kd-spacing-16);
          font: var(--kd-font-body-01);
          color: var(--kd-color-text-level-secondary);
          box-sizing: border-box;
          min-height: 0;
        }
        .divider-drag-demo__divider {
          flex: 0 0 8px;
          min-width: 8px;
          cursor: ew-resize;
          background: transparent;
          display: flex;
        }
        .divider-drag-demo__divider kyn-divider {
          width: 100%;
          height: 100%;
        }
      </style>
      <div class="divider-drag-demo">
        <p class="divider-drag-demo__intro">
          Example layout composition using a vertical divider with drag-handle
          affordance.
        </p>
        <div class="divider-drag-demo__layout">
          <div class="divider-drag-demo__pane">Pane A</div>
          <div class="divider-drag-demo__divider" aria-hidden="true">
            <kyn-divider
              vertical
              drag-handle
              decorative
              hideHairline
            ></kyn-divider>
          </div>
          <div class="divider-drag-demo__pane">Pane B</div>
        </div>
      </div>
    `;
  },
};

export const WithCard = {
  render: () => {
    return html`
      <kyn-card style="width:300px" type="normal">
        <div class="card-container">
          <kyn-meta-data noBackground>
            <div slot="label">Title</div>
            <div>Value text</div>
          </kyn-meta-data>
          <kyn-divider></kyn-divider>
          <kyn-meta-data noBackground>
            <div slot="label">Title</div>
            <div>Value text</div>
          </kyn-meta-data>
          <kyn-divider></kyn-divider>
          <kyn-meta-data noBackground>
            <div slot="label">Title</div>
            <div>Value text</div>
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

      <kyn-divider
        class="kd-spacing--margin-top-24 kd-spacing--margin-bottom-16"
      ></kyn-divider>

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
      <kyn-divider class="kd-spacing--margin-top-24"></kyn-divider>
    `;
  },
};
