import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Tag',
  component: 'kyn-tag-group',
  subcomponents: {
    Tag: 'kyn-tag',
    TagSkeleton: 'kyn-tag-skeleton',
  },
  argTypes: {
    tagSize: {
      options: ['sm', 'md'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4-420751&p=f&m=dev',
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

export const Skeleton = {
  args: {
    limitTags: false,
    tagSize: 'md',
    textStrings: {
      showAll: 'Show all',
      showLess: 'Show less',
    },
    tagSkeletonLength: 10,
  },
  render: (args) => {
    return html`
      <kyn-tag-group
        ?limitTags=${args.limitTags}
        tagSize=${args.tagSize}
        .textStrings=${args.textStrings}
        .tagSkeletonLength=${args.tagSkeletonLength}
      >
        ${Array.from(
          { length: args.tagSkeletonLength },
          () => html`<kyn-tag-skeleton></kyn-tag-skeleton>`
        )}
      </kyn-tag-group>
    `;
  },
};

Skeleton.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-546635&m=dev',
  },
};
