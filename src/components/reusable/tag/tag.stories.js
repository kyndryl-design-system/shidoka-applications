import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

export default {
  title: 'Components/Tag',
  component: 'kyn-tag-group',
  subcomponents: {
    'kyn-tag': 'kyn-tag',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/pQKkip0UrZqEbaGN2dQ3dY/Istanbul-Release?type=design&node-id=8-9731&mode=design&t=nd4DTcgjxZCAgnB6-0',
    },
  },
  argTypes: {
    tagSize: {
      options: ['sm', 'md'],
      control: { type: 'select' },
    },
  },
};

export const TagGroup = {
  args: {
    filter: false,
    limitTags: false,
    tagSize: 'md',
    textStrings: {
      showAll: 'Show all',
      showLess: 'Show less',
    },
  },
  render: (args) => {
    return html`
      <kyn-tag-group
        ?filter=${args.filter}
        ?limitTags=${args.limitTags}
        tagSize=${args.tagSize}
        .textStrings=${args.textStrings}
      >
        <kyn-tag label="Tag 1" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
        <kyn-tag label="Tag 2" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
        <kyn-tag label="Tag 3" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
        <kyn-tag label="Tag 4" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
        <kyn-tag label="Tag 5" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
        <kyn-tag label="Tag 6" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
        <kyn-tag label="Tag 7" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
        <kyn-tag label="Tag 8" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
        <kyn-tag label="Tag 9" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
        <kyn-tag label="Tag 10" @on-close=${(e) => action(e.type)(e)}></kyn-tag>
      </kyn-tag-group>
    `;
  },
};

export const Tag = {
  args: {
    label: 'Tag Example',
    tagSize: 'md',
    shade: 'light',
    tagColor: 'spruce',
    disabled: false,
    filter: false,
  },
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
  },
  render: (args) => {
    return html`
      <kyn-tag
        .label=${args.label}
        .tagSize=${args.tagSize}
        .shade=${args.shade}
        .tagColor=${args.tagColor}
        ?disabled=${args.disabled}
        ?filter=${args.filter}
        @on-close=${(e) => action(e.type)(e)}
      /></kyn-tag>
    `;
  },
};
