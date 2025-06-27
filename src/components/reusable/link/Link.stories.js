/**
 * Copyright Kyndryl, Inc. 2023
 */
import { html } from 'lit';
import { userEvent, expect, waitFor, fn } from 'storybook/test';
import { within } from 'shadow-dom-testing-library';

import './link';
import arrowRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import { LINK_TYPES, LINK_TARGETS } from './defs';
import { createOptionsArray } from '../../../common/helpers/helpers';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

const createSelectOptions = (defs) => [null, ...createOptionsArray(defs)];

export default {
  title: 'Components/Link',
  component: 'kyn-link',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-546100&p=f&m=dev',
    },
  },
  argTypes: {
    kind: {
      options: createSelectOptions(LINK_TYPES),
      control: { type: 'select', labels: { null: LINK_TYPES.PRIMARY } },
      table: {
        defaultValue: { summary: LINK_TYPES.PRIMARY },
      },
    },
    target: {
      options: createSelectOptions(LINK_TARGETS),
      control: { type: 'select', labels: { null: LINK_TARGETS.SELF } },
      table: {
        defaultValue: { summary: LINK_TARGETS.SELF },
      },
    },
    linkFontWeight: {
      options: ['default', 'lighter'],
      control: { type: 'select' },
    },
  },
};

const args = {
  unnamed: 'Link Text',
  href: '',
  target: '_self',
  kind: 'primary',
  disabled: false,
  standalone: false,
  iconLeft: false,
  linkFontWeight: 'default',
  'on-click': fn(),
};

const linkIconArgs = { ...args, standalone: true, sizeOverride: 16 };

// Inline link
export const Link = {
  args: args,
  render: (args) =>
    html`
      <kyn-link
        id="test"
        ?standalone=${args.standalone}
        href=${args.href}
        target=${args.target}
        kind=${args.kind}
        linkFontWeight=${args.linkFontWeight}
        ?disabled=${args.disabled}
        @on-click=${args['on-click']}
      >
        ${args.unnamed}
      </kyn-link>
    `,
  play: async ({ canvasElement }) => {
    // example interaction test
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByShadowRole('link'));
    await waitFor(() => expect(args['on-click']).toHaveBeenCalled());
    canvas.getByShadowRole('link').blur();
  },
};

// Standalone Link
export const LinkWithIcon = {
  args: linkIconArgs,
  render: (args) => html`
    <kyn-link
      id="test"
      ?standalone=${args.standalone}
      ?iconLeft=${args.iconLeft}
      href=${args.href}
      target=${args.target}
      kind=${args.kind}
      linkFontWeight=${args.linkFontWeight}
      ?disabled=${args.disabled}
      @on-click=${args['on-click']}
    >
      ${args.unnamed}
      <span
        slot="icon"
        role="img"
        aria-label="Arrow right icon"
        title="Arrow right icon"
        >${unsafeSVG(arrowRightIcon)}</span
      >
    </kyn-link>
  `,
};

// AI Link
export const LinkAISpecific = {
  args: {
    ...args,
    kind: 'ai',
  },
  render: (args) =>
    html`
      <kyn-link
        id="test"
        ?standalone=${args.standalone}
        href=${args.href}
        target=${args.target}
        kind=${args.kind}
        linkFontWeight=${args.linkFontWeight}
        ?disabled=${args.disabled}
        @on-click=${args['on-click']}
      >
        ${args.unnamed}
      </kyn-link>
    `,
};
