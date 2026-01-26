/**
 * represents a group of rules with a logical combinator (AND/OR).
 * groups can contain both rules and nested groups, forming a tree structure.
 */
export interface RuleGroupType {
  id: string;
  combinator: 'and' | 'or';
  rules: RuleOrGroup[];
  not?: boolean;
  disabled?: boolean;
}

/**
 * represents a single rule/condition in the query.
 */
export interface RuleType {
  id: string;
  field: string;
  operator: string;
  value: any;
  valueSource?: 'value' | 'field';
  disabled?: boolean;
  /** Wwether the rule passes validation (undefined = not yet validated) */
  valid?: boolean;
  /** validation error message if valid is false */
  validationError?: string;
}

/**
 * union type for items that can appear in a rule group
 */
export type RuleOrGroup = RuleType | RuleGroupType;

/**
 * type guard to check if an item is a RuleGroupType
 */
export function isRuleGroup(item: RuleOrGroup): item is RuleGroupType {
  return 'combinator' in item && 'rules' in item;
}

/**
 * type guard to check if an item is a RuleType
 */
export function isRule(item: RuleOrGroup): item is RuleType {
  return 'field' in item && 'operator' in item;
}

/**
 * configuration for a queryable field.
 */
export interface QueryField {
  name: string;
  label: string;
  dataType: FieldDataType;
  operators?: QueryOperator[];
  values?: QueryOption[];
  defaultOperator?: string;
  defaultValue?: any;
  placeholder?: string;
  validator?: (rule: RuleType) => boolean | string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * supported field data types
 */
export type FieldDataType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'boolean'
  | 'select'
  | 'radio'
  | 'slider';

/**
 * configuration for an operator.
 */
export interface QueryOperator {
  name: string;
  label: string;
  valueCount?: 'none' | 'single';
}

/**
 * generic option used for dropdowns (fields, operators, values).
 */
export interface QueryOption {
  value: string;
  label: string;
}

/**
 * configuration options for the query builder component.
 */
export interface QueryBuilderConfig {
  fields: QueryField[];
  combinators?: QueryOption[];
  showCloneButtons?: boolean;
  showLockButtons?: boolean;
  maxDepth?: number;
  disableDragAndDrop?: boolean;
}

/**
 * event detail for query change events.
 */
export interface QueryChangeEventDetail {
  /** The updated query */
  query: RuleGroupType;
}

/**
 * event detail for rule/group actions.
 */
export interface QueryActionEventDetail {
  action: 'add-rule' | 'add-group' | 'remove' | 'clone' | 'lock' | 'unlock';
  path: number[];
  item?: RuleOrGroup;
}

/**
 * size options for the query builder components.
 * uses the short format (xs, sm, md, lg) which maps to:
 * - inputs/dropdowns/pickers: xs, sm, md, lg
 * - buttons: extra-small, small, medium, large
 */
export type QueryBuilderSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * button size format used by kyn-button component.
 */
export type ButtonSize = 'extra-small' | 'small' | 'medium' | 'large';

/**
 * maps QueryBuilderSize to ButtonSize.
 */
export const sizeToButtonSize: Record<QueryBuilderSize, ButtonSize> = {
  xs: 'extra-small',
  sm: 'small',
  md: 'medium',
  lg: 'large',
};
