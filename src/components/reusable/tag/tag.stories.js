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
      control: false,
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4-420751&p=f&m=dev',
    },
  },
};

const args = {
  label: 'Tag Example',
  tagSize: 'md',
  tagColor: 'default',
  clickable: true,
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
      <span>${unsafeSVG(userIcon)}</span>
    </kyn-tag>
    `;
  },
};
