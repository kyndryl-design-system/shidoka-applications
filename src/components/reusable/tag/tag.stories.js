import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

export default {
  title: 'Components/Tag',
  component: 'kyn-tag',
  argTypes: {
    tagSize: {
      options: ['sm', 'md'],
      control: { type: 'select' },
    },
    shade: {
      options: ['light', 'dark'],
      control: { type: 'select' },
    },
    tagColor: {
      options: [
        'grey',
        'spruce',
        'failed',
        'warning',
        'passed',
        'cat01',
        'cat02',
        'cat03',
        'cat04',
        'cat05',
      ],
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
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/pQKkip0UrZqEbaGN2dQ3dY/Istanbul-Release?type=design&node-id=8-9731&mode=design&t=nd4DTcgjxZCAgnB6-0',
    },
  },
};

const args = {
  label: 'Tag Example',
  tagSize: 'md',
  shade: 'light',
  tagColor: 'spruce',
  disabled: false,
  filter: false,
  noTruncation: false,
};

export const Tag = {
  args,
  render: (args) => {
    return html`
      <kyn-tag
        label=${args.label}
        tagSize=${args.tagSize}
        shade=${args.shade}
        tagColor=${args.tagColor}
        ?disabled=${args.disabled}
        ?filter=${args.filter}
        ?noTruncation=${args.noTruncation}
        @on-close=${(e) => action(e.type)(e)}
      /></kyn-tag>
    `;
  },
};
