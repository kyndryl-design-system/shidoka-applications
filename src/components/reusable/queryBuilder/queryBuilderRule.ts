import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import QueryBuilderRuleStyles from './queryBuilderRule.scss?inline';

import type {
  RuleType,
  QueryField,
  QueryOperator,
  QueryBuilderSize,
} from './defs/types';
import { sizeToButtonSize } from './defs/types';
import {
  getOperatorsForType,
  isNoValueOperator,
  isBetweenOperator,
  isMultiValueOperator,
} from './defs/operators';

import '../dropdown';
import '../textInput';
import '../numberInput';
import '../datePicker';
import '../timepicker';
import '../toggleButton';
import '../button';
import '../radioButton';
import '../sliderInput';

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

  /** Whether drag and drop is disabled */
  @property({ type: Boolean })
  accessor disableDragAndDrop = false;

  /** Whether the rule is disabled/locked */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Index of this rule in its parent group (for drag-and-drop) */
  @property({ type: Number })
  accessor index = 0;

  /** Path to the parent group (for drag-and-drop) */
  @property({ type: Array })
  accessor parentPath: number[] = [];

  /** Number of siblings at this level (used to determine if drag handle should show at depth 1) */
  @property({ type: Number })
  accessor siblingCount = 1;

  /** Text strings for i18n */
  @property({ type: Object })
  accessor textStrings: Record<string, string> = {};

  /** Size of child components */
  @property({ type: String })
  accessor size: QueryBuilderSize = 'xs';

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

  /** Check if current operator requires no value */
  private get isNoValue(): boolean {
    return isNoValueOperator(this.rule.operator, this.operators);
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
      'qb-rule--invalid': this.rule.valid === false,
    };

    return html`
      <div class=${classMap(classes)}>
        ${!this.disableDragAndDrop ? this._renderDragHandle() : null}
        <div class="qb-rule__fields">
          ${this._renderFieldSelector()} ${this._renderOperatorSelector()}
          ${this.rule.operator && !this.isNoValue
            ? this._renderValueEditor()
            : null}
        </div>
        ${this._renderActions()}
      </div>
    `;
  }

  private _renderDragHandle() {
    // at depth 1 (direct child of root is empty), only show drag handle if there are multiple siblings
    if (this.parentPath.length === 0 && this.siblingCount <= 1) {
      return null;
    }

    const canDrag = !this.disabled && !this.rule.disabled;

    const dragLabel = this.textStrings.dragToReorder || 'Drag to reorder';

    return html`
      <div
        class="qb-rule__drag-handle"
        role="button"
        tabindex=${canDrag ? '0' : '-1'}
        title=${dragLabel}
        aria-label=${dragLabel}
        aria-disabled=${!canDrag}
        draggable=${canDrag ? 'true' : 'false'}
        @dragstart=${this._handleDragStart}
        @dragend=${this._handleDragEnd}
      >
        ${unsafeSVG(dragIcon)}
      </div>
    `;
  }

  private _handleDragStart(e: DragEvent) {
    if (this.disableDragAndDrop || this.disabled || this.rule.disabled) {
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

    // position drag image relative to where user clicked
    const rect = this.getBoundingClientRect();
    e.dataTransfer!.setDragImage(
      this,
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    // add visual feedback to the source element
    this.classList.add('qb-rule--dragging');
  }

  private _handleDragEnd() {
    this.classList.remove('qb-rule--dragging');
  }

  private _renderFieldSelector() {
    return html`
      <kyn-dropdown
        class="qb-rule__field"
        placeholder=${this.textStrings.selectField || 'Select field'}
        size=${this.size}
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
        placeholder=${this.textStrings.selectOperator || 'Select operator'}
        size=${this.size}
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

    // handle "between" operators with dual inputs
    if (this.isBetween) {
      return this._renderBetweenEditor(field);
    }

    // handle multi-value operators (in, notIn)
    if (this.isMultiValue && field.values) {
      return this._renderMultiSelectEditor(field);
    }

    // render based on field data type
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
        size=${this.size}
        hideLabel
        placeholder=${field?.placeholder || this.textStrings.value || 'Value'}
        .value=${String(this.rule.value)}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-input=${this._handleValueChange}
        @blur=${this._handleValueBlur}
      ></kyn-text-input>
    `;
  }

  private _renderNumberInput(field: QueryField) {
    return html`
      <kyn-number-input
        class="qb-rule__value"
        size=${this.size}
        hideLabel
        placeholder=${field.placeholder || this.textStrings.value || 'Value'}
        .value=${Number(this.rule.value) || 0}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-input=${this._handleValueChange}
        @blur=${this._handleValueBlur}
      ></kyn-number-input>
    `;
  }

  private _renderDateInput(field: QueryField) {
    return html`
      <kyn-date-picker
        class="qb-rule__value"
        size=${this.size}
        hideLabel
        placeholder=${field.placeholder ||
        this.textStrings.selectDate ||
        'Select date'}
        .value=${this.rule.value}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleValueChange}
        @blur=${this._handleValueBlur}
      ></kyn-date-picker>
    `;
  }

  private _renderDateTimeInput(field: QueryField) {
    return html`
      <kyn-date-picker
        class="qb-rule__value"
        size=${this.size}
        hideLabel
        enableTime
        placeholder=${field.placeholder ||
        this.textStrings.selectDateTime ||
        'Select date/time'}
        .value=${this.rule.value}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleValueChange}
        @blur=${this._handleValueBlur}
      ></kyn-date-picker>
    `;
  }

  private _renderTimeInput(field: QueryField) {
    return html`
      <kyn-time-picker
        class="qb-rule__value"
        size=${this.size}
        hideLabel
        placeholder=${field.placeholder ||
        this.textStrings.selectTime ||
        'Select time'}
        .value=${this.rule.value}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleValueChange}
        @blur=${this._handleValueBlur}
      ></kyn-time-picker>
    `;
  }

  private _renderBooleanInput(_field: QueryField) {
    return html`
      <kyn-toggle-button
        class="qb-rule__value qb-rule__value--boolean"
        small
        hideLabel
        label=${this.textStrings.value || 'Value'}
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
          .value=${String(this.rule.value)}
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
        fullWidth
        hideLabel
        .value=${Number(this.rule.value) || min}
        .min=${min}
        .max=${max}
        .step=${step}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-input=${this._handleSliderChange}
        @blur=${this._handleValueBlur}
      ></kyn-slider-input>
    `;
  }

  private _renderSelectInput(field: QueryField) {
    return html`
      <kyn-dropdown
        class="qb-rule__value"
        size=${this.size}
        hideTags
        hideLabel
        placeholder=${field.placeholder ||
        this.textStrings.selectValue ||
        'Select value'}
        .value=${this.rule.value as string}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleValueChange}
        @blur=${this._handleValueBlur}
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
        size=${this.size}
        multiple
        hideLabel
        placeholder=${field.placeholder ||
        this.textStrings.selectValues ||
        'Select values'}
        .value=${values}
        ?disabled=${this.disabled || this.rule.disabled}
        @on-change=${this._handleMultiValueChange}
        @blur=${this._handleValueBlur}
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
            size=${this.size}
            hideLabel
            placeholder=${this.textStrings.min || 'Min'}
            .value=${Number(val1) || 0}
            ?disabled=${this.disabled || this.rule.disabled}
            @on-input=${(e: CustomEvent) => this._handleBetweenChange(e, 0)}
            @blur=${this._handleValueBlur}
          ></kyn-number-input>
          <span class="qb-rule__between-separator">and</span>
          <kyn-number-input
            class="qb-rule__value"
            size=${this.size}
            hideLabel
            placeholder=${this.textStrings.max || 'Max'}
            .value=${Number(val2) || 0}
            ?disabled=${this.disabled || this.rule.disabled}
            @on-input=${(e: CustomEvent) => this._handleBetweenChange(e, 1)}
            @blur=${this._handleValueBlur}
          ></kyn-number-input>
        </div>
      `;
    }

    if (field.dataType === 'date' || field.dataType === 'datetime') {
      return html`
        <div class="qb-rule__between">
          <kyn-date-picker
            class="qb-rule__value"
            size=${this.size}
            hideLabel
            ?enableTime=${field.dataType === 'datetime'}
            placeholder=${this.textStrings.start || 'Start'}
            .value=${val1}
            ?disabled=${this.disabled || this.rule.disabled}
            @on-change=${(e: CustomEvent) => this._handleBetweenChange(e, 0)}
            @blur=${this._handleValueBlur}
          ></kyn-date-picker>
          <span class="qb-rule__between-separator">and</span>
          <kyn-date-picker
            class="qb-rule__value"
            size=${this.size}
            hideLabel
            ?enableTime=${field.dataType === 'datetime'}
            placeholder=${this.textStrings.end || 'End'}
            .value=${val2}
            ?disabled=${this.disabled || this.rule.disabled}
            @on-change=${(e: CustomEvent) => this._handleBetweenChange(e, 1)}
            @blur=${this._handleValueBlur}
          ></kyn-date-picker>
        </div>
      `;
    }

    // default text between
    // defensive fallbacks in place for when parent queryBuilder doesn't define for some reason
    return html`
      <div class="qb-rule__between">
        <kyn-text-input
          class="qb-rule__value"
          size=${this.size}
          hideLabel
          placeholder=${this.textStrings.from || 'From'}
          .value=${String(val1)}
          ?disabled=${this.disabled || this.rule.disabled}
          @on-input=${(e: CustomEvent) => this._handleBetweenChange(e, 0)}
          @blur=${this._handleValueBlur}
        ></kyn-text-input>
        <span class="qb-rule__between-separator">and</span>
        <kyn-text-input
          class="qb-rule__value"
          size=${this.size}
          hideLabel
          placeholder=${this.textStrings.to || 'To'}
          .value=${String(val2)}
          ?disabled=${this.disabled || this.rule.disabled}
          @on-input=${(e: CustomEvent) => this._handleBetweenChange(e, 1)}
          @blur=${this._handleValueBlur}
        ></kyn-text-input>
      </div>
    `;
  }

  private _renderActions() {
    // order: add, lock, copy, delete
    return html`
      <div class="qb-rule__actions">
        ${this.isLast
          ? html`
              <kyn-button
                kind="outline"
                size=${sizeToButtonSize[this.size]}
                description=${this.textStrings.addRule || 'Add rule'}
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
                size=${sizeToButtonSize[this.size]}
                description=${this.rule.disabled
                  ? this.textStrings.unlockRule || 'Unlock rule'
                  : this.textStrings.lockRule || 'Lock rule'}
                ?disabled=${this.disabled}
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
                size=${sizeToButtonSize[this.size]}
                description=${this.textStrings.cloneRule || 'Clone rule'}
                ?disabled=${this.disabled || this.rule.disabled}
                @on-click=${this._handleCloneRule}
              >
                <span slot="icon">${unsafeSVG(cloneIcon)}</span>
              </kyn-button>
            `
          : null}
        <kyn-button
          kind="outline-destructive"
          size=${sizeToButtonSize[this.size]}
          description=${this.textStrings.removeRule || 'Remove rule'}
          ?disabled=${this.disabled || this.rule.disabled}
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

    // when field changes, reset operator and value
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
    const isNewNoValue = isNoValueOperator(newOperator, this.operators);

    // reset value when switching to/from between operators
    if (isNewNoValue) {
      newValue = '';
    } else if (
      isBetweenOperator(newOperator) &&
      !Array.isArray(this.rule.value)
    ) {
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
    const value = this._getDetailValue(e.detail ?? {});
    if (value === undefined) {
      return;
    }

    const updatedRule: RuleType = {
      ...this.rule,
      value,
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
    const value = this._getDetailValue(e.detail ?? {});
    if (value === undefined) {
      return;
    }

    const currentValue = Array.isArray(this.rule.value)
      ? [...this.rule.value]
      : ['', ''];
    currentValue[index] = value;

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

  /** validate the current rule using the field's validator function */
  private _validateRule() {
    const field = this.selectedField;
    if (!field?.validator) {
      if (this.rule.valid !== true || this.rule.validationError !== undefined) {
        const updatedRule: RuleType = {
          ...this.rule,
          valid: true,
          validationError: undefined,
        };
        this._emitRuleChange(updatedRule);
      }
      return;
    }

    const result = field.validator(this.rule);
    const isValid = result === true;
    const errorMessage =
      typeof result === 'string' ? result : isValid ? undefined : 'Invalid';

    if (
      this.rule.valid !== isValid ||
      this.rule.validationError !== errorMessage
    ) {
      const updatedRule: RuleType = {
        ...this.rule,
        valid: isValid,
        validationError: errorMessage,
      };
      this._emitRuleChange(updatedRule);
    }
  }

  /** handle blur events on value inputs to trigger validation */
  private _handleValueBlur() {
    this._validateRule();
  }

  private _getDetailValue(detail: Record<string, unknown>): unknown {
    if (Object.prototype.hasOwnProperty.call(detail, 'value')) {
      const value = (detail as { value?: unknown }).value;
      if (value !== undefined) {
        return value;
      }
    }
    if (Object.prototype.hasOwnProperty.call(detail, 'dates')) {
      return (detail as { dates: unknown }).dates;
    }
    if (Object.prototype.hasOwnProperty.call(detail, 'time')) {
      return (detail as { time: unknown }).time;
    }
    if (Object.prototype.hasOwnProperty.call(detail, 'date')) {
      return (detail as { date: unknown }).date;
    }
    return undefined;
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
