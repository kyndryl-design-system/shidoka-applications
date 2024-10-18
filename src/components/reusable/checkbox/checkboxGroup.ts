import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import { FormMixin } from '../../../common/mixins/form-input';
import CheckboxGroupScss from './checkboxGroup.scss';

import '../textInput';
import './checkbox';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import errorIcon from '@carbon/icons/es/warning--filled/16';

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
 * @fires on-checkbox-group-change - Captures the change event and emits the selected values.
 * @fires on-search - Captures the search input event and emits the search term.
 * @fires on-limit-toggle - Captures the show more/less click and emits the expanded state.
 * @slot unnamed - Slot for individual checkboxes.
 * @slot tooltip - Slot for tooltip.
 * @slot description - Slot for description text.
 */
@customElement('kyn-checkbox-group')
export class CheckboxGroup extends FormMixin(LitElement) {
  static override styles = CheckboxGroupScss;

  /** Checkbox group selected values. */
  @property({ type: Array })
  override value: Array<any> = [];

  /** Makes a single selection required. */
  @property({ type: Boolean })
  required = false;

  /** Checkbox group disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Checkbox group horizontal style. */
  @property({ type: Boolean })
  horizontal = false;

  /** Adds a "Select All" checkbox to the top of the group. */
  @property({ type: Boolean })
  selectAll = false;

  /** Is "Select All" box checked.
   * @internal
   */
  @property({ type: Boolean })
  selectAllChecked = false;

  /** Is "Select All" indeterminate.
   * @internal
   */
  @property({ type: Boolean })
  selectAllIndeterminate = false;

  /** Hide the group legend/label visually. */
  @property({ type: Boolean })
  hideLegend = false;

  /** Adds a search input to enable filtering of checkboxes. */
  @property({ type: Boolean })
  filterable = false;

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Filter text input value.
   * @internal
   */
  @state()
  searchTerm = '';

  /** Limits visible checkboxes behind a "Show all" button. */
  @property({ type: Boolean })
  limitCheckboxes = false;

  /** Number of checkboxes visible when limited.
   * @internal
   */
  @state()
  _limitCount = 4;

  /** Checkbox limit visibility.
   * @internal
   */
  @state()
  limitRevealed = false;

  /** Text string customization. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  // /**
  //  * Queries for slotted checkboxes.
  //  * @ignore
  //  */
  // @queryAssignedElements()
  // checkboxes!: Array<any>;

  @state()
  checkboxes: Array<any> = [];

  @state()
  filteredCheckboxes: Array<any> = [];

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
                @on-input=${(e: Event) => this._handleFilter(e)}
              >
                ${this._textStrings.search}
              </kyn-text-input>
            `
          : null}

        <fieldset ?disabled=${this.disabled}>
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
                  <kd-icon
                    role="img"
                    .icon="${errorIcon}"
                    title=${this._textStrings.error}
                    aria-label=${this._textStrings.error}
                  ></kd-icon>
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
                    ?invalid=${this.invalidText !== '' ||
                    this._internalValidationMsg !== ''}
                  >
                    ${this._textStrings.selectAll}
                  </kyn-checkbox>
                `
              : null}

            <slot @slotchange=${this._handleSlotChange}></slot>

            ${this.limitCheckboxes &&
            this.filteredCheckboxes.length > this._limitCount
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
  }

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    this._onUpdated(changedProps);

    if (changedProps.has('name')) {
      // set name for each checkbox
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.name = this.name;
      });
    }

    if (changedProps.has('value')) {
      // set checked state for each checkbox
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.checked = this.value.includes(checkbox.value);
      });

      const CheckedBoxesCount = this.checkboxes.filter(
        (checkbox) => checkbox.checked
      ).length;

      // sync "Select All" checkbox state
      this.selectAllChecked =
        this.checkboxes.length > 0 &&
        CheckedBoxesCount === this.checkboxes.length;

      // sync "Select All" indeterminate state
      this.selectAllIndeterminate =
        CheckedBoxesCount < this.checkboxes.length && CheckedBoxesCount > 0;

      // set form data value
      const entries = new FormData();
      this.value.forEach((value) => {
        entries.append(this.name, value);
      });
      this._internals.setFormValue(entries);
    }

    if (changedProps.has('required')) {
      // set required for each checkbox
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.required = this.required;
      });
    }

    if (
      changedProps.has('disabled') &&
      changedProps.get('disabled') !== undefined
    ) {
      // set disabled for each checkbox
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.disabled = this.disabled;
      });
    }

    if (
      changedProps.has('invalidText') ||
      changedProps.has('internalValidationMsg')
    ) {
      // set invalid state for each checkbox
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.invalid = this._isInvalid;
      });
    }

    if (
      changedProps.has('limitCheckboxes') &&
      changedProps.get('limitCheckboxes') !== undefined
    ) {
      this._toggleRevealed(false);
    }
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // set validity flags
    const Validity = {
      customError: this.invalidText !== '',
      valueMissing: this.required && !this.value.length,
    };

    // set validationMessage
    const InternalMsg =
      this.required && !this.value.length ? 'A selection is required.' : '';
    const ValidationMessage =
      this.invalidText !== '' ? this.invalidText : InternalMsg;

    // set validity on custom element, anchor to first checkbox
    this._internals.setValidity(
      Validity,
      ValidationMessage,
      this.checkboxes[0]
    );

    // set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = InternalMsg;
    }

    // focus the first checkbox to show validity
    if (report) {
      this._internals.reportValidity();
    }
  }

  private _handleCheckboxChange(e: any) {
    const value = e.detail.value;

    if (value === 'selectAll') {
      if (e.detail.checked) {
        this.value = this.checkboxes
          .filter((checkbox) => !checkbox.disabled)
          .map((checkbox) => {
            return checkbox.value;
          });
      } else {
        this.value = [];
      }
    } else {
      const newValues = [...this.value];
      if (newValues.includes(value)) {
        const index = newValues.indexOf(value);
        newValues.splice(index, 1);
      } else {
        newValues.push(value);
      }
      this.value = newValues;
    }

    this._validate(true, false);

    this._emitChangeEvent();
  }

  private _emitChangeEvent() {
    const event = new CustomEvent('on-checkbox-group-change', {
      detail: { value: this.value },
    });
    this.dispatchEvent(event);
  }

  // override _handleFormdata = (e: any) => {
  //   this.value.forEach((value) => {
  //     e.formData.append(this.name, value);
  //   });
  // }

  private _handleFilter(e: any) {
    let visibleCount = 0;

    this.searchTerm = e.detail.value.toLowerCase();

    this.filteredCheckboxes = this.checkboxes.filter((checkboxEl) => {
      return checkboxEl.textContent.toLowerCase().includes(this.searchTerm);
    });

    this.checkboxes.forEach((checkboxEl) => {
      // get checkbox label text
      const checkboxText = checkboxEl.textContent.toLowerCase();

      // hide checkbox if no match to search term
      if (this.limitCheckboxes && !this.limitRevealed) {
        if (
          checkboxText.includes(this.searchTerm) &&
          visibleCount < this._limitCount
        ) {
          checkboxEl.style.display = 'block';
          visibleCount++;
        } else {
          checkboxEl.style.display = 'none';
        }
      } else {
        if (checkboxText.includes(this.searchTerm)) {
          checkboxEl.style.display = 'block';
        } else {
          checkboxEl.style.display = 'none';
        }
      }
    });

    const event = new CustomEvent('on-search', {
      detail: { searchTerm: this.searchTerm },
    });
    this.dispatchEvent(event);
  }

  private _toggleRevealed(revealed: boolean) {
    this.limitRevealed = revealed;

    // this.searchTerm = '';

    this.filteredCheckboxes.forEach((checkboxEl, index) => {
      if (!this.limitCheckboxes || this.limitRevealed) {
        checkboxEl.style.display = 'block';
      } else {
        if (index < this._limitCount) {
          checkboxEl.style.display = 'block';
        } else {
          checkboxEl.style.display = 'none';
        }
      }
    });

    const event = new CustomEvent('on-limit-toggle', {
      detail: { expanded: this.limitRevealed },
    });
    this.dispatchEvent(event);
  }

  private _handleSlotChange() {
    this.checkboxes = Array.from(this.querySelectorAll('kyn-checkbox'));
    this.filteredCheckboxes = this.checkboxes;
    this._updateChildren();
    this._toggleRevealed(this.limitRevealed);
    this.requestUpdate();
  }

  private _updateChildren() {
    this.checkboxes.forEach((checkbox) => {
      checkbox.disabled = this.disabled;
      checkbox.checked = this.value.includes(checkbox.value);
    });

    const CheckedBoxesCount = this.checkboxes.filter(
      (checkbox) => checkbox.checked
    ).length;

    // sync "Select All" checkbox state
    this.selectAllChecked =
      this.checkboxes.length > 0 &&
      CheckedBoxesCount === this.checkboxes.length;

    // sync "Select All" indeterminate state
    this.selectAllIndeterminate =
      CheckedBoxesCount < this.checkboxes.length && CheckedBoxesCount > 0;
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
    console.log(newValues);

    this.value = newValues;

    this._validate(true, false);

    this._emitChangeEvent();
  }

  override connectedCallback() {
    super.connectedCallback();

    // preserve FormMixin connectedCallback function
    this._onConnected();

    // capture child checkboxes change event
    this.addEventListener('on-checkbox-change', (e: any) =>
      this._handleCheckboxChange(e)
    );

    // capture subgroup change event
    this.addEventListener('on-checkbox-subgroup-change', (e: any) =>
      this._handleSubgroupChange(e)
    );
  }

  override disconnectedCallback() {
    // preserve FormMixin disconnectedCallback function
    this._onDisconnected();

    this.removeEventListener('on-checkbox-change', (e: any) =>
      this._handleCheckboxChange(e)
    );

    this.removeEventListener('on-checkbox-subgroup-change', (e: any) =>
      this._handleSubgroupChange(e)
    );

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-checkbox-group': CheckboxGroup;
  }
}
