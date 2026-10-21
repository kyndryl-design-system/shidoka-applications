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
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
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

/**
 * Optional per-option `disabled` on QueryField / QueryOption is forwarded to
 * kyn-dropdown-option. Disabled options stay in the list but cannot be selected.
 */
export const DisabledOptionsIllustrated = {
  render: () => html`
    <kyn-query-builder
      .fields=${[
        { name: 'firstName', label: 'First Name', dataType: 'text' },
        {
          name: 'legacyId',
          label: 'Legacy ID',
          dataType: 'text',
          disabled: true,
        },
        {
          name: 'status',
          label: 'Status',
          dataType: 'select',
          values: [
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived', disabled: true },
            { value: 'pending', label: 'Pending' },
          ],
        },
      ]}
      .query=${{
        id: 'root',
        combinator: 'and',
        rules: [
          {
            id: 'rule-1',
            field: 'status',
            operator: 'equal',
            value: 'active',
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

    const fieldDropdown = rule.shadowRoot.querySelector('.qb-rule__field');
    expect(fieldDropdown).toBeTruthy();
    await fieldDropdown.updateComplete;

    const fieldOptions = Array.from(
      fieldDropdown.querySelectorAll('kyn-dropdown-option')
    );
    const legacyOption = fieldOptions.find((opt) => opt.value === 'legacyId');
    const firstNameOption = fieldOptions.find(
      (opt) => opt.value === 'firstName'
    );

    expect(legacyOption).toBeTruthy();
    expect(legacyOption.disabled).toBe(true);
    const legacyInner =
      legacyOption.shadowRoot?.querySelector('[role="option"]');
    expect(legacyInner?.getAttribute('aria-disabled')).toBe('true');
    expect(firstNameOption.disabled).toBe(false);

    const valueDropdown = rule.shadowRoot.querySelector('.qb-rule__value');
    expect(valueDropdown).toBeTruthy();
    await valueDropdown.updateComplete;

    const valueOptions = Array.from(
      valueDropdown.querySelectorAll('kyn-dropdown-option')
    );
    const archivedOption = valueOptions.find((opt) => opt.value === 'archived');
    expect(archivedOption).toBeTruthy();
    expect(archivedOption.disabled).toBe(true);

    const queryPromise = new Promise((resolve) => {
      el.addEventListener('on-query-change', (e) => resolve(e.detail.query), {
        once: true,
      });
    });

    fieldDropdown.dispatchEvent(
      new CustomEvent('on-change', {
        detail: { value: 'firstName' },
        bubbles: true,
        composed: true,
      })
    );

    const query = await queryPromise;
    const updatedRule = query.rules.find((r) => r.id === 'rule-1');
    expect(updatedRule?.field).toBe('firstName');
  },
};
