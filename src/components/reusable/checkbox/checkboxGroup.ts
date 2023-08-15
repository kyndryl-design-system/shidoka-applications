import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import CheckboxGroupScss from './checkboxGroup.scss';

import '@kyndryl-design-system/foundation/components/icon';
import errorIcon from '@carbon/icons/es/warning--filled/16';

/**
 * Checkbox group container.
 * @fires on-checkbox-group-change - Captures the change event and emits the selected values.
 * @slot unnamed - Slot for individual checkboxes.
 */
@customElement('kyn-checkbox-group')
export class CheckboxGroup extends LitElement {
  static override styles = CheckboxGroupScss;

  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /** Checkbox group label text. */
  @property({ type: String })
  labelText = '';

  /** Checkbox input name attribute. */
  @property({ type: String })
  name = '';

  /** Checkbox group selected values. */
  @property({ type: Array })
  value!: Array<string>;

  /** Makes a single selection required. */
  @property({ type: Boolean })
  required = false;

  /** Checkbox group disabled state. */
  @property({ type: Boolean })
  disabled = false;

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

  override render() {
    return html`
      <fieldset ?disabled=${this.disabled}>
        <legend>
          ${this.required ? html`<span class="required">*</span>` : null}
          ${this.labelText}
        </legend>

        <slot></slot>

        ${this.invalidText !== ''
          ? html`
              <div class="error">
                <kd-icon .icon="${errorIcon}"></kd-icon>
                ${this.invalidText}
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
      const entries = new FormData();
      this.value.forEach((value) => {
        entries.append(this.name, value);
      });
      this.internals.setFormValue(entries);

      // set validity
      if (this.required) {
        if (!this.value.length) {
          this.internals.setValidity(
            { valueMissing: true },
            'A selection is required.'
          );
          this.invalidText = this.internals.validationMessage;
        } else {
          this.internals.setValidity({});
          this.invalidText = '';
        }
      }
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

    if (changedProps.has('invalidText')) {
      // set invalid state for each checkbox
      this.checkboxes.forEach((checkbox: any) => {
        checkbox.invalid = this.invalidText !== '';
      });
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    // capture child checkboxes change event
    this.addEventListener('on-checkbox-change', (e: any) => {
      // set selected value
      const value = e.detail.value;
      const newValues = [...this.value];
      if (newValues.includes(value)) {
        const index = newValues.indexOf(value);
        newValues.splice(index, 1);
      } else {
        newValues.push(value);
      }
      this.value = newValues;

      // emit selected value
      const event = new CustomEvent('on-checkbox-group-change', {
        detail: { value: newValues },
      });
      this.dispatchEvent(event);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-checkbox-group': CheckboxGroup;
  }
}
