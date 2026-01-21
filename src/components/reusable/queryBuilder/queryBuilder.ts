import { LitElement, html, unsafeCSS, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import QueryBuilderStyles from './queryBuilder.scss?inline';

import type {
  RuleGroupType,
  QueryField,
  QueryOption,
  QueryChangeEventDetail,
} from './defs/types';
import { createDefaultQuery, generateId } from './defs/helpers';

import './queryBuilderGroup';
import './queryBuilderRule';

const _defaultTextStrings = {
  title: 'Query Builder',
  emptyState: 'No conditions added. Add a rule to get started.',
  addRule: 'Add Rule',
  addGroup: 'Add Group',
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
  private _combinators: QueryOption[] = [
    { value: 'and', label: 'AND' },
    { value: 'or', label: 'OR' },
  ];

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

  /** Text string customization */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal query state for tracking changes
   * @internal
   */
  @state()
  accessor _internalQuery: RuleGroupType = createDefaultQuery();

  override willUpdate(changedProps: PropertyValues) {
    if (changedProps.has('query')) {
      // Ensure the query has an ID
      if (!this.query.id) {
        this._internalQuery = {
          ...this.query,
          id: generateId(),
        };
      } else {
        this._internalQuery = this.query;
      }
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
            .path=${[]}
            .depth=${0}
            .maxDepth=${this.maxDepth}
            isRoot
            ?showCloneButton=${this.showCloneButtons}
            ?showLockButton=${this.showLockButtons}
            ?allowDragAndDrop=${this.allowDragAndDrop}
            ?disabled=${this.disabled}
            @on-group-change=${this._handleGroupChange}
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
   * Get the current query
   */
  getQuery(): RuleGroupType {
    return this._internalQuery;
  }

  /**
   * Set the query programmatically
   */
  setQuery(query: RuleGroupType) {
    this.query = query;
  }

  /**
   * Reset the query to initial empty state
   */
  resetQuery() {
    this._internalQuery = createDefaultQuery();
    this._emitQueryChange();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-query-builder': QueryBuilder;
  }
}
