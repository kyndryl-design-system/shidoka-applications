import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import CheckboxGroupScss from './checkboxGroup.scss';

import '../textInput';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import errorIcon from '@carbon/icons/es/warning--filled/16';

/**
 * Checkbox group container.
 * @fires on-checkbox-group-change - Captures the change event and emits the selected values.
 * @slot unnamed - Slot for individual checkboxes.
 * @slot label - Slot for label text.
 */
@customElement('kyn-checkbox-group')
export class CheckboxGroup extends LitElement {
  static override styles = CheckboxGroupScss;

  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /** Checkbox input name attribute. */
  @property({ type: String })
  name = '';

  /** Checkbox group selected values. */
  @property({ type: Array })
  value: Array<any> = [];

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

  /** "Select All" text customization. */
  @property({ type: String })
  selectAllText = 'Select All';

  /** Hide the group legend/label visually. */
  @property({ type: Boolean })
  hideLegend = false;

  /** Adds a search input to enable filtering of checkboxes. */
  @property({ type: Boolean })
  filterable = false;

  /** Checkbox group invalid text. */
  @property({ type: String })
  invalidText = '';

  /**
   * Queries for slotted checkboxes.
   * @ignore
   */
  @queryAssignedElements()
  checkboxes!: Array<any>;

  /**
   * Attached internals for form association.
   * @ignore
   */
  @state()
  internals = this.attachInternals();

  /**
   * Internal validation message.
   * @ignore
   */
  @state()
  internalValidationMsg = '';

  /**
   * isInvalid when internalValidationMsg or invalidText is non-empty.
   * @ignore
   */
  @state()
  isInvalid = false;

  override render() {
    return html`
      <fieldset ?disabled=${this.disabled}>
        <kyn-text-input
          class="search"
          type="search"
          size="sm"
          placeholder="Search"
          @on-input=${(e: Event) => this._handleFilter(e)}
        ></kyn-text-input>

        <div class="${this.horizontal ? 'horizontal' : ''}">
          <legend class="${this.hideLegend ? 'sr-only' : ''}">
            ${this.required ? html`<span class="required">*</span>` : null}
            <slot name="label"></slot>
          </legend>

          ${this.selectAll
            ? html`
                <kyn-checkbox class="select-all" value="selectAll">
                  ${this.selectAllText}
                </kyn-checkbox>
              `
            : null}

          <slot></slot>
        </div>

        ${this.isInvalid
          ? html`
              <div class="error">
                <kd-icon .icon="${errorIcon}"></kd-icon>
                ${this.invalidText || this.internalValidationMsg}
              </div>
            `
          : null}
      </fieldset>
    `;
  }

  override updated(changedProps: any) {
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

      // set form data value
      // const entries = new FormData();
      // this.value.forEach((value) => {
      //   entries.append(this.name, value);
      // });
      // this.internals.setFormValue(entries);
    }

    if (changedProps.has('required')) {
      // set required for each checkbox
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.required = this.required;
      });
    }

    if (changedProps.has('disabled')) {
      // set disabled for each checkbox
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.disabled = this.disabled;
      });
    }

    if (
      changedProps.has('invalidText') ||
      changedProps.has('internalValidationMsg')
    ) {
      this.isInvalid =
        this.invalidText !== '' || this.internalValidationMsg !== ''
          ? true
          : false;
      // set invalid state for each checkbox
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.invalid = this.isInvalid;
      });
    }
  }

  private _validate() {
    if (this.required) {
      if (!this.value.length) {
        this.internals.setValidity(
          { valueMissing: true },
          'A selection is required.'
        );
        this.internalValidationMsg = this.internals.validationMessage;
      } else {
        this.internals.setValidity({});
        this.internalValidationMsg = '';
      }
    }
  }

  private _handleCheckboxChange(e: any) {
    const value = e.detail.value;

    if (value === 'selectAll') {
      if (e.detail.checked) {
        this.value = this.checkboxes.map((checkbox) => {
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

    this._validate();

    this._emitChangeEvent();
  }

  private _emitChangeEvent() {
    const event = new CustomEvent('on-checkbox-group-change', {
      detail: { value: this.value },
    });
    this.dispatchEvent(event);
  }

  private _handleFormdata(e: any) {
    this.value.forEach((value) => {
      e.formData.append(this.name, value);
    });
  }

  private _handleFilter(e: any) {
    this.checkboxes.forEach((checkboxEl) => {
      // get checkbox label text
      const nodes = checkboxEl.shadowRoot.querySelector('slot').assignedNodes({
        flatten: true,
      });
      let checkboxText = '';
      for (let i = 0; i < nodes.length; i++) {
        checkboxText += nodes[i].textContent.trim();
      }

      // hide checkbox if no match to search term
      if (checkboxText.toLowerCase().includes(e.detail.value.toLowerCase())) {
        checkboxEl.style.display = 'block';
      } else {
        checkboxEl.style.display = 'none';
      }
    });
  }

  override connectedCallback() {
    super.connectedCallback();

    // capture child checkboxes change event
    this.addEventListener('on-checkbox-change', (e: any) =>
      this._handleCheckboxChange(e)
    );

    if (this.internals.form) {
      this.internals.form.addEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );
    }
  }

  override disconnectedCallback() {
    this.removeEventListener('on-checkbox-change', (e: any) =>
      this._handleCheckboxChange(e)
    );

    if (this.internals.form) {
      this.internals.form.removeEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );
    }

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-checkbox-group': CheckboxGroup;
  }
}
