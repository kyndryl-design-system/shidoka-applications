import { useArgs } from 'storybook/preview-api';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { repeat } from 'lit/directives/repeat.js';
import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import '../tooltip';
import { ValidationArgs } from '../../../common/helpers/helpers';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';

export default {
  title: 'Components/Form Inputs/Dropdown',
  component: 'kyn-dropdown',
  subcomponents: {
    DropdownOption: 'kyn-dropdown-option',
  },
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    kind: {
      options: ['default', 'ai'],
      control: { type: 'select' },
    },
    openDirection: {
      options: ['auto', 'up', 'down'],
      control: { type: 'select' },
    },
    searchable: {
      control: { type: 'boolean' },
    },
    searchThreshold: {
      control: { type: 'number', min: 0 },
    },
    filterSearch: {
      control: { type: 'boolean' },
    },
    enhanced: {
      control: { type: 'boolean' },
    },
    multiple: {
      control: { type: 'boolean' },
    },
    allowAddOption: {
      control: { type: 'boolean' },
    },
    preventDuplicateAddOption: {
      control: { type: 'boolean' },
    },
    allowDuplicateSelections: {
      control: { type: 'boolean' },
    },
    'kind-changed': {
      table: { disable: true },
      control: false,
    },
    ...ValidationArgs,
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
  kind: 'default',
  inline: false,
  name: 'example',
  open: false,
  searchable: false,
  searchThreshold: 0,
  filterSearch: false,
  enhanced: false,
  multiple: false,
  required: false,
  disabled: false,
  readonly: false,
  hideTags: false,
  hideLabel: false,
  selectAll: false,
  selectAllText: 'Select all',
  allowAddOption: false,
  preventDuplicateAddOption: true,
  allowDuplicateSelections: true,
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
          min-width: 250px;
        }
      </style>
      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        kind=${args.kind}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?hideLabel=${args.hideLabel}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        openDirection=${args.openDirection}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
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

export const AI = {
  args: {
    ...args,
    kind: 'ai',
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
          min-width: 250px;
        }
      </style>
      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        kind=${args.kind}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?hideLabel=${args.hideLabel}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        openDirection=${args.openDirection}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
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

export const SingleSearchable = {
  args: { ...args, searchable: true, filterSearch: false, searchThreshold: 0 },
  render: (args) => {
    return html`
      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        kind=${args.kind}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?searchable=${args.searchable}
        searchThreshold=${args.searchThreshold}
        ?hideLabel=${args.hideLabel}
        ?filterSearch=${args.filterSearch}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        searchText=${args.searchText}
        .textStrings=${args.textStrings}
        value=${args.value}
        openDirection=${args.openDirection}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-search=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
      <style>
        kyn-dropdown {
          min-width: 250px;
        }
      </style>

      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        kind=${args.kind}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        multiple
        ?hideLabel=${args.hideLabel}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
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
          action(e.type)({ ...e, detail: e.detail });
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
  args: {
    ...args,
    searchable: true,
    filterSearch: false,
    searchThreshold: 0,
    multiple: true,
    value: [],
  },
  render: (args) => {
    return html`
      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        kind=${args.kind}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?searchable=${args.searchable}
        searchThreshold=${args.searchThreshold}
        ?filterSearch=${args.filterSearch}
        ?multiple=${args.multiple}
        ?hideLabel=${args.hideLabel}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?hideTags=${args.hideTags}
        ?selectAll=${args.selectAll}
        selectAllText=${args.selectAllText}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        searchText=${args.searchText}
        .textStrings=${args.textStrings}
        .value=${args.value}
        openDirection=${args.openDirection}
        @on-change=${(e) => {
          const selectedValues = e.detail.value;
          args.value = selectedValues;
          action(e.type)({ ...e, detail: e.detail });
        }}
        @on-search=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
      <style>
        kyn-dropdown {
          min-width: 250px;
        }
      </style>

      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        kind=${args.kind}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?hideLabel=${args.hideLabel}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
      action(e.type)({ ...e, detail: e.detail });
    };

    return html`
      <kyn-dropdown
        label=${args.label}
        multiple
        placeholder=${args.placeholder}
        size=${args.size}
        kind=${args.kind}
        ?inline=${args.inline}
        ?hideTags=${args.hideTags}
        name=${args.name}
        ?open=${args.open}
        ?hideLabel=${args.hideLabel}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
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
          min-width: 250px;
        }
      </style>
      <div class="dropdown-container">
        <div class="dropdown-row">
          <kyn-dropdown
            label="Auto (default)"
            placeholder="Auto detection"
            size=${args.size}
            kind=${args.kind}
            name="auto-direction"
            openDirection="auto"
            ?disabled=${args.disabled}
            ?readonly=${args.readonly}
            .textStrings=${args.textStrings}
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
            ?disabled=${args.disabled}
            ?readonly=${args.readonly}
            .textStrings=${args.textStrings}
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
            ?disabled=${args.disabled}
            ?readonly=${args.readonly}
            .textStrings=${args.textStrings}
            @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
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
      action(e.type)({ ...e, detail: e.detail });
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

      action(e.type)({ ...e, detail: e.detail });
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

      action(e.type)({ ...e, detail: e.detail });
    };
    return html`
      <style>
        kyn-dropdown {
          min-width: 250px;
        }
      </style>

      <kyn-dropdown
        label=${args.label}
        multiple
        placeholder=${args.placeholder}
        size=${args.size}
        kind=${args.kind}
        ?inline=${args.inline}
        ?hideTags=${args.hideTags}
        name=${args.name}
        ?open=${args.open}
        ?hideLabel=${args.hideLabel}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
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
        <kyn-text-input
          slot="add-option-input"
          class="add-option-input"
          type="text"
          label="Add new option"
          hideLabel
          placeholder="Add item..."
        ></kyn-text-input>

        <kyn-button
          slot="add-option-button"
          type="button"
          size="small"
          kind="secondary"
          >Add</kyn-button
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

export const Readonly = {
  args: {
    ...args,
    readonly: true,
    value: '2',
  },
  parameters: {
    a11y: { disable: true },
  },
  render: (args) => {
    return html`
      <style>
        kyn-dropdown {
          min-width: 250px;
        }
      </style>
      <kyn-dropdown
        label=${args.label}
        placeholder=${args.placeholder}
        size=${args.size}
        kind=${args.kind}
        ?inline=${args.inline}
        name=${args.name}
        ?open=${args.open}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?hideLabel=${args.hideLabel}
        invalidText=${args.invalidText}
        caption=${args.caption}
        menuMinWidth=${args.menuMinWidth}
        .textStrings=${args.textStrings}
        value=${args.value}
        openDirection=${args.openDirection}
        @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
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

export const AddNewOptionValidation = {
  args: {
    ...args,
    label: 'Add New Option (Validation)',
    value: ['option2'],
    allowAddOption: true,
    items: items,
    dropdownItems: items,

    preventDuplicateAddOption: true,
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
      action(e.type)({ ...e, detail: e.detail });
    };

    const handleAddOption = (e, dropdownItems) => {
      const newOption = {
        value: e.detail.value,
        text: e.detail.value,
        removable: true,
      };

      const newItems = [...dropdownItems, newOption].sort((a, b) => {
        return a.text.localeCompare(b.text);
      });

      updateArgs({
        dropdownItems: newItems,
      });

      action(e.type)({ ...e, detail: e.detail });
    };

    const handleRemoveOption = (e, dropdownItems) => {
      const removedOption = e.detail.value;
      const newOption = dropdownItems.filter(
        (item) => item.value !== removedOption
      );
      const newValue = [...value].filter((item) => item !== removedOption);

      updateArgs({
        dropdownItems: [...newOption],
        value: newValue,
      });

      action(e.type)({ ...e, detail: e.detail });
    };

    return html`
      <style>
        kyn-dropdown {
          min-width: 250px;
        }
        .validation-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, minmax(260px, 1fr));
          align-items: start;
        }
        .validation-note {
          font-size: 12px;
          opacity: 0.8;
          margin-top: 6px;
        }
        @media (max-width: 700px) {
          .validation-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="validation-grid">
        <div>
          <kyn-dropdown
            label=${args.label}
            multiple
            placeholder=${args.placeholder}
            size=${args.size}
            kind=${args.kind}
            ?inline=${args.inline}
            ?hideTags=${args.hideTags}
            name=${args.name}
            ?open=${args.open}
            ?hideLabel=${args.hideLabel}
            ?required=${args.required}
            ?disabled=${args.disabled}
            ?readonly=${args.readonly}
            invalidText=${args.invalidText}
            caption=${args.caption}
            menuMinWidth=${args.menuMinWidth}
            .textStrings=${args.textStrings}
            .value=${value}
            ?selectAll=${args.selectAll}
            selectAllText=${args.selectAllText}
            .allowAddOption=${args.allowAddOption}
            .preventDuplicateAddOption=${args.preventDuplicateAddOption}
            .addOptionValidator=${(val) => {
              if (val.toLowerCase().includes('bad')) {
                return 'Value cannot include "bad".';
              }
              return null;
            }}
            @on-change=${handleChange}
            @on-add-option=${(e) => {
              handleAddOption(e, dropdownItems);
            }}
          >
            <kyn-text-input
              slot="add-option-input"
              class="add-option-input"
              type="text"
              label="Add new option"
              hideLabel
              placeholder="Add item..."
              pattern="^[A-Za-z][A-Za-z0-9 -]*$"
              minlength="3"
            ></kyn-text-input>

            <kyn-button
              slot="add-option-button"
              type="button"
              size="small"
              kind="secondary"
              >Add</kyn-button
            >
            <kyn-tooltip slot="tooltip">
              <span slot="anchor" style="display:flex"
                >${unsafeSVG(infoIcon)}</span
              >
              Try: ab (too short), 1abc (fails pattern), bad (fails pattern),
              option2 (duplicate), New Option (valid).
            </kyn-tooltip>

            ${repeat(
              dropdownItems,
              (item) => item.value,
              (item) => html`
                <kyn-dropdown-option
                  value=${item.value}
                  ?disabled=${item.disabled}
                  ?removable=${item.removable}
                  @on-remove-option=${(e) =>
                    handleRemoveOption(e, dropdownItems)}
                >
                  <span slot="icon">${unsafeSVG(infoIcon)}</span>
                  ${item.text}
                </kyn-dropdown-option>
              `
            )}
          </kyn-dropdown>

          <div class="validation-note">
            Try: <b>ab</b> (too short), <b>1abc</b> (fails pattern),
            <b>bad</b> (fails pattern), <b>option2</b> (duplicate),
            <b>New Option</b> (valid).
          </div>
        </div>
      </div>
    `;
  },
};
