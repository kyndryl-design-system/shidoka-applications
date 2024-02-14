import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import TextAreaScss from './textArea.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import errorIcon from '@carbon/icons/es/warning--filled/24';

/**
 * Text area.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {number} minLength - Minimum number of characters.
 * @prop {number} maxLength - Maximum number of characters.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-text-area')
export class TextArea extends LitElement {
  static override styles = TextAreaScss;

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /**
   * Attached internals for form association.
   * @ignore
   */
  @state()
  internals = this.attachInternals();

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Input value. */
  @property({ type: String })
  value = '';

  /** Input placeholder. */
  @property({ type: String })
  placeholder = '';

  /** Input name. */
  @property({ type: String })
  name = '';

  /** Makes the input required. */
  @property({ type: Boolean })
  required = false;

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Input invalid text. */
  @property({ type: String })
  invalidText = '';

  /** Maximum number of characters. */
  @property({ type: Number })
  maxLength = null;

  /** Minimum number of characters. */
  @property({ type: Number })
  minLength = null;

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
      <div class="text-area" ?disabled=${this.disabled}>
        <label class="label-text" for=${this.name}>
          ${this.required ? html`<span class="required">*</span>` : null}
          <slot></slot>
        </label>

        <div class="input-wrapper">
          <textarea
            id=${this.name}
            name=${this.name}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this.isInvalid}
            minlength=${ifDefined(this.minLength)}
            maxlength=${ifDefined(this.maxLength)}
            @input=${(e: any) => this.handleInput(e)}
          >
${this.value}</textarea
          >

          ${this.isInvalid
            ? html` <kd-icon class="error-icon" .icon=${errorIcon}></kd-icon> `
            : null}
          ${this.maxLength
            ? html`
                <div class="count">${this.value.length}/${this.maxLength}</div>
              `
            : null}
        </div>

        ${this.caption !== ''
          ? html` <div class="caption">${this.caption}</div> `
          : null}
        ${this.isInvalid
          ? html`
              <div class="error">
                ${this.invalidText || this.internalValidationMsg}
              </div>
            `
          : null}
      </div>
    `;
  }

  private handleInput(e: any) {
    this.value = e.target.value;

    // emit selected value
    const event = new CustomEvent('on-input', {
      detail: {
        value: e.target.value,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (
      changedProps.has('invalidText') ||
      changedProps.has('internalValidationMsg')
    ) {
      //check if any (internal / external )error msg. present then isInvalid is true
      this.isInvalid =
        this.invalidText !== '' || this.internalValidationMsg !== ''
          ? true
          : false;
    }

    if (changedProps.get('value') !== undefined && changedProps.has('value')) {
      // set form data value
      // this.internals.setFormValue(this.value);

      // set validity
      if (this.required && (!this.value || this.value === '')) {
        // validate required
        this.internals.setValidity(
          { valueMissing: true },
          'This field is required.'
        );
        this.internalValidationMsg = this.internals.validationMessage;
      } else if (this.minLength && this.value.length < this.minLength) {
        // validate min
        this.internals.setValidity({ tooShort: true }, 'Too few characters.');
        this.internalValidationMsg = this.internals.validationMessage;
      } else if (this.maxLength && this.value.length > this.maxLength) {
        // validate max
        this.internals.setValidity({ tooLong: true }, 'Too many characters.');
        this.internalValidationMsg = this.internals.validationMessage;
      } else {
        // clear validation
        this.internals.setValidity({});
        this.internalValidationMsg = '';
      }
    }
  }

  private _handleFormdata(e: any) {
    e.formData.append(this.name, this.value);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.internals.form) {
      this.internals.form.addEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );
    }
  }

  override disconnectedCallback(): void {
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
    'kyn-text-area': TextArea;
  }
}
