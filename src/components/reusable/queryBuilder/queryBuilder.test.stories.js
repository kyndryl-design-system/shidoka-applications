import { html } from 'lit';
import { expect } from 'storybook/test';

import './index';

export default {
  title: 'Tests/Components/Query Builder',
  component: 'kyn-query-builder',
  tags: ['!autodocs'],
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
};

const getRootGroup = async (el) => {
  await el.updateComplete;
  const group = el.shadowRoot.querySelector('kyn-qb-group');
  await group.updateComplete;
  return group;
};

const getGroupAddButtons = (group) =>
  Array.from(group.shadowRoot.querySelectorAll('kyn-button')).filter(
    (button) => button.textContent.trim() === 'Group'
  );

export const DefaultShowsGroupButton = {
  render: () => html`<kyn-query-builder></kyn-query-builder>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-query-builder');
    const group = await getRootGroup(el);

    expect(getGroupAddButtons(group)).toHaveLength(1);
  },
};

export const HideGroupBtnHidesGroupButton = {
  render: () =>
    html`<kyn-query-builder ?hideGroupBtn=${true}></kyn-query-builder>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-query-builder');
    const group = await getRootGroup(el);

    expect(getGroupAddButtons(group)).toHaveLength(0);
  },
};
