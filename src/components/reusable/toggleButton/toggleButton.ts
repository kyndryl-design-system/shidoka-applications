import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import ToggleButtonScss from './toggleButton.scss';

/**
 * Toggle Button.
 * @fires on-change - Captures the change event and emits the selected value and original event details.
 * @slot unnamed - Slot for label text.
 * @csspart label - Styles the label.
 */
@customElement('kyn-toggle-button')
export class ToggleButton extends LitElement {
  static override styles = ToggleButtonScss;

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

  /** Input name. */
  @property({ type: String })
  name = '';

  /** Input value. */
  @property({ type: String })
  value = '';

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

  /** Reverse UI element order, label on the left. */
  @property({ type: Boolean })
  reverse = false;

  override render() {
    return html`
      <div class="toggle-button" ?disabled=${this.disabled}>
        <label part="label" class="label-text" for=${this.name}>
          <slot></slot>
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
            ?disabled=${this.disabled}
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
  }

  override updated(changedProps: any) {
    if (changedProps.has('checked')) {
      // set form data value
      // this.internals.setFormValue(this.checked ? this.value : null);
    }
  }

  private _handleFormdata(e: any) {
    if (this.checked) {
      e.formData.append(this.name, this.value);
    }
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
    'kyn-toggle-button': ToggleButton;
  }
}
