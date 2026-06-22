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
  showSecondaryAction: true,
  showDescription: true,
  showCTA: true,
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
      ?showSecondaryAction=${args.showSecondaryAction}
      ?showDescription=${args.showDescription}
      ?showCTA=${args.showCTA}
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
    showSecondaryAction: true,
  },
  render: renderStateIndicator,
};

export const Medium = {
  args: {
    ...args,
    size: STATE_SIZES.MEDIUM,
    type: STATE_TYPES.NO_RESULTS,
    showSecondaryAction: true,
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
    showSecondaryAction: { control: false },
  },
  render: renderStateIndicator,
};
