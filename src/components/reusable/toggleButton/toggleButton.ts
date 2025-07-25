import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { FormMixin } from '../../../common/mixins/form-input';
import ToggleButtonScss from './toggleButton.scss?inline';

/**
 * Toggle Button.
 * @fires on-change - Emits the change event. `detail:{ origEvent: Event, checked: boolean, value: string }`
 * @slot tooltip - Slot for tooltip.
 * @attr {string} [value=''] - The value of the input.
 * @attr {string} [name=''] - The name of the input, used for form submission.
 */
@customElement('kyn-toggle-button')
export class ToggleButton extends FormMixin(LitElement) {
  static override styles = unsafeCSS(ToggleButtonScss);

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Checkbox checked state. */
  @property({ type: Boolean, reflect: true })
  accessor checked = false;

  /** Checked state text. */
  @property({ type: String })
  accessor checkedText = 'On';

  /** Unchecked state text. */
  @property({ type: String })
  accessor uncheckedText = 'Off';

  /** Option to use small size. */
  @property({ type: Boolean, reflect: true })
  accessor small = false;

  /** Checkbox disabled state. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Reverse UI element order, label on the left. */
  @property({ type: Boolean })
  accessor reverse = false;

  /** Hides the label visually. */
  @property({ type: Boolean })
  accessor hideLabel = false;

  /**
   * Queries the <input> DOM element.
   * @internal
   */
  @query('input')
  accessor _inputEl!: HTMLInputElement;

  override render() {
    const id = this.name;
    const statusId = `${id}-status`;

    return html`
      <div class="toggle-button" ?disabled=${this.disabled}>
        <label class="label-text ${this.hideLabel ? 'sr-only' : ''}" for=${id}>
          ${this.label}
          <slot name="tooltip"></slot>
        </label>

        <div class="wrapper ${this.reverse ? 'reverse' : ''}">
          <input
            id=${id}
            class=${this.small ? 'size--sm' : ''}
            type="checkbox"
            name=${this.name}
            role="switch"
            aria-checked=${this.checked}
            aria-describedby=${statusId}
            value=${this.value}
            .checked=${this.checked}
            ?disabled=${this.disabled}
            @change=${this.handleChange}
            @keydown=${this.handleKeyDown}
          />

          <span id=${statusId} class="label-text sr-only">
            ${this.checked ? this.checkedText : this.uncheckedText}
          </span>

          <span aria-hidden="true" class="status-text">
            ${this.checked ? this.checkedText : this.uncheckedText}
          </span>
        </div>
      </div>
    `;
  }

  private handleChange = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this._internals.setFormValue(this.checked ? this.value : null);
    this.dispatchEvent(
      new CustomEvent('on-change', {
        detail: { checked: this.checked, value: this.value, origEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      this.checked = !this.checked;
      this._internals.setFormValue(this.checked ? this.value : null);
      this.dispatchEvent(
        new CustomEvent('on-change', {
          detail: { checked: this.checked, value: this.value, origEvent: e },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  override updated(changedProps: any) {
    this._onUpdated(changedProps);

    if (changedProps.has('checked')) {
      // set form data value
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }

  // ignore warning, FormMixin requires this method
  private _validate(interacted: boolean, report: boolean) {
    const Validity =
      this.invalidText !== ''
        ? { ...this._inputEl.validity, customError: true }
        : this._inputEl.validity;

    const ValidationMessage =
      this.invalidText !== ''
        ? this.invalidText
        : this._inputEl.validationMessage;

    this._internals.setValidity(Validity, ValidationMessage, this._inputEl);

    if (interacted) {
      this._internalValidationMsg = this._inputEl.validationMessage;
    }
    if (report) {
      this._internals.reportValidity();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-toggle-button': ToggleButton;
  }
}
