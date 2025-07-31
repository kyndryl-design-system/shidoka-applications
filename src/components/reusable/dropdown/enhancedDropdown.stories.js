import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import { action } from 'storybook/actions';
import { ValidationArgs } from '../../../common/helpers/helpers';

import './index';

import '../tooltip';

import businessConsultIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/business-consulting.svg';
import aiOpsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/AIOps-docs.svg';
import boxIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/box.svg';
import branchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/branch.svg';
import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chevron-down.svg';

export default {
  title: 'Components/Dropdown/Enhanced Dropdown',
  component: 'kyn-dropdown',
  subcomponents: {
    EnhancedDropdownOption: 'kyn-enhanced-dropdown-option',
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    openDirection: {
      options: ['auto', 'up', 'down'],
      control: { type: 'select' },
    },
    multiple: { control: { type: 'boolean' } },
    enhanced: {
      table: { disable: true },
    },
    allowAddOption: {
      table: { disable: true },
    },
    searchable: { control: { type: 'boolean' } },
    filterSearch: {
      control: { type: 'boolean' },
      if: { arg: 'searchable', truthy: true },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library-2.0?node-id=13361-476952&m=dev',
    },
  },
  ...ValidationArgs,
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
  hideLabel: false,
  selectAll: false,
  selectAllText: 'Select all',
  invalidText: '',
  caption: '',
  searchText: '',
  value: '',
  menuMinWidth: 'initial',
  buttonText: '',
  multiple: false,
  filterSearch: false,
  searchable: false,
  textStrings: {
    required: 'Required',
    error: 'Error',
  },
};

export const Default = {
  args: {
    ...args,
    label: 'Enhanced Dropdown Options',
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
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
        ?hideLabel=${args.hideLabel}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
        style="min-width: 300px;"
      >
        <kyn-enhanced-dropdown-option value="1">
          <span slot="title">Option 1</span>
          <span slot="description"
            >This is a description for the Option 1 enhanced dropdown
            option.</span
          >
          <span slot="optionType">Type: Global</span>
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="2">
          <span slot="title">Option 2</span>
          <kyn-tag slot="tag" label="New chat" tagSize="sm"></kyn-tag>
          <span slot="description"
            >This is a description for the Option 2 enhanced dropdown
            option.</span
          >
          <span slot="optionType">Type: Private</span>
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="3">
          <span slot="title">Option 3</span>
          <span slot="description"
            >This is a description for the Option 3 enhanced dropdown
            option.</span
          >
          <span slot="optionType">Type: Private</span>
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="4">
          <span slot="title">Option 4</span>
          <kyn-tag slot="tag" label="New chat" tagSize="sm"></kyn-tag>
          <span slot="description"
            >This is a description for the Option 4 enhanced dropdown
            option.</span
          >
          <span slot="optionType">Type: Global</span>
        </kyn-enhanced-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

export const WithIcons = {
  args: {
    ...args,
    label: 'Enhanced Dropdown Options',
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      <style>
        kyn-dropdown {
          min-width: 300px;
        }
      </style>
      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-enhanced-dropdown-option value="1">
          <span slot="icon">${unsafeSVG(businessConsultIcon)}</span>
          <span slot="title">Option 1</span>
          <span slot="description"
            >This is a description for the Option 1 enhanced dropdown
            option.</span
          >
          <span slot="optionType">Type: Global</span>
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="2">
          <span slot="icon">${unsafeSVG(aiOpsIcon)}</span>
          <span slot="title">Option 2</span>
          <kyn-tag slot="tag" label="New chat" tagSize="sm"></kyn-tag>
          <span slot="description"
            >This is a description for the Option 2 enhanced dropdown
            option.</span
          >
          <span slot="optionType">Type: Private</span>
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="3">
          <span slot="icon">${unsafeSVG(boxIcon)}</span>
          <span slot="title">Option 3</span>
          <span slot="description"
            >This is a description for the Option 3 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="4">
          <span slot="icon">${unsafeSVG(branchIcon)}</span>
          <span slot="title">Option 4</span>
          <kyn-tag slot="tag" label="New chat" tagSize="sm"></kyn-tag>
          <span slot="description"
            >This is a description for the Option 4 enhanced dropdown
            option.</span
          >
          <span slot="optionType">Type: Global</span>
        </kyn-enhanced-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

export const ButtonAnchor = {
  args: {
    ...args,
    label: 'Enhanced Dropdown Options',
    placeholder: 'Select an option',
    buttonText: 'Options',
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      <style>
        kyn-dropdown {
          min-width: 300px;
        }
      </style>
      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button
          slot="anchor"
          class="dropdown-anchor-button"
          kind="secondary-ai"
          size="small"
          iconPosition="right"
        >
          ${args.buttonText || args.placeholder || 'Select option'}
          <span slot="icon" style="transition: transform 0.2s ease-in-out;"
            >${unsafeSVG(downIcon)}</span
          >
        </kyn-button>
        <kyn-enhanced-dropdown-option value="1">
          <span slot="icon">${unsafeSVG(businessConsultIcon)}</span>
          <span slot="title">Option 1</span>
          <span slot="description"
            >This is a description for the Option 1 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="2">
          <span slot="icon">${unsafeSVG(aiOpsIcon)}</span>
          <span slot="title">Option 2</span>
          <kyn-tag slot="tag" label="New chat" tagSize="sm"></kyn-tag>
          <span slot="description"
            >This is a description for the Option 2 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="3">
          <span slot="icon">${unsafeSVG(boxIcon)}</span>
          <span slot="title">Option 3</span>
          <span slot="description"
            >This is a description for the Option 3 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="4">
          <span slot="icon">${unsafeSVG(branchIcon)}</span>
          <span slot="title">Option 4</span>
          <kyn-tag slot="tag" label="New chat" tagSize="sm"></kyn-tag>
          <span slot="description"
            >This is a description for the Option 4 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

export const Searchable = {
  args: {
    ...args,
    label: 'Enhanced Searchable Options',
    filterSearch: true,
    searchable: true,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      <style>
        kyn-dropdown {
          min-width: 20rem;
        }
      </style>
      <kyn-dropdown
        label=${args.label}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?searchable=${args.searchable}
        ?filterSearch=${args.filterSearch}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-search=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-enhanced-dropdown-option value="javascript">
          <span slot="title">JavaScript</span>
          <span slot="description"
            >Dynamic programming language for web development</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="typescript">
          <span slot="title">TypeScript</span>
          <span slot="description"
            >Typed superset of JavaScript that compiles to plain
            JavaScript</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="python">
          <span slot="title">Python</span>
          <span slot="description"
            >High-level programming language with readable syntax</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="rust">
          <span slot="title">Rust</span>
          <span slot="description"
            >Systems programming language focused on safety and
            performance</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="go">
          <span slot="title">Go</span>
          <span slot="description"
            >Open source programming language that makes it easy to build
            simple, reliable, and efficient software</span
          >
        </kyn-enhanced-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

export const MutliSelect = {
  args: {
    ...args,
    label: 'Enhanced Dropdown Options',
    value: ['1', '2'],
    multiple: true,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      <style>
        kyn-dropdown {
          min-width: 300px;
        }
      </style>
      <kyn-dropdown
        label=${args.label}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?multiple=${args.multiple}
        ?searchable=${args.searchable}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        ?hideTags=${args.hideTags}
        ?filterSearch=${args.filterSearch}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        .value=${args.value}
        @on-change=${(e) => {
          const selectedValues = e.detail.value;
          args.value = selectedValues;
          action(e.type)({ ...e, detail: e.detail });
        }}
      >
        <kyn-enhanced-dropdown-option value="1">
          <span slot="title">Option 1</span>
          <span slot="description"
            >This is a description for the Option 1 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="2">
          <span slot="title">Option 2</span>
          <span slot="description"
            >This is a description for the Option 2 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="3">
          <span slot="title">Option 3</span>
          <span slot="description"
            >This is a description for the Option 3 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="4">
          <span slot="title">Option 4</span>
          <span slot="description"
            >This is a description for the Option 4 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

export const MultiSelectIcons = {
  args: {
    ...args,
    label: 'Enhanced Dropdown Options',
    value: ['1', '2'],
    multiple: true,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      <style>
        kyn-dropdown {
          min-width: 300px;
        }
      </style>
      <kyn-dropdown
        label=${args.label}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?multiple=${args.multiple}
        ?searchable=${args.searchable}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        ?hideTags=${args.hideTags}
        ?filterSearch=${args.filterSearch}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        .value=${args.value}
        @on-change=${(e) => {
          const selectedValues = e.detail.value;
          args.value = selectedValues;
          action(e.type)({ ...e, detail: e.detail });
        }}
      >
        <kyn-enhanced-dropdown-option value="1">
          <span slot="icon">${unsafeSVG(businessConsultIcon)}</span>
          <span slot="title">Option 1</span>
          <span slot="description"
            >This is a description for the Option 1 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="2">
          <span slot="icon">${unsafeSVG(aiOpsIcon)}</span>
          <span slot="title">Option 2</span>
          <span slot="description"
            >This is a description for the Option 2 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="3">
          <span slot="icon">${unsafeSVG(boxIcon)}</span>
          <span slot="title">Option 3</span>
          <span slot="description"
            >This is a description for the Option 3 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="4">
          <span slot="icon">${unsafeSVG(branchIcon)}</span>
          <span slot="title">Option 4</span>
          <span slot="description"
            >This is a description for the Option 4 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
      </kyn-dropdown>
    `;
  },
};

export const SearchableMultiSelect = {
  args: {
    ...args,
    label: 'Enhanced Searchable Options',
    filterSearch: true,
    searchable: true,
    multiple: true,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      <style>
        kyn-dropdown {
          min-width: 20rem;
        }
      </style>
      <kyn-dropdown
        label=${args.label}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?searchable=${args.searchable}
        ?multiple=${args.multiple}
        ?filterSearch=${args.filterSearch}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-search=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-enhanced-dropdown-option value="javascript">
          <span slot="title">JavaScript</span>
          <span slot="description"
            >Dynamic programming language for web development</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="typescript">
          <span slot="title">TypeScript</span>
          <span slot="description"
            >Typed superset of JavaScript that compiles to plain
            JavaScript</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="python">
          <span slot="title">Python</span>
          <span slot="description"
            >High-level programming language with readable syntax</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="rust">
          <span slot="title">Rust</span>
          <span slot="description"
            >Systems programming language focused on safety and
            performance</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="go">
          <span slot="title">Go</span>
          <span slot="description"
            >Open source programming language that makes it easy to build
            simple, reliable, and efficient software</span
          >
        </kyn-enhanced-dropdown-option>
      </kyn-dropdown>
    `;
  },
};
