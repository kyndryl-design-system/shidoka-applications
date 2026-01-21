import { html } from 'lit';
import './index';
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
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

// Sample fields configuration showcasing all value types:
// text, number, date, select, radio, slider
const sampleFields = [
  // Text inputs
  { name: 'firstName', label: 'First Name', dataType: 'text' },
  { name: 'lastName', label: 'Last Name', dataType: 'text' },
  {
    name: 'email',
    label: 'Email',
    dataType: 'text',
    placeholder: 'Enter email address',
  },

  // Number inputs
  { name: 'age', label: 'Age', dataType: 'number' },
  { name: 'salary', label: 'Salary', dataType: 'number' },

  // Date inputs
  { name: 'birthDate', label: 'Birth Date', dataType: 'date' },
  { name: 'hireDate', label: 'Hire Date', dataType: 'date' },

  // Select (dropdown) inputs
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

  // Radio button inputs
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

  // Slider inputs
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

// Initial query with some pre-populated rules showcasing different value types
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

// Complex nested query showcasing different value types
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
  query: { id: 'root', combinator: 'and', rules: [] },
  showCloneButtons: false,
  showLockButtons: false,
  maxDepth: 5,
  allowDragAndDrop: true,
  disabled: false,
};

export const Default = {
  args: {
    ...args,
  },
  render: (args) => {
    return html`
      <kyn-query-builder
        .fields=${args.fields}
        .query=${args.query}
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?allowDragAndDrop=${args.allowDragAndDrop}
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
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?allowDragAndDrop=${args.allowDragAndDrop}
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
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?allowDragAndDrop=${args.allowDragAndDrop}
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
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?allowDragAndDrop=${args.allowDragAndDrop}
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
          ?showCloneButtons=${args.showCloneButtons}
          ?showLockButtons=${args.showLockButtons}
          .maxDepth=${args.maxDepth}
          ?allowDragAndDrop=${args.allowDragAndDrop}
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
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?allowDragAndDrop=${args.allowDragAndDrop}
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
          padding: 16px;
          background-color: var(--kd-color-background-ui-soft);
          border-radius: 8px;
          font-family: monospace;
          font-size: 12px;
          white-space: pre-wrap;
          max-height: 300px;
          overflow: auto;
        }
        .query-output-label {
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }
      </style>
      <kyn-query-builder
        id="query-builder-with-output"
        .fields=${args.fields}
        .query=${args.query}
        ?showCloneButtons=${args.showCloneButtons}
        ?showLockButtons=${args.showLockButtons}
        .maxDepth=${args.maxDepth}
        ?allowDragAndDrop=${args.allowDragAndDrop}
        ?disabled=${args.disabled}
        @on-query-change=${(e) => {
          action('on-query-change')(e.detail);
          const outputEl = document.getElementById('query-output');
          if (outputEl) {
            outputEl.textContent = JSON.stringify(e.detail.query, null, 2);
          }
        }}
      ></kyn-query-builder>
      <div class="query-output">
        <span class="query-output-label">Query Output (JSON):</span>
        <div id="query-output">${JSON.stringify(args.query, null, 2)}</div>
      </div>
    `;
  },
};

// Query showcasing all the different value types
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
      operator: 'greaterThan',
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
          ?showCloneButtons=${args.showCloneButtons}
          ?showLockButtons=${args.showLockButtons}
          .maxDepth=${args.maxDepth}
          ?allowDragAndDrop=${args.allowDragAndDrop}
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
