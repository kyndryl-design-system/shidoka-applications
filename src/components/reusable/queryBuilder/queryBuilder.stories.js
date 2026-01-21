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

// Sample fields configuration
const sampleFields = [
  { name: 'firstName', label: 'First Name', dataType: 'text' },
  { name: 'lastName', label: 'Last Name', dataType: 'text' },
  {
    name: 'email',
    label: 'Email',
    dataType: 'text',
    placeholder: 'Enter email address',
  },
  { name: 'age', label: 'Age', dataType: 'number' },
  { name: 'salary', label: 'Salary', dataType: 'number' },
  { name: 'birthDate', label: 'Birth Date', dataType: 'date' },
  { name: 'hireDate', label: 'Hire Date', dataType: 'date' },
  { name: 'isActive', label: 'Is Active', dataType: 'boolean' },
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
];

// Initial query with some pre-populated rules
const initialQuery = {
  id: 'root',
  combinator: 'and',
  rules: [
    {
      id: 'rule-1',
      field: 'firstName',
      operator: 'contains',
      value: '',
    },
    {
      id: 'rule-2',
      field: 'status',
      operator: 'equal',
      value: 'active',
    },
  ],
};

// Complex nested query for demo
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
          field: 'department',
          operator: 'equal',
          value: 'sales',
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
              field: 'salary',
              operator: 'greaterThan',
              value: 50000,
            },
          ],
        },
      ],
    },
    {
      id: 'rule-6',
      field: 'isActive',
      operator: 'equal',
      value: true,
    },
  ],
};

const args = {
  fields: sampleFields,
  query: { id: 'root', combinator: 'and', rules: [] },
  showNotToggle: false,
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
        ?showNotToggle=${args.showNotToggle}
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
        ?showNotToggle=${args.showNotToggle}
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
        ?showNotToggle=${args.showNotToggle}
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
    showNotToggle: true,
    showCloneButtons: true,
    showLockButtons: true,
  },
  render: (args) => {
    return html`
      <kyn-query-builder
        .fields=${args.fields}
        .query=${args.query}
        ?showNotToggle=${args.showNotToggle}
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
          ?showNotToggle=${args.showNotToggle}
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
        ?showNotToggle=${args.showNotToggle}
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
        ?showNotToggle=${args.showNotToggle}
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
