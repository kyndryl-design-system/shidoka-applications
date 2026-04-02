import { html } from 'lit';
import './index';

import '../card';
import '../metaData';
import { LinkWithIcon as Link } from '../link/Link.stories.js';

export default {
  title: 'Components/Layout & Structure/Divider',
  component: 'kyn-divider',
  argTypes: {
    vertical: { control: { type: 'boolean' } },
    dragHandle: { control: { type: 'boolean' } },
    decorative: { control: { type: 'boolean' } },
    resizeLabel: { control: { type: 'text' } },
    dragging: { control: { type: 'boolean' } },
    hideHairline: { control: { type: 'boolean' } },
    invertedHandle: {
      options: ['none', 'left', 'right'],
      control: { type: 'select' },
    },
    'drag-handle': { table: { disable: true } },
    'inverted-handle': { table: { disable: true } },
  },
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
    dragHandle: false,
    decorative: false,
    resizeLabel: 'Resize panels',
    dragging: false,
    hideHairline: false,
    invertedHandle: 'none',
  },
  render: (args) => {
    return html`
      <div
        style="${args.vertical ? 'height: 100px;' : ''}"
        class="${args.vertical ? 'v-align' : ''}"
      >
        <kyn-divider
          ?vertical=${args.vertical}
          ?drag-handle=${args.dragHandle}
          ?decorative=${args.decorative}
          resizeLabel=${args.resizeLabel}
          ?dragging=${args.dragging}
          ?hideHairline=${args.hideHairline}
          inverted-handle=${args.invertedHandle}
        ></kyn-divider>
      </div>
    `;
  },
};

export const Vertical = {
  parameters: { controls: { disable: true } },
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

export const VerticalDragHandle = {
  args: {
    dragHandle: true,
    decorative: true,
    resizeLabel: 'Resize panels',
    hideHairline: false,
    invertedHandle: 'none',
  },
  argTypes: {
    vertical: { table: { disable: true } },
    dragging: { table: { disable: true } },
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['new'],
  render: (args) => {
    const handlePointerDown = (e) => {
      if (e.button !== 0) return;
      const track = e.currentTarget.closest('.divider-drag-demo__layout');
      const paneA = track.querySelector('.divider-drag-demo__pane--a');
      const divider = track.querySelector('kyn-divider');
      const startX = e.clientX;
      const startWidth = paneA.getBoundingClientRect().width;

      divider.dragging = true;
      track.style.userSelect = 'none';
      track.style.cursor = 'ew-resize';

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {
        /* no-op */
      }

      const onMove = (ev) => {
        ev.preventDefault();
        const trackWidth = track.getBoundingClientRect().width;
        const min = 80;
        const max = trackWidth - 80 - 8;
        const next = Math.min(
          Math.max(min, startWidth + (ev.clientX - startX)),
          max
        );
        paneA.style.flexBasis = `${next}px`;
        paneA.style.flexGrow = '0';
      };

      const onUp = () => {
        divider.dragging = false;
        track.style.userSelect = '';
        track.style.cursor = '';
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    return html`
      <style>
        .divider-drag-demo {
          box-sizing: border-box;
          width: 100%;
          max-width: 1024px;
          margin: 0 auto;
          padding: var(--kd-spacing-24);
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
        <div class="divider-drag-demo__layout">
          <div class="divider-drag-demo__pane divider-drag-demo__pane--a">
            Pane A
          </div>
          <div
            class="divider-drag-demo__divider"
            role="separator"
            aria-orientation="vertical"
            aria-label=${args.resizeLabel}
            @pointerdown=${handlePointerDown}
          >
            <kyn-divider
              vertical
              ?drag-handle=${args.dragHandle}
              ?decorative=${args.decorative}
              resizeLabel=${args.resizeLabel}
              ?hideHairline=${args.hideHairline}
              inverted-handle=${args.invertedHandle}
            ></kyn-divider>
          </div>
          <div class="divider-drag-demo__pane">Pane B</div>
        </div>
      </div>
    `;
  },
};

export const HorizontalDragHandle = {
  args: {
    dragHandle: true,
    decorative: true,
    resizeLabel: 'Resize panels',
    hideHairline: false,
    invertedHandle: 'none',
  },
  argTypes: {
    vertical: { table: { disable: true } },
    dragging: { table: { disable: true } },
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => {
    const handlePointerDown = (e) => {
      if (e.button !== 0) return;
      const track = e.currentTarget.closest('.divider-drag-demo-h__layout');
      const paneA = track.querySelector('.divider-drag-demo-h__pane--a');
      const divider = track.querySelector('kyn-divider');
      const startY = e.clientY;
      const startHeight = paneA.getBoundingClientRect().height;

      divider.dragging = true;
      track.style.userSelect = 'none';
      track.style.cursor = 'ns-resize';

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {
        /* no-op */
      }

      const onMove = (ev) => {
        ev.preventDefault();
        const trackHeight = track.getBoundingClientRect().height;
        const min = 60;
        const max = trackHeight - 60 - 8;
        const next = Math.min(
          Math.max(min, startHeight + (ev.clientY - startY)),
          max
        );
        paneA.style.flexBasis = `${next}px`;
        paneA.style.flexGrow = '0';
      };

      const onUp = () => {
        divider.dragging = false;
        track.style.userSelect = '';
        track.style.cursor = '';
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    return html`
      <style>
        .divider-drag-demo-h {
          box-sizing: border-box;
          width: 100%;
          max-width: 1024px;
          margin: 0 auto;
          padding: var(--kd-spacing-24);
        }
        .divider-drag-demo-h__layout {
          min-height: min(560px, calc(100vh - 48px));
          display: flex;
          flex-direction: column;
          border: 1px solid var(--kd-color-border-level-secondary);
          border-radius: 8px;
          overflow: hidden;
          background: var(--kd-color-background-page-default);
        }
        .divider-drag-demo-h__pane {
          flex: 1 1 0;
          padding: var(--kd-spacing-16);
          font: var(--kd-font-body-01);
          color: var(--kd-color-text-level-secondary);
          box-sizing: border-box;
          min-height: 0;
        }
        .divider-drag-demo-h__divider {
          flex: 0 0 8px;
          min-height: 8px;
          cursor: ns-resize;
          background: transparent;
        }
      </style>
      <div class="divider-drag-demo-h">
        <div class="divider-drag-demo-h__layout">
          <div class="divider-drag-demo-h__pane divider-drag-demo-h__pane--a">
            Pane A
          </div>
          <div
            class="divider-drag-demo-h__divider"
            role="separator"
            aria-orientation="horizontal"
            aria-label=${args.resizeLabel}
            @pointerdown=${handlePointerDown}
          >
            <kyn-divider
              ?drag-handle=${args.dragHandle}
              ?decorative=${args.decorative}
              resizeLabel=${args.resizeLabel}
              ?hideHairline=${args.hideHairline}
              inverted-handle=${args.invertedHandle}
            ></kyn-divider>
          </div>
          <div class="divider-drag-demo-h__pane">Pane B</div>
        </div>
      </div>
    `;
  },
};

export const WithCard = {
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
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
