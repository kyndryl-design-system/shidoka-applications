import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import QueryBuilderRuleStyles from './queryBuilderRule.scss?inline';

import type { RuleType, QueryField, QueryOperator } from './defs/types';
import {
  getOperatorsForType,
  isUnaryOperator,
  isBetweenOperator,
  isMultiValueOperator,
} from './defs/operators';

// Import Shidoka components
import '../dropdown';
import '../textInput';
import '../numberInput';
import '../datePicker';
import '../timepicker';
import '../toggleButton';
import '../button';
import '../radioButton';
import '../sliderInput';

// Import icons
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/delete.svg';
import addSimpleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';
import dragIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/draggable.svg';
import lockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/lock.svg';
import unlockIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/unlock.svg';
import cloneIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';

/**
 * Query Builder Rule component.
 * Represents a single condition in the query (field + operator + value).
 *
 * @fires on-rule-change - Emits when the rule changes. `detail: { rule: RuleType }`
 * @fires on-rule-remove - Emits when the rule should be removed. `detail: { ruleId: string }`
 * @fires on-rule-add - Emits when a new rule should be added after this one. `detail: { ruleId: string }`
 * @fires on-rule-clone - Emits when the rule should be cloned. `detail: { ruleId: string }`
 * @fires on-rule-lock - Emits when the rule lock state changes. `detail: { ruleId: string, disabled: boolean }`
 */
@customElement('kyn-qb-rule')
export class QueryBuilderRule extends LitElement {
  static override styles = unsafeCSS(QueryBuilderRuleStyles);

  /** The rule data */
  @property({ type: Object })
  accessor rule: RuleType = {
    id: '',
    field: '',
    operator: '',
    value: '',
  };

  /** Available fields */
  @property({ type: Array })
  accessor fields: QueryField[] = [];

  /** Whether this is the last rule in the group (shows add button) */
  @property({ type: Boolean })
  accessor isLast = false;

  /** Whether to show the clone button */
  @property({ type: Boolean })
  accessor showCloneButton = false;

  /** Whether to show the lock button */
  @property({ type: Boolean })
  accessor showLockButton = false;

  /** Whether drag and drop is enabled */
  @property({ type: Boolean })
  accessor allowDragAndDrop = true;

  /** Whether the rule is disabled/locked */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Index of this rule in its parent group (for drag-and-drop) */
  @property({ type: Number })
  accessor index = 0;

  /** Path to the parent group (for drag-and-drop) */
  @property({ type: Array })
  accessor parentPath: number[] = [];

  /** Get the currently selected field configuration */
  private get selectedField(): QueryField | undefined {
    return this.fields.find((f) => f.name === this.rule.field);
  }

  /** Get operators for the current field */
  private get operators(): QueryOperator[] {
    const field = this.selectedField;
    if (field?.operators) {
      return field.operators;
    }
    return getOperatorsForType(field?.dataType || 'text');
  }

  /** Check if current operator is unary (no value needed) */
  private get isUnary(): boolean {
    return isUnaryOperator(this.rule.operator, this.operators);
  }

  /** Check if current operator requires two values */
  private get isBetween(): boolean {
    return isBetweenOperator(this.rule.operator);
  }

  /** Check if current operator accepts multiple values */
  private get isMultiValue(): boolean {
    return isMultiValueOperator(this.rule.operator);
  }

  override render() {
    const classes = {
      'qb-rule': true,
      'qb-rule--disabled': this.disabled || !!this.rule.disabled,
    };

    return html`
      <div class=${classMap(classes)}>
        ${this.allowDragAndDrop ? this._renderDragHandle() : null}
        <div class="qb-rule__fields">
          ${this._renderFieldSelector()} ${this._renderOperatorSelector()}
          ${!this.isUnary ? this._renderValueEditor() : null}
        </div>
        ${this._renderActions()}
      </div>
    `;
  }

  private _renderDragHandle() {
    const canDrag = !this.disabled && !this.rule.disabled;

    return html`
      <div
        class="qb-rule__drag-handle"
        title=${canDrag ? 'Drag to reorder' : ''}
        draggable="true"
        @dragstart=${this._handleDragStart}
        @dragend=${this._handleDragEnd}
      >
        ${unsafeSVG(dragIcon)}
      </div>
    `;
  }

  private _handleDragStart(e: DragEvent) {
    if (!this.allowDragAndDrop || this.disabled || this.rule.disabled) {
      e.preventDefault();
      return;
    }

    const dragData = {
      type: 'rule',
      id: this.rule.id,
      sourceIndex: this.index,
      sourcePath: this.parentPath,
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
    this.classList.add('qb-rule--dragging');
  }

  private _handleDragEnd() {
    this.classList.remove('qb-rule--dragging');
  }

  private _renderFieldSelector() {
    return html`
      <kyn-dropdown
        class="qb-rule__field"
        placeholder="Select Field"
        size="sm"
        hideTags
        hideLabel
        .value=${this.rule.field}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleFieldChange}
      >
        ${this.fields.map(
          (field) => html`
            <kyn-dropdown-option value=${field.name}>
              ${field.label}
            </kyn-dropdown-option>
          `
        )}
      </kyn-dropdown>
    `;
  }

  private _renderOperatorSelector() {
    return html`
      <kyn-dropdown
        class="qb-rule__operator"
        placeholder="Select Operator"
        size="sm"
        hideTags
        hideLabel
        .value=${this.rule.operator}
        ?disabled=${this.disabled || this.rule.disabled || !this.rule.field}
        @on-change=${this._handleOperatorChange}
      >
        ${this.operators.map(
          (op) => html`
            <kyn-dropdown-option value=${op.name}>
              ${op.label}
            </kyn-dropdown-option>
          `
        )}
      </kyn-dropdown>
    `;
  }

  private _renderValueEditor() {
    const field = this.selectedField;
    if (!field) {
      return this._renderTextInput();
    }

    // Handle "between" operators with dual inputs
    if (this.isBetween) {
      return this._renderBetweenEditor(field);
    }

    // Handle multi-value operators (in, notIn)
    if (this.isMultiValue && field.values) {
      return this._renderMultiSelectEditor(field);
    }

    // Render based on field data type
    switch (field.dataType) {
      case 'number':
        return this._renderNumberInput(field);
      case 'date':
        return this._renderDateInput(field);
      case 'datetime':
        return this._renderDateTimeInput(field);
      case 'time':
        return this._renderTimeInput(field);
      case 'boolean':
        return this._renderBooleanInput(field);
      case 'select':
        return this._renderSelectInput(field);
      case 'radio':
        return this._renderRadioInput(field);
      case 'slider':
        return this._renderSliderInput(field);
      case 'text':
      default:
        return this._renderTextInput(field);
    }
  }

  private _renderTextInput(field?: QueryField) {
    return html`
      <kyn-text-input
        class="qb-rule__value"
        size="sm"
        hideLabel
        placeholder=${field?.placeholder || 'Value'}
        .value=${String(this.rule.value || '')}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-input=${this._handleValueChange}
      ></kyn-text-input>
    `;
  }

  private _renderNumberInput(field: QueryField) {
    return html`
      <kyn-number-input
        class="qb-rule__value"
        size="sm"
        hideLabel
        placeholder=${field.placeholder || 'Value'}
        .value=${Number(this.rule.value) || 0}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-input=${this._handleValueChange}
      ></kyn-number-input>
    `;
  }

  private _renderDateInput(field: QueryField) {
    return html`
      <kyn-date-picker
        class="qb-rule__value"
        size="sm"
        hideLabel
        placeholder=${field.placeholder || 'Select date'}
        .value=${this.rule.value || ''}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleValueChange}
      ></kyn-date-picker>
    `;
  }

  private _renderDateTimeInput(field: QueryField) {
    return html`
      <kyn-date-picker
        class="qb-rule__value"
        size="sm"
        hideLabel
        enableTime
        placeholder=${field.placeholder || 'Select date/time'}
        .value=${this.rule.value || ''}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleValueChange}
      ></kyn-date-picker>
    `;
  }

  private _renderTimeInput(field: QueryField) {
    return html`
      <kyn-time-picker
        class="qb-rule__value"
        size="sm"
        hideLabel
        placeholder=${field.placeholder || 'Select time'}
        .value=${this.rule.value || ''}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleValueChange}
      ></kyn-time-picker>
    `;
  }

  private _renderBooleanInput(_field: QueryField) {
    return html`
      <kyn-toggle-button
        class="qb-rule__value qb-rule__value--boolean"
        small
        hideLabel
        label="Value"
        ?checked=${Boolean(this.rule.value)}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleBooleanChange}
      ></kyn-toggle-button>
    `;
  }

  private _renderRadioInput(field: QueryField) {
    return html`
      <div class="qb-rule__value qb-rule__value--radio">
        <kyn-radio-button-group
          horizontal
          hideLabel
          .value=${String(this.rule.value || '')}
          ?disabled=${this.disabled || this.rule.disabled}
          @on-radio-group-change=${this._handleRadioChange}
        >
          ${(field.values || []).map(
            (opt) => html`
              <kyn-radio-button value=${opt.value}
                >${opt.label}</kyn-radio-button
              >
            `
          )}
        </kyn-radio-button-group>
      </div>
    `;
  }

  private _renderSliderInput(field: QueryField) {
    const min = field.min ?? 0;
    const max = field.max ?? 100;
    const step = field.step ?? 1;

    return html`
      <kyn-slider-input
        class="qb-rule__value qb-rule__value--slider"
        hideLabel
        .value=${Number(this.rule.value) || min}
        .min=${min}
        .max=${max}
        .step=${step}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-input=${this._handleSliderChange}
      ></kyn-slider-input>
    `;
  }

  private _renderSelectInput(field: QueryField) {
    return html`
      <kyn-dropdown
        class="qb-rule__value"
        size="sm"
        hideTags
        hideLabel
        placeholder=${field.placeholder || 'Select value'}
        .value=${this.rule.value || ''}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleValueChange}
      >
        ${(field.values || []).map(
          (opt) => html`
            <kyn-dropdown-option value=${opt.value}>
              ${opt.label}
            </kyn-dropdown-option>
          `
        )}
      </kyn-dropdown>
    `;
  }

  private _renderMultiSelectEditor(field: QueryField) {
    const values: string[] = Array.isArray(this.rule.value)
      ? this.rule.value
      : [];
    return html`
      <kyn-dropdown
        class="qb-rule__value"
        size="sm"
        multiple
        hideLabel
        placeholder=${field.placeholder || 'Select values'}
        .value=${values as unknown as string}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleMultiValueChange}
      >
        ${(field.values || []).map(
          (opt) => html`
            <kyn-dropdown-option value=${opt.value}>
              ${opt.label}
            </kyn-dropdown-option>
          `
        )}
      </kyn-dropdown>
    `;
  }

  private _renderBetweenEditor(field: QueryField) {
    const values = Array.isArray(this.rule.value) ? this.rule.value : ['', ''];
    const [val1, val2] = values;

    if (field.dataType === 'number') {
      return html`
        <div class="qb-rule__between">
          <kyn-number-input
            class="qb-rule__value"
            size="sm"
            hideLabel
            placeholder="Min"
            .value=${Number(val1) || 0}
            ?disabled=${this.disabled || this.rule.disabled}
            @on-input=${(e: CustomEvent) => this._handleBetweenChange(e, 0)}
          ></kyn-number-input>
          <span class="qb-rule__between-separator">and</span>
          <kyn-number-input
            class="qb-rule__value"
            size="sm"
            hideLabel
            placeholder="Max"
            .value=${Number(val2) || 0}
            ?disabled=${this.disabled || this.rule.disabled}
            @on-input=${(e: CustomEvent) => this._handleBetweenChange(e, 1)}
          ></kyn-number-input>
        </div>
      `;
    }

    if (field.dataType === 'date' || field.dataType === 'datetime') {
      return html`
        <div class="qb-rule__between">
          <kyn-date-picker
            class="qb-rule__value"
            size="sm"
            hideLabel
            ?enableTime=${field.dataType === 'datetime'}
            placeholder="Start"
            .value=${val1 || ''}
            ?disabled=${this.disabled || this.rule.disabled}
            @on-change=${(e: CustomEvent) => this._handleBetweenChange(e, 0)}
          ></kyn-date-picker>
          <span class="qb-rule__between-separator">and</span>
          <kyn-date-picker
            class="qb-rule__value"
            size="sm"
            hideLabel
            ?enableTime=${field.dataType === 'datetime'}
            placeholder="End"
            .value=${val2 || ''}
            ?disabled=${this.disabled || this.rule.disabled}
            @on-change=${(e: CustomEvent) => this._handleBetweenChange(e, 1)}
          ></kyn-date-picker>
        </div>
      `;
    }

    // Default text between
    return html`
      <div class="qb-rule__between">
        <kyn-text-input
          class="qb-rule__value"
          size="sm"
          hideLabel
          placeholder="From"
          .value=${String(val1 || '')}
          ?disabled=${this.disabled || this.rule.disabled}
          @on-input=${(e: CustomEvent) => this._handleBetweenChange(e, 0)}
        ></kyn-text-input>
        <span class="qb-rule__between-separator">and</span>
        <kyn-text-input
          class="qb-rule__value"
          size="sm"
          hideLabel
          placeholder="To"
          .value=${String(val2 || '')}
          ?disabled=${this.disabled || this.rule.disabled}
          @on-input=${(e: CustomEvent) => this._handleBetweenChange(e, 1)}
        ></kyn-text-input>
      </div>
    `;
  }

  private _renderActions() {
    // Order: add, lock, copy, delete (per design)
    return html`
      <div class="qb-rule__actions">
        ${this.isLast
          ? html`
              <kyn-button
                kind="outline"
                size="small"
                description="Add rule"
                ?disabled=${this.disabled || this.rule.disabled}
                @on-click=${this._handleAddRule}
              >
                <span slot="icon">${unsafeSVG(addSimpleIcon)}</span>
              </kyn-button>
            `
          : null}
        ${this.showLockButton
          ? html`
              <kyn-button
                kind=${this.rule.disabled ? 'secondary' : 'outline'}
                size="small"
                description=${this.rule.disabled ? 'Unlock rule' : 'Lock rule'}
                @on-click=${this._handleLockToggle}
              >
                <span slot="icon">
                  ${unsafeSVG(this.rule.disabled ? lockIcon : unlockIcon)}
                </span>
              </kyn-button>
            `
          : null}
        ${this.showCloneButton
          ? html`
              <kyn-button
                kind="outline"
                size="small"
                description="Clone rule"
                ?disabled=${this.disabled || this.rule.disabled}
                @on-click=${this._handleCloneRule}
              >
                <span slot="icon">${unsafeSVG(cloneIcon)}</span>
              </kyn-button>
            `
          : null}
        <kyn-button
          kind="outline-destructive"
          size="small"
          description="Remove rule"
          ?disabled=${this.disabled}
          @on-click=${this._handleRemoveRule}
        >
          <span slot="icon">${unsafeSVG(deleteIcon)}</span>
        </kyn-button>
      </div>
    `;
  }

  private _handleFieldChange(e: CustomEvent) {
    const newField = e.detail.value;
    const field = this.fields.find((f) => f.name === newField);
    const operators =
      field?.operators || getOperatorsForType(field?.dataType || 'text');

    // When field changes, reset operator and value
    const updatedRule: RuleType = {
      ...this.rule,
      field: newField,
      operator: field?.defaultOperator || operators[0]?.name || '',
      value: field?.defaultValue ?? '',
    };

    this._emitRuleChange(updatedRule);
  }

  private _handleOperatorChange(e: CustomEvent) {
    const newOperator = e.detail.value;
    let newValue = this.rule.value;

    // Reset value when switching to/from between operators
    if (isBetweenOperator(newOperator) && !Array.isArray(this.rule.value)) {
      newValue = ['', ''];
    } else if (
      isMultiValueOperator(newOperator) &&
      !Array.isArray(this.rule.value)
    ) {
      newValue = [];
    } else if (
      !isBetweenOperator(newOperator) &&
      !isMultiValueOperator(newOperator) &&
      Array.isArray(this.rule.value)
    ) {
      newValue = '';
    }

    const updatedRule: RuleType = {
      ...this.rule,
      operator: newOperator,
      value: newValue,
    };

    this._emitRuleChange(updatedRule);
  }

  private _handleValueChange(e: CustomEvent) {
    const updatedRule: RuleType = {
      ...this.rule,
      value: e.detail.value,
    };

    this._emitRuleChange(updatedRule);
  }

  private _handleBooleanChange(e: CustomEvent) {
    const updatedRule: RuleType = {
      ...this.rule,
      value: e.detail.checked,
    };

    this._emitRuleChange(updatedRule);
  }

  private _handleRadioChange(e: CustomEvent) {
    const updatedRule: RuleType = {
      ...this.rule,
      value: e.detail.value,
    };

    this._emitRuleChange(updatedRule);
  }

  private _handleSliderChange(e: CustomEvent) {
    const updatedRule: RuleType = {
      ...this.rule,
      value: e.detail.value,
    };

    this._emitRuleChange(updatedRule);
  }

  private _handleMultiValueChange(e: CustomEvent) {
    const updatedRule: RuleType = {
      ...this.rule,
      value: Array.isArray(e.detail.value) ? e.detail.value : [e.detail.value],
    };

    this._emitRuleChange(updatedRule);
  }

  private _handleBetweenChange(e: CustomEvent, index: 0 | 1) {
    const currentValue = Array.isArray(this.rule.value)
      ? [...this.rule.value]
      : ['', ''];
    currentValue[index] = e.detail.value;

    const updatedRule: RuleType = {
      ...this.rule,
      value: currentValue,
    };

    this._emitRuleChange(updatedRule);
  }

  private _emitRuleChange(rule: RuleType) {
    this.dispatchEvent(
      new CustomEvent('on-rule-change', {
        detail: { rule },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleAddRule() {
    this.dispatchEvent(
      new CustomEvent('on-rule-add', {
        detail: { ruleId: this.rule.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleRemoveRule() {
    this.dispatchEvent(
      new CustomEvent('on-rule-remove', {
        detail: { ruleId: this.rule.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleCloneRule() {
    this.dispatchEvent(
      new CustomEvent('on-rule-clone', {
        detail: { ruleId: this.rule.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleLockToggle() {
    this.dispatchEvent(
      new CustomEvent('on-rule-lock', {
        detail: { ruleId: this.rule.id, disabled: !this.rule.disabled },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-qb-rule': QueryBuilderRule;
  }
}
