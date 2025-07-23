import { useArgs } from 'storybook/preview-api';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { repeat } from 'lit/directives/repeat.js';
import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import '../tooltip';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';

import businessConsultIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/business-consulting.svg';
import aiOpsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/AIOps-docs.svg';
import boxIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/box.svg';
import branchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/branch.svg';

export default {
  title: 'Components/Dropdown',
  component: 'kyn-dropdown',
  subcomponents: {
    DropdownOption: 'kyn-dropdown-option',
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
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-540521&p=f&m=dev',
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
  hideLabel: false,
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
  args: {
    ...args,
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
          min-width: 15rem;
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
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        openDirection=${args.openDirection}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
        <kyn-dropdown-option value="1">
          <span slot="icon">${unsafeSVG(infoIcon)}</span>
          Option 1
        </kyn-dropdown-option>
        <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
        <kyn-dropdown-option value="3" disabled>
          <span slot="icon">${unsafeSVG(infoIcon)}</span>
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

export const Enhanced = {
  args: {
    ...args,
    label: 'AI Model Selection',
    placeholder: 'Choose an AI model...',
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
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-enhanced-dropdown-option value="option-1">
          <span slot="icon">${unsafeSVG(businessConsultIcon)}</span>
          <span slot="title">Option 1</span>
          <span slot="description"
            >This is a description for the Option 1 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="option-2">
          <span slot="icon">${unsafeSVG(aiOpsIcon)}</span>
          <span slot="title">Option 2</span>
          <kyn-tag slot="tag" label="New chat" tagSize="sm"></kyn-tag>
          <span slot="description"
            >This is a description for the Option 2 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="option-3">
          <span slot="icon">${unsafeSVG(boxIcon)}</span>
          <span slot="title">Option 3</span>
          <span slot="description"
            >This is a description for the Option 3 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="option-4">
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

export const EnhancedMultiSelect = {
  args: {
    ...args,
    label: 'Development Frameworks',
    placeholder: 'Select frameworks...',
    value: ['option-1', 'option-2'],
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
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        multiple
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        ?hideTags=${args.hideTags}
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
          action(e.type)(e);
        }}
      >
        <kyn-enhanced-dropdown-option value="option-1">
          <span slot="title">Option 1</span>
          <span slot="description"
            >This is a description for the Option 1 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="option-2">
          <span slot="title">Option 2</span>
          <span slot="description"
            >This is a description for the Option 2 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="option-3">
          <span slot="title">Option 3</span>
          <span slot="description"
            >This is a description for the Option 3 enhanced dropdown
            option.</span
          >
        </kyn-enhanced-dropdown-option>
        <kyn-enhanced-dropdown-option value="option-4">
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

export const EnhancedSearchable = {
  args: {
    ...args,
    label: 'Programming Languages',
    placeholder: 'Search languages...',
    filterSearch: true,
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
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        searchable
        ?filterSearch=${args.filterSearch}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideLabel=${args.hideLabel}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)(e)}
        @on-search=${(e) => action(e.type)(e)}
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
        ?hideLabel=${args.hideLabel}
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
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
        <kyn-dropdown-option value="1">
          <span slot="icon">${unsafeSVG(infoIcon)}</span>
          Option 1
        </kyn-dropdown-option>
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
  args: { ...args, value: ['1', '3'] },
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
        multiple
        ?hideLabel=${args.hideLabel}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?hideTags=${args.hideTags}
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
          action(e.type)(e);
        }}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
        <kyn-dropdown-option value="1">
          <span slot="icon">${unsafeSVG(infoIcon)}</span>
          Option 1
        </kyn-dropdown-option>
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
  args: { ...args, filterSearch: false, value: [] },
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
        ?hideLabel=${args.hideLabel}
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
        .value=${args.value}
        @on-change=${(e) => {
          const selectedValues = e.detail.value;
          args.value = selectedValues;
          action(e.type)(e);
        }}
        @on-search=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
        <kyn-dropdown-option value="1">
          Option 1
          <span slot="icon">${unsafeSVG(infoIcon)}</span>
        </kyn-dropdown-option>
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

export const Grouped = {
  args: args,
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
        ?hideLabel=${args.hideLabel}
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
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
        <kyn-dropdown-category>Category 1</kyn-dropdown-category>
        <kyn-dropdown-option value="1">
          <span slot="icon">${unsafeSVG(infoIcon)}</span>
          Option 1
        </kyn-dropdown-option>

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

const items = [
  {
    value: 'option1',
    text: 'Option 1',
  },
  {
    value: 'option2',
    text: 'Option 2',
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
  args: { ...args, value: ['option2'] },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    const handleChange = (e) => {
      updateArgs({
        value: e.detail.value,
      });
      action(e.type)(e);
    };

    return html`
      <kyn-dropdown
        label=${args.label}
        multiple
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        ?hideTags=${args.hideTags}
        name=${args.name}
        ?open=${args.open}
        ?hideLabel=${args.hideLabel}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        .value=${value}
        @on-change=${handleChange}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>

        ${items.map((item) => {
          return html`
            <kyn-dropdown-option value=${item.value} ?disabled=${item.disabled}>
              <span slot="icon">${unsafeSVG(infoIcon)}</span>
              ${item.text}
            </kyn-dropdown-option>
          `;
        })}
      </kyn-dropdown>
    `;
  },
};

export const DirectionalControl = {
  args: {
    ...args,
    label: 'Open Direction Control',
    placeholder: 'Choose direction',
    openDirection: 'auto',
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    return html`
      <style>
        .dropdown-container {
          margin-top: 150px;
          display: flex;
          gap: 20px;
          flex-direction: column;
          align-items: center;
        }
        .dropdown-row {
          display: flex;
          gap: 20px;
        }
        kyn-dropdown {
          min-width: 15rem;
        }
      </style>
      <div class="dropdown-container">
        <div class="dropdown-row">
          <kyn-dropdown
            label="Auto (default)"
            placeholder="Auto detection"
            size=${args.size}
            name="auto-direction"
            openDirection="auto"
            .textStrings=${args.textStrings}
            @on-change=${(e) => action(e.type)(e)}
          >
            <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
            <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
            <kyn-dropdown-option value="3">Option 3</kyn-dropdown-option>
          </kyn-dropdown>

          <kyn-dropdown
            label="Force Upward"
            placeholder="Opens upward"
            size=${args.size}
            name="up-direction"
            openDirection="up"
            .textStrings=${args.textStrings}
            @on-change=${(e) => action(e.type)(e)}
          >
            <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
            <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
            <kyn-dropdown-option value="3">Option 3</kyn-dropdown-option>
          </kyn-dropdown>

          <kyn-dropdown
            label="Force Downward"
            placeholder="Opens downward"
            size=${args.size}
            name="down-direction"
            openDirection="down"
            .textStrings=${args.textStrings}
            @on-change=${(e) => action(e.type)(e)}
          >
            <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
            <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
            <kyn-dropdown-option value="3">Option 3</kyn-dropdown-option>
          </kyn-dropdown>
        </div>
      </div>
    `;
  },
};

export const AddNewOption = {
  args: {
    ...args,
    value: ['option2'],
    allowAddOption: true,
    items: items,
    dropdownItems: items,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
  render: (args) => {
    const [{ dropdownItems, value }, updateArgs] = useArgs();

    const handleChange = (e) => {
      updateArgs({
        value: e.detail.value,
      });
      action(e.type)(e);
    };

    const handleAddOption = (e, dropdownItems) => {
      const newOption = {
        value: e.detail.value,
        text: e.detail.value,
        removable: true,
      };

      // Create a new array with the new option
      const newItems = [...dropdownItems, newOption].sort((a, b) => {
        return a.text.localeCompare(b.text);
      });

      updateArgs({
        dropdownItems: newItems,
      });

      action(e.type)(e);
    };

    const handleRemoveOption = (e, dropdownItems) => {
      const removedOption = e.detail.value;
      const newOption = dropdownItems.filter(
        (item) => item.value !== removedOption
      );
      const newValue = [...value].filter((item) => item !== removedOption);

      updateArgs({
        dropdownItems: [...newOption], // Create a new array with the new option
        value: newValue, // remove value if removed item was selected
      });

      action(e.type)(e);
    };
    return html`
      <style>
        kyn-dropdown {
          min-width: 15rem;
        }
      </style>

      <kyn-dropdown
        label=${args.label}
        multiple
        placeholder=${args.placeholder}
        size=${args.size}
        ?inline=${args.inline}
        ?hideTags=${args.hideTags}
        name=${args.name}
        ?open=${args.open}
        ?hideLabel=${args.hideLabel}
        ?required=${args.required}
        ?disabled=${args.disabled}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        .value=${value}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        .allowAddOption=${args.allowAddOption}
        @on-change=${handleChange}
        @on-add-option=${(e) => {
          handleAddOption(e, dropdownItems);
        }}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>

        ${repeat(
          dropdownItems,
          (item) => item.value,
          (item) => html`
            <kyn-dropdown-option
              value=${item.value}
              ?disabled=${item.disabled}
              ?removable=${item.removable}
              @on-remove-option=${(e) => handleRemoveOption(e, dropdownItems)}
            >
              <span slot="icon">${unsafeSVG(infoIcon)}</span>
              ${item.text}
            </kyn-dropdown-option>
          `
        )}
      </kyn-dropdown>
    `;
  },
};
