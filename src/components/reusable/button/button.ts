import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ButtonScss from './button.scss';

/**
 * Primary UI component for user interaction.
 * @fires on-click - Captures the click event and emits the original event details.
 * @csspart button - Styles to override the button
 */
@customElement('kyn-button')
export class Button extends LitElement {
  static override styles = ButtonScss;

  /** The kind of button to render. */
  @property({ type: String })
  kind = 'primary';

  /** The button size. */
  @property({ type: String })
  size = 'md';

  /** Converts to an &lt;a&gt; tag to create a link. */
  @property({ type: String })
  href = '';

  /** Disables the button. */
  @property({ type: Boolean })
  disabled = false;

  override render() {
    return html`
      ${this.href != ''
        ? html`
            <a
              href=${this.href}
              class="btn btn--${this.kind} btn--${this.size}"
              part="button"
              ?disabled=${this.disabled}
              @click=${(e: Event) => this.handleClick(e)}
            >
              <slot></slot>
            </a>
          `
        : html`
            <button
              class="btn btn--${this.kind} btn--${this.size}"
              part="button"
              ?disabled=${this.disabled}
            >
              <slot></slot>
            </button>
          `}
    `;
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-button': Button;
  }
}
