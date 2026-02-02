import type { RuleGroupType, RuleType } from './types';

/**
 * Generate a unique ID for rules and groups
 */
export function generateId(): string {
  return `qb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create an empty rule with no field/operator/value selected
 */
export function createEmptyRule(): RuleType {
  return {
    id: `rule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    field: '',
    operator: '',
    value: '',
  };
}

/**
 * Create the initial/default query structure with one empty rule
 */
export function createDefaultQuery(): RuleGroupType {
  return {
    id: generateId(),
    combinator: 'and',
    rules: [createEmptyRule()],
  };
}
