import { html } from 'lit';
import { expect, waitFor } from 'storybook/test';

import './index';
import '../button';
import '../link';
import { STATE_TYPES, STATE_SIZES } from './defs';

export default {
  title: 'Tests/Components/State Indicator',
  component: 'kyn-state-indicator',
  tags: ['!autodocs'],
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
};

const content = html`
  <span slot="header">State sample header</span>
  <span>Description text.</span>
  <kyn-button slot="primary" size="medium">Primary</kyn-button>
  <kyn-button slot="secondary" size="medium" kind="secondary"
    >Secondary</kyn-button
  >
  <kyn-link slot="link" standalone href="#">Link</kyn-link>
`;

const getAssignedTo = (el, slotName) => {
  const selector = slotName ? `slot[name="${slotName}"]` : 'slot:not([name])';
  const slot = el.shadowRoot.querySelector(selector);
  return slot ? slot.assignedElements() : [];
};

export const LargeShowsBothCtas = {
  render: () => html`
    <kyn-state-indicator type=${STATE_TYPES.ERROR} size=${STATE_SIZES.LARGE}
      >${content}</kyn-state-indicator
    >
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-state-indicator');
    await el.updateComplete;

    expect(getAssignedTo(el, 'primary')).toHaveLength(1);
    expect(getAssignedTo(el, 'secondary')).toHaveLength(1);
    // The link slot is not rendered on the large size.
    expect(el.shadowRoot.querySelector('slot[name="link"]')).toBeNull();
    // Decorative illustration is hidden from assistive tech.
    expect(
      el.shadowRoot
        .querySelector('.state-indicator__visual')
        .getAttribute('aria-hidden')
    ).toBe('true');
    await waitFor(() => {
      expect(
        el.shadowRoot
          .querySelector('.state-indicator__actions')
          .hasAttribute('hidden')
      ).toBe(false);
    });
  },
};

export const MediumShowsLink = {
  render: () => html`
    <kyn-state-indicator
      type=${STATE_TYPES.NO_RESULTS}
      size=${STATE_SIZES.MEDIUM}
      >${content}</kyn-state-indicator
    >
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-state-indicator');
    await el.updateComplete;

    expect(getAssignedTo(el, 'primary')).toHaveLength(1);
    expect(getAssignedTo(el, 'link')).toHaveLength(1);
    // The secondary button slot is not rendered on the medium size.
    expect(el.shadowRoot.querySelector('slot[name="secondary"]')).toBeNull();
  },
};

export const SmallIsPrimaryOnly = {
  render: () => html`
    <kyn-state-indicator type=${STATE_TYPES.ERROR} size=${STATE_SIZES.SMALL}
      >${content}</kyn-state-indicator
    >
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-state-indicator');
    await el.updateComplete;

    expect(getAssignedTo(el, 'primary')).toHaveLength(1);
    // Secondary actions are size-specific; small only renders the primary slot.
    expect(el.shadowRoot.querySelector('slot[name="secondary"]')).toBeNull();
    expect(el.shadowRoot.querySelector('slot[name="link"]')).toBeNull();
  },
};

export const NoCtasHidesActionWrapper = {
  render: () => html`
    <kyn-state-indicator type=${STATE_TYPES.EMPTY} size=${STATE_SIZES.LARGE}>
      <span slot="header">State sample header</span>
      <span>Description text.</span>
    </kyn-state-indicator>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-state-indicator');
    await el.updateComplete;

    expect(
      el.shadowRoot
        .querySelector('.state-indicator__actions')
        .hasAttribute('hidden')
    ).toBe(true);
  },
};

export const HideDescriptionAndCtas = {
  render: () => html`
    <kyn-state-indicator
      type=${STATE_TYPES.EMPTY}
      size=${STATE_SIZES.LARGE}
      ?hideDescription=${true}
      ?hideActionsBtn=${true}
      >${content}</kyn-state-indicator
    >
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-state-indicator');
    await el.updateComplete;

    expect(
      el.shadowRoot.querySelector('.state-indicator__description')
    ).toBeNull();
    expect(el.shadowRoot.querySelector('.state-indicator__actions')).toBeNull();
    // Header is unaffected.
    expect(getAssignedTo(el, 'header')).toHaveLength(1);
  },
};
