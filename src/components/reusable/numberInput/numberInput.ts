import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './numberInput.scss';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import addIcon from '@carbon/icons/es/add/20';
import subtractIcon from '@carbon/icons/es/subtract/20';

/**
 * Number input.
 * @fires on-input - Captures the input event and emits the value and original event details.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-number-input')
export class NumberInput extends LitElement {
  static override styles = Styles;

  /** @ignore */
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

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  /** Input value. */
  @property({ type: Number })
  value = 0;

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

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Input invalid text. */
  @property({ type: String })
  invalidText = '';

  /** Maximum value. */
  @property({ type: Number })
  max!: number;

  /** Minimum value. */
  @property({ type: Number })
  min!: number;

  /** Step value. */
  @property({ type: Number })
  step = 1;

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  inputEl!: HTMLInputElement;

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
      <div class="number-input" ?disabled=${this.disabled}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${this.required ? html`<span class="required">*</span>` : null}
          <slot></slot>
        </label>

        <div
          class="${classMap({
            'input-wrapper': true,
          })}"
        >
          <kd-button
            kind="secondary"
            size=${this._sizeMap(this.size)}
            ?disabled=${this.disabled || this.value === this.min}
            @on-click=${this._handleSubtract}
          >
            <kd-icon slot="icon" .icon=${subtractIcon}></kd-icon>
          </kd-button>

          <input
            autofocus
            class="${classMap({
              'size--sm': this.size === 'sm',
              'size--lg': this.size === 'lg',
            })}"
            type="number"
            id=${this.name}
            name=${this.name}
            value=${this.value.toString()}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this.isInvalid}
            aria-invalid=${this.isInvalid}
            aria-describedby=${this.isInvalid ? 'error' : ''}
            step=${ifDefined(this.step)}
            min=${ifDefined(this.min)}
            max=${ifDefined(this.max)}
            @input=${(e: any) => this._handleInput(e)}
          />

          <kd-button
            kind="secondary"
            size=${this._sizeMap(this.size)}
            ?disabled=${this.disabled || this.value === this.max}
            @on-click=${this._handleAdd}
          >
            <kd-icon slot="icon" .icon=${addIcon}></kd-icon>
          </kd-button>
        </div>

        ${this.caption !== ''
          ? html` <div class="caption">${this.caption}</div> `
          : null}
        ${this.isInvalid
          ? html`
              <div id="error" class="error">
                ${this.invalidText || this.internalValidationMsg}
              </div>
            `
          : null}
      </div>
    `;
  }

  private _sizeMap(size: string) {
    let btnSize = 'medium';

    switch (size) {
      case 'lg':
        btnSize = 'large';
        break;
      case 'sm':
        btnSize = 'small';
        break;
    }

    return btnSize;
  }

  private _handleSubtract() {
    this.inputEl.stepDown();
    this.value = Number(this.inputEl.value);

    this._emitValue();
  }

  private _handleAdd() {
    this.inputEl.stepUp();
    this.value = Number(this.inputEl.value);

    this._emitValue();
  }

  private _handleInput(e: any) {
    this.value = Number(e.target.value);

    this._validate(true, false);
    this._emitValue(e);
  }

  private _emitValue(e?: any) {
    const Detail: any = {
      value: this.value,
    };
    if (e) {
      Detail.origEvent = e;
    }

    const event = new CustomEvent('on-input', {
      detail: Detail,
    });
    this.dispatchEvent(event);
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // get validity state from inputEl, combine customError flag if invalidText is provided
    const Validity =
      this.invalidText !== ''
        ? { ...this.inputEl.validity, customError: true }
        : this.inputEl.validity;
    // set validationMessage to invalidText if present, otherwise use inputEl validationMessage
    const ValidationMessage =
      this.invalidText !== ''
        ? this.invalidText
        : this.inputEl.validationMessage;

    // set validity on custom element, anchor to inputEl
    this.internals.setValidity(Validity, ValidationMessage, this.inputEl);

    // set internal validation message if value was changed by user input
    if (interacted) {
      this.internalValidationMsg = this.inputEl.validationMessage;
    }

    // focus the form field to show validity
    if (report) {
      this.internals.reportValidity();
    }
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

    if (changedProps.has('value')) {
      this.inputEl.value = this.value.toString();
      // set form data value
      // this.internals.setFormValue(this.value);

      this._validate(false, false);
    }

    if (
      changedProps.has('invalidText') &&
      changedProps.get('invalidText') !== undefined
    ) {
      this._validate(false, false);
    }
  }

  private _handleFormdata(e: any) {
    e.formData.append(this.name, this.value);
  }

  private _handleInvalid() {
    this._validate(true, false);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.internals.form) {
      this.internals.form.addEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );

      this.addEventListener('invalid', () => {
        this._handleInvalid();
      });
    }
  }

  override disconnectedCallback(): void {
    if (this.internals.form) {
      this.internals.form.removeEventListener('formdata', (e) =>
        this._handleFormdata(e)
      );

      this.removeEventListener('invalid', () => {
        this._handleInvalid();
      });
    }

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-number-input': NumberInput;
  }
}
