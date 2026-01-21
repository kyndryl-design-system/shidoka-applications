/**
 * Represents a group of rules with a logical combinator (AND/OR).
 * Groups can contain both rules and nested groups, forming a tree structure.
 */
export interface RuleGroupType {
  /** Unique identifier for the group */
  id: string;
  /** Logical combinator for rules in this group */
  combinator: 'and' | 'or';
  /** Array of rules and/or nested groups */
  rules: RuleOrGroup[];
  /** Whether to negate the group (NOT) */
  not?: boolean;
  /** Whether the group is disabled */
  disabled?: boolean;
}

/**
 * Represents a single rule/condition in the query.
 */
export interface RuleType {
  /** Unique identifier for the rule */
  id: string;
  /** The field name being queried */
  field: string;
  /** The operator to apply */
  operator: string;
  /** The value(s) to compare against */
  value: any;
  /** Source of the value - either a literal value or another field */
  valueSource?: 'value' | 'field';
  /** Whether the rule is disabled */
  disabled?: boolean;
}

/**
 * Union type for items that can appear in a rule group
 */
export type RuleOrGroup = RuleType | RuleGroupType;

/**
 * Type guard to check if an item is a RuleGroupType
 */
export function isRuleGroup(item: RuleOrGroup): item is RuleGroupType {
  return 'combinator' in item && 'rules' in item;
}

/**
 * Type guard to check if an item is a RuleType
 */
export function isRule(item: RuleOrGroup): item is RuleType {
  return 'field' in item && 'operator' in item;
}

/**
 * Configuration for a queryable field.
 */
export interface QueryField {
  /** Unique field identifier (used in RuleType.field) */
  name: string;
  /** Display label for the field */
  label: string;
  /** Data type of the field, determines available operators and value editor */
  dataType: FieldDataType;
  /** Custom operators for this field (overrides defaults for dataType) */
  operators?: QueryOperator[];
  /** Predefined values for select/multiselect fields */
  values?: QueryOption[];
  /** Default operator when field is selected */
  defaultOperator?: string;
  /** Default value when field is selected */
  defaultValue?: any;
  /** Placeholder text for the value input */
  placeholder?: string;
  /** Custom validation function */
  validator?: (rule: RuleType) => boolean | string;
}

/**
 * Supported field data types
 */
export type FieldDataType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'boolean'
  | 'select';

/**
 * Configuration for an operator.
 */
export interface QueryOperator {
  /** Unique operator identifier */
  name: string;
  /** Display label for the operator */
  label: string;
  /** Arity of the operator - unary operators don't need a value */
  arity?: 'unary' | 'binary';
}

/**
 * A generic option used for dropdowns (fields, operators, values).
 */
export interface QueryOption {
  /** Option value */
  value: string;
  /** Display label */
  label: string;
}

/**
 * Configuration options for the query builder component.
 */
export interface QueryBuilderConfig {
  /** Available fields to query */
  fields: QueryField[];
  /** Available combinators (default: AND, OR) */
  combinators?: QueryOption[];
  /** Show NOT toggle on groups */
  showNotToggle?: boolean;
  /** Show clone button on rules/groups */
  showCloneButtons?: boolean;
  /** Show lock/disable button on rules/groups */
  showLockButtons?: boolean;
  /** Maximum nesting depth (default: unlimited) */
  maxDepth?: number;
  /** Enable drag-and-drop reordering */
  allowDragAndDrop?: boolean;
}

/**
 * Event detail for query change events.
 */
export interface QueryChangeEventDetail {
  /** The updated query */
  query: RuleGroupType;
}

/**
 * Event detail for rule/group actions.
 */
export interface QueryActionEventDetail {
  /** Type of action performed */
  action: 'add-rule' | 'add-group' | 'remove' | 'clone' | 'lock' | 'unlock';
  /** Path to the affected item */
  path: number[];
  /** The item that was acted upon */
  item?: RuleOrGroup;
}
