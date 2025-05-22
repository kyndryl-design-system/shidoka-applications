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
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Checked state text. */
  @property({ type: String })
  checkedText = 'On';

  /** Unchecked state text. */
  @property({ type: String })
  uncheckedText = 'Off';

  /** Option to use small size. */
  @property({ type: Boolean, reflect: true })
  small = false;

  /** Checkbox disabled state. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Reverse UI element order, label on the left. */
  @property({ type: Boolean })
  reverse = false;

  /** Hides the label visually. */
  @property({ type: Boolean })
  hideLabel = false;

  /**
   * Queries the <input> DOM element.
   * @internal
   */
  @query('input')
  _inputEl!: HTMLInputElement;

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
