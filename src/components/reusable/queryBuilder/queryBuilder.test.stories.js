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

/**
 * Date fields opt into valueFormat="dateFormat" so rule values stay calendar
 * strings (e.g. 2026-06-01) instead of timezone-shifted ISO instants.
 */
export const DateRuleEmitsCalendarDateString = {
  render: () => html`
    <kyn-query-builder
      .fields=${[{ name: 'birthDate', label: 'Birth Date', dataType: 'date' }]}
      .query=${{
        id: 'root',
        combinator: 'and',
        rules: [
          {
            id: 'rule-1',
            field: 'birthDate',
            operator: 'equal',
            value: '',
          },
        ],
      }}
    ></kyn-query-builder>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-query-builder');
    const group = await getRootGroup(el);
    const rule = group.shadowRoot.querySelector('kyn-qb-rule');
    await rule.updateComplete;

    const picker = rule.shadowRoot.querySelector('kyn-date-picker');
    expect(picker).toBeTruthy();
    await picker.updateComplete;
    expect(picker.valueFormat).toBe('dateFormat');

    const queryPromise = new Promise((resolve) => {
      el.addEventListener('on-query-change', (e) => resolve(e.detail.query), {
        once: true,
      });
    });

    await picker.handleDateChange([new Date(2026, 5, 1)], '2026-06-01');
    const query = await queryPromise;
    const dateRule = query.rules.find((r) => r.field === 'birthDate');

    expect(dateRule?.value).toBe('2026-06-01');
    expect(String(dateRule?.value)).not.toMatch(/T/);
  },
};
