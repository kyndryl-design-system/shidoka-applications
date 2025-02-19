import { html } from 'lit';
import './index';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/user.svg';

export default {
  title: 'Components/List',
  component: 'kyn-list',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const unorderedList = {
  render: () => {
    return html`
      <kyn-list listType="unordered">
        <h3 slot="title">Unordered list</h3>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
      </kyn-list>
    `;
  },
};

export const orderedList = {
  render: () => {
    return html`
      <kyn-list listType="ordered">
        <h3 slot="title">Ordered list</h3>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </kyn-list>
    `;
  },
};

export const nestedList = {
  render: () => {
    return html`
      <kyn-list>
        <h3 slot="title">Nested list</h3>
        <li>Item 1</li>
        <li>Item 2</li>
        <kyn-list listType="ordered">
          <li>Item 2a</li>
          <li>Item 2b</li>
          <li>Item 2c</li>
        </kyn-list>
        <li>Item 3</li>
        <kyn-list>
          <li>Item 3a</li>
          <li>Item 3b</li>
          <li>Item 3c</li>
        </kyn-list>
      </kyn-list>
    `;
  },
};

export const unorderedListWithTitleIcon = {
  render: () => {
    return html`
      <kyn-list listType="unordered">
        <span slot="icon">${unsafeSVG(userIcon)}</span>
        <h3 slot="title">Unordered list with title icon</h3>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
      </kyn-list>
    `;
  },
};
