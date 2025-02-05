import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { FormMixin } from '../../../common/mixins/form-input';
import ToggleButtonScss from './toggleButton.scss';

/**
 * Toggle Button.
 * @fires on-change - Captures the change event and emits the selected value and original event details.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-toggle-button')
export class ToggleButton extends FormMixin(LitElement) {
  static override styles = ToggleButtonScss;

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Checkbox checked state. */
  @property({ type: Boolean })
  checked = false;

  /** Checked state text. */
  @property({ type: String })
  checkedText = 'On';

  /** Unchecked state text. */
  @property({ type: String })
  uncheckedText = 'Off';

  /** Option to use small size. */
  @property({ type: Boolean })
  small = false;

  /** Checkbox disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Input read only state. */
  @property({ type: Boolean })
  readOnly = false;

  /** Reverse UI element order, label on the left. */
  @property({ type: Boolean })
  reverse = false;

  /** Hides the label visually. */
  @property({ type: Boolean })
  hideLabel = false;

  /**
   * The state that is considered valid (true/false).
   * If set, the toggle must be in this state to be valid.
   * If not set, any state is considered valid.
   */
  @property({ type: Boolean, attribute: 'valid-state' })
  validState?: boolean;

  /**
   * Queries the <input> DOM element.
   * @internal
   */
  @query('input')
  _inputEl!: HTMLInputElement;

  override render() {
    return html`
      <div
        class="toggle-button"
        ?disabled=${this.disabled || this.readOnly}
        ?readonly=${this.readOnly}
      >
        <label
          class="label-text  ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          <span>${this.label}</span>
          <slot name="tooltip"></slot>
        </label>

        <div class="wrapper ${this.reverse ? 'reverse' : ''}">
          <input
            class="${this.small ? 'size--sm' : ''}"
            type="checkbox"
            name=${this.name}
            id=${this.name}
            value=${this.value}
            .checked=${this.checked}
            ?checked=${this.checked}
            ?disabled=${this.disabled || this.readOnly}
            ?readonly=${this.readOnly}
            @change=${(e: any) => this.handleChange(e)}
          />

          <span class="status-text">
            ${this.checked ? this.checkedText : this.uncheckedText}
          </span>
        </div>
      </div>
    `;
  }

  private handleChange(e: any) {
    this.checked = e.target.checked;
    // emit selected value, bubble so it can be captured by the checkbox group
    const event = new CustomEvent('on-change', {
      detail: {
        checked: e.target.checked,
        value: this.value,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);

    // Validate after value changes
    this._validate(true, false);
  }

  private _validate(interacted: Boolean, report: Boolean) {
    let validity = { ...this._inputEl.validity };
    let validationMessage = '';

    // Check if a valid state is specified and current state doesn't match
    if (this.validState !== undefined && this.checked !== this.validState) {
      validity = { ...validity, customError: true };
      validationMessage = `This toggle must be ${
        this.validState ? 'on' : 'off'
      }`;
    }

    // Add custom error if invalidText is provided
    if (this.invalidText !== '') {
      validity = { ...validity, customError: true };
      validationMessage = this.invalidText;
    }

    // Set validity on custom element, anchor to inputEl
    this._internals.setValidity(validity, validationMessage, this._inputEl);

    // Set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = validationMessage;
    }

    // Focus the form field to show validity
    if (report) {
      this._internals.reportValidity();
    }
  }

  override updated(changedProps: any) {
    this._onUpdated(changedProps);

    if (changedProps.has('checked')) {
      // set form data value
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-toggle-button': ToggleButton;
  }
}
