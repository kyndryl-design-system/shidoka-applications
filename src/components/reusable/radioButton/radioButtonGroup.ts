import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import RadioButtonGroupScss from './radioButtonGroup.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import errorIcon from '@carbon/icons/es/warning--filled/16';

/**
 * Radio button group container.
 * @fires on-radio-group-change - Captures the change event and emits the selected value.
 * @slot unnamed - Slot for individual radio buttons.
 * @slot label - Slot for label text.
 */
@customElement('kyn-radio-button-group')
export class RadioButtonGroup extends LitElement {
  static override styles = RadioButtonGroupScss;

  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /** Radio button input name attribute. */
  @property({ type: String })
  name = '';

  /** Radio button group selected value. */
  @property({ type: String })
  value = '';

  /** Makes the input required. */
  @property({ type: Boolean })
  required = false;

  /** Radio button group disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Radio button group invalid text. */
  @property({ type: String })
  invalidText = '';

  /**
   * Queries for slotted radio buttons.
   * @ignore
   */
  @queryAssignedElements()
  radioButtons!: Array<any>;

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
        <legend>
          ${this.required ? html`<span class="required">*</span>` : null}
          <slot name="label"></slot>
        </legend>

        <slot></slot>

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
      // set name for each radio button
      this.radioButtons.forEach((radio: any) => {
        radio.name = this.name;
      });
    }

    if (changedProps.has('value')) {
      // set checked state for each radio button
      this.radioButtons.forEach((radio: any) => {
        radio.checked = radio.value === this.value;
      });

      // set form data value
      // this.internals.setFormValue(this.value);

      // set validity
      if (this.required) {
        if (!this.value || this.value === '') {
          this.internals.setValidity(
            { valueMissing: true },
            'This field is required.'
          );
          this.internalValidationMsg = this.internals.validationMessage;
        } else {
          this.internals.setValidity({});
          this.internalValidationMsg = '';
        }
      }
    }

    if (changedProps.has('required')) {
      // set required for each radio button
      this.radioButtons.forEach((radio: any) => {
        radio.required = this.required;
      });
    }

    if (changedProps.has('disabled')) {
      // set disabled for each radio button
      this.radioButtons.forEach((radio: any) => {
        radio.disabled = this.disabled;
      });
    }

    if (
      changedProps.has('invalidText') ||
      changedProps.has('internalValidationMsg')
    ) {
      //check if any (internal / external )error msg. present then isInvalid is true
      this.isInvalid =
        this.invalidText !== '' || this.internalValidationMsg !== ''
          ? true
          : false;
      // set invalid state for each radio button
      this.radioButtons.forEach((radio: any) => {
        radio.invalid = this.isInvalid;
      });
    }
  }

  private _handleRadioChange(e: any) {
    // set selected value
    this.value = e.detail.value;

    // emit selected value
    const event = new CustomEvent('on-radio-group-change', {
      detail: { value: e.detail.value },
    });
    this.dispatchEvent(event);
  }

  private _handleFormdata(e: any) {
    e.formData.append(this.name, this.value);
  }

  override connectedCallback() {
    super.connectedCallback();

    // capture child radio buttons change event
    this.addEventListener('on-radio-change', (e: any) =>
      this._handleRadioChange(e)
    );

    if (this.internals.form) {
      this.internals.form.addEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );
    }
  }

  override disconnectedCallback(): void {
    this.removeEventListener('on-radio-change', (e: any) =>
      this._handleRadioChange(e)
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
    'kyn-radio-button-group': RadioButtonGroup;
  }
}
