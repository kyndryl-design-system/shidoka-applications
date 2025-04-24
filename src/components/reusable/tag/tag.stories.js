import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';

export default {
  title: 'Components/Tag',
  component: 'kyn-tag',
  argTypes: {
    tagSize: {
      options: ['sm', 'md'],
      control: { type: 'select' },
    },
    tagColor: {
      options: ['default', 'spruce', 'sea', 'lilac', 'ai'],
      control: { type: 'select' },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    filter: {
      control: {
        type: 'boolean',
      },
    },
    clickable: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/rC5XdRnXVbDmu3vPN8tJ4q/2.1-Edinburgh?node-id=4068-5127&p=f&t=zD5Z2mgIhkDeoPnr-0',
    },
  },
};

const args = {
  label: 'Tag Example',
  tagSize: 'md',
  tagColor: 'spruce',
  clickable: false,
  filter: false,
  noTruncation: false,
  disabled: false,
};

export const Tag = {
  args,
  render: (args) => {
    return html`
      <kyn-tag
        label=${args.label}
        tagSize=${args.tagSize}
        tagColor=${args.tagColor}
        ?disabled=${args.disabled}
        ?filter=${args.filter}
        ?clickable=${args.clickable}
        ?noTruncation=${args.noTruncation}
        @on-close=${(e) => action(e.type)(e)}
        @on-click=${(e) => action(e.type)(e)}
      /></kyn-tag>
    `;
  },
};

export const TagWithIcon = {
  args,
  render: (args) => {
    return html`
      <kyn-tag
        label=${args.label}
        tagSize=${args.tagSize}
        tagColor=${args.tagColor}
        ?disabled=${args.disabled}
        ?filter=${args.filter}
        ?clickable=${args.clickable}
        ?noTruncation=${args.noTruncation}
        @on-close=${(e) => action(e.type)(e)}
        @on-click=${(e) => action(e.type)(e)}
      />
      <span style="display: flex;" aria-label="User icon" aria-hidden="true">
        ${unsafeSVG(userIcon)}
      </span>
    </kyn-tag>
    `;
  },
};
