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
  argTypes: {
    type: {
      options: createOptionsArray(STATE_TYPES),
      control: { type: 'select' },
    },
    size: {
      options: createOptionsArray(STATE_SIZES),
      control: { type: 'select' },
    },
    // Content is driven by the *Text args below; hide the raw slot rows.
    header: { control: false, table: { disable: true } },
    unnamed: { control: false, table: { disable: true } },
    primary: { control: false, table: { disable: true } },
    secondary: { control: false, table: { disable: true } },
    link: { control: false, table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          '> **Note:** This component is referred to as the "State Pattern" in Figma.',
      },
    },
  },
};

const args = {
  type: STATE_TYPES.EMPTY,
  size: STATE_SIZES.LARGE,
  hideDescription: false,
  hideCtas: false,
  headerText: 'State sample header',
  description:
    'Additional information helps explain the current state and any actions that may be available.',
  primaryText: 'Primary',
  secondaryText: 'Secondary',
  linkText: 'Link',
};

const renderStateIndicator = (args) => {
  return html`
    <kyn-state-indicator
      type=${args.type}
      size=${args.size}
      ?hideDescription=${args.hideDescription}
      ?hideCtas=${args.hideCtas}
    >
      <span slot="header">${args.headerText}</span>
      <span>${args.description}</span>
      <kyn-button
        slot="primary"
        size="medium"
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.primaryText}
      </kyn-button>
      <kyn-button
        slot="secondary"
        size="medium"
        kind="secondary"
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.secondaryText}
      </kyn-button>
      <kyn-link
        slot="link"
        standalone
        href="#"
        @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        ${args.linkText}
      </kyn-link>
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
