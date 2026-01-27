import { html } from 'lit';
import './index';
import '../blockCodeView';
import '../sideDrawer';
import '../button';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Query Builder',
  component: 'kyn-query-builder',
  subcomponents: {
    QueryBuilderGroup: 'kyn-qb-group',
    QueryBuilderRule: 'kyn-qb-rule',
  },
  argTypes: {
    maxDepth: {
      control: { type: 'number', min: 1, max: 10 },
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'select' },
      description: 'Size of all child components (buttons, inputs, dropdowns)',
      table: {
        defaultValue: { summary: 'xs' },
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
    a11y: {
      config: {
        rules: [
          {
            // False positive: accessibility checks incorrectly measures unselected button text against adjacent selected button background in button groups
            id: 'color-contrast',
            selector: '.kd-btn--group-first, .kd-btn--group-last',
            enabled: false,
          },
        ],
      },
    },
  },
};

const sampleFields = [
  // text inputs
  { name: 'firstName', label: 'First Name', dataType: 'text' },
  { name: 'lastName', label: 'Last Name', dataType: 'text' },
  {
    name: 'email',
    label: 'Email',
    dataType: 'text',
    placeholder: 'Enter email address',
  },

  // number inputs
  { name: 'age', label: 'Age', dataType: 'number' },
  { name: 'salary', label: 'Salary', dataType: 'number' },

  // date inputs
  { name: 'birthDate', label: 'Birth Date', dataType: 'date' },
  { name: 'hireDate', label: 'Hire Date', dataType: 'date' },

  // select (dropdown) inputs
  {
    name: 'status',
    label: 'Status',
    dataType: 'select',
    values: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
      { value: 'suspended', label: 'Suspended' },
    ],
  },
  {
    name: 'department',
    label: 'Department',
    dataType: 'select',
    values: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'sales', label: 'Sales' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'hr', label: 'Human Resources' },
      { value: 'finance', label: 'Finance' },
    ],
  },
  {
    name: 'role',
    label: 'Role',
    dataType: 'select',
    values: [
      { value: 'admin', label: 'Administrator' },
      { value: 'manager', label: 'Manager' },
      { value: 'employee', label: 'Employee' },
      { value: 'contractor', label: 'Contractor' },
    ],
  },

  // radio button inputs
  {
    name: 'priority',
    label: 'Priority',
    dataType: 'radio',
    values: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },
  {
    name: 'employmentType',
    label: 'Employment Type',
    dataType: 'radio',
    values: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
    ],
  },

  // slider inputs
  {
    name: 'rating',
    label: 'Rating',
    dataType: 'slider',
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 50,
  },
  {
    name: 'experienceYears',
    label: 'Years of Experience',
    dataType: 'slider',
    min: 0,
    max: 30,
    step: 1,
    defaultValue: 5,
  },
];

const initialQuery = {
  id: 'root',
  combinator: 'and',
  rules: [
    {
      id: 'rule-1',
      field: 'firstName',
      operator: 'contains',
      value: 'John',
    },
    {
      id: 'rule-2',
      field: 'status',
      operator: 'equal',
      value: 'active',
    },
    {
      id: 'rule-3',
      field: 'priority',
      operator: 'equal',
      value: 'high',
    },
    {
      id: 'rule-4',
      field: 'rating',
      operator: 'greaterThan',
      value: 70,
    },
  ],
};

// complex nested query showcasing different value types
const nestedQuery = {
  id: 'root',
  combinator: 'and',
  rules: [
    {
      id: 'rule-1',
      field: 'status',
      operator: 'equal',
      value: 'active',
    },
    {
      id: 'group-1',
      combinator: 'or',
      rules: [
        {
          id: 'rule-2',
          field: 'department',
          operator: 'equal',
          value: 'engineering',
        },
        {
          id: 'rule-3',
          field: 'priority',
          operator: 'equal',
          value: 'high',
        },
        {
          id: 'group-2',
          combinator: 'and',
          rules: [
            {
              id: 'rule-4',
              field: 'role',
              operator: 'equal',
              value: 'manager',
            },
            {
              id: 'rule-5',
              field: 'experienceYears',
              operator: 'greaterThan',
              value: 5,
            },
          ],
        },
      ],
    },
    {
      id: 'rule-6',
      field: 'rating',
      operator: 'greaterThanOrEqual',
      value: 80,
    },
  ],
};

const args = {
  fields: sampleFields,
  showCloneButtons: false,
  showLockButtons: false,
  maxDepth: 5,
  disableDragAndDrop: false,
  disabled: false,
  size: 'xs',
};

export const Default = {
  args: {
    ...args,
  },
  render: (args) => {
    return html`
      <kyn-query-builder
        .fields=${args.fields}
        .size=${args.size}
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?disableDragAndDrop=${args.disableDragAndDrop}
        ?disabled=${args.disabled}
        @on-query-change=${(e) => {
          action('on-query-change')(e.detail);
          console.log(
            'Query changed:',
            JSON.stringify(e.detail.query, null, 2)
          );
        }}
      ></kyn-query-builder>
    `;
  },
};

export const WithInitialQuery = {
  args: {
    ...args,
    query: initialQuery,
  },
  render: (args) => {
    return html`
      <kyn-query-builder
        .fields=${args.fields}
        .query=${args.query}
        .size=${args.size}
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?disableDragAndDrop=${args.disableDragAndDrop}
        ?disabled=${args.disabled}
        @on-query-change=${(e) => {
          action('on-query-change')(e.detail);
          console.log(
            'Query changed:',
            JSON.stringify(e.detail.query, null, 2)
          );
        }}
      ></kyn-query-builder>
    `;
  },
};

export const NestedGroups = {
  args: {
    ...args,
    query: nestedQuery,
  },
  render: (args) => {
    return html`
      <kyn-query-builder
        .fields=${args.fields}
        .query=${args.query}
        .size=${args.size}
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?disableDragAndDrop=${args.disableDragAndDrop}
        ?disabled=${args.disabled}
        @on-query-change=${(e) => {
          action('on-query-change')(e.detail);
          console.log(
            'Query changed:',
            JSON.stringify(e.detail.query, null, 2)
          );
        }}
      ></kyn-query-builder>
    `;
  },
};

export const WithAllOptions = {
  args: {
    ...args,
    query: initialQuery,
    showCloneButtons: true,
    showLockButtons: true,
  },
  render: (args) => {
    return html`
      <kyn-query-builder
        .fields=${args.fields}
        .query=${args.query}
        .size=${args.size}
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?disableDragAndDrop=${args.disableDragAndDrop}
        ?disabled=${args.disabled}
        @on-query-change=${(e) => {
          action('on-query-change')(e.detail);
          console.log(
            'Query changed:',
            JSON.stringify(e.detail.query, null, 2)
          );
        }}
      ></kyn-query-builder>
    `;
  },
};

export const LimitedDepth = {
  args: {
    ...args,
    query: nestedQuery,
    maxDepth: 2,
  },
  render: (args) => {
    return html`
      <div>
        <p
          style="margin-bottom: 16px; color: var(--kd-color-text-level-secondary);"
        >
          Max depth is set to 2. You cannot add groups beyond this depth.
        </p>
        <kyn-query-builder
          .fields=${args.fields}
          .query=${args.query}
          .size=${args.size}
          ?showCloneButtons=${args.showCloneButtons}
          ?showLockButtons=${args.showLockButtons}
          .maxDepth=${args.maxDepth}
          ?disableDragAndDrop=${args.disableDragAndDrop}
          ?disabled=${args.disabled}
          @on-query-change=${(e) => {
            action('on-query-change')(e.detail);
            console.log(
              'Query changed:',
              JSON.stringify(e.detail.query, null, 2)
            );
          }}
        ></kyn-query-builder>
      </div>
    `;
  },
};

export const Disabled = {
  args: {
    ...args,
    query: initialQuery,
    disabled: true,
  },
  render: (args) => {
    return html`
      <kyn-query-builder
        .fields=${args.fields}
        .query=${args.query}
        .size=${args.size}
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?disableDragAndDrop=${args.disableDragAndDrop}
        ?disabled=${args.disabled}
        @on-query-change=${(e) => {
          action('on-query-change')(e.detail);
          console.log(
            'Query changed:',
            JSON.stringify(e.detail.query, null, 2)
          );
        }}
      ></kyn-query-builder>
    `;
  },
};

export const WithQueryOutput = {
  args: {
    ...args,
    query: initialQuery,
  },
  render: (args) => {
    return html`
      <style>
        .query-output {
          margin-top: 24px;
        }
      </style>
      <kyn-query-builder
        id="query-builder-with-output"
        .fields=${args.fields}
        .query=${args.query}
        .size=${args.size}
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?disableDragAndDrop=${args.disableDragAndDrop}
        ?disabled=${args.disabled}
        @on-query-change=${(e) => {
          action('on-query-change')(e.detail);
          const outputEl = document.getElementById('query-output');
          if (outputEl) {
            outputEl.codeSnippet = JSON.stringify(e.detail.query, null, 2);
          }
        }}
      ></kyn-query-builder>
      <div class="query-output">
        <kyn-block-code-view
          id="query-output"
          language="json"
          codeViewLabel="Query Output"
          codeSnippet=${JSON.stringify(args.query, null, 2)}
          .maxHeight=${300}
          copyOptionVisible
        ></kyn-block-code-view>
      </div>
    `;
  },
};

const allValueTypesQuery = {
  id: 'root',
  combinator: 'and',
  rules: [
    {
      id: 'rule-text',
      field: 'firstName',
      operator: 'contains',
      value: 'John',
    },
    {
      id: 'rule-number',
      field: 'age',
      operator: 'greaterThan',
      value: 25,
    },
    {
      id: 'rule-date',
      field: 'birthDate',
      operator: 'after',
      value: '1990-01-01',
    },
    {
      id: 'rule-select',
      field: 'department',
      operator: 'equal',
      value: 'engineering',
    },
    {
      id: 'rule-radio',
      field: 'priority',
      operator: 'equal',
      value: 'high',
    },
    {
      id: 'rule-slider',
      field: 'rating',
      operator: 'greaterThanOrEqual',
      value: 70,
    },
  ],
};

export const AllValueTypes = {
  args: {
    ...args,
    query: allValueTypesQuery,
    showCloneButtons: true,
    showLockButtons: true,
  },
  render: (args) => {
    return html`
      <div>
        <p
          style="margin-bottom: 16px; color: var(--kd-color-text-level-secondary);"
        >
          This story showcases all available value types: text input, number
          input, date picker, dropdown select, radio button group, and slider.
        </p>
        <kyn-query-builder
          .fields=${args.fields}
          .query=${args.query}
          .size=${args.size}
          ?showCloneButtons=${args.showCloneButtons}
          ?showLockButtons=${args.showLockButtons}
          .maxDepth=${args.maxDepth}
          ?disableDragAndDrop=${args.disableDragAndDrop}
          ?disabled=${args.disabled}
          @on-query-change=${(e) => {
            action('on-query-change')(e.detail);
            console.log(
              'Query changed:',
              JSON.stringify(e.detail.query, null, 2)
            );
          }}
        ></kyn-query-builder>
      </div>
    `;
  },
};

// Fields with validators for the validation story
const fieldsWithValidation = [
  {
    name: 'firstName',
    label: 'First Name',
    dataType: 'text',
    validator: (rule) => {
      if (!rule.value || rule.value.trim() === '') {
        return 'First name is required';
      }
      if (rule.value.length < 2) {
        return 'First name must be at least 2 characters';
      }
      return true;
    },
  },
  {
    name: 'age',
    label: 'Age',
    dataType: 'number',
    validator: (rule) => {
      if (
        rule.value === '' ||
        rule.value === null ||
        rule.value === undefined
      ) {
        return 'Age is required';
      }
      if (rule.value < 0) {
        return 'Age must be a positive number';
      }
      if (rule.value > 150) {
        return 'Age must be realistic (0-150)';
      }
      return true;
    },
  },
  {
    name: 'email',
    label: 'Email',
    dataType: 'text',
    placeholder: 'Enter email address',
    validator: (rule) => {
      if (!rule.value || rule.value.trim() === '') {
        return 'Email is required';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rule.value)) {
        return 'Please enter a valid email address';
      }
      return true;
    },
  },
  {
    name: 'status',
    label: 'Status',
    dataType: 'select',
    values: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

// Query with the second rule invalid (age is negative)
const validationQuery = {
  id: 'root',
  combinator: 'and',
  rules: [
    {
      id: 'rule-1',
      field: 'firstName',
      operator: 'equal',
      value: 'John',
      valid: true,
    },
    {
      id: 'rule-2',
      field: 'age',
      operator: 'greaterThan',
      value: -5,
      valid: false,
      validationError: 'Age must be a positive number',
    },
    {
      id: 'rule-3',
      field: 'status',
      operator: 'equal',
      value: 'active',
      valid: true,
    },
  ],
};

export const WithValidation = {
  args: {
    ...args,
    fields: fieldsWithValidation,
    query: validationQuery,
  },
  render: (args) => {
    return html`
      <div>
        <p
          style="margin-bottom: 16px; color: var(--kd-color-text-level-secondary);"
        >
          This story demonstrates field validation. The second rule (Age) has an
          invalid value (-5) and displays a validation error. Try editing the
          values to see validation in action (onBlur).
        </p>
        <kyn-query-builder
          .fields=${args.fields}
          .query=${args.query}
          .size=${args.size}
          ?showCloneButtons=${args.showCloneButtons}
          ?showLockButtons=${args.showLockButtons}
          .maxDepth=${args.maxDepth}
          ?disableDragAndDrop=${args.disableDragAndDrop}
          ?disabled=${args.disabled}
          @on-query-change=${(e) => {
            action('on-query-change')(e.detail);
            console.log(
              'Query changed:',
              JSON.stringify(e.detail.query, null, 2)
            );
          }}
        ></kyn-query-builder>
      </div>
    `;
  },
};

// Fields with only text and select types for side drawer story
const sideDrawerFields = sampleFields.filter(
  (field) => field.dataType === 'text' || field.dataType === 'select'
);

// Query with only text and select rules
const sideDrawerQuery = {
  id: 'root',
  combinator: 'and',
  rules: [
    {
      id: 'rule-1',
      field: 'firstName',
      operator: 'contains',
      value: 'John',
    },
    {
      id: 'rule-2',
      field: 'lastName',
      operator: 'equal',
      value: 'Doe',
    },
    {
      id: 'rule-3',
      field: 'status',
      operator: 'equal',
      value: 'active',
    },
    {
      id: 'rule-4',
      field: 'department',
      operator: 'equal',
      value: 'engineering',
    },
  ],
};

export const WithSideDrawer = {
  args: {
    ...args,
    fields: sideDrawerFields,
    query: sideDrawerQuery,
  },
  render: (args) => {
    return html`
      <kyn-side-drawer
        size="md"
        titleText="Edit Query"
        labelText="View and Category will be locked after conditions are added"
        submitBtnText="Apply"
        cancelBtnText="Reset"
        showSecondaryButton
        secondaryButtonText="Save"
        @on-close=${(e) => action('on-close')(e.detail)}
        @on-open=${(e) => action('on-open')(e.detail)}
      >
        <kyn-button slot="anchor">Open Query Builder</kyn-button>

        <div class="side-drawer-content">
          <kyn-query-builder
            id="side-drawer-query-builder"
            .fields=${args.fields}
            .query=${args.query}
            .size=${args.size}
            ?showCloneButtons=${args.showCloneButtons}
            ?showLockButtons=${args.showLockButtons}
            .maxDepth=${args.maxDepth}
            ?disableDragAndDrop=${args.disableDragAndDrop}
            ?disabled=${args.disabled}
            @on-query-change=${(e) => {
              action('on-query-change')(e.detail);
              const outputEl = document.getElementById(
                'side-drawer-query-output'
              );
              if (outputEl) {
                outputEl.codeSnippet = JSON.stringify(e.detail.query, null, 2);
              }
            }}
          ></kyn-query-builder>

          <div class="preview-section">
            <kyn-block-code-view
              id="side-drawer-query-output"
              language="json"
              codeViewLabel="Preview"
              codeSnippet=${JSON.stringify(args.query, null, 2)}
              .maxHeight=${200}
              copyOptionVisible
            ></kyn-block-code-view>
          </div>
        </div>
      </kyn-side-drawer>

      <style>
        .side-drawer-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .preview-section {
          margin-top: 8px;
        }
      </style>
    `;
  },
};
