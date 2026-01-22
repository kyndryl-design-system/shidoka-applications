import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

  /** Number of siblings at this level (used to determine if drag handle should show at depth 1) */
  @property({ type: Number })
  accessor siblingCount = 1;

  /** Current drag over index for drop indicator */
  @state()
  accessor _dragOverIndex: number | null = null;

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
                size="extra-small"
                iconPosition="left"
                ?disabled=${this.disabled || this.group.disabled}
                @on-click=${this._handleAddGroup}
              >
                <span slot="icon">${unsafeSVG(addSimpleIcon)}</span>
                Group
              </kyn-button>
            `
          : null}
        ${!this.isRoot
          ? html`
              <kyn-button
                kind="outline-destructive"
                size="extra-small"
                description="Remove group"
                ?disabled=${this.disabled || this.group.disabled}
                @on-click=${this._handleRemoveGroup}
              >
                <span slot="icon">${unsafeSVG(deleteIcon)}</span>
              </kyn-button>
            `
          : null}
        ${this._renderHeaderActions()}
      </div>
    `;
  }

  private _renderDragHandle() {
    // Don't allow dragging the root group
    if (this.isRoot) {
      return null;
    }

    // At depth 1 (direct child of root), only show drag handle if there are multiple siblings
    if (this.depth === 1 && this.siblingCount <= 1) {
      return null;
    }

    const canDrag = !this.disabled && !this.group.disabled;

    return html`
      <div
        class="qb-group__drag-handle"
        title=${canDrag ? 'Drag to reorder' : ''}
        draggable="true"
        @dragstart=${this._handleDragStart}
        @dragend=${this._handleDragEnd}
      >
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
              size="extra-small"
              value=${comb.value}
              ?disabled=${this.disabled || this.group.disabled}
            >
              ${comb.label}
            </kyn-button>
          `
        )}
      </kyn-button-group>
    `;
  }

  private _handleCombinatorGroupChange(e: CustomEvent) {
    const value = e.detail.value;
    if (value) {
      this._handleCombinatorChange(value);
    }
  }

  private _renderHeaderActions() {
    // Only render clone button for non-root groups
    if (!this.showCloneButton || this.isRoot) {
      return null;
    }

    return html`
      <div class="qb-group__header-actions">
        <kyn-button
          kind="ghost"
          size="extra-small"
          description="Clone group"
          ?disabled=${this.disabled || this.group.disabled}
          @on-click=${this._handleCloneGroup}
        >
          <span slot="icon">${unsafeSVG(cloneIcon)}</span>
        </kyn-button>
      </div>
    `;
  }

  private _renderRules() {
    if (this.group.rules.length === 0) {
      return this._renderEmptyState();
    }

    return html`
      <div
        class="qb-group__rules"
        @dragover=${this._handleGroupDragOver}
        @drop=${this._handleGroupDrop}
      >
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
          size="extra-small"
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
    const isDropBefore = this._dragOverIndex === index;
    const isDropAfter =
      this._dragOverIndex === index + 1 &&
      index === this.group.rules.length - 1;

    const wrapperClasses = {
      'qb-group__item-wrapper': true,
      'qb-group__item-wrapper--drop-before': isDropBefore,
      'qb-group__item-wrapper--drop-after': isDropAfter,
    };

    if (isRuleGroup(item)) {
      return html`
        <div
          class=${classMap(wrapperClasses)}
          @dragover=${(e: DragEvent) => this._handleItemDragOver(e, index)}
          @dragleave=${this._handleItemDragLeave}
          @drop=${(e: DragEvent) => this._handleItemDrop(e, index)}
        >
          <kyn-qb-group
            .group=${item}
            .fields=${this.fields}
            .combinators=${this.combinators}
            .path=${[...this.path, index]}
            .depth=${this.depth + 1}
            .maxDepth=${this.maxDepth}
            .siblingCount=${this.group.rules.length}
            ?showCloneButton=${this.showCloneButton}
            ?showLockButton=${this.showLockButton}
            ?allowDragAndDrop=${this.allowDragAndDrop}
            ?disabled=${this.disabled || this.group.disabled}
            @on-group-change=${this._handleNestedGroupChange}
            @on-group-remove=${this._handleNestedGroupRemove}
            @on-group-clone=${this._handleNestedGroupClone}
            @on-group-lock=${this._handleNestedGroupLock}
            @on-item-move=${this._handleNestedItemMove}
          ></kyn-qb-group>
        </div>
      `;
    }

    const isLastRule = this._isLastRule(index);

    return html`
      <div
        class=${classMap(wrapperClasses)}
        @dragover=${(e: DragEvent) => this._handleItemDragOver(e, index)}
        @dragleave=${this._handleItemDragLeave}
        @drop=${(e: DragEvent) => this._handleItemDrop(e, index)}
      >
        <kyn-qb-rule
          .rule=${item}
          .fields=${this.fields}
          .index=${index}
          .parentPath=${this.path}
          .siblingCount=${this.group.rules.length}
          ?isLast=${isLastRule}
          ?showCloneButton=${this.showCloneButton}
          ?showLockButton=${this.showLockButton}
          ?allowDragAndDrop=${this.allowDragAndDrop}
          ?disabled=${this.disabled || this.group.disabled}
          @on-rule-change=${(e: CustomEvent) =>
            this._handleRuleChange(e, index)}
          @on-rule-remove=${() => this._handleRuleRemove(index)}
          @on-rule-add=${() => this._handleAddRuleAfter(index)}
          @on-rule-clone=${() => this._handleRuleClone(index)}
          @on-rule-lock=${(e: CustomEvent) => this._handleRuleLock(e, index)}
        ></kyn-qb-rule>
      </div>
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

  // ============================================
  // Drag and Drop Handlers
  // ============================================

  private _handleDragStart(e: DragEvent) {
    if (!this.allowDragAndDrop || this.disabled || this.group.disabled) {
      e.preventDefault();
      return;
    }

    const dragData = {
      type: 'group',
      id: this.group.id,
      sourceIndex: this.path[this.path.length - 1] ?? 0,
      sourcePath: this.path.slice(0, -1),
    };

    e.dataTransfer!.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer!.effectAllowed = 'move';

    // Position drag image relative to where user clicked
    const rect = this.getBoundingClientRect();
    e.dataTransfer!.setDragImage(
      this,
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    // Add visual feedback to the source element
    this.classList.add('qb-group--dragging');
  }

  private _handleDragEnd() {
    this.classList.remove('qb-group--dragging');
    this._dragOverIndex = null;
  }

  private _handleItemDragOver(e: DragEvent, index: number) {
    if (!this.allowDragAndDrop || this.disabled || this.group.disabled) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Determine drop position based on mouse position
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;

    // Set drop index: if above midpoint, drop before; if below, drop after
    const newIndex = e.clientY < midY ? index : index + 1;

    if (this._dragOverIndex !== newIndex) {
      this._dragOverIndex = newIndex;
    }

    e.dataTransfer!.dropEffect = 'move';
  }

  private _handleItemDragLeave(e: DragEvent) {
    const relatedTarget = e.relatedTarget as Node | null;
    const currentTarget = e.currentTarget as Node;

    // Only clear if leaving to outside the current wrapper
    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }

    this._dragOverIndex = null;
  }

  private _handleItemDrop(e: DragEvent, targetIndex: number) {
    e.preventDefault();
    e.stopPropagation();

    const dataStr = e.dataTransfer?.getData('text/plain');
    if (!dataStr) {
      this._dragOverIndex = null;
      return;
    }

    try {
      const dragData = JSON.parse(dataStr);

      // Calculate actual target index based on mouse position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const actualTargetIndex =
        e.clientY < midY ? targetIndex : targetIndex + 1;

      // Emit move event
      this.dispatchEvent(
        new CustomEvent('on-item-move', {
          detail: {
            dragData,
            targetPath: this.path,
            targetIndex: actualTargetIndex,
          },
          bubbles: true,
          composed: true,
        })
      );
    } catch {
      // Invalid drag data
    }

    this._dragOverIndex = null;
  }

  private _handleGroupDragOver(e: DragEvent) {
    if (!this.allowDragAndDrop || this.disabled || this.group.disabled) {
      return;
    }
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
  }

  private _handleGroupDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    const dataStr = e.dataTransfer?.getData('text/plain');
    if (!dataStr) {
      this._dragOverIndex = null;
      return;
    }

    try {
      const dragData = JSON.parse(dataStr);

      // Don't allow dropping a group into itself
      if (dragData.type === 'group') {
        const dragPath = [...dragData.sourcePath, dragData.sourceIndex];
        const thisPath = this.path;
        if (thisPath.join(',').startsWith(dragPath.join(','))) {
          this._dragOverIndex = null;
          return;
        }
      }

      // Emit move event to add at end of this group
      this.dispatchEvent(
        new CustomEvent('on-item-move', {
          detail: {
            dragData,
            targetPath: this.path,
            targetIndex: this.group.rules.length,
          },
          bubbles: true,
          composed: true,
        })
      );
    } catch {
      // Invalid drag data
    }

    this._dragOverIndex = null;
  }

  private _handleNestedItemMove(e: CustomEvent) {
    // Bubble up move events from nested groups
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('on-item-move', {
        detail: e.detail,
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-qb-group': QueryBuilderGroup;
  }
}
