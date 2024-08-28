import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '../textInput';

export default {
  title: 'Components/DropdownAddNewBtn',
  component: 'kyn-dropdown-addnew-btn',
  subcomponents: {
    DropdownOption: 'kyn-dropdown-addnew-btn-option',
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    resetSelection: {
      description:
        'Manually reset the dropdown value. Useful when programmatically updating child options. Must be called after child options are updated/re-rendered.',
      table: {
        category: 'Methods',
        type: 'Function',
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=383%3A2845&mode=dev',
    },
  },
};

const args = {
  label: 'Label',
  placeholder: '',
  size: 'md',
  inline: false,
  name: 'example',
  open: false,
  required: false,
  disabled: false,
  hideTags: false,
  selectAll: false,
  selectAllText: 'Select all',
  invalidText: '',
  caption: '',
  searchText: '',
  menuMinWidth: 'initial',
  updateByValue: true,
};

export const SingleAddNewBtn = {
  args: args,
  render: (args) => {
    const dropdown = html`
      <kyn-dropdown-addnew-btn
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        ?updateByValue=${args.updateByValue}
        @on-change=${(e) => {
          action(e.type)(e);
        }}
      >
        <span slot="label">${args.label}</span>
        <kyn-dropdown-addnew-btn-option value="1"
          >New Option 1</kyn-dropdown-addnew-btn-option
        >
        <kyn-dropdown-addnew-btn-option value="2"
          >New Option 2</kyn-dropdown-addnew-btn-option
        >
        <kyn-dropdown-addnew-btn-option value="3" disabled>
          Disabled Option
        </kyn-dropdown-addnew-btn-option>
        <kyn-dropdown-addnew-btn-option value="4"
          >New Option 4</kyn-dropdown-addnew-btn-option
        >
        <kyn-dropdown-addnew-btn-option value="5"
          >New Option 5</kyn-dropdown-addnew-btn-option
        >
        <kyn-dropdown-addnew-btn-option value="6"
          >New Option 6</kyn-dropdown-addnew-btn-option
        >
        <kyn-dropdown-addnew-btn-option value="7"
          >New Option 7</kyn-dropdown-addnew-btn-option
        >
      </kyn-dropdown-addnew-btn>
    `;
    return html`${dropdown}`;
  },
};
