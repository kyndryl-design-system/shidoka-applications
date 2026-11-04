/**
 * Copyright Kyndryl, Inc. 2023
 */
import { html } from 'lit';
import { userEvent, expect, waitFor, fn } from 'storybook/test';
import { within } from 'shadow-dom-testing-library';

import './link';
import arrowRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import { LINK_TYPES, LINK_TARGETS, LINK_SIZES } from './defs';
import { createOptionsArray } from '../../../common/helpers/helpers';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

const createSelectOptions = (defs) => [null, ...createOptionsArray(defs)];

export default {
  title: 'Components/Navigation/Link',
  component: 'kyn-link',
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
    size: {
      description:
        'Controls link text typography only. When omitted, text inherits from context. Consumers must size slotted icons to 16px for `lg`, 14px for `md`, and 12px for `sm`; Link does not resize icons.',
      options: [...createOptionsArray(LINK_SIZES), undefined],
      control: 'select',
      table: {
        defaultValue: { summary: 'undefined (inherited)' },
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
  size: undefined,
  disabled: false,
  standalone: false,
  iconLeft: false,
  linkFontWeight: 'default',
  animationInactive: false,
  truncate: false,
  'on-click': fn(),
};

const linkIconArgs = { ...args, standalone: true };

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
        size=${args.size}
        linkFontWeight=${args.linkFontWeight}
        ?disabled=${args.disabled}
        ?truncate=${args.truncate}
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
  argTypes: {
    size: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Each example sets the SVG dimensions in consumer CSS: 16px for `lg`, 14px for `md`, and 12px for `sm`. Link controls text typography only.',
      },
    },
  },
  render: (args) => html`
    <style>
      .link-icon-examples [slot='icon'] svg {
        width: 100%;
        height: 100%;
      }
    </style>
    <div
      class="link-icon-examples"
      style="display: flex; flex-direction: column; align-items: flex-start; gap: var(--kd-spacing-16);"
    >
      ${[
        { size: LINK_SIZES.LARGE, iconSize: 16 },
        { size: LINK_SIZES.MEDIUM, iconSize: 14 },
        { size: LINK_SIZES.SMALL, iconSize: 12 },
      ].map(
        ({ size, iconSize }) => html`
          <kyn-link
            ?standalone=${args.standalone}
            ?iconLeft=${args.iconLeft}
            ?animationInactive=${args.animationInactive}
            ?truncate=${args.truncate}
            href=${args.href}
            target=${args.target}
            kind=${args.kind}
            size=${size}
            linkFontWeight=${args.linkFontWeight}
            ?disabled=${args.disabled}
            @on-click=${args['on-click']}
          >
            ${args.unnamed} (${size})
            <span
              slot="icon"
              role="img"
              aria-label="Arrow right icon"
              title="Arrow right icon"
              style="width: ${iconSize}px; height: ${iconSize}px;"
              >${unsafeSVG(arrowRightIcon)}</span
            >
          </kyn-link>
        `
      )}
    </div>
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
        size=${args.size}
        linkFontWeight=${args.linkFontWeight}
        ?disabled=${args.disabled}
        ?truncate=${args.truncate}
        @on-click=${args['on-click']}
      >
        ${args.unnamed}
      </kyn-link>
    `,
};
