import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Tag',
  component: 'kyn-tag',
  argTypes: {
    tagSize: {
      options: ['sm', 'md'],
      control: { type: 'select' },
    },
    tagColor: {
      options: [
        'grey',
        'spruce',
        'interactive',
        'cat01',
        'cat02',
        'cat03',
        'cat04',
        'cat05',
        'cat06',
        'blue',
        'warning',
        'error',
        'success',
        'criticalLight',
        'informationDark',
        'warningDark',
        'errorDark',
        'successDark',
        'criticalDark',
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
    clickable: {
      control: {
        type: 'boolean',
      },
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
  tagColor: 'spruce',
  disabled: false,
  filter: false,
  clickable: false,
  noTruncation: false,
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
