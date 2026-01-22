import type { RuleGroupType } from './types';

/**
 * Generate a unique ID for rules and groups
 */
export function generateId(): string {
  return `qb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create the initial/default query structure
 */
export function createDefaultQuery(): RuleGroupType {
  return {
    id: generateId(),
    combinator: 'and',
    rules: [],
  };
}
