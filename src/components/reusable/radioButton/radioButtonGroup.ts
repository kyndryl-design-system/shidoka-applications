import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import RadioButtonGroupScss from './radioButtonGroup.scss';
import { FormMixin } from '../../../common/mixins/form-input';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';

const _defaultTextStrings = {
  required: 'Required',
  error: 'Error',
};

/**
 * Radio button group container.
 * @fires on-radio-group-change - Captures the change event and emits the selected value.
 * @slot unnamed - Slot for individual radio buttons.
 * @slot description - Slot for description text.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-radio-button-group')
export class RadioButtonGroup extends FormMixin(LitElement) {
  static override styles = RadioButtonGroupScss;

  /** Label text */
  @property({ type: String })
  label = '';

  /** Makes the input required. */
  @property({ type: Boolean })
  required = false;

  /** Radio button group disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Radio button group horizontal layout. */
  @property({ type: Boolean })
  horizontal = false;

  /** Text string customization. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /**
   * Queries for slotted radio buttons.
   * @ignore
   */
  @queryAssignedElements()
  radioButtons!: Array<any>;

  override render() {
    return html`
      <fieldset ?disabled=${this.disabled}>
        <legend class="label-text">
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
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </fieldset>
    `;
  }

  private _handleSlotChange() {
    this._updateChildren();
  }

  private _updateChildren() {
    this.radioButtons.forEach((radio) => {
      radio.disabled = this.disabled;
      radio.checked = radio.value === this.value;
      radio.name = this.name;
      radio.required = this.required;
      radio.invalid = this._isInvalid;
    });
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override updated(changedProps: any) {
    this._onUpdated(changedProps);

    if (
      changedProps.has('value') ||
      changedProps.has('name') ||
      changedProps.has('required') ||
      changedProps.has('disabled') ||
      changedProps.has('invalidText') ||
      changedProps.has('internalValidationMsg')
    ) {
      this._updateChildren();
    }
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // set validity flags
    const Validity = {
      customError: this.invalidText !== '',
      valueMissing: this.required && this.value === '',
    };

    // set validationMessage
    const InternalMsg =
      this.required && this.value === '' ? 'A selection is required.' : '';
    const ValidationMessage =
      this.invalidText !== '' ? this.invalidText : InternalMsg;

    // set validity on custom element, anchor to first radio
    this._internals.setValidity(
      Validity,
      ValidationMessage,
      this.radioButtons[0]
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

  private _handleRadioChange(e: any) {
    // set selected value
    this.value = e.detail.value;

    this._validate(false, false);

    // emit selected value
    const event = new CustomEvent('on-radio-group-change', {
      detail: { value: e.detail.value },
    });
    this.dispatchEvent(event);
  }

  override connectedCallback() {
    super.connectedCallback();

    // preserve FormMixin connectedCallback function
    this._onConnected();

    // capture child radio buttons change event
    this.addEventListener('on-radio-change', (e: any) =>
      this._handleRadioChange(e)
    );
  }

  override disconnectedCallback(): void {
    // preserve FormMixin disconnectedCallback function
    this._onDisconnected();

    this.removeEventListener('on-radio-change', (e: any) =>
      this._handleRadioChange(e)
    );

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-radio-button-group': RadioButtonGroup;
  }
}
