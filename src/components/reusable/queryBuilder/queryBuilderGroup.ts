import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import QueryBuilderGroupStyles from './queryBuilderGroup.scss?inline';

import type {
  RuleGroupType,
  RuleType,
  RuleOrGroup,
  QueryField,
  QueryOption,
} from './defs/types';
import { isRuleGroup } from './defs/types';

import './queryBuilderRule';
import '../button';
import '../buttonGroup';

// Import icons
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/delete.svg';
import addSimpleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';
import dragIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/draggable.svg';
import lockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/lock.svg';
import unlockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/unlock.svg';
import cloneIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';

/**
 * Query Builder Group component.
 * Represents a group of rules with a combinator (AND/OR).
 *
 * @fires on-group-change - Emits when the group changes. `detail: { group: RuleGroupType, path: number[] }`
 * @fires on-group-remove - Emits when the group should be removed. `detail: { groupId: string, path: number[] }`
 * @fires on-group-clone - Emits when the group should be cloned. `detail: { groupId: string, path: number[] }`
 * @fires on-group-lock - Emits when the group lock state changes. `detail: { groupId: string, disabled: boolean, path: number[] }`
 */
@customElement('kyn-qb-group')
export class QueryBuilderGroup extends LitElement {
  static override styles = unsafeCSS(QueryBuilderGroupStyles);

  /** The group data */
  @property({ type: Object })
  accessor group: RuleGroupType = {
    id: '',
    combinator: 'and',
    rules: [],
  };

  /** Available fields for rules */
  @property({ type: Array })
  accessor fields: QueryField[] = [];

  /** Available combinators */
  @property({ type: Array })
  accessor combinators: QueryOption[] = [
    { value: 'and', label: 'AND' },
    { value: 'or', label: 'OR' },
  ];

  /** Path to this group in the query tree */
  @property({ type: Array })
  accessor path: number[] = [];

  /** Current depth level (0 = root) */
  @property({ type: Number })
  accessor depth = 0;

  /** Maximum allowed depth */
  @property({ type: Number })
  accessor maxDepth = Infinity;

  /** Whether this is the root group */
  @property({ type: Boolean })
  accessor isRoot = false;

  /** Whether to show NOT toggle */
  @property({ type: Boolean })
  accessor showNotToggle = false;

  /** Whether to show clone button */
  @property({ type: Boolean })
  accessor showCloneButton = false;

  /** Whether to show lock button */
  @property({ type: Boolean })
  accessor showLockButton = false;

  /** Whether drag and drop is enabled */
  @property({ type: Boolean })
  accessor allowDragAndDrop = true;

  /** Whether the group is disabled/locked */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  override render() {
    const classes = {
      'qb-group': true,
      'qb-group--root': this.isRoot,
      'qb-group--nested': !this.isRoot,
      'qb-group--disabled': this.disabled || !!this.group.disabled,
      [`qb-group--depth-${Math.min(this.depth, 4)}`]: true,
    };

    return html`
      <div class=${classMap(classes)}>
        ${this._renderHeader()}
        <div class="qb-group__content">${this._renderRules()}</div>
      </div>
    `;
  }

  private _renderHeader() {
    const canAddGroup = this.depth < this.maxDepth;

    return html`
      <div class="qb-group__header">
        ${this.allowDragAndDrop ? this._renderDragHandle() : null}
        ${this._renderCombinatorToggle()}
        ${canAddGroup
          ? html`
              <kyn-button
                kind="outline"
                size="small"
                iconPosition="left"
                ?disabled=${this.disabled || this.group.disabled}
                @on-click=${this._handleAddGroup}
              >
                <span slot="icon">${unsafeSVG(addSimpleIcon)}</span>
                Group
              </kyn-button>
            `
          : null}
        <kyn-button
          kind="outline-destructive"
          size="small"
          description="Remove group"
          ?disabled=${this.disabled || this.group.disabled}
          @on-click=${this._handleRemoveGroup}
        >
          <span slot="icon">${unsafeSVG(deleteIcon)}</span>
        </kyn-button>
        ${this._renderHeaderActions()}
      </div>
    `;
  }

  private _renderDragHandle() {
    return html`
      <div class="qb-group__drag-handle" title="Drag to reorder">
        ${unsafeSVG(dragIcon)}
      </div>
    `;
  }

  private _renderCombinatorToggle() {
    const selectedIndex = this.combinators.findIndex(
      (c) => c.value === this.group.combinator
    );

    return html`
      <kyn-button-group
        class="qb-group__combinator"
        .selectedIndex=${selectedIndex >= 0 ? selectedIndex : 0}
        @on-change=${this._handleCombinatorGroupChange}
      >
        ${this.combinators.map(
          (comb) => html`
            <kyn-button
              kind="tertiary"
              size="small"
              value=${comb.value}
              ?disabled=${this.disabled || this.group.disabled}
            >
              ${comb.label}
            </kyn-button>
          `
        )}
      </kyn-button-group>
      ${this.showNotToggle
        ? html`
            <kyn-button
              kind=${this.group.not ? 'primary-destructive' : 'tertiary'}
              size="small"
              ?disabled=${this.disabled || this.group.disabled}
              @on-click=${this._handleNotToggle}
              description="Negate group (NOT)"
            >
              NOT
            </kyn-button>
          `
        : null}
    `;
  }

  private _handleCombinatorGroupChange(e: CustomEvent) {
    const value = e.detail.value;
    if (value) {
      this._handleCombinatorChange(value);
    }
  }

  private _renderHeaderActions() {
    // Only render if there are optional buttons to show
    if (!this.showCloneButton && !this.showLockButton) {
      return null;
    }

    return html`
      <div class="qb-group__header-actions">
        ${this.showCloneButton && !this.isRoot
          ? html`
              <kyn-button
                kind="ghost"
                size="small"
                description="Clone group"
                ?disabled=${this.disabled || this.group.disabled}
                @on-click=${this._handleCloneGroup}
              >
                <span slot="icon">${unsafeSVG(cloneIcon)}</span>
              </kyn-button>
            `
          : null}
        ${this.showLockButton
          ? html`
              <kyn-button
                kind="ghost"
                size="small"
                description=${this.group.disabled
                  ? 'Unlock group'
                  : 'Lock group'}
                @on-click=${this._handleLockToggle}
              >
                <span slot="icon">
                  ${unsafeSVG(this.group.disabled ? lockIcon : unlockIcon)}
                </span>
              </kyn-button>
            `
          : null}
      </div>
    `;
  }

  private _renderRules() {
    if (this.group.rules.length === 0) {
      return this._renderEmptyState();
    }

    return html`
      <div class="qb-group__rules">
        ${repeat(
          this.group.rules,
          (item) => item.id,
          (item, index) => this._renderRuleOrGroup(item, index)
        )}
      </div>
    `;
  }

  private _renderEmptyState() {
    return html`
      <div class="qb-group__empty">
        <kyn-button
          kind="ghost"
          size="small"
          iconPosition="left"
          ?disabled=${this.disabled || this.group.disabled}
          @on-click=${this._handleAddRule}
        >
          <span slot="icon">${unsafeSVG(addSimpleIcon)}</span>
          Add Rule
        </kyn-button>
      </div>
    `;
  }

  private _renderRuleOrGroup(item: RuleOrGroup, index: number) {
    if (isRuleGroup(item)) {
      return html`
        <kyn-qb-group
          .group=${item}
          .fields=${this.fields}
          .combinators=${this.combinators}
          .path=${[...this.path, index]}
          .depth=${this.depth + 1}
          .maxDepth=${this.maxDepth}
          ?showNotToggle=${this.showNotToggle}
          ?showCloneButton=${this.showCloneButton}
          ?showLockButton=${this.showLockButton}
          ?allowDragAndDrop=${this.allowDragAndDrop}
          ?disabled=${this.disabled || this.group.disabled}
          @on-group-change=${this._handleNestedGroupChange}
          @on-group-remove=${this._handleNestedGroupRemove}
          @on-group-clone=${this._handleNestedGroupClone}
          @on-group-lock=${this._handleNestedGroupLock}
        ></kyn-qb-group>
      `;
    }

    const isLastRule = this._isLastRule(index);

    return html`
      <kyn-qb-rule
        .rule=${item}
        .fields=${this.fields}
        ?isLast=${isLastRule}
        ?showCloneButton=${this.showCloneButton}
        ?showLockButton=${this.showLockButton}
        ?allowDragAndDrop=${this.allowDragAndDrop}
        ?disabled=${this.disabled || this.group.disabled}
        @on-rule-change=${(e: CustomEvent) => this._handleRuleChange(e, index)}
        @on-rule-remove=${() => this._handleRuleRemove(index)}
        @on-rule-add=${() => this._handleAddRuleAfter(index)}
        @on-rule-clone=${() => this._handleRuleClone(index)}
        @on-rule-lock=${(e: CustomEvent) => this._handleRuleLock(e, index)}
      ></kyn-qb-rule>
    `;
  }

  /** Check if this is the last rule (not group) in the rules array */
  private _isLastRule(index: number): boolean {
    // Find the index of the last rule (non-group) item
    for (let i = this.group.rules.length - 1; i >= 0; i--) {
      if (!isRuleGroup(this.group.rules[i])) {
        return i === index;
      }
    }
    return false;
  }

  private _handleCombinatorChange(combinator: string) {
    const updatedGroup: RuleGroupType = {
      ...this.group,
      combinator: combinator as 'and' | 'or',
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleNotToggle() {
    const updatedGroup: RuleGroupType = {
      ...this.group,
      not: !this.group.not,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleAddRule() {
    this._addNewRule(this.group.rules.length);
  }

  private _handleAddRuleAfter(index: number) {
    this._addNewRule(index + 1);
  }

  private _addNewRule(insertIndex: number) {
    const newRule: RuleType = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      field: '',
      operator: '',
      value: '',
    };

    const newRules = [...this.group.rules];
    newRules.splice(insertIndex, 0, newRule);

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: newRules,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleAddGroup() {
    const newGroup: RuleGroupType = {
      id: `group-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      combinator: 'and',
      rules: [],
    };

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: [...this.group.rules, newGroup],
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleRuleChange(e: CustomEvent, index: number) {
    e.stopPropagation();
    const updatedRule = e.detail.rule as RuleType;

    const newRules = [...this.group.rules];
    newRules[index] = updatedRule;

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: newRules,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleRuleRemove(index: number) {
    const newRules = [...this.group.rules];
    newRules.splice(index, 1);

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: newRules,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleRuleClone(index: number) {
    const originalRule = this.group.rules[index] as RuleType;
    const clonedRule: RuleType = {
      ...originalRule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    const newRules = [...this.group.rules];
    newRules.splice(index + 1, 0, clonedRule);

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: newRules,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleRuleLock(e: CustomEvent, index: number) {
    const { disabled } = e.detail;
    const rule = this.group.rules[index] as RuleType;

    const updatedRule: RuleType = {
      ...rule,
      disabled,
    };

    const newRules = [...this.group.rules];
    newRules[index] = updatedRule;

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: newRules,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleNestedGroupChange(e: CustomEvent) {
    e.stopPropagation();
    const { group: nestedGroup, path } = e.detail;

    // Find the index in our rules array
    const localIndex = path[this.path.length];
    if (localIndex === undefined) return;

    const newRules = [...this.group.rules];
    newRules[localIndex] = nestedGroup;

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: newRules,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleNestedGroupRemove(e: CustomEvent) {
    e.stopPropagation();
    const { path } = e.detail;

    // Find the index in our rules array
    const localIndex = path[this.path.length];
    if (localIndex === undefined) return;

    const newRules = [...this.group.rules];
    newRules.splice(localIndex, 1);

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: newRules,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleNestedGroupClone(e: CustomEvent) {
    e.stopPropagation();
    const { path } = e.detail;

    // Find the index in our rules array
    const localIndex = path[this.path.length];
    if (localIndex === undefined) return;

    const originalGroup = this.group.rules[localIndex] as RuleGroupType;
    const clonedGroup = this._deepCloneGroup(originalGroup);

    const newRules = [...this.group.rules];
    newRules.splice(localIndex + 1, 0, clonedGroup);

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: newRules,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleNestedGroupLock(e: CustomEvent) {
    e.stopPropagation();
    const { path, disabled } = e.detail;

    // Find the index in our rules array
    const localIndex = path[this.path.length];
    if (localIndex === undefined) return;

    const nestedGroup = this.group.rules[localIndex] as RuleGroupType;
    const updatedNestedGroup: RuleGroupType = {
      ...nestedGroup,
      disabled,
    };

    const newRules = [...this.group.rules];
    newRules[localIndex] = updatedNestedGroup;

    const updatedGroup: RuleGroupType = {
      ...this.group,
      rules: newRules,
    };
    this._emitGroupChange(updatedGroup);
  }

  private _handleRemoveGroup() {
    this.dispatchEvent(
      new CustomEvent('on-group-remove', {
        detail: { groupId: this.group.id, path: this.path },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleCloneGroup() {
    this.dispatchEvent(
      new CustomEvent('on-group-clone', {
        detail: { groupId: this.group.id, path: this.path },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleLockToggle() {
    this.dispatchEvent(
      new CustomEvent('on-group-lock', {
        detail: {
          groupId: this.group.id,
          disabled: !this.group.disabled,
          path: this.path,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _emitGroupChange(group: RuleGroupType) {
    this.dispatchEvent(
      new CustomEvent('on-group-change', {
        detail: { group, path: this.path },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _deepCloneGroup(group: RuleGroupType): RuleGroupType {
    const cloned: RuleGroupType = {
      ...group,
      id: `group-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      rules: group.rules.map((item) => {
        if (isRuleGroup(item)) {
          return this._deepCloneGroup(item);
        }
        return {
          ...item,
          id: `rule-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
        };
      }),
    };
    return cloned;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-qb-group': QueryBuilderGroup;
  }
}
