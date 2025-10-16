import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './aiInputQuery.scss?inline';

@customElement('kyn-ai-input-query')
export class AIInputQuery extends LitElement {
  static override styles = unsafeCSS(styles);

  /** If true, the input box will appear elevated. */
  @property({ type: Boolean, reflect: true })
  accessor floating = false;

  /** Internal input modality: 'pointer' | 'keyboard'. */
  @state()
  private accessor modality: 'pointer' | 'keyboard' = 'pointer';

  /** Internal pressed/active state. */
  @state()
  private accessor active = false;
  override render() {
    return html`
      <form
        class="container"
        @submit=${this.onSubmit}
        @keydown=${this.onKeyDown}
      >
        <div class="message">
          <div
            class="textarea-wrap"
            @pointerdown=${this.onPointerDown}
            @pointerup=${this.onPointerUp}
            @pointercancel=${this.onPointerCancel}
            @pointerleave=${this.onPointerLeave}
            tabindex="-1"
          >
            <slot name="textarea"></slot>
            <div class="footer-content">
              <slot name="footer"></slot>
            </div>
          </div>
          <slot name="action"></slot>
        </div>
      </form>
    `;
  }

  override updated(): void {
    this.toggleAttribute('data-active', this.active);
    this.setAttribute('data-modality', this.modality);
  }

  private onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    this.dispatchEvent(
      new CustomEvent('submit', {
        bubbles: true,
        composed: true,
        detail: { formData: fd, event: e },
      })
    );
  };

  private inFooter(e: Event): boolean {
    const path = e.composedPath() as Element[];
    return path.some((n) =>
      (n as Element)?.classList?.contains?.('footer-content')
    );
  }

  private onPointerDown = (e: PointerEvent) => {
    this.modality = 'pointer';
    if (e.button !== 0) return;
    if (this.inFooter(e)) return;
    this.active = true;
  };

  private onPointerUp = (e: PointerEvent) => {
    if (this.inFooter(e)) return;
    this.active = false;
  };

  private onPointerCancel = () => {
    this.active = false;
  };

  private onPointerLeave = () => {
    this.active = false;
  };

  private onKeyDown = () => {
    this.modality = 'keyboard';
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-input-query': AIInputQuery;
  }
}
