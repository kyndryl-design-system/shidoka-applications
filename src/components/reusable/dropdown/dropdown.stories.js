import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Dropdown',
  component: 'kyn-dropdown',
  subcomponents: {
    DropdownOption: 'kyn-dropdown-option',
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
};

export const Single = {
  args: args,
  render: (args) => {
    return html`
      <kyn-dropdown
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        caption=${args.caption}
        @on-change=${(e) => action(e.type)(e)}
      >
        <span slot="label">${args.label}</span>
        <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
        <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
        <kyn-dropdown-option value="3" disabled>
          Disabled Option
        </kyn-dropdown-option>
        <kyn-dropdown-option value="4">Option 4</kyn-dropdown-option>
        <kyn-dropdown-option value="5">Option 5</kyn-dropdown-option>
        <kyn-dropdown-option value="6">Option 6</kyn-dropdown-option>
        <kyn-dropdown-option value="7">Option 7</kyn-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

export const SingleSearchable = {
  args: args,
  render: (args) => {
    return html`
      <kyn-dropdown
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        searchable
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        caption=${args.caption}
        @on-change=${(e) => action(e.type)(e)}
        @on-search=${(e) => action(e.type)(e)}
      >
        <span slot="label">${args.label}</span>
        <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
        <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
        <kyn-dropdown-option value="3" disabled>
          Disabled Option
        </kyn-dropdown-option>
        <kyn-dropdown-option value="4">Option 4</kyn-dropdown-option>
        <kyn-dropdown-option value="5">Option 5</kyn-dropdown-option>
        <kyn-dropdown-option value="6">Option 6</kyn-dropdown-option>
        <kyn-dropdown-option value="7">Option 7</kyn-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

export const MultiSelect = {
  args: args,
  render: (args) => {
    return html`
      <kyn-dropdown
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        multiple
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideTags=${args.hideTags}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        @on-change=${(e) => action(e.type)(e)}
      >
        <span slot="label">${args.label}</span>
        <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
        <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
        <kyn-dropdown-option value="3" disabled>
          Disabled Option
        </kyn-dropdown-option>
        <kyn-dropdown-option value="4">Option 4</kyn-dropdown-option>
        <kyn-dropdown-option value="5">Option 5</kyn-dropdown-option>
        <kyn-dropdown-option value="6">Option 6</kyn-dropdown-option>
        <kyn-dropdown-option value="7">Option 7</kyn-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

export const MultiSelectSearchable = {
  args: args,
  render: (args) => {
    return html`
      <kyn-dropdown
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        searchable
        multiple
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideTags=${args.hideTags}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        @on-change=${(e) => action(e.type)(e)}
        @on-search=${(e) => action(e.type)(e)}
      >
        <span slot="label">${args.label}</span>
        <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
        <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
        <kyn-dropdown-option value="3" disabled>
          Disabled Option
        </kyn-dropdown-option>
        <kyn-dropdown-option value="4">Option 4</kyn-dropdown-option>
        <kyn-dropdown-option value="5">Option 5</kyn-dropdown-option>
        <kyn-dropdown-option value="6">Option 6</kyn-dropdown-option>
        <kyn-dropdown-option value="7">Option 7</kyn-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

const items = [
  {
    value: 'option1',
    text: 'Option 1',
  },
  {
    value: 'option2',
    text: 'Option 2',
    selected: true,
  },
  {
    value: 'option3',
    text: 'Option 3',
    disabled: true,
  },
  {
    value: 'option4',
    text: 'Option 4',
  },
];

export const DataDrivenOptions = {
  args: args,
  render: (args) => {
    return html`
      <kyn-dropdown
        multiple
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        caption=${args.caption}
        @on-change=${(e) => {
          // console.log(e.detail);
          action(e.type)(e);
        }}
      >
        <span slot="label">${args.label}</span>

        ${items.map((item) => {
          return html`
            <kyn-dropdown-option
              value=${item.value}
              ?selected=${item.selected}
              ?disabled=${item.disabled}
            >
              ${item.text}
            </kyn-dropdown-option>
          `;
        })}
      </kyn-dropdown>
    `;
  },
};
