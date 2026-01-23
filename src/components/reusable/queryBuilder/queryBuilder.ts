import { LitElement, html, unsafeCSS, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { deepmerge } from 'deepmerge-ts';

import QueryBuilderStyles from './queryBuilder.scss?inline';

import type {
  RuleGroupType,
  RuleOrGroup,
  QueryField,
  QueryOption,
  QueryChangeEventDetail,
  QueryBuilderSize,
} from './defs/types';
import { isRuleGroup } from './defs/types';
import { createDefaultQuery, generateId } from './defs/helpers';

import './queryBuilderGroup';
import './queryBuilderRule';

const _defaultTextStrings = {
  and: 'AND',
  or: 'OR',
  removeGroup: 'Remove group',
  cloneGroup: 'Clone group',
  addRule: 'Add rule',
  addGroup: 'Group',
  lockGroup: 'Lock group',
  unlockGroup: 'Unlock group',
  removeRule: 'Remove rule',
  cloneRule: 'Clone rule',
  lockRule: 'Lock rule',
  unlockRule: 'Unlock rule',
  dragToReorder: 'Drag to reorder',
  selectField: 'Select field',
  selectOperator: 'Select operator',
  value: 'Value',
  selectValue: 'Select value',
  selectValues: 'Select values',
  selectDate: 'Select date',
  selectDateTime: 'Select date/time',
  selectTime: 'Select time',
  min: 'Min',
  max: 'Max',
  start: 'Start',
  end: 'End',
  from: 'From',
  to: 'To',
};

/**
 * Query Builder component.
 * A visual query builder for constructing complex filter conditions.
 *
 * @fires on-query-change - Emits when the query changes. `detail: { query: RuleGroupType }`
 * @slot header - Slot for custom header content
 *
 * @example
 * ```html
 * <kyn-query-builder
 *   .fields=${[
 *     { name: 'firstName', label: 'First Name', dataType: 'text' },
 *     { name: 'age', label: 'Age', dataType: 'number' },
 *     { name: 'status', label: 'Status', dataType: 'select', values: [
 *       { value: 'active', label: 'Active' },
 *       { value: 'inactive', label: 'Inactive' },
 *     ]},
 *   ]}
 *   @on-query-change=${(e) => console.log(e.detail.query)}
 * ></kyn-query-builder>
 * ```
 */
@customElement('kyn-query-builder')
export class QueryBuilder extends LitElement {
  static override styles = unsafeCSS(QueryBuilderStyles);

  /** The query data structure */
  @property({ type: Object })
  accessor query: RuleGroupType = createDefaultQuery();

  /** Available fields to query */
  @property({ type: Array })
  accessor fields: QueryField[] = [];

  /** Available combinators (internal) */
  private get _combinators(): QueryOption[] {
    return [
      { value: 'and', label: this._textStrings.and },
      { value: 'or', label: this._textStrings.or },
    ];
  }

  /** Show clone button on rules/groups */
  @property({ type: Boolean })
  accessor showCloneButtons = false;

  /** Show lock/disable button on rules/groups */
  @property({ type: Boolean })
  accessor showLockButtons = false;

  /** Maximum nesting depth (default: unlimited) */
  @property({ type: Number })
  accessor maxDepth = Infinity;

  /** Enable drag-and-drop reordering */
  @property({ type: Boolean })
  accessor allowDragAndDrop = true;

  /** Disable the entire query builder */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Size of all child components (buttons, inputs, dropdowns, datepickers) */
  @property({ type: String })
  accessor size: QueryBuilderSize = 'xs';

  /** Text string customization for i18n. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal query state for tracking changes
   * @internal
   */
  @state()
  accessor _internalQuery: RuleGroupType = createDefaultQuery();

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

  override willUpdate(changedProps: PropertyValues) {
    if (changedProps.has('query')) {
      // ensure the query has an ID
      if (!this.query.id) {
        this._internalQuery = {
          ...this.query,
          id: generateId(),
        };
      } else {
        this._internalQuery = this.query;
      }
    }

    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override render() {
    const classes = {
      'query-builder': true,
      'query-builder--disabled': this.disabled,
    };

    return html`
      <div class=${classMap(classes)}>
        <slot name="header"></slot>
        <div class="query-builder__content">
          <kyn-qb-group
            .group=${this._internalQuery}
            .fields=${this.fields}
            .combinators=${this._combinators}
            .textStrings=${this._textStrings}
            .path=${[]}
            .depth=${0}
            .maxDepth=${this.maxDepth}
            .size=${this.size}
            isRoot
            ?showCloneButton=${this.showCloneButtons}
            ?showLockButton=${this.showLockButtons}
            ?allowDragAndDrop=${this.allowDragAndDrop}
            ?disabled=${this.disabled}
            @on-group-change=${this._handleGroupChange}
            @on-group-lock=${this._handleGroupLock}
            @on-item-move=${this._handleItemMove}
          ></kyn-qb-group>
        </div>
      </div>
    `;
  }

  private _handleGroupChange(e: CustomEvent) {
    e.stopPropagation();
    const { group } = e.detail;

    this._internalQuery = group;
    this._emitQueryChange();
  }

  private _handleGroupLock(e: CustomEvent) {
    e.stopPropagation();
    const { disabled } = e.detail;

    this._internalQuery = {
      ...this._internalQuery,
      disabled,
    };
    this._emitQueryChange();
  }

  private _emitQueryChange() {
    const detail: QueryChangeEventDetail = {
      query: this._internalQuery,
    };

    this.dispatchEvent(
      new CustomEvent('on-query-change', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * get the current query
   */
  getQuery(): RuleGroupType {
    return this._internalQuery;
  }

  /**
   * set the query programmatically
   */
  setQuery(query: RuleGroupType) {
    this.query = query;
  }

  /**
   * reset the query to initial empty state
   */
  resetQuery() {
    this._internalQuery = createDefaultQuery();
    this._emitQueryChange();
  }

  /**
   * handle drag-and-drop move events
   */
  private _handleItemMove(e: CustomEvent) {
    e.stopPropagation();

    const { dragData, targetPath, targetIndex } = e.detail;

    // deep clone the query
    const newQuery = JSON.parse(
      JSON.stringify(this._internalQuery)
    ) as RuleGroupType;

    // find and remove the item from its source location
    const sourceGroup = this._getGroupAtPath(newQuery, dragData.sourcePath);
    if (!sourceGroup) return;

    const [movedItem] = sourceGroup.rules.splice(dragData.sourceIndex, 1);
    if (!movedItem) return;

    // find the target group and insert the item
    const targetGroup = this._getGroupAtPath(newQuery, targetPath);
    if (!targetGroup) return;

    // adjust target index if moving within same group and source was before target
    let adjustedTargetIndex = targetIndex;
    if (
      JSON.stringify(dragData.sourcePath) === JSON.stringify(targetPath) &&
      dragData.sourceIndex < targetIndex
    ) {
      adjustedTargetIndex = Math.max(0, targetIndex - 1);
    }

    targetGroup.rules.splice(adjustedTargetIndex, 0, movedItem);

    this._internalQuery = newQuery;
    this._emitQueryChange();
  }

  /**
   * get a group at a specific path in the query tree
   */
  private _getGroupAtPath(
    query: RuleGroupType,
    path: number[]
  ): RuleGroupType | null {
    if (path.length === 0) {
      return query;
    }

    let current: RuleOrGroup = query;
    for (const index of path) {
      if (!isRuleGroup(current)) {
        return null;
      }
      current = current.rules[index];
      if (!current) {
        return null;
      }
    }

    return isRuleGroup(current) ? current : null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-query-builder': QueryBuilder;
  }
}
