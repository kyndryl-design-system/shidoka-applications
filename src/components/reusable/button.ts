import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ButtonScss from './button.scss';

@customElement('kyn-button')
export class Button extends LitElement {
  static override styles = ButtonScss;

  @property({ type: String })
  kind = 'primary';

  @property({ type: String })
  href = '';

  @property({ type: Boolean })
  disabled = false;

  override render() {
    return html`
      ${this.href != ''
        ? html`
            <a
              href=${this.href}
              class="btn btn--${this.kind}"
              ?disabled=${this.disabled}
              @click=${(e: Event) => this.handleClick(e)}
            >
              <slot></slot>
            </a>
          `
        : html`
            <button class="btn btn--${this.kind}" ?disabled=${this.disabled}>
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
