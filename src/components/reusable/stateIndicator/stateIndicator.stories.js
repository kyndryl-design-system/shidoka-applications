import { html } from 'lit';
import { action } from 'storybook/actions';
import './index';
import '../button';
import '../link';
import { STATE_TYPES, STATE_SIZES } from './defs';
import { createOptionsArray } from '../../../common/helpers/helpers';

export default {
  title: 'Components/Feedback & Status/State Indicator',
  component: 'kyn-state-indicator',
  tags: ['new'],
  argTypes: {
    type: {
      options: createOptionsArray(STATE_TYPES),
      control: { type: 'select' },
    },
    size: {
      options: createOptionsArray(STATE_SIZES),
      control: { type: 'select' },
    },
    header: {
      control: { type: 'text' },
    },
    unnamed: {
      control: { type: 'text' },
    },
    primary: {
      control: { type: 'text' },
    },
    secondary: {
      control: { type: 'text' },
    },
    link: {
      control: { type: 'text' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'State Indicator communicates a contextual state with an illustration, header, description, and call(s) to action.',
      },
    },
  },
};

const args = {
  type: STATE_TYPES.EMPTY,
  size: STATE_SIZES.LARGE,
  hideDescription: false,
  hideActionsBtn: false,
  header: 'State sample header',
  unnamed:
    'Additional information helps explain the current state and any actions that may be available.',
  primary: 'Primary',
  secondary: 'Secondary',
  link: 'Link',
};

const renderStateIndicator = (args) => {
  return html`
    <kyn-state-indicator
      type=${args.type}
      size=${args.size}
      ?hideDescription=${args.hideDescription}
      ?hideActionsBtn=${args.hideActionsBtn}
    >
      ${args.header ? html`<span slot="header">${args.header}</span>` : null}
      ${args.unnamed ? html`<span>${args.unnamed}</span>` : null}
      ${args.primary
        ? html`<kyn-button
            slot="primary"
            size="medium"
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            ${args.primary}
          </kyn-button>`
        : null}
      ${args.secondary
        ? html`<kyn-button
            slot="secondary"
            size="medium"
            kind="secondary"
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            ${args.secondary}
          </kyn-button>`
        : null}
      ${args.link
        ? html`<kyn-link
            slot="link"
            standalone
            href="#"
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            ${args.link}
          </kyn-link>`
        : null}
    </kyn-state-indicator>
  `;
};

export const Large = {
  args: {
    ...args,
    size: STATE_SIZES.LARGE,
    type: STATE_TYPES.ERROR,
  },
  render: renderStateIndicator,
};

// `sleep` is only supported on `large`; offer the remaining types as options
// for the `medium` / `small` controls.
const nonSleepTypes = createOptionsArray(STATE_TYPES).filter(
  (type) => type !== STATE_TYPES.SLEEP
);

export const Medium = {
  args: {
    ...args,
    size: STATE_SIZES.MEDIUM,
    type: STATE_TYPES.NO_RESULTS,
  },
  argTypes: {
    type: { options: nonSleepTypes, control: { type: 'select' } },
  },
  render: renderStateIndicator,
};

export const Small = {
  args: {
    ...args,
    size: STATE_SIZES.SMALL,
    type: STATE_TYPES.ERROR,
  },
  argTypes: {
    type: { options: nonSleepTypes, control: { type: 'select' } },
  },
  render: renderStateIndicator,
};

// Story-only floor for the illustration area per size so every cell in a row
// aligns its header / description / CTAs (mascots have differing intrinsic
// heights). Applied via the `visual` part rather than baked into the component.
const GALLERY_VISUAL_MIN_HEIGHT = {
  [STATE_SIZES.LARGE]: '260px',
  [STATE_SIZES.MEDIUM]: '184px',
  [STATE_SIZES.SMALL]: '72px',
};

export const Gallery = {
  parameters: { controls: { disable: true } },
  render: () => {
    const types = createOptionsArray(STATE_TYPES);
    const sizes = createOptionsArray(STATE_SIZES);
    return html`
      <style>
        .state-indicator-gallery {
          display: flex;
          flex-direction: column;
          gap: 160px;
        }
        .state-indicator-gallery__grid {
          row-gap: 80px;
        }
        .state-indicator-gallery__cell {
          display: flex;
        }
        .state-indicator-gallery__cell kyn-state-indicator {
          align-self: stretch;
        }
        .state-indicator-gallery__grid[data-size='large']
          kyn-state-indicator::part(visual) {
          min-height: ${GALLERY_VISUAL_MIN_HEIGHT[STATE_SIZES.LARGE]};
        }
        .state-indicator-gallery__grid[data-size='medium']
          kyn-state-indicator::part(visual) {
          min-height: ${GALLERY_VISUAL_MIN_HEIGHT[STATE_SIZES.MEDIUM]};
        }
        .state-indicator-gallery__grid[data-size='small']
          kyn-state-indicator::part(visual) {
          min-height: ${GALLERY_VISUAL_MIN_HEIGHT[STATE_SIZES.SMALL]};
        }
      </style>
      <div class="state-indicator-gallery">
        ${sizes.map(
          (size) => html`
            <div>
              <div
                class="kd-type--headline-08"
                style="margin-bottom: var(--kd-spacing-16); text-transform: capitalize;"
              >
                ${size}
              </div>
              <div
                class="state-indicator-gallery__grid kd-grid kd-grid--no-max kd-grid--align-left"
                data-size=${size}
              >
                ${(size === STATE_SIZES.LARGE
                  ? types
                  : types.filter((type) => type !== STATE_TYPES.SLEEP)
                ).map(
                  (type) => html`
                    <div
                      class="state-indicator-gallery__cell kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4"
                    >
                      <kyn-state-indicator type=${type} size=${size}>
                        <span slot="header">${type}</span>
                        <span
                          >Additional information helps explain the current
                          state.</span
                        >
                        <kyn-button slot="primary" size="medium"
                          >Primary</kyn-button
                        >
                        <kyn-button
                          slot="secondary"
                          size="medium"
                          kind="secondary"
                          >Secondary</kyn-button
                        >
                        <kyn-link slot="link" standalone href="#"
                          >Link</kyn-link
                        >
                      </kyn-state-indicator>
                    </div>
                  `
                )}
              </div>
            </div>
          `
        )}
      </div>
    `;
  },
};
