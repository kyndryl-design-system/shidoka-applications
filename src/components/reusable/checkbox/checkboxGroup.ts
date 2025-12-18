import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import { FormMixin } from '../../../common/mixins/form-input';
import CheckboxGroupScss from './checkboxGroup.scss?inline';

import '../textInput';
import './checkbox';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';

const _defaultTextStrings = {
  selectAll: 'Select all',
  showMore: 'Show more',
  showLess: 'Show less',
  search: 'Search',
  required: 'Required',
  error: 'Error',
};

/**
 * Checkbox group container.
 * @fires on-checkbox-group-change - Captures the change event and emits the selected values. `detail:{ value: Array }`
 * @fires on-search - Captures the search input event and emits the search term. `detail:{ searchTerm: string }`
 * @fires on-limit-toggle - Captures the show more/less click and emits the expanded state. `detail:{ expanded: boolean }`
 * @slot unnamed - Slot for individual checkboxes.
 * @slot tooltip - Slot for tooltip.
 * @slot description - Slot for description text.
 * @attr {array} [value=[]] - The selected values of the checkbox group.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 * @attr {string} [invalidText=''] - The custom validation message when the input is invalid.
 */
@customElement('kyn-checkbox-group')
export class CheckboxGroup extends FormMixin(LitElement) {
  static override styles = unsafeCSS(CheckboxGroupScss);

  /** Checkbox group selected values. */
  override value: Array<any> = [];

  /** Makes a single selection required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Checkbox group disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Checkbox group readonly state. */
  @property({ type: Boolean })
  accessor readonly = false;

  /** Checkbox group horizontal style. */
  @property({ type: Boolean })
  accessor horizontal = false;

  /** Adds a "Select All" checkbox to the top of the group. */
  @property({ type: Boolean })
  accessor selectAll = false;

  /** Is "Select All" box checked.
   * @internal
   */
  @property({ type: Boolean })
  accessor selectAllChecked = false;

  /** Is "Select All" indeterminate boolean.
   * @internal
   */
  @property({ type: Boolean })
  accessor selectAllIndeterminate = false;

  /** Select All scope behavior.
   * @internal
   */
  @property({ type: String, attribute: false })
  accessor selectAllScope: 'legacy' | 'visible' | 'filtered' | 'all' = 'legacy';

  /** Hide the group legend/label visually. */
  @property({ type: Boolean })
  accessor hideLegend = false;

  /** Adds a search input to enable filtering of checkboxes. */
  @property({ type: Boolean })
  accessor filterable = false;

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Search input value */
  @property({ type: String })
  accessor searchTerm = '';

  /** Limits visible checkboxes behind a "Show all" button. */
  @property({ type: Boolean })
  accessor limitCheckboxes = false;

  /** Number of checkboxes visible when limited. */
  @property({ type: Number })
  accessor limitCount = 4;

  /** Checkbox limit visibility.
   * @internal
   */
  @state()
  accessor limitRevealed = false;

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

  // /**
  //  * Queries for slotted checkboxes.
  //  * @ignore
  //  */
  // @queryAssignedElements()
  // checkboxes!: Array<any>;

  /** Checkboxes array.
   * @internal
   */
  @state()
  accessor checkboxes: Array<any> = [];

  /** Filtered Checkboxes array.
   * @internal
   */
  @state()
  accessor filteredCheckboxes: Array<any> = [];

  override render() {
    return html`
      <div>
        ${this.filterable
          ? html`
              <kyn-text-input
                class="search"
                type="search"
                size="sm"
                placeholder=${this._textStrings.search}
                hideLabel
                value=${this.searchTerm}
                ?disabled=${this.disabled}
                ?readonly=${!this.disabled && this.readonly}
                @on-input=${(e: Event) => this._handleFilter(e)}
              >
                ${this._textStrings.search}
              </kyn-text-input>
            `
          : null}

        <fieldset
          ?disabled=${this.disabled}
          ?readonly=${!this.disabled && this.readonly}
        >
          <legend class="label-text ${this.hideLegend ? 'sr-only' : ''}">
            ${this.required
              ? html`
                  <abbr
                    class="required"
                    title=${this._textStrings.required}
                    aria-label=${this._textStrings.required}
                  >
                    *
                  </abbr>
                `
              : null}
            <span>${this.label}</span>
            <slot name="tooltip"></slot>
          </legend>
          <div class="description-text">
            <slot name="description"></slot>
          </div>
          ${this._isInvalid
            ? html`
                <div class="error">
                  <span
                    role="img"
                    class="error-icon"
                    title=${this._textStrings.error}
                    aria-label=${this._textStrings.error}
                    >${unsafeSVG(errorIcon)}</span
                  >
                  ${this.invalidText || this._internalValidationMsg}
                </div>
              `
            : null}

          <div class="${this.horizontal ? 'horizontal' : ''}">
            ${this.selectAll
              ? html`
                  <kyn-checkbox
                    class="select-all"
                    value="selectAll"
                    ?checked=${this.selectAllChecked}
                    ?indeterminate=${this.selectAllIndeterminate}
                    ?required=${this.required}
                    ?disabled=${this.disabled}
                    ?readonly=${!this.disabled && this.readonly}
                    ?invalid=${this.invalidText !== '' ||
                    this._internalValidationMsg !== ''}
                  >
                    ${this._textStrings.selectAll}
                  </kyn-checkbox>
                `
              : null}

            <slot @slotchange=${this._handleSlotChange}></slot>

            ${this.limitCheckboxes &&
            this.filteredCheckboxes.length > this.limitCount
              ? html`
                  <button
                    class="reveal-toggle"
                    @click=${() => this._toggleRevealed(!this.limitRevealed)}
                  >
                    ${this.limitRevealed
                      ? this._textStrings.showLess
                      : html`
                          ${this._textStrings.showMore}
                          (${this.filteredCheckboxes.length})
                        `}
                  </button>
                `
              : null}
          </div>
        </fieldset>
      </div>
    `;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }

    if (changedProps.has('value')) {
      this._updateCheckboxStates();
    }

    if (changedProps.has('selectAllScope')) this._updateCheckboxStates();

    if (changedProps.has('searchTerm') && this.checkboxes.length) {
      this._applyFilter();
    }

    if (changedProps.has('invalidText')) {
      this._isInvalid =
        this.invalidText !== '' || this._internalValidationMsg !== '';
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.invalid = this._isInvalid;
      });
    }
  }

  override updated(changedProps: any) {
    if (!changedProps.has('invalidText')) this._onUpdated(changedProps);

    if (changedProps.has('name')) {
      this.checkboxes.forEach((c: any) => (c.name = this.name));
      const entries = new FormData();
      this.value.forEach((v) => entries.append(this.name, v));
      this._internals.setFormValue(entries);
    }

    if (changedProps.has('required')) {
      this.checkboxes.forEach((c: any) => (c.required = this.required));
    }

    if (
      changedProps.has('disabled') &&
      changedProps.get('disabled') !== undefined
    ) {
      this.checkboxes.forEach((c: any) => (c.disabled = this.disabled));
      this._updateCheckboxStates();
    }

    if (
      changedProps.has('readonly') &&
      changedProps.get('readonly') !== undefined
    ) {
      this.checkboxes.forEach((c: any) => (c.readonly = this.readonly));
      this._updateCheckboxStates();
    }

    if (
      changedProps.has('limitCheckboxes') &&
      changedProps.get('limitCheckboxes') !== undefined
    ) {
      this._toggleRevealed(false);
    }

    if (
      changedProps.has('limitCount') &&
      changedProps.get('limitCount') !== undefined
    ) {
      this._toggleRevealed(this.limitRevealed);
    }
  }

  private _scopeRelevant(): Array<any> {
    const allEnabled = this.checkboxes.filter(
      (c: any) => !c.disabled && !c.readonly
    );

    let visibleRelevant = this.filteredCheckboxes.filter(
      (c: any) => !c.disabled && !c.readonly
    );
    if (this.limitCheckboxes && !this.limitRevealed) {
      visibleRelevant = visibleRelevant.slice(0, this.limitCount);
    }

    const filteredRelevant = this.filteredCheckboxes.filter(
      (c: any) => !c.disabled && !c.readonly
    );

    switch (this.selectAllScope) {
      case 'visible':
        return visibleRelevant;
      case 'filtered':
        return filteredRelevant;
      case 'all':
        return allEnabled;
      default: {
        const useVisible =
          (this.searchTerm && this.searchTerm.length > 0) ||
          (this.limitCheckboxes && !this.limitRevealed);
        return useVisible ? visibleRelevant : allEnabled;
      }
    }
  }

  private _computeSelectAllFromValues() {
    const relevant = this._scopeRelevant();
    const relevantValues = new Set(relevant.map((c: any) => c.value));
    const total = relevantValues.size;
    if (total === 0) return { checked: false, indeterminate: false };

    let selected = 0;
    for (const v of this.value) if (relevantValues.has(v)) selected++;
    return {
      checked: selected === total,
      indeterminate: selected > 0 && selected < total,
    };
  }

  private _updateCheckboxStates() {
    this.checkboxes.forEach((c: any) => {
      c.checked = this.value.includes(c.value);
    });

    const { checked, indeterminate } = this._computeSelectAllFromValues();
    this.selectAllChecked = checked;
    this.selectAllIndeterminate = indeterminate;

    const selectAllEl = this.querySelector('.select-all') as any;
    if (selectAllEl) {
      selectAllEl.checked = checked;
      selectAllEl.indeterminate = indeterminate;
      const native =
        (selectAllEl.shadowRoot?.querySelector(
          'input'
        ) as HTMLInputElement | null) ??
        (selectAllEl.querySelector('input') as HTMLInputElement | null);
      if (native) {
        native.checked = checked;
        if (typeof (native as any).indeterminate === 'boolean') {
          (native as any).indeterminate = indeterminate;
        }
      }
      selectAllEl.requestUpdate?.();
    }

    const entries = new FormData();
    this.value.forEach((v) => entries.append(this.name, v));
    this._internals.setFormValue(entries);
  }

  private _validate(interacted: boolean, report: boolean) {
    const Validity = {
      customError: this.invalidText !== '',
      valueMissing: this.required && !this.value.length,
    };

    const InternalMsg =
      this.required && !this.value.length ? 'A selection is required.' : '';
    const ValidationMessage =
      this.invalidText !== '' ? this.invalidText : InternalMsg;

    if (interacted || this.invalidText !== '') {
      this._internals.setValidity(Validity, ValidationMessage);

      if (interacted) {
        this._internalValidationMsg = InternalMsg;
      }
    }

    if (report) {
      this._internals.reportValidity();
    }
  }

  private _handleCheckboxChange(
    e: CustomEvent<{ value: string; checked: boolean }>
  ) {
    const { value } = e.detail;

    if (this.disabled || this.readonly) {
      e.stopPropagation();
      const target = e.target as HTMLInputElement & { indeterminate?: boolean };
      if (target) {
        if (value === 'selectAll') {
          const { checked, indeterminate } = this._computeSelectAllFromValues();
          target.checked = checked;
          if (typeof target.indeterminate === 'boolean')
            target.indeterminate = indeterminate;
        } else {
          target.checked = this.value.includes(value);
          if (typeof target.indeterminate === 'boolean')
            target.indeterminate = false;
        }
      }
      return;
    }

    if (value === 'selectAll') {
      const targets = this._scopeRelevant();

      if (e.detail.checked) {
        const next = new Set(this.value);
        targets.forEach((c: any) => next.add(c.value));
        this.value = Array.from(next);
      } else {
        const toRemove = new Set(targets.map((c: any) => c.value));
        this.value = this.value.filter((v) => !toRemove.has(v));
      }

      this.checkboxes.forEach((c: any) => (c.indeterminate = false));
    } else {
      const next = new Set(this.value);
      next.has(value) ? next.delete(value) : next.add(value);
      this.value = Array.from(next);
    }

    this._validate(true, false);
    this._emitChangeEvent();
  }

  private _emitChangeEvent() {
    const event = new CustomEvent('on-checkbox-group-change', {
      detail: { value: [...this.value] },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _handleFilter(e: any) {
    this.searchTerm = e.detail.value.toLowerCase();
    this._applyFilter();

    const event = new CustomEvent('on-search', {
      detail: { searchTerm: this.searchTerm },
    });
    this.dispatchEvent(event);
  }

  private _applyFilter() {
    let visibleCount = 0;
    const searchLower = this.searchTerm.toLowerCase();

    this.filteredCheckboxes = this.checkboxes.filter((checkboxEl) => {
      return checkboxEl.textContent.toLowerCase().includes(searchLower);
    });

    this.checkboxes.forEach((checkboxEl) => {
      // get checkbox label text
      const checkboxText = checkboxEl.textContent.toLowerCase();

      // hide checkbox if no match to search term
      if (this.limitCheckboxes && !this.limitRevealed) {
        if (
          checkboxText.includes(searchLower) &&
          visibleCount < this.limitCount
        ) {
          checkboxEl.style.display = 'block';
          visibleCount++;
        } else {
          checkboxEl.style.display = 'none';
        }
      } else {
        if (checkboxText.includes(searchLower)) {
          checkboxEl.style.display = 'block';
        } else {
          checkboxEl.style.display = 'none';
        }
      }
    });

    this._updateCheckboxStates();
  }

  private _toggleRevealed(revealed: boolean) {
    this.limitRevealed = revealed;

    this.filteredCheckboxes.forEach((checkboxEl, index) => {
      if (!this.limitCheckboxes || this.limitRevealed) {
        checkboxEl.style.display = 'block';
      } else {
        if (index < this.limitCount) {
          checkboxEl.style.display = 'block';
        } else {
          checkboxEl.style.display = 'none';
        }
      }
    });

    this._updateCheckboxStates();

    const event = new CustomEvent('on-limit-toggle', {
      detail: { expanded: this.limitRevealed },
    });
    this.dispatchEvent(event);
  }

  private _handleSlotChange() {
    const prev = this.checkboxes;
    this.checkboxes = Array.from(
      this.querySelectorAll('kyn-checkbox:not(.select-all)')
    );
    this.filteredCheckboxes = this.checkboxes;

    if (!prev.length) {
      this._updateChildren();
      // Apply initial filter if searchTerm is set
      if (this.searchTerm && this.searchTerm.length > 0) {
        this._applyFilter();
      }
    }

    this._toggleRevealed(this.limitRevealed);
  }

  private _updateChildren() {
    this.checkboxes.forEach((c) => {
      c.disabled = c.hasAttribute('disabled') || this.disabled;
      c.readonly = c.hasAttribute('readonly') || this.readonly;
      c.checked = !!this.value?.length && this.value.includes(c.value);
    });
    this._updateCheckboxStates();
  }

  private _handleSubgroupChange(e: any) {
    const newValues = [...this.value];
    const {
      isParent,
      parentChecked,
      parentValue,
      value,
      checked,
      childValues,
    } = e.detail;

    if (isParent) {
      if (checked) {
        if (!newValues.includes(value)) {
          newValues.push(value);
        }

        childValues.forEach((value: string) => {
          if (!newValues.includes(value)) {
            newValues.push(value);
          }
        });
      } else {
        const index = newValues.indexOf(value);
        newValues.splice(index, 1);

        childValues.forEach((value: string) => {
          const index = newValues.indexOf(value);
          if (index !== -1) {
            newValues.splice(index, 1);
          }
        });
      }
    } else {
      if (checked) {
        if (!newValues.includes(value)) {
          newValues.push(value);
        }
      } else {
        const index = newValues.indexOf(value);
        if (index !== -1) {
          newValues.splice(index, 1);
        }
      }

      if (parentChecked) {
        if (!newValues.includes(parentValue)) {
          newValues.push(parentValue);
        }
      } else {
        const index = newValues.indexOf(parentValue);
        if (index !== -1) {
          newValues.splice(index, 1);
        }
      }
    }

    this.value = newValues;

    this._validate(true, false);

    this._emitChangeEvent();
  }

  /** _onCheckboxChange event.
   * @ignore
   */
  private _onCheckboxChange = (e: any) => this._handleCheckboxChange(e);
  /** _onCheckboxSubgroupChange event.
   * @ignore
   */
  private _onCheckboxSubgroupChange = (e: any) => this._handleSubgroupChange(e);

  override connectedCallback() {
    super.connectedCallback();
    this._onConnected();
    this.addEventListener('on-checkbox-change', this._onCheckboxChange);
    this.addEventListener(
      'on-checkbox-subgroup-change',
      this._onCheckboxSubgroupChange
    );
  }

  override disconnectedCallback() {
    this._onDisconnected();
    this.removeEventListener('on-checkbox-change', this._onCheckboxChange);
    this.removeEventListener(
      'on-checkbox-subgroup-change',
      this._onCheckboxSubgroupChange
    );
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-checkbox-group': CheckboxGroup;
  }
}
