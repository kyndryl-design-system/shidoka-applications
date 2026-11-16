import { html } from 'lit';
import { expect } from 'storybook/test';
import './index';

export default {
  title: 'Tests/Components/Meta Data',
  component: 'kyn-meta-data',
  tags: ['!autodocs'],
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
};

const flushRows = [
  { label: 'Last detected', value: '4 Aug 2026, 13:48' },
  { label: 'Failed checks while open', value: '777,6' },
  { label: 'Last data update', value: '6 May 2026' },
  { label: 'Account', value: 'ACME' },
];

const getContainer = (el) => el.shadowRoot.querySelector('.meta-container');

export const DefaultHasContainerPadding = {
  name: 'Default has container padding',
  render: () => html`
    <div style="max-width: 360px;">
      <kyn-meta-data>
        <div slot="label">Last detected</div>
        <div>4 Aug 2026, 13:48</div>
      </kyn-meta-data>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-meta-data');
    await el.updateComplete;
    const container = getContainer(el);
    expect(container.classList.contains('no-padding')).toBe(false);
    expect(getComputedStyle(container).paddingTop).toBe('16px');
    expect(getComputedStyle(container).paddingRight).toBe('16px');
    expect(getComputedStyle(container).paddingBottom).toBe('16px');
    expect(getComputedStyle(container).paddingLeft).toBe('16px');
  },
};

export const NoPaddingRemovesContainerPadding = {
  name: 'noPadding removes container padding',
  render: () => html`
    <div style="max-width: 360px;">
      <kyn-meta-data noPadding>
        <div slot="label">Last detected</div>
        <div>4 Aug 2026, 13:48</div>
      </kyn-meta-data>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('kyn-meta-data');
    await el.updateComplete;
    const container = getContainer(el);
    expect(container.classList.contains('no-padding')).toBe(true);
    expect(getComputedStyle(container).paddingTop).toBe('0px');
    expect(getComputedStyle(container).paddingRight).toBe('0px');
    expect(getComputedStyle(container).paddingBottom).toBe('0px');
    expect(getComputedStyle(container).paddingLeft).toBe('0px');
  },
};

export const HorizontalFlushComposition = {
  name: 'Horizontal flush composition (UX)',
  render: () => html`
    <div
      style="max-width: 360px; display: flex; flex-direction: column; gap: 8px;"
    >
      ${flushRows.map(
        (row) => html`
          <kyn-meta-data horizontal noBackground noPadding>
            <div slot="label">${row.label}</div>
            <div style="text-align: right;">${row.value}</div>
          </kyn-meta-data>
        `
      )}
    </div>
  `,
  play: async ({ canvasElement }) => {
    const items = [...canvasElement.querySelectorAll('kyn-meta-data')];
    expect(items).toHaveLength(flushRows.length);

    for (const el of items) {
      await el.updateComplete;
      expect(el.horizontal).toBe(true);
      expect(el.noBackground).toBe(true);
      expect(el.noPadding).toBe(true);

      const container = getContainer(el);
      expect(container.classList.contains('no-background')).toBe(true);
      expect(container.classList.contains('no-padding')).toBe(true);
      expect(getComputedStyle(container).paddingTop).toBe('0px');
      expect(getComputedStyle(container).paddingRight).toBe('0px');
      expect(getComputedStyle(container).paddingBottom).toBe('0px');
      expect(getComputedStyle(container).paddingLeft).toBe('0px');
      expect(getComputedStyle(container).backgroundColor).toBe(
        'rgba(0, 0, 0, 0)'
      );

      const wrapper = el.shadowRoot.querySelector('.meta-wrapper');
      expect(wrapper.classList.contains('horizontal-align')).toBe(true);
    }
  },
};
