import type { QueryOperator, FieldDataType } from './types';

/**
 * Default operators for text fields
 */
export const TEXT_OPERATORS: QueryOperator[] = [
  { name: 'equal', label: 'Equal' },
  { name: 'notEqual', label: 'Not Equal' },
  { name: 'contains', label: 'Contains' },
  { name: 'notContains', label: 'Does Not Contain' },
  { name: 'startsWith', label: 'Starts With' },
  { name: 'endsWith', label: 'Ends With' },
  { name: 'isNull', label: 'Is Empty', arity: 'unary' },
  { name: 'isNotNull', label: 'Is Not Empty', arity: 'unary' },
];

/**
 * Default operators for number fields
 */
export const NUMBER_OPERATORS: QueryOperator[] = [
  { name: 'equal', label: 'Equal' },
  { name: 'notEqual', label: 'Not Equal' },
  { name: 'lessThan', label: 'Less Than' },
  { name: 'lessThanOrEqual', label: 'Less Than Or Equal' },
  { name: 'greaterThan', label: 'Greater Than' },
  { name: 'greaterThanOrEqual', label: 'Greater Than Or Equal' },
  { name: 'between', label: 'Between' },
  { name: 'notBetween', label: 'Not Between' },
  { name: 'isNull', label: 'Is Empty', arity: 'unary' },
  { name: 'isNotNull', label: 'Is Not Empty', arity: 'unary' },
];

/**
 * Default operators for date/datetime fields
 */
export const DATE_OPERATORS: QueryOperator[] = [
  { name: 'equal', label: 'Equal' },
  { name: 'notEqual', label: 'Not Equal' },
  { name: 'before', label: 'Before' },
  { name: 'after', label: 'After' },
  { name: 'between', label: 'Between' },
  { name: 'isNull', label: 'Is Empty', arity: 'unary' },
  { name: 'isNotNull', label: 'Is Not Empty', arity: 'unary' },
];

/**
 * Default operators for time fields
 */
export const TIME_OPERATORS: QueryOperator[] = [
  { name: 'equal', label: 'Equal' },
  { name: 'notEqual', label: 'Not Equal' },
  { name: 'before', label: 'Before' },
  { name: 'after', label: 'After' },
  { name: 'between', label: 'Between' },
  { name: 'isNull', label: 'Is Empty', arity: 'unary' },
  { name: 'isNotNull', label: 'Is Not Empty', arity: 'unary' },
];

/**
 * Default operators for boolean fields
 */
export const BOOLEAN_OPERATORS: QueryOperator[] = [
  { name: 'equal', label: 'Is' },
];

/**
 * Default operators for select/multiselect fields
 */
export const SELECT_OPERATORS: QueryOperator[] = [
  { name: 'equal', label: 'Equal' },
  { name: 'notEqual', label: 'Not Equal' },
  { name: 'in', label: 'In' },
  { name: 'notIn', label: 'Not In' },
  { name: 'isNull', label: 'Is Empty', arity: 'unary' },
  { name: 'isNotNull', label: 'Is Not Empty', arity: 'unary' },
];

/**
 * Get default operators for a given field data type
 */
export function getOperatorsForType(dataType: FieldDataType): QueryOperator[] {
  switch (dataType) {
    case 'text':
      return TEXT_OPERATORS;
    case 'number':
      return NUMBER_OPERATORS;
    case 'date':
    case 'datetime':
      return DATE_OPERATORS;
    case 'time':
      return TIME_OPERATORS;
    case 'boolean':
      return BOOLEAN_OPERATORS;
    case 'select':
      return SELECT_OPERATORS;
    default:
      return TEXT_OPERATORS;
  }
}

/**
 * Check if an operator is unary (doesn't require a value)
 */
export function isUnaryOperator(
  operator: string,
  operators: QueryOperator[]
): boolean {
  const op = operators.find((o) => o.name === operator);
  return op?.arity === 'unary';
}

/**
 * Check if an operator requires two values (between, notBetween)
 */
export function isBetweenOperator(operator: string): boolean {
  return operator === 'between' || operator === 'notBetween';
}

/**
 * Check if an operator works with multiple values (in, notIn)
 */
export function isMultiValueOperator(operator: string): boolean {
  return operator === 'in' || operator === 'notIn';
}
