import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '../tooltip';
import infoIcon from '@carbon/icons/es/information/16';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

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
  value: '',
  menuMinWidth: 'initial',
  textStrings: {
    required: 'Required',
    error: 'Error',
  },
};

export const Single = {
  args: args,
  render: (args) => {
    return html`
      <kyn-dropdown
        label=${args.label}
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
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon> tooltip
        </kyn-tooltip>
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
  args: { ...args, filterSearch: false },
  render: (args) => {
    return html`
      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        searchable
        ?filterSearch=${args.filterSearch}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        searchText=${args.searchText}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)(e)}
        @on-search=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon> tooltip
        </kyn-tooltip>
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
        label=${args.label}
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
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon> tooltip
        </kyn-tooltip>
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
  args: { ...args, filterSearch: false },
  render: (args) => {
    return html`
      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        searchable
        ?filterSearch=${args.filterSearch}
        multiple
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideTags=${args.hideTags}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        searchText=${args.searchText}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)(e)}
        @on-search=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon> tooltip
        </kyn-tooltip>
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

export const Grouped = {
  args: args,
  render: (args) => {
    return html`
      <kyn-dropdown
        label=${args.label}
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
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon> tooltip
        </kyn-tooltip>
        <kyn-dropdown-category>Category 1</kyn-dropdown-category>
        <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>

        <kyn-dropdown-category>Category 2</kyn-dropdown-category>
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

export const DataDrivenOptions = {
  args: args,
  render: (args) => {
    return html`
      <kyn-dropdown
        label=${args.label}
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
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => {
          // console.log(e.detail);
          action(e.type)(e);
        }}
      >
        <kyn-tooltip slot="tooltip">
          <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon> tooltip
        </kyn-tooltip>

        ${items.map((item) => {
          return html`
            <kyn-dropdown-option value=${item.value} ?disabled=${item.disabled}>
              ${item.text}
            </kyn-dropdown-option>
          `;
        })}
      </kyn-dropdown>
    `;
  },
};
