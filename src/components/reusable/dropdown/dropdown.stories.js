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
  },
};

export const Single = {
  args: {
    label: 'Label',
    placeholder: 'Select an option',
    size: 'md',
    inline: false,
    name: 'example',
    open: false,
    required: false,
    disabled: false,
    invalidText: '',
    caption: '',
  },
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
  args: {
    label: 'Label',
    placeholder: 'Select an option',
    size: 'md',
    inline: false,
    name: 'example',
    open: false,
    required: false,
    disabled: false,
    invalidText: '',
    caption: '',
  },
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

Single.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Component-Library-for-Dev?node-id=383%3A2845&mode=dev',
  },
};
