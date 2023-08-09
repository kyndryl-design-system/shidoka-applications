import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import RadioButtonScss from './radioButton.scss';

/**
 * Radio button.
 * @fires on-radio-change - Captures the change event and emits the selected value and original event details.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-radio-button')
export class RadioButton extends LitElement {
  static override styles = RadioButtonScss;

  /** Radio button value. */
  @property({ type: String })
  value = '';

  /**
   * Radio button name, inherited from the parent group.
   * @ignore
   */
  @property({ type: String })
  name = '';

  /**
   * Radio button checked state, inherited from the parent group if value matches.
   * @ignore
   */
  @property({ type: Boolean })
  checked = false;

  /**
   * Radio button disabled state, inherited from the parent group.
   * @ignore
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Radio button group invalid state, inherited from the parent group.
   * @ignore
   */
  @property({ type: Boolean })
  invalid = false;

  override render() {
    return html`
      <label ?disabled=${this.disabled} ?invalid=${this.invalid}>
        <span><slot></slot></span>
        <input
          type="radio"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          ?invalid=${this.invalid}
          @change=${(e: any) => this.handleChange(e)}
        />
      </label>
    `;
  }

  private handleChange(e: any) {
    // emit selected value, bubble so it can be captured by the radio group
    const event = new CustomEvent('on-radio-change', {
      bubbles: true,
      composed: true,
      detail: { value: e.target.value, origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-radio-button': RadioButton;
  }
}
