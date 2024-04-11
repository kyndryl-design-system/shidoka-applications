import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import TextInputScss from './textInput.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import clearIcon from '@carbon/icons/es/close/24';
import errorIcon from '@carbon/icons/es/warning--filled/24';

/**
 * Text input.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} pattern - RegEx pattern to validate.
 * @prop {number} minLength - Minimum number of characters.
 * @prop {number} maxLength - Maximum number of characters.
 * @slot unnamed - Slot for label text.
 * @slot icon - Slot for contextual icon.
 * @csspart label - Styles the label.
 */
@customElement('kyn-text-input')
export class TextInput extends LitElement {
  static override styles = TextInputScss;

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

  /** Input type, limited to options that are "text like". */
  @property({ type: String })
  type = 'text';

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

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

  /** RegEx pattern to validate. */
  @property({ type: String })
  pattern!: string;

  /** Maximum number of characters. */
  @property({ type: Number })
  maxLength!: number;

  /** Minimum number of characters. */
  @property({ type: Number })
  minLength!: number;

  /** Place icon on the right. */
  @property({ type: Boolean })
  iconRight = false;

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
   * Evaluates if an icon is slotted.
   * @ignore
   */
  @state()
  iconSlotted = false;

  /**
   * Queries any slotted icons.
   * @ignore
   */
  @queryAssignedElements({ slot: 'icon' })
  iconSlot!: Array<HTMLElement>;

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
      <div class="text-input" ?disabled=${this.disabled}>
        <label
          part="label"
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${this.required ? html`<span class="required">*</span>` : null}
          <slot></slot>
        </label>

        <div
          class="${classMap({
            'input-wrapper': true,
            'icon--left': this.iconSlotted && !this.iconRight,
            'icon--right': this.iconSlotted && this.iconRight,
          })}"
        >
          <span class="context-icon">
            <slot name="icon"></slot>
          </span>

          <input
            class="${classMap({
              'size--sm': this.size === 'sm',
              'size--lg': this.size === 'lg',
            })}"
            type=${this.type}
            id=${this.name}
            name=${this.name}
            value=${this.value}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?invalid=${this.isInvalid}
            pattern=${ifDefined(this.pattern)}
            minlength=${ifDefined(this.minLength)}
            maxlength=${ifDefined(this.maxLength)}
            @input=${(e: any) => this._handleInput(e)}
          />

          ${this.isInvalid
            ? html` <kd-icon class="error-icon" .icon=${errorIcon}></kd-icon> `
            : null}
          ${this.value !== ''
            ? html`
                <button
                  ?disabled=${this.disabled}
                  class="clear"
                  @click=${() => this._handleClear()}
                >
                  <kd-icon .icon=${clearIcon}></kd-icon>
                </button>
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

  private _handleInput(e: any) {
    this.value = e.target.value;

    this._validate(true, false);
    this._emitValue(e);
  }

  private _handleClear() {
    this.value = '';
    this.inputEl.value = '';

    this._validate(true, false);
    this._emitValue();
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
      this.inputEl.value = this.value;
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

  override firstUpdated() {
    this.determineIfSlotted();
  }

  private determineIfSlotted() {
    this.iconSlotted = this.iconSlot.length ? true : false;
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
    'kyn-text-input': TextInput;
  }
}
