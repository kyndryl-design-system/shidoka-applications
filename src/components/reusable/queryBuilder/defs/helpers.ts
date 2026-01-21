import type { RuleGroupType, RuleType, RuleOrGroup, QueryField } from './types';
import { isRuleGroup } from './types';
import { getOperatorsForType } from './operators';

/**
 * Generate a unique ID for rules and groups
 */
export function generateId(): string {
  return `qb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new empty rule
 */
export function createRule(fields: QueryField[]): RuleType {
  const defaultField = fields[0];
  const operators =
    defaultField?.operators ||
    getOperatorsForType(defaultField?.dataType || 'text');

  return {
    id: generateId(),
    field: '',
    operator: operators[0]?.name || 'equal',
    value: defaultField?.defaultValue ?? '',
  };
}

/**
 * Create a new empty rule group
 */
export function createRuleGroup(
  combinator: 'and' | 'or' = 'and'
): RuleGroupType {
  return {
    id: generateId(),
    combinator,
    rules: [],
  };
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

/**
 * Deep clone a query object
 */
export function cloneQuery<T extends RuleOrGroup>(query: T): T {
  return JSON.parse(JSON.stringify(query));
}

/**
 * Clone a rule or group with new IDs
 */
export function cloneWithNewIds<T extends RuleOrGroup>(item: T): T {
  const cloned = cloneQuery(item);
  regenerateIds(cloned);
  return cloned;
}

/**
 * Recursively regenerate IDs for a rule or group
 */
function regenerateIds(item: RuleOrGroup): void {
  item.id = generateId();
  if (isRuleGroup(item)) {
    item.rules.forEach(regenerateIds);
  }
}

/**
 * Find an item in the query tree by path
 * Path is an array of indices, e.g., [0, 1, 2] means root.rules[0].rules[1].rules[2]
 */
export function findByPath(
  query: RuleGroupType,
  path: number[]
): RuleOrGroup | undefined {
  if (path.length === 0) {
    return query;
  }

  let current: RuleOrGroup = query;

  for (const index of path) {
    if (!isRuleGroup(current) || index >= current.rules.length) {
      return undefined;
    }
    current = current.rules[index];
  }

  return current;
}

/**
 * Find the parent group of an item by path
 */
export function findParentByPath(
  query: RuleGroupType,
  path: number[]
): RuleGroupType | undefined {
  if (path.length === 0) {
    return undefined;
  }

  const parentPath = path.slice(0, -1);
  const parent = findByPath(query, parentPath);

  return parent && isRuleGroup(parent) ? parent : undefined;
}

/**
 * Add a rule to a group at the specified path
 */
export function addRule(
  query: RuleGroupType,
  path: number[],
  fields: QueryField[]
): RuleGroupType {
  const newQuery = cloneQuery(query);
  const group = findByPath(newQuery, path);

  if (group && isRuleGroup(group)) {
    group.rules.push(createRule(fields));
  }

  return newQuery;
}

/**
 * Add a nested group to a group at the specified path
 */
export function addGroup(
  query: RuleGroupType,
  path: number[],
  combinator: 'and' | 'or' = 'and'
): RuleGroupType {
  const newQuery = cloneQuery(query);
  const group = findByPath(newQuery, path);

  if (group && isRuleGroup(group)) {
    group.rules.push(createRuleGroup(combinator));
  }

  return newQuery;
}

/**
 * Remove an item (rule or group) at the specified path
 */
export function removeItem(
  query: RuleGroupType,
  path: number[]
): RuleGroupType {
  if (path.length === 0) {
    // Can't remove the root group
    return query;
  }

  const newQuery = cloneQuery(query);
  const parentPath = path.slice(0, -1);
  const index = path[path.length - 1];
  const parent = findByPath(newQuery, parentPath);

  if (parent && isRuleGroup(parent) && index < parent.rules.length) {
    parent.rules.splice(index, 1);
  }

  return newQuery;
}

/**
 * Update a rule at the specified path
 */
export function updateRule(
  query: RuleGroupType,
  path: number[],
  updates: Partial<RuleType>
): RuleGroupType {
  const newQuery = cloneQuery(query);
  const item = findByPath(newQuery, path);

  if (item && !isRuleGroup(item)) {
    Object.assign(item, updates);
  }

  return newQuery;
}

/**
 * Update a group's combinator at the specified path
 */
export function updateCombinator(
  query: RuleGroupType,
  path: number[],
  combinator: 'and' | 'or'
): RuleGroupType {
  const newQuery = cloneQuery(query);
  const item = findByPath(newQuery, path);

  if (item && isRuleGroup(item)) {
    item.combinator = combinator;
  }

  return newQuery;
}

/**
 * Toggle the NOT flag on a group at the specified path
 */
export function toggleNot(query: RuleGroupType, path: number[]): RuleGroupType {
  const newQuery = cloneQuery(query);
  const item = findByPath(newQuery, path);

  if (item && isRuleGroup(item)) {
    item.not = !item.not;
  }

  return newQuery;
}

/**
 * Toggle the disabled flag on an item at the specified path
 */
export function toggleDisabled(
  query: RuleGroupType,
  path: number[]
): RuleGroupType {
  const newQuery = cloneQuery(query);
  const item = findByPath(newQuery, path);

  if (item) {
    item.disabled = !item.disabled;
  }

  return newQuery;
}

/**
 * Clone an item at the specified path and insert it after
 */
export function cloneItem(query: RuleGroupType, path: number[]): RuleGroupType {
  if (path.length === 0) {
    // Can't clone the root
    return query;
  }

  const newQuery = cloneQuery(query);
  const parentPath = path.slice(0, -1);
  const index = path[path.length - 1];
  const parent = findByPath(newQuery, parentPath);
  const item = findByPath(newQuery, path);

  if (parent && isRuleGroup(parent) && item) {
    const cloned = cloneWithNewIds(item);
    parent.rules.splice(index + 1, 0, cloned);
  }

  return newQuery;
}

/**
 * Move an item from one path to another
 */
export function moveItem(
  query: RuleGroupType,
  fromPath: number[],
  toPath: number[]
): RuleGroupType {
  if (fromPath.length === 0) {
    // Can't move the root
    return query;
  }

  const newQuery = cloneQuery(query);
  const item = findByPath(newQuery, fromPath);

  if (!item) {
    return query;
  }

  // Remove from old location
  const fromParentPath = fromPath.slice(0, -1);
  const fromIndex = fromPath[fromPath.length - 1];
  const fromParent = findByPath(newQuery, fromParentPath);

  if (!fromParent || !isRuleGroup(fromParent)) {
    return query;
  }

  const [removed] = fromParent.rules.splice(fromIndex, 1);

  // Adjust toPath if it was affected by the removal
  const adjustedToPath = [...toPath];
  if (fromParentPath.length === adjustedToPath.slice(0, -1).length) {
    // Same parent
    const toIndex = adjustedToPath[adjustedToPath.length - 1];
    if (toIndex > fromIndex) {
      adjustedToPath[adjustedToPath.length - 1] = toIndex - 1;
    }
  }

  // Insert at new location
  const toParentPath = adjustedToPath.slice(0, -1);
  const toIndex = adjustedToPath[adjustedToPath.length - 1];
  const toParent = findByPath(newQuery, toParentPath);

  if (!toParent || !isRuleGroup(toParent)) {
    // Restore original
    fromParent.rules.splice(fromIndex, 0, removed);
    return query;
  }

  toParent.rules.splice(toIndex, 0, removed);

  return newQuery;
}

/**
 * Get the depth of a path (0 = root)
 */
export function getDepth(path: number[]): number {
  return path.length;
}

/**
 * Check if adding a group at the path would exceed max depth
 */
export function wouldExceedMaxDepth(path: number[], maxDepth: number): boolean {
  return path.length >= maxDepth;
}

/**
 * Count total rules in a query (excluding groups)
 */
export function countRules(query: RuleGroupType): number {
  let count = 0;

  for (const item of query.rules) {
    if (isRuleGroup(item)) {
      count += countRules(item);
    } else {
      count += 1;
    }
  }

  return count;
}

/**
 * Count total groups in a query (including root)
 */
export function countGroups(query: RuleGroupType): number {
  let count = 1; // Include self

  for (const item of query.rules) {
    if (isRuleGroup(item)) {
      count += countGroups(item);
    }
  }

  return count;
}
